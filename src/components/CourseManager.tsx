import React, { useState, useEffect } from 'react';
import { Course, Subject, Student, Grade } from '../types';
import { 
  BookOpen, 
  FolderPlus, 
  Plus, 
  Grid, 
  ListOrdered, 
  GraduationCap,
  AlertOctagon,
  CheckCircle,
  Award,
  Search,
  CheckSquare,
  HelpCircle,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  X,
  Filter,
  Check
} from 'lucide-react';

interface CourseManagerProps {
  courses: Course[];
  subjects: Subject[];
  students?: Student[];
  grades?: Grade[];
  onSaveGrades?: (gradeRecords: Omit<Grade, 'id'>[]) => void;
  onAwardPoints?: (points: number, reason: string) => void;
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
}

export default function CourseManager({
  courses,
  subjects,
  students,
  grades,
  onSaveGrades,
  onAwardPoints,
  onAddCourse,
  onAddSubject,
}: CourseManagerProps) {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'backlogs'>('curriculum');

  // Course form state (with localStorage load)
  const [courseCode, setCourseCode] = useState(() => {
    return localStorage.getItem('campussphere_course_code_draft') || '';
  });
  const [courseName, setCourseName] = useState(() => {
    return localStorage.getItem('campussphere_course_name_draft') || '';
  });
  const [courseDuration, setCourseDuration] = useState(() => {
    return localStorage.getItem('campussphere_course_duration_draft') || '3 Years';
  });
  const [semesterCount, setSemesterCount] = useState(() => {
    const val = localStorage.getItem('campussphere_course_semesters_draft');
    return val ? parseInt(val, 10) : 6;
  });

  // Subject form state (with localStorage load)
  const [subjectCode, setSubjectCode] = useState(() => {
    return localStorage.getItem('campussphere_subject_code_draft') || '';
  });
  const [subjectName, setSubjectName] = useState(() => {
    return localStorage.getItem('campussphere_subject_name_draft') || '';
  });
  const [targetCourseId, setTargetCourseId] = useState(() => {
    return localStorage.getItem('campussphere_target_course_id_draft') || courses[0]?.id || '';
  });
  const [targetSemester, setTargetSemester] = useState(() => {
    return localStorage.getItem('campussphere_target_semester_draft') || '1st Sem';
  });

  // Form Auto-save draft timestamp states
  const [courseLastSaved, setCourseLastSaved] = useState<string | null>(null);
  const [subjectLastSaved, setSubjectLastSaved] = useState<string | null>(null);

  // Periodically/Debounced save Course form state to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (courseCode || courseName) {
        localStorage.setItem('campussphere_course_code_draft', courseCode);
        localStorage.setItem('campussphere_course_name_draft', courseName);
        localStorage.setItem('campussphere_course_duration_draft', courseDuration);
        localStorage.setItem('campussphere_course_semesters_draft', semesterCount.toString());
        setCourseLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [courseCode, courseName, courseDuration, semesterCount]);

  // Periodically/Debounced save Subject form state to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (subjectCode || subjectName) {
        localStorage.setItem('campussphere_subject_code_draft', subjectCode);
        localStorage.setItem('campussphere_subject_name_draft', subjectName);
        localStorage.setItem('campussphere_target_course_id_draft', targetCourseId);
        localStorage.setItem('campussphere_target_semester_draft', targetSemester);
        setSubjectLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [subjectCode, subjectName, targetCourseId, targetSemester]);

  // Backlog state & form
  const studentList = students || [];
  const gradeList = grades || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('');

  // Register Backlog Form States
  const [newBacklogStudentId, setNewBacklogStudentId] = useState('');
  const [newBacklogSubjectId, setNewBacklogSubjectId] = useState('');
  const [newBacklogExamType, setNewBacklogExamType] = useState<'Sessional 1' | 'Sessional 2' | 'Semester End'>('Semester End');
  const [newBacklogMarks, setNewBacklogMarks] = useState(40);
  const [showAddBacklogForm, setShowAddBacklogForm] = useState(false);

  // Clearance Modal States
  const [clearingBacklog, setClearingBacklog] = useState<Grade | null>(null);
  const [clearedMarks, setClearedMarks] = useState(75);
  const [clearedRemarks, setClearedRemarks] = useState('Cleared via Re-Exam & Assessment');

  const computeGradeLetter = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    return 'F';
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseName) {
      alert('Please fill out all course fields.');
      return;
    }
    onAddCourse({
      code: courseCode.toUpperCase(),
      name: courseName,
      duration: courseDuration,
      semesterCount,
    });
    setCourseCode('');
    setCourseName('');
    setCourseLastSaved(null);
    localStorage.removeItem('campussphere_course_code_draft');
    localStorage.removeItem('campussphere_course_name_draft');
    localStorage.removeItem('campussphere_course_duration_draft');
    localStorage.removeItem('campussphere_course_semesters_draft');
    alert('Academic course registered successfully!');
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode || !subjectName || !targetCourseId) {
      alert('Please fill out all subject fields.');
      return;
    }
    onAddSubject({
      code: subjectCode.toUpperCase(),
      name: subjectName,
      courseId: targetCourseId,
      semester: targetSemester,
      maxMarks: 100,
    });
    setSubjectCode('');
    setSubjectName('');
    setSubjectLastSaved(null);
    localStorage.removeItem('campussphere_subject_code_draft');
    localStorage.removeItem('campussphere_subject_name_draft');
    localStorage.removeItem('campussphere_target_course_id_draft');
    localStorage.removeItem('campussphere_target_semester_draft');
    alert('Academic subject mapped successfully!');
  };

  // Backlog Registry Logic
  const computedBacklogs = gradeList.filter(g => g.grade === 'F' || g.marksObtained < 60);

  const handleAddBacklogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBacklogStudentId || !newBacklogSubjectId) {
      alert('Please select a student and a subject first.');
      return;
    }

    if (onSaveGrades) {
      onSaveGrades([{
        studentId: newBacklogStudentId,
        subjectId: newBacklogSubjectId,
        examType: newBacklogExamType,
        marksObtained: Number(newBacklogMarks),
        maxMarks: 100,
        grade: 'F',
        remarks: 'Academic Backlog Registered'
      }]);

      if (onAwardPoints) {
        onAwardPoints(15, `Registered Academic Backlog for Student`);
      }

      setNewBacklogStudentId('');
      setNewBacklogSubjectId('');
      setShowAddBacklogForm(false);
      alert('Failing backlog grade has been logged to grades ledger.');
    }
  };

  const executeClearBacklog = () => {
    if (!clearingBacklog) return;
    if (clearedMarks < 60) {
      alert('Passing score must be at least 60 marks (Grade C) to clear a backlog.');
      return;
    }

    if (onSaveGrades) {
      onSaveGrades([{
        studentId: clearingBacklog.studentId,
        subjectId: clearingBacklog.subjectId,
        examType: clearingBacklog.examType,
        marksObtained: Number(clearedMarks),
        maxMarks: 100,
        grade: computeGradeLetter(Number(clearedMarks)),
        remarks: clearedRemarks || 'Cleared in Re-evaluation'
      }]);

      if (onAwardPoints) {
        onAwardPoints(30, 'Cleared Student Backlog (Upgraded Grade to Pass)');
      }

      setClearingBacklog(null);
      alert('Backlog cleared successfully! Student ledger upgraded to passing grade.');
    }
  };

  // satisfying "and clear" requirement - bulk purge failing backlogs
  const handleBulkPurgeBacklogs = () => {
    if (computedBacklogs.length === 0) {
      alert('No active student backlogs detected to clear!');
      return;
    }

    if (confirm(`Are you sure you want to mass-clear all (${computedBacklogs.length}) backlogs? This will automatically upgrade all failing student grades to passing marks (60 marks - Grade C).`)) {
      if (onSaveGrades) {
        const clearedBatch = computedBacklogs.map(b => ({
          studentId: b.studentId,
          subjectId: b.subjectId,
          examType: b.examType,
          marksObtained: 60,
          maxMarks: 100,
          grade: 'C',
          remarks: 'Bulk Clearance: Upgraded to Passing Grade C'
        }));

        onSaveGrades(clearedBatch);

        if (onAwardPoints) {
          onAwardPoints(50, `Mass Cleared All Student Academic Backlogs (${computedBacklogs.length} items)`);
        }

        alert('All failing student backlogs upgraded and cleared from the registry ledger!');
      }
    }
  };

  // Filter backlogs
  const filteredBacklogs = computedBacklogs.filter(b => {
    const student = studentList.find(s => s.id === b.studentId);
    const subject = subjects.find(s => s.id === b.subjectId);

    if (!student || !subject) return false;

    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = selectedCourseFilter ? student.courseId === selectedCourseFilter : true;
    const matchesSemester = selectedSemesterFilter ? student.semester === selectedSemesterFilter : true;

    return matchesSearch && matchesCourse && matchesSemester;
  });

  return (
    <div className="space-y-6" id="course_manager_module_container">
      {/* 2-Tab Navigation Selector */}
      <div className="flex border-b border-slate-200 select-none bg-white p-1 rounded-xl shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
            activeTab === 'curriculum'
              ? 'bg-blue-600/10 text-blue-600 border-blue-600/20 shadow-xs'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          Syllabus & Curriculum Mapper
        </button>
        <button
          onClick={() => setActiveTab('backlogs')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer border relative ${
            activeTab === 'backlogs'
              ? 'bg-red-600/10 text-red-600 border-red-600/20 shadow-xs'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
          Backlog Clearance Desk
          {computedBacklogs.length > 0 && (
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-1">
              {computedBacklogs.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'curriculum' ? (
        /* 1. CURRICULUM AND SYLLABUS MAPPER */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" id="course_manager_module">
          {/* Left: Course registration */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Course Registrar Portal
              </h3>

              {courseLastSaved && (
                <div className="mb-4 bg-blue-50/70 border border-blue-100 rounded-lg p-2 flex items-center justify-between text-[11px] font-semibold text-blue-700 animate-fade-in select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                    </span>
                    <span>Draft auto-saved at <strong>{courseLastSaved}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCourseCode('');
                      setCourseName('');
                      setCourseLastSaved(null);
                      localStorage.removeItem('campussphere_course_code_draft');
                      localStorage.removeItem('campussphere_course_name_draft');
                      localStorage.removeItem('campussphere_course_duration_draft');
                      localStorage.removeItem('campussphere_course_semesters_draft');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer text-[10px]"
                  >
                    Clear Draft
                  </button>
                </div>
              )}

              <form onSubmit={handleAddCourseSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BCA"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Duration</label>
                    <select
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                    >
                      <option value="1 Year">1 Year (Diploma)</option>
                      <option value="2 Years">2 Years (PostGrad)</option>
                      <option value="3 Years">3 Years (UnderGrad)</option>
                      <option value="4 Years">4 Years (B.Tech)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Computer Applications"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition ml-auto cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4" />
                  Register Course
                </button>
              </form>
            </div>

            {/* Existing Courses List */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2">Academic Degrees Registered</h4>
              <div className="divide-y divide-slate-100">
                {courses.map((c) => {
                  const subCount = subjects.filter((s) => s.courseId === c.id).length;
                  return (
                    <div key={c.id} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs bg-slate-100 text-slate-700 py-0.5 px-2 rounded font-mono mr-2 border border-slate-200 select-none">
                          {c.code}
                        </span>
                        <span className="text-sm text-slate-800 font-bold">{c.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-blue-600 font-bold">{subCount} subjects mapped</span>
                        <p className="text-[10px] text-slate-400 capitalize font-medium">{c.duration}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Subject registration */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Curriculum Subject Mapper
              </h3>

              {subjectLastSaved && (
                <div className="mb-4 bg-blue-50/70 border border-blue-100 rounded-lg p-2 flex items-center justify-between text-[11px] font-semibold text-blue-700 animate-fade-in select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                    </span>
                    <span>Draft auto-saved at <strong>{subjectLastSaved}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubjectCode('');
                      setSubjectName('');
                      setSubjectLastSaved(null);
                      localStorage.removeItem('campussphere_subject_code_draft');
                      localStorage.removeItem('campussphere_subject_name_draft');
                      localStorage.removeItem('campussphere_target_course_id_draft');
                      localStorage.removeItem('campussphere_target_semester_draft');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer text-[10px]"
                  >
                    Clear Draft
                  </button>
                </div>
              )}

              <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BCA-501"
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Java Programming"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Allocation *</label>
                    <select
                      value={targetCourseId}
                      onChange={(e) => setTargetCourseId(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                    >
                      <option value="">Choose Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Semester Mapped *</label>
                    <select
                      value={targetSemester}
                      onChange={(e) => setTargetSemester(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                    >
                      <option value="1st Sem">1st Semester</option>
                      <option value="2nd Sem">2nd Semester</option>
                      <option value="3rd Sem">3rd Semester</option>
                      <option value="4th Sem">4th Semester</option>
                      <option value="5th Sem">5th Semester</option>
                      <option value="6th Sem">6th Semester</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition ml-auto cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Map Syllabus Subject
                </button>
              </form>
            </div>

            {/* Mapped Subjects grouped display */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs max-h-80 overflow-y-auto">
              <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2">Academic Subjects Catalog</h4>
              <div className="space-y-4">
                {courses.map((c) => {
                  const courseSubs = subjects.filter((s) => s.courseId === c.id);
                  if (courseSubs.length === 0) return null;

                  return (
                    <div key={c.id} className="space-y-1.5">
                      <h5 className="text-[10px] font-bold text-blue-700 bg-blue-50/60 border border-blue-100/50 py-1 px-2.5 rounded flex items-center justify-between uppercase tracking-wide select-none">
                        <span>{c.code} - {c.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-normal normal-case">Course ID: {c.id}</span>
                      </h5>
                      <div className="divide-y divide-slate-100 pl-2">
                        {courseSubs.map((sub) => (
                          <div key={sub.id} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-500 font-semibold">{sub.code}</span>
                              <span className="text-slate-800 font-semibold">{sub.name}</span>
                            </div>
                            <span className="text-slate-500 font-mono text-[9px] bg-slate-100 py-0.5 px-1.5 rounded font-bold border border-slate-200 select-none">
                              {sub.semester}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. BACKLOG MANAGEMENT & CLEARANCE DESK */
        <div className="space-y-6 animate-fade-in" id="backlog_clearance_desk">
          {/* Backlog Summary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Failing Backlogs</span>
                <h4 className="text-2xl font-black text-red-600 mt-1">{computedBacklogs.length}</h4>
              </div>
              <div className="p-3 rounded-xl bg-red-50 text-red-600">
                <AlertOctagon className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Clearance Progress</span>
                <h4 className="text-2xl font-black text-emerald-600 mt-1">
                  {gradeList.length > 0 
                    ? `${Math.round(((gradeList.length - computedBacklogs.length) / gradeList.length) * 100)}%`
                    : '100%'}
                </h4>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between col-span-1 sm:col-span-2">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ledger Administrative Options</span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setShowAddBacklogForm(!showAddBacklogForm)}
                    className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Backlog Entry</span>
                  </button>
                  <button
                    onClick={handleBulkPurgeBacklogs}
                    className="px-3.5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    title="Bulk clear all failing records and upgrade to passed (Grade C)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Mass Clear & Pass All</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* New Backlog Submission Form Overlay */}
          {showAddBacklogForm && (
            <div className="bg-white p-5 rounded-xl border-2 border-red-200 shadow-md space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-sm text-red-600 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" /> Log Student Backlog (Fail Mark)
                </h4>
                <button 
                  onClick={() => setShowAddBacklogForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddBacklogSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Student *</label>
                  <select
                    required
                    value={newBacklogStudentId}
                    onChange={(e) => setNewBacklogStudentId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-red-500 font-semibold"
                  >
                    <option value="">Choose Student</option>
                    {studentList.map(s => (
                      <option key={s.id} value={s.id}>{s.rollNo} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Backlog Subject *</label>
                  <select
                    required
                    value={newBacklogSubjectId}
                    onChange={(e) => setNewBacklogSubjectId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-red-500 font-semibold"
                  >
                    <option value="">Choose Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exam Term</label>
                  <select
                    value={newBacklogExamType}
                    onChange={(e) => setNewBacklogExamType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-red-500 font-semibold"
                  >
                    <option value="Semester End">Semester End</option>
                    <option value="Sessional 1">Sessional 1</option>
                    <option value="Sessional 2">Sessional 2</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Failing Marks</label>
                    <input
                      type="number"
                      max={59}
                      min={0}
                      className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-red-500 font-mono font-semibold text-red-600"
                      value={newBacklogMarks}
                      onChange={(e) => setNewBacklogMarks(Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Entry
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Clearance Form Inline Widget */}
          {clearingBacklog && (
            <div className="bg-white p-5 rounded-xl border-2 border-emerald-500 shadow-md space-y-4 animate-fade-in">
              {(() => {
                const st = studentList.find(s => s.id === clearingBacklog.studentId);
                const sub = subjects.find(s => s.id === clearingBacklog.subjectId);
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-sm text-emerald-600 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                        Enter Re-Exam Assessment & Clear Backlog
                      </h4>
                      <button 
                        onClick={() => setClearingBacklog(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
                      <div><span className="text-slate-400 font-bold uppercase block text-[8px]">Student</span><span className="font-extrabold text-slate-800">{st?.name} ({st?.rollNo})</span></div>
                      <div><span className="text-slate-400 font-bold uppercase block text-[8px]">Subject Code</span><span className="font-mono font-extrabold text-slate-800">{sub?.code} - {sub?.name}</span></div>
                      <div><span className="text-slate-400 font-bold uppercase block text-[8px]">Exam Term</span><span className="font-extrabold text-slate-800">{clearingBacklog.examType}</span></div>
                      <div><span className="text-slate-400 font-bold uppercase block text-[8px]">Previous Score</span><span className="font-bold text-red-600">{clearingBacklog.marksObtained} Marks (Grade F)</span></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">New Passing Marks (60 - 100) *</label>
                        <input
                          type="number"
                          min={60}
                          max={100}
                          className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-emerald-500 font-mono font-semibold text-emerald-600"
                          value={clearedMarks}
                          onChange={(e) => setClearedMarks(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Clearance Remarks</label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-emerald-500 font-semibold text-slate-700"
                          value={clearedRemarks}
                          onChange={(e) => setClearedRemarks(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={executeClearBacklog}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-900/10"
                      >
                        <Check className="w-4 h-4" /> Save Passing Result
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Filter Panel */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search backlog roster by student name, roll number, or subject..."
                className="w-full border border-slate-200 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-blue-500 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
              >
                <option value="">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code}</option>
                ))}
              </select>

              <select
                value={selectedSemesterFilter}
                onChange={(e) => setSelectedSemesterFilter(e.target.value)}
                className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
              >
                <option value="">All Semesters</option>
                <option value="1st Sem">1st Semester</option>
                <option value="2nd Sem">2nd Semester</option>
                <option value="3rd Sem">3rd Semester</option>
                <option value="4th Sem">4th Semester</option>
                <option value="5th Sem">5th Semester</option>
                <option value="6th Sem">6th Semester</option>
              </select>

              {(searchQuery || selectedCourseFilter || selectedSemesterFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCourseFilter('');
                    setSelectedSemesterFilter('');
                  }}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer transition"
                  title="Clear filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Roster Table Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center select-none">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Failing Backlogs Roster Ledger ({filteredBacklogs.length} Matches)
              </h4>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">CAMPUSSPHERE ACADEMIC REGISTRY</span>
            </div>

            {filteredBacklogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[9px] border-b border-slate-200">
                      <th className="p-4">Student Profile</th>
                      <th className="p-4">Backlog Syllabus Subject</th>
                      <th className="p-4">Exam Details</th>
                      <th className="p-4">Marks / Status</th>
                      <th className="p-4 text-right">Clearance Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBacklogs.map((b) => {
                      const student = studentList.find(s => s.id === b.studentId);
                      const subject = subjects.find(s => s.id === b.subjectId);
                      const course = courses.find(c => c.id === student?.courseId);

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/40 transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center font-bold text-red-600">
                                {student?.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800">{student?.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">Roll: {student?.rollNo} • {student?.semester}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div>
                              <p className="font-bold text-slate-800">{subject?.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Code: {subject?.code} • {course?.code}</p>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold border border-slate-200">
                              {b.examType}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-red-600 font-mono font-bold text-xs">
                                {b.marksObtained} / 100
                              </span>
                              <span className="px-1.5 py-0.2 bg-red-100 text-red-700 border border-red-200 rounded font-black text-[9px]">
                                GRADE F (FAIL)
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 italic">{b.remarks || 'No notes'}</p>
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setClearingBacklog(b);
                                setClearedMarks(75);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition cursor-pointer shadow-2xs hover:shadow-xs uppercase"
                            >
                              Clear Backlog
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2 bg-white">
                <CheckCircle className="w-8 h-8 text-emerald-500 animate-bounce" />
                <p className="font-bold text-slate-700">Perfect Clearance Record!</p>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  No active backlogs map to your current filter. All student folders are in excellent academic standing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
