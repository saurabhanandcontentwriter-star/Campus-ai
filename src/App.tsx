import React, { useState, useEffect } from 'react';
import { Student, Course, Subject, Grade, Attendance } from './types';
import StudentManager from './components/StudentManager';
import AttendanceManager from './components/AttendanceManager';
import GradeManager from './components/GradeManager';
import CourseManager from './components/CourseManager';
import ReportHub from './components/ReportHub';
import VivaVocePrep from './components/VivaVocePrep';

// CampusSphere AI new components
import AIStudyAssistant from './components/AIStudyAssistant';
import SmartAttendanceAnalytics from './components/SmartAttendanceAnalytics';
import DigitalPortfolio from './components/DigitalPortfolio';
import CampusEventHub from './components/CampusEventHub';
import PeerCommunity from './components/PeerCommunity';
import CareerTracker from './components/CareerTracker';
import SmartLibrary from './components/SmartLibrary';
import LostFoundPortal from './components/LostFoundPortal';
import FeedbackSystem from './components/FeedbackSystem';
import Leaderboard from './components/Leaderboard';

// Custom Interactive & Avatar Modules
import AIVoiceChatbot from './components/AIVoiceChatbot';
import StudentProfileView from './components/StudentProfileView';
import TeacherProfileView from './components/TeacherProfileView';
import AssignmentManager from './components/AssignmentManager';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  BookOpen,
  FileText,
  HelpCircle,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Menu,
  X,
  Plus,
  RotateCcw,
  Trash2,
  BrainCircuit,
  Briefcase,
  Layers,
  Sparkles,
  MapPin,
  Inbox,
  AwardIcon,
  MessageSquare,
  HelpCircleIcon,
  User,
  LogOut
} from 'lucide-react';

// Seeding Initial Data
const INITIAL_COURSES: Course[] = [
  { id: 'c1', code: 'BCA', name: 'Bachelor of Computer Applications', duration: '3 Years', semesterCount: 6 },
  { id: 'c2', code: 'BSc-CS', name: 'B.Sc. Computer Science', duration: '3 Years', semesterCount: 6 },
  { id: 'c3', code: 'MCA', name: 'Master of Computer Applications', duration: '2 Years', semesterCount: 4 },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 's1', code: 'BCA-501', name: 'Web Programming using PHP & MySQL', courseId: 'c1', semester: '5th Sem', maxMarks: 100 },
  { id: 's2', code: 'BCA-502', name: 'Software Engineering & UML Modeling', courseId: 'c1', semester: '5th Sem', maxMarks: 100 },
  { id: 's3', code: 'BCA-101', name: 'Computer Fundamentals & C Programming', courseId: 'c1', semester: '1st Sem', maxMarks: 100 },
  { id: 's4', code: 'BCS-301', name: 'Data Structures & Algorithms', courseId: 'c2', semester: '3rd Sem', maxMarks: 100 },
  { id: 's5', code: 'MCA-101', name: 'Advanced Java Technologies', courseId: 'c3', semester: '1st Sem', maxMarks: 100 },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st1',
    rollNo: 'BCA2026-101',
    name: 'Amit Sharma',
    email: 'amit.sharma@college.edu',
    phone: '+91 98765 11111',
    gender: 'Male',
    dob: '2004-05-12',
    courseId: 'c1',
    semester: '5th Sem',
    joiningDate: '2023-08-01',
    status: 'Active',
  },
  {
    id: 'st2',
    rollNo: 'BCA2026-102',
    name: 'Saurabh Anand',
    email: 'saurabh.anand@college.edu',
    phone: '+91 98765 22222',
    gender: 'Male',
    dob: '2004-02-18',
    courseId: 'c1',
    semester: '5th Sem',
    joiningDate: '2023-08-01',
    status: 'Active',
  },
  {
    id: 'st3',
    rollNo: 'BCA2026-103',
    name: 'Priyanka Patel',
    email: 'priyanka.patel@college.edu',
    phone: '+91 98765 33333',
    gender: 'Female',
    dob: '2004-11-20',
    courseId: 'c1',
    semester: '5th Sem',
    joiningDate: '2023-08-01',
    status: 'Active',
  },
  {
    id: 'st4',
    rollNo: 'BCA2026-104',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    phone: '+91 98765 44444',
    gender: 'Male',
    dob: '2004-09-05',
    courseId: 'c2',
    semester: '3rd Sem',
    joiningDate: '2024-08-01',
    status: 'Active',
  },
  {
    id: 'st5',
    rollNo: 'BCA2026-105',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@college.edu',
    phone: '+91 98765 55555',
    gender: 'Female',
    dob: '2003-07-28',
    courseId: 'c3',
    semester: '1st Sem',
    joiningDate: '2025-08-01',
    status: 'Active',
  },
];

// Seed initial grades
const INITIAL_GRADES: Grade[] = [
  { id: 'g1', studentId: 'st1', subjectId: 's1', examType: 'Semester End', marksObtained: 85, maxMarks: 100, grade: 'A' },
  { id: 'g2', studentId: 'st2', subjectId: 's1', examType: 'Semester End', marksObtained: 94, maxMarks: 100, grade: 'A+' },
  { id: 'g3', studentId: 'st3', subjectId: 's1', examType: 'Semester End', marksObtained: 78, maxMarks: 100, grade: 'B' },
  { id: 'g4', studentId: 'st1', subjectId: 's2', examType: 'Semester End', marksObtained: 82, maxMarks: 100, grade: 'A' },
  { id: 'g5', studentId: 'st2', subjectId: 's2', examType: 'Semester End', marksObtained: 91, maxMarks: 100, grade: 'A+' },
];

// Seed initial attendance entries
const INITIAL_ATTENDANCE: Attendance[] = [
  { id: 'a1', studentId: 'st1', subjectId: 's1', date: '2026-06-25', status: 'Present' },
  { id: 'a2', studentId: 'st2', subjectId: 's1', date: '2026-06-25', status: 'Present' },
  { id: 'a3', studentId: 'st3', subjectId: 's1', date: '2026-06-25', status: 'Absent' },
  { id: 'a4', studentId: 'st1', subjectId: 's1', date: '2026-06-26', status: 'Present' },
  { id: 'a5', studentId: 'st2', subjectId: 's1', date: '2026-06-26', status: 'Present' },
  { id: 'a6', studentId: 'st3', subjectId: 's1', date: '2026-06-26', status: 'Present' },
];

// Baseline dataset for Departmental Growth enrollment trends
const ENROLLMENT_TRENDS_DATA = [
  { semester: 'Spring 2024', BCA: 45, 'BSc-CS': 30, MCA: 20 },
  { semester: 'Fall 2024', BCA: 60, 'BSc-CS': 40, MCA: 28 },
  { semester: 'Spring 2025', BCA: 55, 'BSc-CS': 35, MCA: 24 },
  { semester: 'Fall 2025', BCA: 75, 'BSc-CS': 48, MCA: 35 },
  { semester: 'Spring 2026', BCA: 70, 'BSc-CS': 42, MCA: 30 },
  { semester: 'Fall 2026', BCA: 90, 'BSc-CS': 55, MCA: 42 },
];

export default function App() {
  // User Authentication Database
  const [usersDb, setUsersDb] = useState<any[]>(() => {
    const saved = localStorage.getItem('campussphere_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Error parsing users database:', err);
      }
    }
    const defaults = [
      { id: 'usr-admin', userId: '7667926418', name: 'Saurabh Anand', role: 'Admin', password: '123456' },
      { id: 'usr-faculty', userId: 'faculty1', name: 'Prof. Rajesh Kumar', role: 'Faculty', password: '123456' },
      { id: 'usr-student', userId: 'student1', name: 'Amit Sharma', role: 'Student', password: '123456' }
    ];
    localStorage.setItem('campussphere_users', JSON.stringify(defaults));
    return defaults;
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('campussphere_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleRegisterUser = (userId: string, name: string, role: 'Admin' | 'Faculty' | 'Student', pass: string) => {
    if (usersDb.some(u => u.userId === userId)) {
      alert('User ID already exists! Please choose a unique User ID.');
      return false;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      userId,
      name,
      role,
      password: pass
    };
    const updated = [...usersDb, newUser];
    setUsersDb(updated);
    localStorage.setItem('campussphere_users', JSON.stringify(updated));
    alert(`Account created successfully as ${role}! You can now login.`);
    return true;
  };

  const handleLoginUser = (userId: string, pass: string) => {
    const found = usersDb.find(u => u.userId === userId && u.password === pass);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('campussphere_current_user', JSON.stringify(found));
      handleAwardPoints(10, `Logged in successfully as ${found.role}`);
      return true;
    } else {
      alert('Invalid User ID or Password! Default admin is ID: 7667926418 and Pass: 123456.');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campussphere_current_user');
  };

  // Auth Screen Form states
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authUserId, setAuthUserId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'Admin' | 'Faculty' | 'Student'>('Admin');

  // Navigation
  const [activeTab, setActiveTab] = useState<'portal' | 'thesis' | 'viva'>('portal');
  // Portal Sub-tabs
  const [portalSubTab, setPortalSubTab] = useState<
    'dashboard' | 'students' | 'attendance' | 'grades' | 'curriculum' |
    'ai-assistant' | 'attendance-analytics' | 'portfolio' | 'events' |
    'peer-community' | 'career-tracker' | 'library' | 'lost-found' | 'feedback' | 'leaderboard' |
    'voice-chatbot' | 'student-profile' | 'teacher-profile' | 'assignments'
  >('dashboard');

  // Mobile sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Floating Chatbot State
  const [isFloatingChatbotOpen, setIsFloatingChatbotOpen] = useState(false);

  // Departmental Growth Recharts enrollment trend states
  const [chartLinesVisibility, setChartLinesVisibility] = useState<{ BCA: boolean; 'BSc-CS': boolean; MCA: boolean }>({
    BCA: true,
    'BSc-CS': true,
    MCA: true,
  });
  const [enrollmentTrends, setEnrollmentTrends] = useState<{ semester: string; BCA: number; 'BSc-CS': number; MCA: number }[]>(() => {
    const saved = localStorage.getItem('sms_enrollment_trends');
    return saved ? JSON.parse(saved) : ENROLLMENT_TRENDS_DATA;
  });
  const [showAddEnrollmentForm, setShowAddEnrollmentForm] = useState(false);
  const [newEnrollmentSem, setNewEnrollmentSem] = useState('');
  const [newEnrollmentBca, setNewEnrollmentBca] = useState(60);
  const [newEnrollmentBsc, setNewEnrollmentBsc] = useState(40);
  const [newEnrollmentMca, setNewEnrollmentMca] = useState(30);

  const handleAddEnrollmentEntry = () => {
    if (!newEnrollmentSem.trim()) {
      alert('Please enter a valid semester name (e.g. Spring 2027)');
      return;
    }
    const newEntry = {
      semester: newEnrollmentSem.trim(),
      BCA: Number(newEnrollmentBca),
      'BSc-CS': Number(newEnrollmentBsc),
      MCA: Number(newEnrollmentMca),
    };
    const updatedTrends = [...enrollmentTrends, newEntry];
    setEnrollmentTrends(updatedTrends);
    localStorage.setItem('sms_enrollment_trends', JSON.stringify(updatedTrends));
    
    // Reset form
    setNewEnrollmentSem('');
    setShowAddEnrollmentForm(false);
    
    // Award points
    handleAwardPoints(20, 'Added New Academic Enrollment Trend Metric');
  };

  const handleResetEnrollmentData = () => {
    if (confirm('Are you sure you want to reset the enrollment trends data to defaults?')) {
      setEnrollmentTrends(ENROLLMENT_TRENDS_DATA);
      localStorage.removeItem('sms_enrollment_trends');
    }
  };

  // Live Toast for gamification point awards
  const [pointsToast, setPointsToast] = useState<{ visible: boolean; points: number; reason: string }>({
    visible: false,
    points: 0,
    reason: ''
  });

  // Core States (Loaded from Local Storage or Seeding)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sms_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('sms_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('sms_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [grades, setGrades] = useState<Grade[]>(() => {
    const saved = localStorage.getItem('sms_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('sms_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Search profile dashboard state
  const [dashSearchRoll, setDashSearchRoll] = useState('');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sms_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sms_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('sms_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('sms_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('sms_attendance', JSON.stringify(attendance));
  }, [attendance]);

  // Points Award Event Listener
  const handleAwardPoints = (points: number, reason: string) => {
    setPointsToast({
      visible: true,
      points,
      reason
    });
    
    // Auto clear toast after 4s
    setTimeout(() => {
      setPointsToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Actions callbacks
  const handleAddStudent = (newS: Omit<Student, 'id'>) => {
    const studentWithId: Student = {
      ...newS,
      id: `st-${Date.now()}`,
    };
    setStudents((prev) => [...prev, studentWithId]);
  };

  const handleEditStudent = (editedS: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === editedS.id ? editedS : s)));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveAttendance = (records: Omit<Attendance, 'id'>[]) => {
    setAttendance((prev) => {
      // Remove previous records on same subject and date to avoid duplication
      const filtered = prev.filter(
        (att) => !(att.subjectId === records[0].subjectId && att.date === records[0].date)
      );
      const withIds = records.map((r, i) => ({
        ...r,
        id: `att-${Date.now()}-${i}`,
      }));
      return [...filtered, ...withIds];
    });
  };

  const handleSaveGrades = (records: Omit<Grade, 'id'>[]) => {
    setGrades((prev) => {
      // Remove matching student + subject + exam records to overwrite
      const filtered = prev.filter(
        (g) =>
          !(
            g.subjectId === records[0].subjectId &&
            g.examType === records[0].examType &&
            records.some((r) => r.studentId === g.studentId)
          )
      );
      const withIds = records.map((r, i) => ({
        ...r,
        id: `grd-${Date.now()}-${i}`,
      }));
      return [...filtered, ...withIds];
    });
  };

  const handleAddCourse = (newC: Omit<Course, 'id'>) => {
    const courseWithId: Course = {
      ...newC,
      id: `c-${Date.now()}`,
    };
    setCourses((prev) => [...prev, courseWithId]);
  };

  const handleAddSubject = (newSub: Omit<Subject, 'id'>) => {
    const subWithId: Subject = {
      ...newSub,
      id: `s-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, subWithId]);
  };

  // Dashboard calculations
  const activeStudentsCount = students.filter((s) => s.status === 'Active').length;
  const runningCoursesCount = courses.length;

  const totalSessionsCount = attendance.length;
  const presentSessionsCount = attendance.filter((a) => a.status === 'Present').length;
  const globalAttendanceRate =
    totalSessionsCount > 0 ? Math.round((presentSessionsCount / totalSessionsCount) * 100) : 85;

  const handleSearchProfile = () => {
    const found = students.find((s) => s.rollNo.toUpperCase() === dashSearchRoll.trim().toUpperCase());
    if (found) {
      setSearchedStudent(found);
    } else {
      setSearchedStudent(null);
      alert('Student with that roll number not found in directory database.');
    }
  };

  // Student specific stats for search profile card
  const getStudentGPA = (studentId: string) => {
    const marksList = grades.filter((g) => g.studentId === studentId);
    if (marksList.length === 0) return 'N/A';
    const sum = marksList.reduce((acc, curr) => acc + curr.marksObtained, 0);
    const avg = sum / marksList.length;
    // Map average score out of 100 to a 10-point GPA scale
    return (avg / 10).toFixed(2);
  };

  const getStudentAttendanceRate = (studentId: string) => {
    const logs = attendance.filter((a) => a.studentId === studentId);
    if (logs.length === 0) return '100%';
    const present = logs.filter((l) => l.status === 'Present').length;
    return `${Math.round((present / logs.length) * 100)}%`;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans text-slate-200 selection:bg-blue-600/30">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden my-4">
          {/* Subtle background glow */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Brand Header */}
          <div className="text-center space-y-2 relative z-10 select-none">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-lg mx-auto shadow-lg shadow-blue-900/30">
              CS
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">CampusSphere Portal</h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Unified Academic Gateway for Administrators, Faculty Advisors, and Class Students.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800/60 relative z-10">
            <button
              type="button"
              onClick={() => {
                setAuthTab('login');
                setAuthUserId('');
                setAuthPassword('');
                setAuthName('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authTab === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In Gate
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthTab('register');
                setAuthUserId('');
                setAuthPassword('');
                setAuthName('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authTab === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (authTab === 'login') {
                handleLoginUser(authUserId, authPassword);
              } else {
                if (!authUserId.trim() || !authPassword.trim() || !authName.trim()) {
                  alert('All starred fields are required!');
                  return;
                }
                const success = handleRegisterUser(authUserId, authName, authRole, authPassword);
                if (success) {
                  setAuthTab('login');
                  setAuthUserId(authUserId);
                  setAuthPassword(authPassword);
                }
              }
            }}
            className="space-y-4 relative z-10 text-left"
          >
            {authTab === 'register' && (
              <div className="space-y-1">
                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Full Profile Name *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">✍</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saurabh Anand"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800/80 focus:border-blue-500 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none text-slate-100 font-bold font-sans"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">User Account ID *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">ID</span>
                <input
                  type="text"
                  required
                  placeholder={authTab === 'login' ? "e.g. 7667926418" : "e.g. Unique User ID"}
                  value={authUserId}
                  onChange={(e) => setAuthUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 focus:border-blue-500 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none text-slate-100 font-bold font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Account Role Selection *</label>
              <select
                value={authRole}
                onChange={(e) => setAuthRole(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800/80 focus:border-blue-500 rounded-lg py-1.5 px-3 text-xs focus:outline-none text-slate-100 font-bold cursor-pointer"
              >
                <option value="Admin">Administrator System</option>
                <option value="Faculty">Faculty Advisor System</option>
                <option value="Student">Class Student System</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Account Password *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">🔑</span>
                <input
                  type="password"
                  required
                  placeholder="••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800/80 focus:border-blue-500 rounded-lg py-1.5 pl-9 pr-3 text-xs focus:outline-none text-slate-100 font-bold font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition shadow-lg shadow-blue-950/40 cursor-pointer active:scale-[0.98]"
            >
              <span>{authTab === 'login' ? 'Authenticate Entry' : 'Register Academic Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Demo Accounts autofill clickable shortcuts */}
          <div className="space-y-3 pt-4 border-t border-slate-800/60 relative z-10 select-none text-left">
            <p className="text-[10px] font-mono font-extrabold uppercase text-slate-500 tracking-wider">💡 Click to Autofill Demo Credentials:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthUserId('7667926418');
                  setAuthPassword('123456');
                  setAuthRole('Admin');
                  setAuthTab('login');
                }}
                className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-blue-950/40 hover:border-blue-800/60 transition active:scale-[0.99] w-full text-left"
              >
                <div>
                  <p className="text-[10px] font-extrabold text-blue-400">Default Super Admin</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: 7667926418 • Pass: 123456</p>
                </div>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-950/80 border border-blue-900/50 rounded-md py-0.5 px-2">Autofill</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthUserId('faculty1');
                  setAuthPassword('123456');
                  setAuthRole('Faculty');
                  setAuthTab('login');
                }}
                className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-emerald-950/40 hover:border-emerald-800/60 transition active:scale-[0.99] w-full text-left"
              >
                <div>
                  <p className="text-[10px] font-extrabold text-emerald-400">Faculty Advisor Account</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: faculty1 • Pass: 123456</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-950/80 border border-emerald-900/50 rounded-md py-0.5 px-2">Autofill</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthUserId('student1');
                  setAuthPassword('123456');
                  setAuthRole('Student');
                  setAuthTab('login');
                }}
                className="bg-purple-950/20 border border-purple-900/40 rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-purple-950/40 hover:border-purple-800/60 transition active:scale-[0.99] w-full text-left"
              >
                <div>
                  <p className="text-[10px] font-extrabold text-purple-400">Class Student Account</p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: student1 • Pass: 123456</p>
                </div>
                <span className="text-[10px] font-bold text-purple-500 bg-purple-950/80 border border-purple-900/50 rounded-md py-0.5 px-2">Autofill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* Floating points credit notification toast */}
      {pointsToast.visible && (
        <div className="fixed bottom-12 right-6 bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-slate-950">
            +{pointsToast.points}
          </div>
          <div>
            <p className="text-xs font-bold font-mono">Gamified Score Credited!</p>
            <p className="text-[10px] text-slate-400 font-semibold">{pointsToast.reason}</p>
          </div>
        </div>
      )}

      {/* Left Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800 shrink-0 select-none">
        <div className="p-6 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm shadow-blue-500/20">CS</div>
          <div className="leading-tight">
            <span className="text-sm font-black text-white tracking-tight block">CampusSphere AI</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">BCA Capstone Core</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 mt-4 px-2">Academic Administration</div>
          
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('dashboard');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'dashboard'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Dashboard
          </button>
          
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('students');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'students'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Student Registry
          </button>
          
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('attendance');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'attendance'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            Attendance Tracker
          </button>
          
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('grades');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'grades'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            Grading Ledger
          </button>
          
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('curriculum');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'curriculum'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            Degree Mapper
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('assignments');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'assignments'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0 text-amber-500" />
            Assignment Manager
          </button>

          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 mt-4 px-2">Campus Smart Ecosystem</div>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('voice-chatbot');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'voice-chatbot'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold animate-pulse'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
            Leo 3D Voice Bot
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('student-profile');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'student-profile'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 shrink-0 text-emerald-400" />
            My Student Dossier
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('teacher-profile');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'teacher-profile'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0 text-indigo-400" />
            Faculty Advisor Profile
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('ai-assistant');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'ai-assistant'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4 shrink-0 text-indigo-400" />
            AI Study Assistant
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('attendance-analytics');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'attendance-analytics'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            Attendance Analytics
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('portfolio');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'portfolio'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            Digital Skill Portfolio
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('events');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'events'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            Campus Event Hub
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('peer-community');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'peer-community'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            Peer Learning Hub
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('career-tracker');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'career-tracker'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            Career & Placement
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('library');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'library'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0 text-slate-500" />
            Smart Library
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('lost-found');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'lost-found'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4 shrink-0" />
            Lost & Found
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('feedback');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'feedback'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HelpCircleIcon className="w-4 h-4 shrink-0" />
            Feedback Desk
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('leaderboard');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'portal' && portalSubTab === 'leaderboard'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <AwardIcon className="w-4 h-4 shrink-0 text-yellow-500" />
            Leaderboard
          </button>

          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 mt-4 px-2">Project Thesis</div>
          <button
            onClick={() => {
              setActiveTab('thesis');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'thesis'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            System Design / ERD
          </button>
          
          <button
            onClick={() => {
              setActiveTab('viva');
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all-custom text-left border cursor-pointer ${
              activeTab === 'viva'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold'
                : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            Interactive Viva Prep
          </button>
        </nav>

        {/* User Card */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30 font-bold text-blue-400 text-xs select-none shrink-0">
                {currentUser ? currentUser.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-white truncate">{currentUser ? currentUser.name : 'Saurabh Anand'}</p>
                <p className="text-[9px] text-slate-400 font-mono tracking-wider font-semibold uppercase">{currentUser ? currentUser.role : 'Student Admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/60 rounded-lg transition cursor-pointer shrink-0"
              title="Logout / Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (Mobile Only) */}
      <header className="lg:hidden h-16 bg-slate-900 text-white flex items-center justify-between px-6 z-40 sticky top-0 shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">CS</div>
          <span className="text-sm font-bold text-white tracking-tight">CampusSphere AI</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Side Menu Dropdown overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 z-30 flex flex-col gap-1 shadow-lg animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 mt-2 px-2">Academic Administration</div>
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('students');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'students' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Student Registry
          </button>
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('attendance');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Attendance Tracker
          </button>
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('grades');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'grades' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Grading Ledger
          </button>
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('curriculum');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'curriculum' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Degree Mapper
          </button>

          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 mt-4 px-2">Campus Smart Ecosystem</div>
          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('ai-assistant');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'ai-assistant' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            AI Study Assistant
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('attendance-analytics');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'attendance-analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Attendance Analytics
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('portfolio');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'portfolio' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Digital Skill Portfolio
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('events');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'events' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Campus Event Hub
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('peer-community');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'peer-community' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Peer Learning Hub
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('career-tracker');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'career-tracker' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Career & Placement
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('library');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'library' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Smart Library
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('lost-found');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'lost-found' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Lost & Found
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('feedback');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'feedback' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <HelpCircleIcon className="w-4 h-4" />
            Feedback Desk
          </button>

          <button
            onClick={() => {
              setActiveTab('portal');
              setPortalSubTab('leaderboard');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'portal' && portalSubTab === 'leaderboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <AwardIcon className="w-4 h-4" />
            Leaderboard
          </button>

          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 mt-4 px-2">Project Thesis</div>
          <button
            onClick={() => {
              setActiveTab('thesis');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'thesis' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            System Design / ERD
          </button>
          <button
            onClick={() => {
              setActiveTab('viva');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-left ${
              activeTab === 'viva' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Interactive Viva Prep
          </button>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center font-bold text-blue-400 text-xs">
                {currentUser ? currentUser.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() : 'SA'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser ? currentUser.name : 'Saurabh Anand'}</p>
                <p className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold uppercase">{currentUser ? currentUser.role : 'Student Admin'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Top Header Row */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {activeTab === 'thesis'
                ? 'System Design & Report (Chapters)'
                : activeTab === 'viva'
                ? 'Viva Voce Exam Preparation'
                : portalSubTab === 'dashboard'
                ? 'Dashboard Overview'
                : portalSubTab === 'students'
                ? 'Student Directory'
                : portalSubTab === 'attendance'
                ? 'Attendance Tracker'
                : portalSubTab === 'grades'
                ? 'Grading Ledger'
                : portalSubTab === 'curriculum'
                ? 'Degree Mapper'
                : portalSubTab === 'ai-assistant'
                ? 'AI Study Assistant & Notes Builder'
                : portalSubTab === 'attendance-analytics'
                ? 'Smart Attendance Analytics'
                : portalSubTab === 'portfolio'
                ? 'Digital Skill Portfolio'
                : portalSubTab === 'events'
                ? 'Campus Event Hub'
                : portalSubTab === 'peer-community'
                ? 'Peer Learning Hub & Doubts Forum'
                : portalSubTab === 'career-tracker'
                ? 'Career & Internship Tracker'
                : portalSubTab === 'library'
                ? 'Smart Library System'
                : portalSubTab === 'lost-found'
                ? 'Campus Lost & Found'
                : portalSubTab === 'feedback'
                ? 'Anonymous Suggestions Desk'
                : 'Achievement Leaderboard'}
            </h1>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase select-none shrink-0">
              System Live
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">June 28, 2026</span>
            </div>
            <div className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded select-none">
              CS-BCA-AI
            </div>
          </div>
        </header>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          {/* Workspace 1: Live SMS App Portal */}
          {activeTab === 'portal' && (
            <div className="space-y-6">
              {/* Dashboard Sub-tab */}
              {portalSubTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Stats Cards Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Students</p>
                        <p className="text-3xl font-bold mt-1 text-slate-900">{activeStudentsCount}</p>
                        <p className="text-[10px] text-green-600 font-bold mt-2">+4.2% from last sem</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Faculty & Degrees</p>
                        <p className="text-3xl font-bold mt-1 text-slate-900">{runningCoursesCount}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2">Active BCA/BSc Department</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Avg. Attendance</p>
                        <p className="text-3xl font-bold mt-1 text-slate-900">{globalAttendanceRate}%</p>
                        <p className="text-[10px] text-blue-600 font-bold mt-2">Critical threshold: CS-301</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Main Data Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Search & Verification Directory */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-sm">Verify Student Profile</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Query the active directory ledger using roll keys.</p>
                        </div>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Enter Roll No"
                              className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-xs focus:outline-blue-500 font-mono"
                              value={dashSearchRoll}
                              onChange={(e) => setDashSearchRoll(e.target.value)}
                            />
                          </div>
                          <button
                            onClick={handleSearchProfile}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition cursor-pointer"
                          >
                            Find Profile
                          </button>
                        </div>

                        {/* Profile Card Output */}
                        {searchedStudent ? (
                          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base border-2 border-white shadow-xs">
                                  {searchedStudent.name.charAt(0)}
                                </div>
                                <div>
                                  <h5 className="font-extrabold text-slate-800 text-sm">{searchedStudent.name}</h5>
                                  <p className="text-[10px] text-slate-400 font-mono">Roll Number: {searchedStudent.rollNo}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-gray-400 uppercase font-bold">Email:</span>
                                  <p className="font-semibold text-slate-700 truncate">{searchedStudent.email}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 uppercase font-bold">Phone:</span>
                                  <p className="font-semibold text-slate-700 truncate">{searchedStudent.phone}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 uppercase font-bold">Academic Degree:</span>
                                  <p className="font-semibold text-slate-700">
                                    {courses.find((c) => c.id === searchedStudent.courseId)?.code || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-gray-400 uppercase font-bold">Current Sem:</span>
                                  <p className="font-semibold text-slate-700">{searchedStudent.semester}</p>
                                </div>
                              </div>
                            </div>

                            {/* Quick Analytical results */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col justify-center space-y-2.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase text-[9px]">GPA Scale:</span>
                                <span className="font-mono font-bold text-blue-600">{getStudentGPA(searchedStudent.id)} / 10.0</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase text-[9px]">Attendance:</span>
                                <span className="font-mono font-bold text-emerald-600">{getStudentAttendanceRate(searchedStudent.id)}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-bold uppercase text-[9px]">Status:</span>
                                <span className="bg-green-50 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                                  {searchedStudent.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-400 italic">No student verified yet. Search above to view individual profile analytics.</p>
                          </div>
                        )}
                      </div>

                      {/* Departmental Growth Line Chart Card */}
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <h4 className="font-extrabold text-slate-800 text-sm">Departmental Growth</h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">Student enrollment trends across recent semesters.</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setShowAddEnrollmentForm(!showAddEnrollmentForm)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Add custom enrollment semester trend data"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Entry</span>
                            </button>
                            {enrollmentTrends.length !== ENROLLMENT_TRENDS_DATA.length && (
                              <button
                                onClick={handleResetEnrollmentData}
                                className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer border border-slate-200"
                                title="Reset enrollment trends data"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Toggle Pill Panels */}
                        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase mr-1.5">Toggle Views:</span>
                          <button
                            onClick={() => setChartLinesVisibility(prev => ({ ...prev, BCA: !prev.BCA }))}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                              chartLinesVisibility.BCA
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-white text-slate-300 border-slate-200 line-through decoration-slate-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>BCA</span>
                          </button>
                          <button
                            onClick={() => setChartLinesVisibility(prev => ({ ...prev, 'BSc-CS': !prev['BSc-CS'] }))}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                              chartLinesVisibility['BSc-CS']
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-white text-slate-300 border-slate-200 line-through decoration-slate-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>BSc-CS</span>
                          </button>
                          <button
                            onClick={() => setChartLinesVisibility(prev => ({ ...prev, MCA: !prev.MCA }))}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                              chartLinesVisibility.MCA
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-white text-slate-300 border-slate-200 line-through decoration-slate-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span>MCA</span>
                          </button>
                        </div>

                        {/* Expandable Add Enrollment Entry Form */}
                        {showAddEnrollmentForm && (
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                            <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">New Semester Data</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">Semester Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Spring 2027"
                                  className="w-full border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-blue-500 font-mono"
                                  value={newEnrollmentSem}
                                  onChange={(e) => setNewEnrollmentSem(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">BCA Intake</label>
                                <input
                                  type="number"
                                  className="w-full border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-blue-500 font-mono"
                                  value={newEnrollmentBca}
                                  onChange={(e) => setNewEnrollmentBca(Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">BSc-CS Intake</label>
                                <input
                                  type="number"
                                  className="w-full border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-blue-500 font-mono"
                                  value={newEnrollmentBsc}
                                  onChange={(e) => setNewEnrollmentBsc(Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">MCA Intake</label>
                                <input
                                  type="number"
                                  className="w-full border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-blue-500 font-mono"
                                  value={newEnrollmentMca}
                                  onChange={(e) => setNewEnrollmentMca(Number(e.target.value))}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => setShowAddEnrollmentForm(false)}
                                className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddEnrollmentEntry}
                                className="px-3.5 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                              >
                                Save Data Entry
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Recharts Render Container */}
                        <div className="h-[280px] w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="semester" stroke="#94a3b8" fontSize={10} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                              <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                              <Legend wrapperStyle={{ fontSize: '10px', marginTop: '8px' }} />
                              <Line
                                type="monotone"
                                dataKey="BCA"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                hide={!chartLinesVisibility.BCA}
                              />
                              <Line
                                type="monotone"
                                dataKey="BSc-CS"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                hide={!chartLinesVisibility['BSc-CS']}
                              />
                              <Line
                                type="monotone"
                                dataKey="MCA"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                hide={!chartLinesVisibility.MCA}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Academic guidelines & Quick actions */}
                    <div className="space-y-6">
                      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase font-mono">Project Companion</span>
                          <h4 className="font-bold text-base">Academic Viva Voce Defenses</h4>
                          <p className="text-xs text-slate-300 leading-relaxed font-mono">
                            This panel manages the live server states. Use the navigation sidebar on the left to review documentation chapters, copy the database schemas, or start the interactive mock viva examiner tool.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveTab('viva')}
                          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          Launch Viva Prep Tool
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Student Directory Sub-tab */}
              {portalSubTab === 'students' && (
                <div className="animate-fade-in">
                  <StudentManager
                    students={students}
                    courses={courses}
                    onAddStudent={handleAddStudent}
                    onEditStudent={handleEditStudent}
                    onDeleteStudent={handleDeleteStudent}
                    currentUserRole={currentUser?.role}
                  />
                </div>
              )}

              {/* Attendance Sub-tab */}
              {portalSubTab === 'attendance' && (
                <div className="animate-fade-in">
                  {currentUser?.role === 'Student' ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Faculty/Admin Access Only</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The live Attendance Ledger can only be modified by faculty members and administrators. 
                        Please visit <strong>My Student Dossier</strong> to view your personal live attendance rate.
                      </p>
                      <button
                        onClick={() => setPortalSubTab('student-profile')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                      >
                        Go to My Student Dossier
                      </button>
                    </div>
                  ) : (
                    <AttendanceManager
                      students={students}
                      courses={courses}
                      subjects={subjects}
                      attendance={attendance}
                      onSaveAttendance={handleSaveAttendance}
                    />
                  )}
                </div>
              )}

              {/* Grading Sub-tab */}
              {portalSubTab === 'grades' && (
                <div className="animate-fade-in">
                  {currentUser?.role === 'Student' ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">Faculty/Admin Access Only</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        The live Grading Ledger can only be modified by faculty members and administrators. 
                        Please visit <strong>My Student Dossier</strong> to view your personal report card.
                      </p>
                      <button
                        onClick={() => setPortalSubTab('student-profile')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                      >
                        Go to My Student Dossier
                      </button>
                    </div>
                  ) : (
                    <GradeManager
                      students={students}
                      courses={courses}
                      subjects={subjects}
                      grades={grades}
                      onSaveGrades={handleSaveGrades}
                    />
                  )}
                </div>
              )}

              {/* Curriculum/Mapper Sub-tab */}
              {portalSubTab === 'curriculum' && (
                <div className="animate-fade-in">
                  <CourseManager
                    courses={courses}
                    subjects={subjects}
                    students={students}
                    grades={grades}
                    onSaveGrades={handleSaveGrades}
                    onAwardPoints={handleAwardPoints}
                    onAddCourse={handleAddCourse}
                    onAddSubject={handleAddSubject}
                    currentUserRole={currentUser?.role}
                  />
                </div>
              )}

              {/* AI Study Assistant Sub-tab */}
              {portalSubTab === 'ai-assistant' && (
                <div className="animate-fade-in">
                  <AIStudyAssistant
                    subjects={subjects}
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Leo 3D Voice Bot Sub-tab */}
              {portalSubTab === 'voice-chatbot' && (
                <div className="animate-fade-in">
                  <AIVoiceChatbot
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Student Profile Dossier Sub-tab */}
              {portalSubTab === 'student-profile' && (
                <div className="animate-fade-in">
                  <StudentProfileView
                    students={students}
                    courses={courses}
                    subjects={subjects}
                    grades={grades}
                    attendance={attendance}
                    onAwardPoints={handleAwardPoints}
                    onEditStudent={handleEditStudent}
                  />
                </div>
              )}

              {/* Faculty Advisor Profile Sub-tab */}
              {portalSubTab === 'teacher-profile' && (
                <div className="animate-fade-in">
                  <TeacherProfileView
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Assignment Manager Sub-tab */}
              {portalSubTab === 'assignments' && (
                <div className="animate-fade-in">
                  <AssignmentManager
                    students={students}
                    subjects={subjects}
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Smart Attendance Analytics Sub-tab */}
              {portalSubTab === 'attendance-analytics' && (
                <div className="animate-fade-in">
                  <SmartAttendanceAnalytics
                    students={students}
                    courses={courses}
                    subjects={subjects}
                    attendance={attendance}
                  />
                </div>
              )}

              {/* Digital Portfolio Sub-tab */}
              {portalSubTab === 'portfolio' && (
                <div className="animate-fade-in">
                  <DigitalPortfolio
                    students={students}
                  />
                </div>
              )}

              {/* Campus Event Hub Sub-tab */}
              {portalSubTab === 'events' && (
                <div className="animate-fade-in">
                  <CampusEventHub
                    students={students}
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Peer Learning Community Sub-tab */}
              {portalSubTab === 'peer-community' && (
                <div className="animate-fade-in">
                  <PeerCommunity
                    students={students}
                    subjects={subjects}
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Career & Internship Tracker Sub-tab */}
              {portalSubTab === 'career-tracker' && (
                <div className="animate-fade-in">
                  <CareerTracker
                    students={students}
                    onAwardPoints={handleAwardPoints}
                  />
                </div>
              )}

              {/* Smart Library Sub-tab */}
              {portalSubTab === 'library' && (
                <div className="animate-fade-in">
                  <SmartLibrary
                    students={students}
                  />
                </div>
              )}

              {/* Lost & Found Sub-tab */}
              {portalSubTab === 'lost-found' && (
                <div className="animate-fade-in">
                  <LostFoundPortal />
                </div>
              )}

              {/* Feedback System Sub-tab */}
              {portalSubTab === 'feedback' && (
                <div className="animate-fade-in">
                  <FeedbackSystem />
                </div>
              )}

              {/* Leaderboard Sub-tab */}
              {portalSubTab === 'leaderboard' && (
                <div className="animate-fade-in">
                  <Leaderboard
                    students={students}
                    courses={courses}
                    attendance={attendance}
                    grades={grades}
                  />
                </div>
              )}
            </div>
          )}

          {/* Workspace 2: 26-Chapter Project Report Thesis Hub */}
          {activeTab === 'thesis' && (
            <div className="animate-fade-in">
              <ReportHub />
            </div>
          )}

          {/* Workspace 3: Interactive Viva Voce Prep */}
          {activeTab === 'viva' && (
            <div className="animate-fade-in">
              <VivaVocePrep students={students} onAwardPoints={handleAwardPoints} />
            </div>
          )}
        </div>

        {/* System Status Footer Bar */}
        <footer className="h-8 bg-slate-100 border-t border-slate-200 px-6 sm:px-8 flex items-center justify-between text-[10px] font-semibold text-slate-500 shrink-0 select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Server Connected
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              |
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              DB Version: 8.0.34-InnoDB
            </span>
          </div>
          <div className="font-mono">CampusSphere AI v1.2.0</div>
        </footer>
      </main>

      {/* FLOATING ACTION CHATBOT WIDGET */}
      <div className="fixed bottom-12 right-6 z-50 print:hidden flex flex-col items-end">
        {isFloatingChatbotOpen && (
          <div className="w-[340px] sm:w-[380px] h-[500px] bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 animate-fade-in">
            <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-850 select-none">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                Leo AI Assistant
              </span>
              <button 
                onClick={() => setIsFloatingChatbotOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-slate-900">
              <AIVoiceChatbot onAwardPoints={handleAwardPoints} isCompact={true} />
            </div>
          </div>
        )}
        <button
          onClick={() => setIsFloatingChatbotOpen(!isFloatingChatbotOpen)}
          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center transition-all duration-250 cursor-pointer border border-white/10 animate-bounce"
          title="Quick Leo Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
