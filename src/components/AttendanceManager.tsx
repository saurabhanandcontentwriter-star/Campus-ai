import React, { useState } from 'react';
import { Student, Course, Subject, Attendance } from '../types';
import { 
  Calendar, 
  Download,
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
  RefreshCw,
  Timer,
  RotateCcw,
  Check
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

  // Tab View Mode: 'manual' (Grid) vs 'qr' (QR Scanning Hub) vs 'face' (Biometric Face Scanner)
  const [activeMode, setActiveMode] = useState<'manual' | 'qr' | 'face'>('manual');
  const [showLogsToggle, setShowLogsToggle] = useState<boolean>(false);

  // QR Scanning States
  const [selectedScannerStudent, setSelectedScannerStudent] = useState<string>('');
  const [scannerState, setScannerState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);
  const [isBeepEnabled, setIsBeepEnabled] = useState(true);
  const [autoSaveOnScan, setAutoSaveOnScan] = useState(true);
  const [scanHistory, setScanHistory] = useState<{ id: string; student: Student; time: string; subjectName: string }[]>([]);

  // Face Scanning States
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceScanState, setFaceScanState] = useState<'idle' | 'scanning' | 'matched' | 'error'>('idle');
  const [faceMatchProgress, setFaceMatchProgress] = useState<number>(0);
  const [isFlashActive, setIsFlashActive] = useState<boolean>(false);
  const [selectedFaceStudent, setSelectedFaceStudent] = useState<string>('');

  // Dynamic QR session expiration countdown timer states
  const [qrSessionDuration, setQrSessionDuration] = useState<number>(120); // default 120 seconds (2 mins)
  const [qrSessionTimeLeft, setQrSessionTimeLeft] = useState<number>(120);
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);

  // Camera initialization and cleanup for Biometric Face Scan Mode
  React.useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (activeMode === 'face') {
      setCameraError(null);
      setFaceScanState('idle');
      setFaceMatchProgress(0);

      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } })
        .then((stream) => {
          activeStream = stream;
          setVideoStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.warn('Video stream play error:', e));
          }
        })
        .catch((err) => {
          console.warn('Webcam permission denied or unavailable:', err);
          setCameraError('Webcam blocked, denied, or not plugged in. Emulating AI vector mesh scanning canvas instead.');
        });
    } else {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
      }
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeMode]);

  // Countdown mechanism for the active QR scan session
  React.useEffect(() => {
    if (activeMode !== 'qr') return;
    if (qrSessionTimeLeft <= 0) {
      setIsSessionExpired(true);
      return;
    }

    setIsSessionExpired(false);

    const intervalId = setInterval(() => {
      setQrSessionTimeLeft((prev) => {
        if (prev <= 1) {
          setIsSessionExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [activeMode, qrSessionTimeLeft]);

  // Helper to regenerate/renew the dynamic QR session
  const handleResetQrSession = (duration: number = qrSessionDuration) => {
    setQrSessionDuration(duration);
    setQrSessionTimeLeft(duration);
    setIsSessionExpired(false);
    if (scannerState === 'error') {
      setScannerState('idle');
    }
  };

  // Reset QR session when subject or active mode changes
  React.useEffect(() => {
    if (activeMode === 'qr') {
      setQrSessionTimeLeft(qrSessionDuration);
      setIsSessionExpired(false);
    }
  }, [selectedSubject, activeMode]);

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
      setSelectedFaceStudent(targetStudents[0].id);
    } else {
      setSelectedScannerStudent('');
      setSelectedFaceStudent('');
    }
  }, [selectedCourse, selectedSemester, students, targetStudents]);

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

  // Helper to log attendance via Face Biometrics and optionally save immediately
  const logAttendanceViaFace = (studentId: string) => {
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

  // Trigger simulated face scanning match
  const handleTriggerFaceScan = () => {
    if (!selectedSubject) {
      alert('Please configure/select a valid subject first.');
      return;
    }
    const student = targetStudents.find(s => s.id === selectedFaceStudent);
    if (!student) {
      alert('Please choose an active student to scan.');
      return;
    }

    setFaceScanState('scanning');
    setFaceMatchProgress(15);

    // Increment matching progress bar dynamically
    const progressInterval = setInterval(() => {
      setFaceMatchProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressInterval);
      setFaceMatchProgress(100);
      playBeep();
      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 200);

      setFaceScanState('matched');
      setScannedStudent(student);
      setShowToast(true);

      logAttendanceViaFace(student.id);

      // Add to scan history
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const activeSubjectName = filteredSubjects.find((s) => s.id === selectedSubject)?.name || 'Subject';

      setScanHistory((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          student,
          time: timeStr,
          subjectName: `${activeSubjectName} (Face Scan ID Match)`,
        },
        ...prev,
      ]);

      // Return scanner to idle after 3.5s
      setTimeout(() => {
        setFaceScanState('idle');
        setFaceMatchProgress(0);
      }, 3500);

      // Manage Toast timeout
      if (toastTimer) clearTimeout(toastTimer);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4500);
      setToastTimer(timer);

    }, 1200);
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

  // Click handler for interactive history log entries
  const handleHistoryLogClick = (item: { student: Student; subjectName: string }) => {
    // Select student card so admin can inspect their details/RFID profile
    setSelectedScannerStudent(item.student.id);

    // Toggle attendance mark status (Present <-> Absent)
    setMarkedRecords((prev) => {
      const currentStatus = prev[item.student.id] || 'Present';
      const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
      const updated = { ...prev, [item.student.id]: newStatus };

      // Commit update immediately to ledger if auto-sync is active
      if (autoSaveOnScan) {
        const recordsToSave = targetStudents.map((stud) => ({
          studentId: stud.id,
          subjectId: selectedSubject,
          date: selectedDate,
          status: stud.id === item.student.id ? newStatus : (updated[stud.id] || 'Present'),
        }));
        onSaveAttendance(recordsToSave);
      }

      // Display immediate visual confirmation (Success toast)
      setScannedStudent(item.student);
      setShowToast(true);
      if (toastTimer) clearTimeout(toastTimer);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3500);
      setToastTimer(timer);

      return updated;
    });

    playBeep();
  };

  // Simulate scanning a student's QR Code ID badge
  const handleSimulateScan = () => {
    if (isSessionExpired) {
      alert('The current QR session has expired! Please regenerate or extend the session first.');
      return;
    }
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

  // Export current active attendance session records into a standard CSV format
  const handleExportCSV = () => {
    if (!selectedSubject) {
      alert('Please configure/select a valid subject first.');
      return;
    }
    if (targetStudents.length === 0) {
      alert('No students found in this course/semester to export.');
      return;
    }

    const courseObj = courses.find((c) => c.id === selectedCourse);
    const subjectObj = subjects.find((s) => s.id === selectedSubject);
    
    const courseName = courseObj ? courseObj.name : 'Unknown Course';
    const courseCode = courseObj ? courseObj.code : '';
    const subjectName = subjectObj ? subjectObj.name : 'Unknown Subject';
    const subjectCode = subjectObj ? subjectObj.code : '';

    // CSV columns configuration
    const headers = [
      'Roll No',
      'Student Name',
      'Course Code',
      'Course Name',
      'Semester',
      'Subject Code',
      'Subject Name',
      'Session Date',
      'Attendance Status'
    ];
    
    const rows = targetStudents.map((stud) => {
      const status = markedRecords[stud.id] || 'Present';
      return [
        stud.rollNo,
        stud.name,
        courseCode,
        courseName,
        selectedSemester,
        subjectCode,
        subjectName,
        selectedDate,
        status
      ];
    });

    // Safely generate CSV formatting handling quote shielding
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Trigger seamless file download in the browser
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance_Backup_${courseCode || 'Course'}_${subjectCode || 'Subject'}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex flex-col sm:flex-row border-b border-slate-200 select-none bg-white p-1 rounded-xl shadow-xs gap-1 justify-between items-stretch sm:items-center">
        <div className="flex gap-1 flex-1 sm:flex-initial flex-wrap">
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
          <button
            onClick={() => setActiveMode('face')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border relative ${
              activeMode === 'face'
                ? 'bg-cyan-600/10 text-cyan-600 border-cyan-600/20 shadow-xs'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent'
            }`}
          >
            <Camera className="w-4 h-4 text-cyan-500" />
            Biometric Face Scanner
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-1.5 sm:mt-0 w-full sm:w-auto">
          <button
            onClick={() => setShowLogsToggle(!showLogsToggle)}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
              showLogsToggle
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900'
            }`}
            title="Toggle recent scan logs view"
          >
            <History className="w-3.5 h-3.5" />
            <span>Scan Logs {scanHistory.length > 0 && `(${Math.min(scanHistory.length, 10)})`}</span>
          </button>

          {targetStudents.length > 0 && selectedSubject && (
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              title="Export session records as CSV backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Backup (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* SECONDARY TOGGLEABLE SCAN LOGS VIEW */}
      {showLogsToggle && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-fade-in" id="secondary_scan_logs_panel">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Recent Auto-Scans Feed (Last 10 Logs)
              </span>
              <span className="text-[10px] bg-blue-100/80 text-blue-800 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                Interactive Admin Control
              </span>
            </div>
            <div className="flex items-center gap-2">
              {scanHistory.length > 0 && (
                <button
                  onClick={() => setScanHistory([])}
                  className="text-[10px] text-red-500 hover:text-red-600 font-extrabold flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded-lg border border-slate-200 hover:border-slate-300 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear History
                </button>
              )}
              <button
                onClick={() => setShowLogsToggle(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 cursor-pointer hover:bg-slate-200/60 rounded-lg transition"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pb-0.5 font-medium leading-relaxed">
            💡 <span className="font-extrabold text-slate-700">Immediate Action Guide:</span> Click any card below to instantly toggle that student's status between <span className="text-emerald-600 font-extrabold">Present ⇆ Absent</span> and auto-save updates to the roll database.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {scanHistory.length > 0 ? (
              scanHistory.slice(0, 10).map((item) => {
                const currentStatus = markedRecords[item.student.id] || 'Present';
                return (
                  <button
                    key={item.id}
                    onClick={() => handleHistoryLogClick(item)}
                    className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between h-28 relative overflow-hidden group select-none cursor-pointer hover:scale-[1.02] active:scale-95 duration-150 ${
                      currentStatus === 'Present'
                        ? 'bg-white hover:bg-emerald-50/10 border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs'
                        : 'bg-red-50/20 hover:bg-red-50/40 border-red-100 hover:border-red-200 shadow-2xs'
                    }`}
                    title={`Click to toggle ${item.student.name} attendance status`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border transition-all ${
                        currentStatus === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {item.student.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600 transition-colors">
                          {item.student.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-semibold truncate uppercase">
                          {item.student.rollNo}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[8.5px] font-mono text-slate-400 font-bold">
                        ⏱️ {item.time}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider border transition-all ${
                        currentStatus === 'Present'
                          ? 'bg-emerald-50/80 text-emerald-700 border-emerald-100/50'
                          : 'bg-red-50/80 text-red-700 border-red-100/50'
                      }`}>
                        {currentStatus}
                      </span>
                    </div>

                    {/* Quick indicator overlay on hover */}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/5 rounded-full p-1">
                      <span className="text-[8px] font-black text-slate-500 px-1 font-mono">
                        Toggle ⇆
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2 bg-white rounded-xl border border-dashed border-slate-200 p-6">
                <Wifi className="w-8 h-8 text-slate-300 animate-pulse" />
                <p className="font-bold text-slate-700">No dynamic check-ins recorded yet</p>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  Head over to the <span className="font-bold text-emerald-600">Sleek QR Scan Terminal</span>, trigger code simulation check-ins, and their real-time timestamps will appear here for interactive logs management.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

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
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear all attendance marks for this roster register? This resets all students to Absent.')) {
                      markAll('Absent');
                    }
                  }}
                  className="bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded transition cursor-pointer uppercase flex items-center gap-1"
                  title="Wipe current marks and start over"
                >
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                  Clear Marks
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

                <div className="p-4 bg-slate-50 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
                    title="Export session records as CSV backup"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
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
      ) : activeMode === 'qr' ? (
        /* Futuristic QR Code Scan Terminal View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-in-up">
          {/* Main hardware viewport simulator */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-5 border border-slate-800 text-slate-300 shadow-xl flex flex-col justify-between min-h-[480px] relative overflow-hidden">
            
            {/* Holographic background scanner grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_75%)] pointer-events-none" />

            {/* Title Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 z-10 relative gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">QR/NFC READER TERMINAL v2.4</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Timer Countdown Display */}
                <div className={`flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded border ${
                  isSessionExpired 
                    ? 'text-red-400 bg-red-950/30 border-red-900/50' 
                    : qrSessionTimeLeft < 30
                    ? 'text-amber-400 bg-amber-950/30 border-amber-900/50 animate-pulse'
                    : 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span className="font-bold">
                    {isSessionExpired ? 'EXPIRED' : `${Math.floor(qrSessionTimeLeft / 60).toString().padStart(2, '0')}:${(qrSessionTimeLeft % 60).toString().padStart(2, '0')}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[9px] text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSessionExpired ? 'bg-red-500' : 'bg-emerald-400 animate-ping'}`} />
                  <span>{isSessionExpired ? 'SECURE EXPIRED' : 'ONLINE LINKED'}</span>
                </div>
              </div>
            </div>

            {/* SCANNING CANVAS VIEWPORT */}
            <div className="flex-1 my-5 rounded-xl border border-slate-900 bg-slate-900/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]">
              
              {/* Dynamic countdown progress bar at the top of the viewport */}
              {!isSessionExpired && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-950/60 z-20">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      qrSessionTimeLeft < 30 ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                    }`}
                    style={{ width: `${(qrSessionTimeLeft / qrSessionDuration) * 100}%` }}
                  />
                </div>
              )}

              {/* Expired State Overlay */}
              {isSessionExpired ? (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4 z-30 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-red-500 shadow-xl">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <span className="text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      TOKEN EXPIRED
                    </span>
                    <h5 className="text-sm font-extrabold text-white mt-1.5">QR Security Token Expired</h5>
                    <p className="text-[11px] text-slate-400 font-medium">
                      The dynamic QR session key has expired to protect roll attendance integrity. Renew to allow check-ins.
                    </p>
                  </div>
                  <button
                    onClick={() => handleResetQrSession()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition duration-200 cursor-pointer shadow-md shadow-emerald-900/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    REGENERATE SESSION
                  </button>
                </div>
              ) : null}

              {/* Vertical Glowing Laser Scanline */}
              {scannerState === 'scanning' && !isSessionExpired && (
                <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.8)] z-20 animate-scan-line" />
              )}
              {scannerState === 'idle' && !isSessionExpired && (
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Audio configuration */}
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Sound FX</span>
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
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Direct Sync</span>
                  <button
                    onClick={() => setAutoSaveOnScan(!autoSaveOnScan)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors uppercase cursor-pointer border ${
                      autoSaveOnScan 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-900 text-slate-500 border-transparent'
                    }`}
                  >
                    {autoSaveOnScan ? 'ENABLED' : 'MANUAL'}
                  </button>
                </div>

                {/* Session configuration & refresh */}
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Timer</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={qrSessionDuration}
                      onChange={(e) => handleResetQrSession(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded py-0.5 px-1 text-[10px] text-emerald-400 focus:outline-none"
                    >
                      <option value={60}>1m</option>
                      <option value={120}>2m</option>
                      <option value={300}>5m</option>
                      <option value={600}>10m</option>
                    </select>
                    <button
                      onClick={() => handleResetQrSession()}
                      className="p-1 rounded text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                      title="Reset Session timer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
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
                  scanHistory.slice(0, 10).map((item) => {
                    const currentStatus = markedRecords[item.student.id] || 'Present';
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryLogClick(item)}
                        className={`w-full p-2.5 border rounded-xl flex items-center justify-between gap-3 animate-fade-in text-left cursor-pointer hover:scale-[1.01] active:scale-95 duration-100 group ${
                          currentStatus === 'Present'
                            ? 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/10'
                            : 'bg-red-50/10 border-red-100 hover:border-red-200 hover:bg-red-50/20'
                        }`}
                        title="Click to toggle attendance status"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}>
                            {item.student.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600 transition-colors">
                              {item.student.name}
                            </p>
                            <p className="text-[9px] text-slate-400 font-semibold truncate uppercase">
                              {item.subjectName}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <p className="font-mono font-bold text-[10px] text-slate-500">{item.time}</p>
                          <span className={`text-[8px] border px-1 rounded uppercase font-extrabold tracking-wide ${
                            currentStatus === 'Present'
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {currentStatus}
                          </span>
                        </div>
                      </button>
                    );
                  })
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
      ) : (
        /* Biometric Live Face Scanning View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none animate-slide-in-up" id="biometric_face_scanner_view">
          {/* Main hardware viewport simulator */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-5 border border-slate-800 text-slate-300 shadow-xl flex flex-col justify-between min-h-[480px] relative overflow-hidden">
            
            {/* Holographic background scanner grid */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_75%)] pointer-events-none" />

            {/* Title Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 z-10 relative gap-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">CYAN BIOMETRIC EYE-TRACK SCANNER v3.1</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-[9px] font-mono font-black text-cyan-400/80 bg-cyan-950/40 border border-cyan-900/50 px-2 py-0.5 rounded uppercase">
                  BIOMETRIC NODE ACTIVE
                </span>
              </div>
            </div>

            {/* Interactive Scanner Viewport */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-xl border border-slate-900 bg-slate-950/80 min-h-[280px]">
              
              {cameraError ? (
                /* High-Fidelity Vector Mesh Emulator Canvas fallback */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  {/* Dynamic pulsing vector dots face mesh */}
                  <div className="w-24 h-24 rounded-full border border-cyan-500/30 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20 animate-spin" style={{ animationDuration: '8s' }} />
                    <div className="absolute w-20 h-20 rounded-full border border-cyan-500/40 animate-pulse" />
                    <div className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    {/* Abstract crosshair lines */}
                    <div className="absolute w-full h-0.5 bg-cyan-500/10" />
                    <div className="absolute h-full w-0.5 bg-cyan-500/10" />
                    {/* Dynamic tracking nodes */}
                    <span className="absolute top-2 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    <span className="absolute bottom-4 right-10 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-cyan-400 font-mono tracking-wider">AI VECTOR PROFILE EMULATOR ACTIVE</p>
                    <p className="text-[10px] text-slate-500 max-w-sm leading-normal">
                      {cameraError}
                    </p>
                  </div>
                </div>
              ) : (
                /* Live Webcam stream */
                <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  {/* Realtime face targeting square box */}
                  <div className={`absolute w-44 h-44 border-2 rounded-2xl transition-all duration-300 z-10 ${
                    faceScanState === 'scanning'
                      ? 'border-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse'
                      : faceScanState === 'matched'
                      ? 'border-emerald-400 shadow-[0_0_15px_#34d399]'
                      : 'border-slate-500/60'
                  }`}>
                    {/* Interactive target locks */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                  </div>
                </div>
              )}

              {/* Laser Scanline */}
              {faceScanState === 'scanning' && (
                <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.8)] z-20 animate-scan-line" />
              )}
              {faceScanState === 'idle' && (
                <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-600 to-transparent shadow-[0_0_6px_rgba(6,182,212,0.5)] z-20 animate-scan-line" />
              )}

              {/* Viewport Reticle Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-sm pointer-events-none border-cyan-700/60" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-sm pointer-events-none border-cyan-700/60" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-sm pointer-events-none border-cyan-700/60" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-sm pointer-events-none border-cyan-700/60" />

              {/* Flash Overlay */}
              {isFlashActive && (
                <div className="absolute inset-0 bg-white z-30 animate-fade-out" />
              )}

              {/* Active UI overlay based on scanning states */}
              {faceScanState === 'idle' && (
                <div className="absolute bottom-4 inset-x-0 mx-auto text-center z-10">
                  <span className="text-[9px] font-mono font-bold bg-slate-950/85 text-cyan-400 border border-cyan-900/50 px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                    ● CAMERA STREAM ACTIVE • AWAITING SUBJECT
                  </span>
                </div>
              )}

              {faceScanState === 'scanning' && (
                <div className="absolute bottom-4 inset-x-0 mx-auto text-center z-10 px-4">
                  <div className="max-w-xs mx-auto bg-slate-950/90 border border-cyan-500/40 rounded-full px-3 py-1 flex items-center justify-between gap-3 shadow-lg">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider animate-pulse shrink-0">
                      MESH CALIBRATING...
                    </span>
                    <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full transition-all duration-150" style={{ width: `${faceMatchProgress}%` }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-cyan-300">{faceMatchProgress}%</span>
                  </div>
                </div>
              )}

              {faceScanState === 'matched' && scannedStudent && (
                <div className="absolute inset-0 bg-cyan-950/20 flex flex-col items-center justify-center p-6 text-center space-y-3 z-20 animate-fade-in">
                  <div className="absolute w-28 h-28 rounded-full border border-cyan-500/30 animate-ping-radar pointer-events-none" />
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 shadow-xl relative z-20">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      BIOMETRICS RECOGNIZED
                    </span>
                    <h5 className="text-base font-extrabold text-white mt-1.5">{scannedStudent.name}</h5>
                    <p className="text-xs font-mono text-cyan-400/80 mt-0.5">Confidence 99.8% • Ledger Written</p>
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM PANEL CONTROLS */}
            <div className="border-t border-slate-900 pt-4 space-y-4 z-10 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audio configuration */}
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Sound FX</span>
                  <button
                    onClick={() => setIsBeepEnabled(!isBeepEnabled)}
                    className={`p-1 rounded cursor-pointer transition ${
                      isBeepEnabled ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-600 hover:text-slate-500'
                    }`}
                  >
                    {isBeepEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                {/* DB sync configuration */}
                <div className="flex items-center justify-between bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Direct Sync</span>
                  <button
                    onClick={() => setAutoSaveOnScan(!autoSaveOnScan)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors uppercase cursor-pointer border ${
                      autoSaveOnScan 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                        : 'bg-slate-900 text-slate-500 border-transparent'
                    }`}
                  >
                    {autoSaveOnScan ? 'ENABLED' : 'MANUAL'}
                  </button>
                </div>
              </div>

              {/* SIMULATION ACTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Choose Subject Presenting student
                  </label>
                  <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">
                    ({targetStudents.length} Students Active)
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={selectedFaceStudent}
                    onChange={(e) => setSelectedFaceStudent(e.target.value)}
                    disabled={targetStudents.length === 0}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-600 font-semibold"
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
                    onClick={handleTriggerFaceScan}
                    disabled={targetStudents.length === 0 || faceScanState === 'scanning'}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-850 disabled:text-slate-600 text-slate-950 font-mono font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition duration-200 cursor-pointer shadow-lg shadow-cyan-900/10"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    TRIGGER FACE MATCH
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Biometric Dossier Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col items-center text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />
              
              <div className="w-full flex justify-between items-start">
                <span className="text-[9px] font-mono font-bold text-cyan-600 tracking-wider">CYAN SECURITY DOSSIER</span>
                <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold">FACIAL AUTHENTICATOR</span>
              </div>

              {faceScanState === 'matched' && scannedStudent ? (
                /* Authenticated State */
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 mx-auto overflow-hidden flex items-center justify-center text-slate-400 font-bold text-2xl shadow-inner">
                      {scannedStudent.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      VERIFIED RECOGNIZED
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-lg mt-2">{scannedStudent.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold font-mono">ID: {scannedStudent.rollNo}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 text-left space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Department Course:</span>
                      <span className="font-bold text-slate-700">
                        {courses.find((c) => c.id === scannedStudent.courseId)?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Active Semester:</span>
                      <span className="font-bold text-slate-700 font-mono">{scannedStudent.semester}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Roster Register status:</span>
                      <span className="font-extrabold text-emerald-600 font-mono">MARKED PRESENT</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Sessional Attendance:</span>
                      <span className="font-bold text-slate-700">
                        {getStudentAttendanceStats(scannedStudent.id).percent}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                    <p className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">BIOMETRIC HARDWARE LOGS</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                      Subject facial node coordinates calibrated. Neural matching distance score is <span className="font-bold text-cyan-600">0.024 (PASS)</span>. Attendance ledger row inserted successfully.
                    </p>
                  </div>
                </div>
              ) : (
                /* Idle/Ready State */
                <div className="w-full py-10 space-y-4 text-center">
                  <div className="w-20 h-20 rounded-full border border-dashed border-slate-300 mx-auto flex items-center justify-center text-slate-300 animate-pulse">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Awaiting Biometric Verification</h5>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">
                      Select a student card from the selection dropdown and click <span className="font-bold text-cyan-600">Trigger Face Match</span> to simulate live facial validation.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* QUICK INFORMATION CARD */}
            <div className="bg-cyan-50/50 border border-cyan-100/80 rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-cyan-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Biometric AI Safeguard
              </h5>
              <p className="text-[11px] text-cyan-700/90 leading-relaxed font-medium">
                The face scanning system matches live facial contours against registered campus digital files to prevent check-in spoofing and proxy attendance. All records are updated automatically.
              </p>
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
