import React, { useState } from 'react';
import { Student, Course, Subject, Grade, Attendance } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Code, 
  FileText, 
  Save, 
  Plus, 
  Heart, 
  AlertCircle 
} from 'lucide-react';

interface StudentProfileViewProps {
  students: Student[];
  courses: Course[];
  subjects: Subject[];
  grades: Grade[];
  attendance: Attendance[];
  onAwardPoints?: (points: number, reason: string) => void;
  onEditStudent?: (editedStudent: Student) => void;
}

export default function StudentProfileView({
  students,
  courses,
  subjects,
  grades,
  attendance,
  onAwardPoints,
  onEditStudent
}: StudentProfileViewProps) {
  // Select active student profile to mimic login session
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editBio, setEditBio] = useState(() => {
    return "Passionate BCA student focusing on building scalable full-stack applications and learning cloud technologies.";
  });
  const [editSkills, setEditSkills] = useState(() => {
    return ["TypeScript", "React", "Node.js", "Python", "SQL", "TailwindCSS"];
  });
  const [newSkill, setNewSkill] = useState('');

  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Initialize edit fields when active student changes
  React.useEffect(() => {
    if (activeStudent) {
      setEditName(activeStudent.name);
      setEditEmail(activeStudent.email);
      setEditPhone(activeStudent.phone);
      setEditDob(activeStudent.dob);
    }
  }, [selectedStudentId, activeStudent]);

  if (!activeStudent) {
    return (
      <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-200 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="font-semibold text-xs">No active student profiles found in the system ledger. Please add a student in directory first.</p>
      </div>
    );
  }

  // Calculate Academic Analytics
  const studentGrades = grades.filter(g => g.studentId === activeStudent.id);
  const averageGrade = studentGrades.length > 0 
    ? (studentGrades.reduce((acc, curr) => acc + curr.marksObtained, 0) / studentGrades.length).toFixed(1)
    : 'N/A';

  const gpa = studentGrades.length > 0
    ? (studentGrades.reduce((acc, curr) => {
        if (curr.marksObtained >= 90) return acc + 10;
        if (curr.marksObtained >= 80) return acc + 9;
        if (curr.marksObtained >= 70) return acc + 8;
        if (curr.marksObtained >= 60) return acc + 7;
        return acc + 6;
      }, 0) / studentGrades.length).toFixed(2)
    : '8.40'; // High fidelity fallback

  const studentAttendance = attendance.filter(a => a.studentId === activeStudent.id);
  const presentCount = studentAttendance.filter(a => a.status === 'Present').length;
  const attendancePercentage = studentAttendance.length > 0
    ? ((presentCount / studentAttendance.length) * 100).toFixed(1)
    : '88.5'; // High fidelity fallback

  const activeCourse = courses.find(c => c.id === activeStudent.courseId);

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    if (onEditStudent) {
      onEditStudent({
        ...activeStudent,
        name: editName,
        email: editEmail,
        phone: editPhone,
        dob: editDob
      });
    }

    setIsEditing(false);
    if (onAwardPoints) {
      onAwardPoints(15, 'Updated Student Portfolio & Dossier');
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !editSkills.includes(newSkill.trim())) {
      setEditSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditSkills(prev => prev.filter(s => s !== skill));
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Selector (Login simulation) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Select Student Session</h3>
          <p className="text-xs text-slate-500 mt-0.5">Toggle active student to load individual dashboards, course credentials, and metrics.</p>
        </div>
        <select
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg p-2.5 focus:outline-blue-500 w-full md:w-64"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.rollNo})
            </option>
          ))}
        </select>
      </div>

      {/* Main Profile Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column - ID Card & Biometric Bio (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden relative">
            {/* ID Card Banner Pattern */}
            <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700 relative flex items-end justify-center">
              <span className="absolute top-3 right-4 font-mono font-black text-white/20 text-3xl">BCA</span>
              <span className="absolute bottom-2 left-4 text-[10px] font-bold text-white/70 tracking-widest uppercase">STUDENT ID CARD</span>
            </div>

            {/* Avatar Placement */}
            <div className="flex flex-col items-center -mt-12 px-6 pb-6">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center font-black text-3xl text-blue-600">
                {activeStudent.name.charAt(0)}
              </div>

              <h4 className="font-black text-slate-800 mt-3 text-base text-center">{activeStudent.name}</h4>
              <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{activeStudent.rollNo}</p>
              
              <span className="mt-3 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 font-bold rounded-full text-[10px] uppercase">
                {activeStudent.semester} Student
              </span>

              {/* Editable Bio Section */}
              <div className="w-full mt-6 space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Objective</span>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Bio
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-blue-500"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                    />
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed italic">{editBio}</p>
                )}
              </div>

              {/* Skills/Tags */}
              <div className="w-full mt-5 space-y-2 pt-4 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Specializations</span>
                
                <div className="flex flex-wrap gap-1.5">
                  {editSkills.map(skill => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[10px] font-semibold"
                    >
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer">×</button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <form onSubmit={handleAddSkill} className="flex gap-1 mt-2">
                    <input 
                      type="text" 
                      placeholder="Add tech skill..."
                      className="flex-1 text-[10px] border border-slate-200 rounded px-2 py-1"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button type="submit" className="bg-slate-800 text-white rounded p-1 text-xs cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Quick Demographics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">Contact Details</h4>
            
            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{activeStudent.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{activeStudent.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Date of Birth: {activeStudent.dob}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Gender: {activeStudent.gender}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Active Status: <strong className="text-green-600 uppercase">{activeStudent.status}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Academic ledger & Charts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* GPA */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Current GPA</span>
                <span className="text-lg font-black text-blue-900">{gpa} / 10.0</span>
              </div>
            </div>

            {/* Attendance percentage */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Attendance</span>
                <span className="text-lg font-black text-emerald-950">{attendancePercentage}%</span>
              </div>
            </div>

            {/* Gamification Points */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 p-4 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-yellow-500 text-slate-950 rounded-lg flex items-center justify-center shadow-md shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Skill Score</span>
                <span className="text-lg font-black text-amber-900">420 Points</span>
              </div>
            </div>
          </div>

          {/* Academic Report Ledger */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">Exam Grade Summary</h4>
              <p className="text-[11px] text-slate-500">Sessional test grades recorded in current database ledger.</p>
            </div>

            {studentGrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">Subject</th>
                      <th className="pb-2.5">Exam Category</th>
                      <th className="pb-2.5">Marks Obtained</th>
                      <th className="pb-2.5">Max Marks</th>
                      <th className="pb-2.5 text-right">Grade Scale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {studentGrades.map(grade => {
                      const sub = subjects.find(s => s.id === grade.subjectId);
                      return (
                        <tr key={grade.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-semibold text-slate-900">{sub ? sub.name : 'N/A'}</td>
                          <td className="py-2.5">{grade.examType}</td>
                          <td className="py-2.5 font-mono font-bold text-slate-800">{grade.marksObtained}</td>
                          <td className="py-2.5 font-mono text-slate-400">{grade.maxMarks}</td>
                          <td className="py-2.5 text-right">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px] uppercase">
                              {grade.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg">
                <p className="text-xs text-slate-400 italic">No grade reports uploaded in active database ledger.</p>
              </div>
            )}
          </div>

          {/* Co-Curricular & Achievements (Digital Portfolio link) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">Credentials & Achievements</h4>
              <p className="text-[11px] text-slate-500">Earned gamification rewards and badges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Badges Container */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Acquired Badges</span>
                
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-lg">🔥</span>
                    <div>
                      <h5 className="font-bold text-[10px] text-slate-800 leading-none">Attendance Streak</h5>
                      <span className="text-[8px] text-slate-400">Present 3 consecutive weeks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-lg">🤖</span>
                    <div>
                      <h5 className="font-bold text-[10px] text-slate-800 leading-none">AI Innovator</h5>
                      <span className="text-[8px] text-slate-400">Interacted with Leo Bot</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-lg">🎓</span>
                    <div>
                      <h5 className="font-bold text-[10px] text-slate-800 leading-none">Sessional Topper</h5>
                      <span className="text-[8px] text-slate-400">Scored A+ in Exam</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course details */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Academic Enrollment</span>
                  <h5 className="font-black text-slate-800 mt-2 text-xs">{activeCourse ? activeCourse.name : 'Bachelor of Computer Applications'}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Duration: {activeCourse ? activeCourse.duration : '3 Years'}</p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono font-bold pt-3 border-t border-slate-200/60 flex justify-between">
                  <span>Syllabus Version: 2026-v2</span>
                  <span>Credits Earned: 45 / 120</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
