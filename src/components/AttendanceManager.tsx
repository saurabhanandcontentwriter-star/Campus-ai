import React, { useState } from 'react';
import { Student, Course, Subject, Attendance } from '../types';
import { Calendar, CheckCircle2, XCircle, Users, AlertCircle, Sparkles } from 'lucide-react';

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

      {/* Live Checkbox List */}
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
    </div>
  );
}
