import React, { useState } from 'react';
import { Student, Course, Subject, Attendance } from '../types';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Users, 
  AlertCircle, 
  Sparkles, 
  QrCode, 
  Camera, 
  Volume2, 
  VolumeX, 
  History, 
  CheckCircle, 
  Trash2, 
  Wifi, 
  UserCheck,
  RefreshCw
} from 'lucide-react';

interface AttendanceManagerProps {
  students: Student[];
  courses: Course[];
  subjects: Subject[];
  attendance: Attendance[];
  onSaveAttendance: (attendanceRecords: Omit<Attendance, 'id'>[]) => void;
}

export default function AttendanceManager({
  students,
  courses,
  subjects,
  attendance,
  onSaveAttendance,
}: AttendanceManagerProps) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || '');
  const [selectedSemester, setSelectedSemester] = useState('1st Sem');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Tab View Mode: 'manual' (Grid) vs 'qr' (QR Scanning Hub)
  const [activeMode, setActiveMode] = useState<'manual' | 'qr'>('manual');

  // QR Scanning States
  const [selectedScannerStudent, setSelectedScannerStudent] = useState<string>('');
  const [scannerState, setScannerState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);
  const [isBeepEnabled, setIsBeepEnabled] = useState(true);
  const [autoSaveOnScan, setAutoSaveOnScan] = useState(true);
  const [scanHistory, setScanHistory] = useState<{ id: string; student: Student; time: string; subjectName: string }[]>([]);

  // Temporary grid state before saving
  const [markedRecords, setMarkedRecords] = useState<{ [studentId: string]: 'Present' | 'Absent' }>({});

  // Filter subjects based on course and semester
  const filteredSubjects = subjects.filter(
    (sub) => sub.courseId === selectedCourse && sub.semester === selectedSemester
  );

  // Auto-select first subject when filters change
  React.useEffect(() => {
    if (filteredSubjects.length > 0) {
      setSelectedSubject(filteredSubjects[0].id);
    } else {
      setSelectedSubject('');
    }
  }, [selectedCourse, selectedSemester, subjects]);

  // Fetch students for selected course/sem
  const targetStudents = students.filter(
    (s) => s.courseId === selectedCourse && s.semester === selectedSemester && s.status === 'Active'
  );

  // Auto-select first student in scanner dropdown when targetStudents change
  React.useEffect(() => {
    if (targetStudents.length > 0) {
      setSelectedScannerStudent(targetStudents[0].id);
    } else {
      setSelectedScannerStudent('');
    }
  }, [selectedCourse, selectedSemester, students]);

  // Load existing records if they exist for this course, semester, subject, and date
  React.useEffect(() => {
    if (!selectedSubject) return;

    const existingRecords = attendance.filter(
      (att) => att.subjectId === selectedSubject && att.date === selectedDate
    );

    const initialMarks: { [studentId: string]: 'Present' | 'Absent' } = {};
    // Populate existing
    existingRecords.forEach((att) => {
      initialMarks[att.studentId] = att.status;
    });

    // For students with no record, default to 'Present'
    targetStudents.forEach((stud) => {
      if (!initialMarks[stud.id]) {
        initialMarks[stud.id] = 'Present';
      }
    });

    setMarkedRecords(initialMarks);
  }, [selectedSubject, selectedDate, selectedCourse, selectedSemester, attendance, students]);

  const toggleStatus = (studentId: string) => {
    setMarkedRecords((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const markAll = (status: 'Present' | 'Absent') => {
    const updated: typeof markedRecords = {};
    targetStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setMarkedRecords(updated);
  };

  // Common Save Handler
  const handleSave = () => {
    if (!selectedSubject) {
      alert('Please select a valid subject first.');
      return;
    }

    const recordsToSave = targetStudents.map((stud) => ({
      studentId: stud.id,
      subjectId: selectedSubject,
      date: selectedDate,
      status: markedRecords[stud.id] || 'Present',
    }));

    onSaveAttendance(recordsToSave);
    alert('Attendance registers saved successfully!');
  };

  // Helper to log attendance via QR and optionally save immediately
  const logAttendanceViaQR = (studentId: string) => {
    if (!selectedSubject) return;

    setMarkedRecords((prev) => {
      const updated = { ...prev, [studentId]: 'Present' as const };

      // Auto save to database if configured
      if (autoSaveOnScan) {
        const recordsToSave = targetStudents.map((stud) => ({
          studentId: stud.id,
          subjectId: selectedSubject,
          date: selectedDate,
          status: stud.id === studentId ? 'Present' as const : (updated[stud.id] || 'Present' as const),
        }));
        onSaveAttendance(recordsToSave);
      }

      return updated;
    });
  };

  // Audio synthesis feedback (Beep sound on successful scan)
  const playBeep = () => {
    if (!isBeepEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 1350; // Pleasant high-pitched scan confirmation tone
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.16);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      console.warn('Audio Context beep could not be initialized:', e);
    }
  };

  // Simulate scanning a student's QR Code ID badge
  const handleSimulateScan = () => {
    if (!selectedSubject) {
      alert('Please configure/select a valid subject first.');
      return;
    }
    const student = targetStudents.find((s) => s.id === selectedScannerStudent);
    if (!student) {
      alert('Please choose an active student to simulate scanning.');
      return;
    }

    setScannerState('scanning');

    // Simulate standard QR recognition time (700ms)
    setTimeout(() => {
      playBeep();
      setScannerState('success');
      setScannedStudent(student);
      setShowToast(true);

      // Save/Log locally & parent database
      logAttendanceViaQR(student.id);

      // Add to session history
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const activeSubjectName = filteredSubjects.find((s) => s.id === selectedSubject)?.name || 'Subject';

      setScanHistory((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          student,
          time: timeStr,
          subjectName: activeSubjectName,
        },
        ...prev,
      ]);

      // Return scanner to idle state
      setTimeout(() => {
        setScannerState('idle');
      }, 1600);

      // Manage Toast timeout
      if (toastTimer) clearTimeout(toastTimer);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4500);
      setToastTimer(timer);

    }, 700);
  };

  // Calculate statistics
  const totalStudents = targetStudents.length;
  const presentCount = Object.values(markedRecords).filter((status) => status === 'Present').length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Calculate individual running attendance percentage for all subjects
  const getStudentAttendanceStats = (studentId: string) => {
    const records = attendance.filter((att) => att.studentId === studentId);
    if (records.length === 0) return { percent: 100, total: 0, attended: 0 };
    const present = records.filter((att) => att.status === 'Present').length;
    return {
      percent: Math.round((present / records.length) * 100),
      total: records.length,
      attended: present,
    };
  };

  // Render highly-polished simulated QR Code SVG
  const renderSimulatedQRCode = (rollNo: string) => {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-900 bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
        {/* Positioning anchors */}
        <rect x="5" y="5" width="22" height="22" rx="2" fill="currentColor" />
        <rect x="9" y="9" width="14" height="14" fill="white" />
        <rect x="12" y="12" width="8" height="8" rx="1" fill="currentColor" />
        
        <rect x="73" y="5" width="22" height="22" rx="2" fill="currentColor" />
        <rect x="77" y="9" width="14" height="14" fill="white" />
        <rect x="80" y="12" width="8" height="8" rx="1" fill="currentColor" />

        <rect x="5" y="73" width="22" height="22" rx="2" fill="currentColor" />
        <rect x="9" y="77" width="14" height="14" fill="white" />
        <rect x="12" y="80" width="8" height="8" rx="1" fill="currentColor" />

        {/* Dynamic-looking randomized bit patterns */}
        <rect x="32" y="5" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="42" y="11" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="52" y="5" width="12" height="6" rx="1" fill="currentColor" />
        <rect x="32" y="17" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="52" y="17" width="6" height="12" rx="1" fill="currentColor" />

        <rect x="5" y="32" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="15" y="42" width="6" height="12" rx="1" fill="currentColor" />
        <rect x="25" y="32" width="12" height="6" rx="1" fill="currentColor" />

        <rect x="42" y="42" width="16" height="16" rx="2" fill="currentColor" />
        <rect x="46" y="46" width="8" height="8" fill="white" />
        <rect x="49" y="49" width="2" height="2" fill="currentColor" />
        
        <rect x="62" y="32" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="62" y="42" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="73" y="32" width="12" height="6" rx="1" fill="currentColor" />
        <rect x="80" y="42" width="12" height="12" rx="2" fill="currentColor" />

        <rect x="32" y="73" width="6" height="12" rx="1" fill="currentColor" />
        <rect x="42" y="82" width="12" height="6" rx="1" fill="currentColor" />
        <rect x="58" y="73" width="6" height="6" rx="1" fill="currentColor" />
        <rect x="32" y="89" width="12" height="6" rx="1" fill="currentColor" />

        <rect x="73" y="73" width="12" height="6" rx="1" fill="currentColor" />
        <rect x="89" y="82" width="6" height="12" rx="1" fill="currentColor" />
        <rect x="73" y="89" width="12" height="6" rx="1" fill="currentColor" />
        <rect x="89" y="73" width="6" height="6" rx="1" fill="currentColor" />
      </svg>
    );
  };

  return (
    <div className="space-y-6" id="attendance_manager_module">
      {/* Selection Filters Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
          <Calendar className="h-4.5 w-4.5 text-blue-600" />
          Roster Session Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
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
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
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
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={filteredSubjects.length === 0}
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 disabled:bg-slate-50 disabled:text-slate-400 font-semibold"
            >
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))
              ) : (
                <option value="">No Subjects Allocated</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Roster Live Stat Cards */}
      {targetStudents.length > 0 && selectedSubject && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Students Checked</span>
              <h4 className="text-2xl font-extrabold text-slate-800 mt-1">{totalStudents}</h4>
            </div>
            <div className="p-3 rounded-full bg-slate-50 text-slate-600">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Present Count</span>
              <h4 className="text-2xl font-extrabold text-green-600 mt-1">{presentCount}</h4>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Session Attendance Rate</span>
              <h4 className="text-2xl font-extrabold text-blue-600 mt-1">{attendanceRate}%</h4>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation Switcher */}
      <div className="flex border-b border-slate-200 select-none bg-white p-1 rounded-xl shadow-xs gap-1">
        <button
          onClick={() => setActiveMode('manual')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
            activeMode === 'manual'
              ? 'bg-blue-600/10 text-blue-600 border-blue-600/20 shadow-xs'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'
          }`}
        >
          <Users className="w-4 h-4" />
          Roster Register Grid
        </button>
        <button
          onClick={() => setActiveMode('qr')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border relative ${
            activeMode === 'qr'
              ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20 shadow-xs'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'
          }`}
        >
          <QrCode className="w-4 h-4 text-emerald-500" />
          Sleek QR Scan Terminal
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* Mode Render Router */}
      {activeMode === 'manual' ? (
        /* Manual Checkbox List View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 select-none">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Roster Ledger Matrix: {filteredSubjects.find(s => s.id === selectedSubject)?.name || 'Select Filter'}
            </h4>

            {targetStudents.length > 0 && selectedSubject && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => markAll('Present')}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-green-50 hover:text-green-700 text-[10px] font-bold px-3 py-1.5 rounded transition cursor-pointer uppercase"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll('Absent')}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 text-[10px] font-bold px-3 py-1.5 rounded transition cursor-pointer uppercase"
                >
                  All Absent
                </button>
              </div>
            )}
          </div>

          {selectedSubject ? (
            targetStudents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {targetStudents.map((stud) => {
                  const status = markedRecords[stud.id] || 'Present';
                  const runningStats = getStudentAttendanceStats(stud.id);
                  const hasLowAttendance = runningStats.total > 0 && runningStats.percent < 75;

                  return (
                    <div
                      key={stud.id}
                      onClick={() => toggleStatus(stud.id)}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-sm select-none ${
                            status === 'Present'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {status === 'Present' ? 'P' : 'A'}
                        </div>

                        <div>
                          <p className="font-bold text-slate-800 text-sm">{stud.name}</p>
                          <p className="text-xs text-slate-400 font-mono font-medium">Roll: {stud.rollNo}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Running Stats */}
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className={`text-xs font-bold ${hasLowAttendance ? 'text-red-600' : 'text-slate-600'}`}>
                              {runningStats.percent}% Attendance
                            </span>
                            {hasLowAttendance && (
                              <span className="bg-red-50 text-red-700 p-0.5 rounded" title="Critically below 75% required attendance!">
                                <AlertCircle className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {runningStats.attended}/{runningStats.total} sessions recorded
                          </p>
                        </div>

                        {/* Check toggle */}
                        <button
                          type="button"
                          className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer ${
                            status === 'Present' ? 'bg-green-500 justify-end' : 'bg-red-500 justify-start'
                          }`}
                        >
                          <span className="bg-white w-4 h-4 rounded-full shadow-md transform duration-200" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="p-4 bg-slate-50 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Save Daily Ledger
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                No active students enrolled in this selected Course and Semester.
              </div>
            )
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              <AlertCircle className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              Please configure academic courses and subjects to allocate student attendance slots.
            </div>
          )}
        </div>
      ) : (
        /* Futuristic QR Code Scan Terminal View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-in-up">
          {/* Main hardware viewport simulator */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-5 border border-slate-800 text-slate-300 shadow-xl flex flex-col justify-between min-h-[480px] relative overflow-hidden">
            
            {/* Holographic background scanner grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_75%)] pointer-events-none" />

            {/* Title Block */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 z-10 relative">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">QR/NFC READER TERMINAL v2.4</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE LINKED</span>
              </div>
            </div>

            {/* SCANNING CANVAS VIEWPORT */}
            <div className="flex-1 my-5 rounded-xl border border-slate-900 bg-slate-900/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
              
              {/* Vertical Glowing Laser Scanline */}
              {scannerState === 'scanning' && (
                <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.8)] z-20 animate-scan-line" />
              )}
              {scannerState === 'idle' && (
                <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_6px_rgba(16,185,129,0.5)] z-20 animate-scan-line" />
              )}

              {/* Viewport Reticle Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm transition-all duration-300 pointer-events-none border-slate-700" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-sm transition-all duration-300 pointer-events-none border-slate-700" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-sm transition-all duration-300 pointer-events-none border-slate-700" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-sm transition-all duration-300 pointer-events-none border-slate-700" />

              {/* Active UI overlay based on scanner state */}
              {scannerState === 'idle' && (
                <div className="text-center p-6 space-y-3 z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-500 shadow-lg relative group">
                    <QrCode className="w-7 h-7 text-slate-400 group-hover:text-emerald-400 transition-all duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Awaiting QR Presentation</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs font-medium">Select a student card on the right panel and execute a simulated scan sequence.</p>
                  </div>
                </div>
              )}

              {scannerState === 'scanning' && (
                <div className="text-center p-6 space-y-3 z-10 flex flex-col items-center">
                  <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase animate-pulse">
                    Decrypting QR Ledger Node...
                  </p>
                  <p className="text-[9px] text-slate-600 font-mono">BCA-LEDGER-AUTH-TOKEN-RESOLVING</p>
                </div>
              )}

              {scannerState === 'success' && scannedStudent && (
                <div className="absolute inset-0 bg-emerald-950/20 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10 animate-fade-in">
                  
                  {/* Ping radar effect */}
                  <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30 animate-ping-radar pointer-events-none" />

                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl relative z-20">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      CREDENTIAL RECORDED
                    </span>
                    <h5 className="text-base font-extrabold text-white mt-1.5">{scannedStudent.name}</h5>
                    <p className="text-xs font-mono text-emerald-400/80 mt-0.5">Roll: {scannedStudent.rollNo} • Present</p>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM PANEL CONTROLS */}
            <div className="border-t border-slate-900 pt-4 space-y-4 z-10 relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Audio configuration */}
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Sound Feedback</span>
                  <button
                    onClick={() => setIsBeepEnabled(!isBeepEnabled)}
                    className={`p-1 rounded cursor-pointer transition ${
                      isBeepEnabled ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-500'
                    }`}
                  >
                    {isBeepEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {/* DB sync configuration */}
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Direct Ledger Sync</span>
                  <button
                    onClick={() => setAutoSaveOnScan(!autoSaveOnScan)}
                    className={`text-[9px] font-bold px-2 py-1 rounded transition-colors uppercase cursor-pointer border ${
                      autoSaveOnScan 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-900 text-slate-500 border-transparent'
                    }`}
                  >
                    {autoSaveOnScan ? 'ENABLED' : 'MANUAL'}
                  </button>
                </div>
              </div>

              {/* SIMULATION ACTION FOR LECTURERS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Select Presenting Student Card
                  </label>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">
                    ({targetStudents.length} Students Active)
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedScannerStudent}
                    onChange={(e) => setSelectedScannerStudent(e.target.value)}
                    disabled={targetStudents.length === 0}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-600 font-semibold"
                  >
                    {targetStudents.length > 0 ? (
                      targetStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.rollNo} - {s.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No Active Students Enrolled</option>
                    )}
                  </select>

                  <button
                    onClick={handleSimulateScan}
                    disabled={targetStudents.length === 0 || scannerState === 'scanning'}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-850 disabled:text-slate-600 text-slate-950 font-mono font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition duration-200 cursor-pointer shadow-lg shadow-emerald-900/10"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    SIMULATE SCAN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Badge Visualiser & History Feed sidebar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* STYLIZED STUDENT ID BADGE VIEWPORT */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col items-center text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-700" />
              
              <div className="w-full flex justify-between items-start">
                <span className="text-[9px] font-mono font-bold text-blue-600 tracking-wider">CAMPUS SPHERE ID CARD</span>
                <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold">BCA LAB ENTRANCE</span>
              </div>

              {/* ID Card Display based on Selected Dropdown Student */}
              {(() => {
                const activeSt = targetStudents.find(s => s.id === selectedScannerStudent);
                if (!activeSt) {
                  return (
                    <div className="py-12 text-slate-400 text-xs font-semibold">
                      Please enroll or select students to visualize RFID card profile.
                    </div>
                  );
                }

                const runningStats = getStudentAttendanceStats(activeSt.id);

                return (
                  <div className="w-full flex flex-col items-center space-y-4">
                    {/* Simulated student photo */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-2xl text-slate-700 shadow-md relative overflow-hidden">
                        {activeSt.name.charAt(0)}
                        {/* Matrix tech line design across photo */}
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-blue-500/50 blur-[1px]" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-500" title="Active Student" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-black text-slate-900">{activeSt.name}</h4>
                      <p className="text-xs text-slate-500 font-mono font-semibold">Roll: {activeSt.rollNo}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">{selectedSemester} BCA</p>
                    </div>

                    {/* SVG generated QR pattern mapping */}
                    <div className="my-1.5">
                      {renderSimulatedQRCode(activeSt.rollNo)}
                    </div>

                    {/* Metadata tags */}
                    <div className="grid grid-cols-2 gap-3 w-full border-t border-slate-100 pt-3.5 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">Status Badge</span>
                        <span className="text-[10px] text-slate-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" /> Active Student
                        </span>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">Total Presence</span>
                        <span className={`text-[10px] font-bold ${runningStats.percent < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {runningStats.percent}% (Req 75%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* LIVE FEED HISTORY LOGS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Live Check-in History</span>
                </div>
                {scanHistory.length > 0 && (
                  <button
                    onClick={() => setScanHistory([])}
                    className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Logs
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto max-h-48 space-y-2 pr-1 scrollbar-thin">
                {scanHistory.length > 0 ? (
                  scanHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 animate-fade-in"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100">
                          {item.student.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-xs truncate">{item.student.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold truncate uppercase">{item.subjectName}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-[10px] text-slate-600">{item.time}</p>
                        <span className="text-[8px] bg-green-50 text-green-700 border border-green-100 px-1 rounded uppercase font-extrabold tracking-wide">
                          PRESENT
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                    <Wifi className="w-7 h-7 text-slate-300 animate-pulse" />
                    <p className="font-medium">No check-ins captured during this active session.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DYNAMIC SUCCESS TOAST NOTIFICATION */}
      {showToast && scannedStudent && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 animate-bounce bg-slate-900 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 text-white rounded-2xl p-4 max-w-sm w-full flex items-center gap-3.5 border-l-4">
          <div className="h-10 w-10 shrink-0 bg-emerald-500/10 border border-emerald-400 rounded-xl flex items-center justify-center text-emerald-400 animate-pulse">
            <UserCheck className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wider">Attendance Logged</span>
              <span className="text-[9px] font-mono text-slate-500">QR-Scanner v2.0</span>
            </div>
            <p className="font-bold text-sm text-slate-100 truncate mt-0.5">{scannedStudent.name}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Roll No: {scannedStudent.rollNo} • Present</p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white p-1 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Embedded Custom Keyframe Animations */}
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0.15; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.15; }
        }
        .animate-scan-line {
          animation: scan-line 2.5s infinite linear;
        }
        @keyframes ping-radar {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .animate-ping-radar {
          animation: ping-radar 1.2s ease-out infinite;
        }
        @keyframes slide-in-up {
          0% { transform: translateY(16px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
