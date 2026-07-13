import React, { useState, useEffect } from 'react';
import { Student, Course } from '../types';
import { Search, UserPlus, Edit2, Trash2, Check, X, ShieldAlert, Filter, Sparkles } from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  courses: Course[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export default function StudentManager({
  students,
  courses,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
}: StudentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal forms state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Inputs
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('1st Sem');
  const [joiningDate, setJoiningDate] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Suspended'>('Active');

  // Form Auto-save draft states
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // Default values helper
  const setDefaultAddValues = () => {
    setRollNo(`BCA2026-${String(students.length + 101)}`);
    setName('');
    setEmail('');
    setPhone('');
    setGender('Male');
    setDob('2004-01-01');
    setCourseId(courses[0]?.id || '');
    setSemester('1st Sem');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setStatus('Active');
    setLastSaved(null);
    setDraftRestored(false);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    const savedDraft = localStorage.getItem('campussphere_student_enrollment_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setRollNo(draft.rollNo || `BCA2026-${String(students.length + 101)}`);
        setName(draft.name || '');
        setEmail(draft.email || '');
        setPhone(draft.phone || '');
        setGender(draft.gender || 'Male');
        setDob(draft.dob || '2004-01-01');
        setCourseId(draft.courseId || courses[0]?.id || '');
        setSemester(draft.semester || '1st Sem');
        setJoiningDate(draft.joiningDate || new Date().toISOString().split('T')[0]);
        setStatus(draft.status || 'Active');
        setLastSaved(draft.savedAt || null);
        setDraftRestored(true);
      } catch (err) {
        console.error('Error loading student form draft:', err);
        setDefaultAddValues();
      }
    } else {
      setDefaultAddValues();
    }
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setRollNo(student.rollNo);
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
    setGender(student.gender);
    setDob(student.dob);
    setCourseId(student.courseId);
    setSemester(student.semester);
    setJoiningDate(student.joiningDate);
    setStatus(student.status);
    setLastSaved(null);
    setDraftRestored(false);
    setIsModalOpen(true);
  };

  // Periodically/Debounced save the state of enrollment form to localStorage to prevent data loss on page refreshes
  useEffect(() => {
    if (isModalOpen && !editingStudent) {
      const timer = setTimeout(() => {
        // Only save if the user has actually typed something to avoid saving blank defaults
        const isDefault = name === '' && email === '' && phone === '';
        if (!isDefault) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const draftData = {
            rollNo,
            name,
            email,
            phone,
            gender,
            dob,
            courseId,
            semester,
            joiningDate,
            status,
            savedAt: timestamp
          };
          localStorage.setItem('campussphere_student_enrollment_draft', JSON.stringify(draftData));
          setLastSaved(timestamp);
          setDraftRestored(true);
        }
      }, 800); // 800ms debounce interval
      return () => clearTimeout(timer);
    }
  }, [rollNo, name, email, phone, gender, dob, courseId, semester, joiningDate, status, isModalOpen, editingStudent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !rollNo) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingStudent) {
      onEditStudent({
        id: editingStudent.id,
        rollNo,
        name,
        email,
        phone,
        gender,
        dob,
        courseId,
        semester,
        joiningDate,
        status,
      });
    } else {
      onAddStudent({
        rollNo,
        name,
        email,
        phone,
        gender,
        dob,
        courseId,
        semester,
        joiningDate,
        status,
      });
      // Clear draft on successful submit
      localStorage.removeItem('campussphere_student_enrollment_draft');
      setDraftRestored(false);
      setLastSaved(null);
    }
    setIsModalOpen(false);
  };

  // Filter list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === 'All' || s.courseId === courseFilter;
    const matchesSem = semesterFilter === 'All' || s.semester === semesterFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesCourse && matchesSem && matchesStatus;
  });

  return (
    <div className="space-y-6" id="student_manager_module">
      {/* Search and Action Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Enroll Student
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          Filter Records:
        </div>

        {/* Course Filter */}
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>

        {/* Semester Filter */}
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="All">All Semesters</option>
          <option value="1st Sem">1st Semester</option>
          <option value="2nd Sem">2nd Semester</option>
          <option value="3rd Sem">3rd Semester</option>
          <option value="4th Sem">4th Semester</option>
          <option value="5th Sem">5th Semester</option>
          <option value="6th Sem">6th Semester</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>

        {/* Clear Filters Button */}
        {(courseFilter !== 'All' || semesterFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
          <button
            onClick={() => {
              setCourseFilter('All');
              setSemesterFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 select-none">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Roll Number</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Course & Sem</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Detail</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Joining Date</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const mappedCourse = courses.find((c) => c.id === student.courseId);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 select-none">
                            {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{student.gender}, DOB: {student.dob}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono font-semibold text-slate-600">{student.rollNo}</td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{mappedCourse ? mappedCourse.code : 'N/A'}</p>
                          <p className="text-xs text-slate-400 font-medium">{student.semester}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-slate-600 font-medium truncate max-w-[200px]">{student.email}</p>
                          <p className="text-xs text-slate-400 font-mono">{student.phone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500">{student.joiningDate}</td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-block text-[9px] px-2.5 py-0.5 rounded font-bold uppercase select-none ${
                            student.status === 'Active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : student.status === 'Inactive'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete student: ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                    <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 mb-2 animate-bounce" />
                    No student records found matching the current search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll/Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-slate-900 p-5 text-white flex justify-between items-center rounded-t-xl border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-400" />
                {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Auto-save Draft Status Bar */}
            {draftRestored && !editingStudent && (
              <div className="bg-blue-50/90 border-b border-blue-100 py-2.5 px-6 flex items-center justify-between text-xs font-semibold text-blue-700 animate-fade-in select-none">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span>
                    {lastSaved ? `Draft progress loaded (auto-saved at ${lastSaved})` : 'Draft progress active & auto-saved'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Discard current enrollment draft and reset the form fields?')) {
                      localStorage.removeItem('campussphere_student_enrollment_draft');
                      setDefaultAddValues();
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                >
                  Discard Draft
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Roll Number (Unique) *</label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                    placeholder="BCA2026-101"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
                    placeholder="Saurabh Anand"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-medium"
                    placeholder="saurabh@example.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enroll Course *</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Current Semester *</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
                  >
                    <option value="1st Sem">1st Semester</option>
                    <option value="2nd Sem">2nd Semester</option>
                    <option value="3rd Sem">3rd Semester</option>
                    <option value="4th Sem">4th Semester</option>
                    <option value="5th Sem">5th Semester</option>
                    <option value="6th Sem">6th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Academic Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
