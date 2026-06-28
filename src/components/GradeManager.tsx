import React, { useState } from 'react';
import { Student, Course, Subject, Grade } from '../types';
import { Award, TrendingUp, BarChart as ChartIcon, Check, Plus, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GradeManagerProps {
  students: Student[];
  courses: Course[];
  subjects: Subject[];
  grades: Grade[];
  onSaveGrades: (gradeRecords: Omit<Grade, 'id'>[]) => void;
}

export default function GradeManager({
  students,
  courses,
  subjects,
  grades,
  onSaveGrades,
}: GradeManagerProps) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || '');
  const [selectedSemester, setSelectedSemester] = useState('1st Sem');
  const [selectedExam, setSelectedExam] = useState<'Sessional 1' | 'Sessional 2' | 'Semester End'>('Semester End');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Editable scores state map
  const [tempScores, setTempScores] = useState<{ [studentId: string]: { score: number; remarks: string } }>({});

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

  const targetStudents = students.filter(
    (s) => s.courseId === selectedCourse && s.semester === selectedSemester && s.status === 'Active'
  );

  // Load existing grade records when filters change
  React.useEffect(() => {
    if (!selectedSubject) return;

    const existingGrades = grades.filter(
      (g) => g.subjectId === selectedSubject && g.examType === selectedExam
    );

    const initialScores: typeof tempScores = {};
    existingGrades.forEach((g) => {
      initialScores[g.studentId] = {
        score: g.marksObtained,
        remarks: g.remarks || '',
      };
    });

    targetStudents.forEach((stud) => {
      if (!initialScores[stud.id]) {
        initialScores[stud.id] = { score: 0, remarks: '' };
      }
    });

    setTempScores(initialScores);
  }, [selectedSubject, selectedExam, selectedCourse, selectedSemester, grades, students]);

  const handleScoreChange = (studentId: string, value: string) => {
    const parsed = Math.min(100, Math.max(0, parseInt(value) || 0));
    setTempScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score: parsed,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, value: string) => {
    setTempScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks: value,
      },
    }));
  };

  const computeGradeLetter = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    return 'F';
  };

  const handleSave = () => {
    if (!selectedSubject) {
      alert('Please select a subject first!');
      return;
    }

    const recordsToSave = targetStudents.map((stud) => {
      const data = tempScores[stud.id] || { score: 0, remarks: '' };
      return {
        studentId: stud.id,
        subjectId: selectedSubject,
        examType: selectedExam,
        marksObtained: data.score,
        maxMarks: 100,
        grade: computeGradeLetter(data.score),
        remarks: data.remarks,
      };
    });

    onSaveGrades(recordsToSave);
    alert('Academic examination grades updated successfully!');
  };

  // Prepare chart data: Average score by subject for the selected course and semester
  const subjectGradesChartData = filteredSubjects.map((sub) => {
    const subGrades = grades.filter((g) => g.subjectId === sub.id && g.examType === selectedExam);
    const average =
      subGrades.length > 0
        ? Math.round(subGrades.reduce((acc, curr) => acc + curr.marksObtained, 0) / subGrades.length)
        : 0;

    return {
      subject: sub.name.substring(0, 15) + (sub.name.length > 15 ? '...' : ''),
      'Avg Score': average,
      'Max Marks': 100,
    };
  });

  return (
    <div className="space-y-6" id="grade_manager_module">
      {/* Parameters Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
          <Award className="h-4.5 w-4.5 text-blue-600" />
          Examination Grading Configuration
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
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Examination Term</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value as any)}
              className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
            >
              <option value="Sessional 1">Sessional 1 Internal</option>
              <option value="Sessional 2">Sessional 2 Internal</option>
              <option value="Semester End">Semester End Theory</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject</label>
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
        </div>
      </div>

      {/* Visual Analytics Recharts Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Performance Metric Matrix ({selectedExam})
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectGradesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} stroke="#cbd5e1" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }} />
                <Bar name="Class Avg Marks" dataKey="Avg Score" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Bounds helper */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-xs space-y-3 flex flex-col justify-between select-none">
          <div>
            <h4 className="font-bold text-sm flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              University Grading Standards
            </h4>
            <div className="space-y-2 mt-4 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span>Score: 90 - 100</span>
                <span className="text-green-400 font-bold">Grade: A+ (Outstanding)</span>
              </div>
              <div className="flex justify-between">
                <span>Score: 80 - 89</span>
                <span className="text-blue-400 font-bold">Grade: A (Very Good)</span>
              </div>
              <div className="flex justify-between">
                <span>Score: 70 - 79</span>
                <span className="text-sky-400 font-bold">Grade: B (Average)</span>
              </div>
              <div className="flex justify-between">
                <span>Score: 60 - 69</span>
                <span className="text-yellow-400 font-bold">Grade: C (Pass)</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-red-400 font-bold">
                <span>Score: Below 60</span>
                <span>Grade: F (Fail)</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic bg-slate-800/40 p-2.5 rounded border border-slate-800 leading-normal">
            * Note: Exam End marks represent standard final-year evaluation datasets. A dynamic GPA is calculated across core topics.
          </div>
        </div>
      </div>

      {/* Roster list to insert Marks */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between select-none">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Log Mark Sheets: {filteredSubjects.find(s => s.id === selectedSubject)?.name || 'Select Filter'}
          </h4>
        </div>

        {selectedSubject ? (
          targetStudents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {targetStudents.map((stud) => {
                const item = tempScores[stud.id] || { score: 0, remarks: '' };
                const gradeLetter = computeGradeLetter(item.score);

                return (
                  <div key={stud.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center select-none border border-slate-200">
                        {stud.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{stud.name}</p>
                        <p className="text-xs text-slate-400 font-mono font-medium">Roll: {stud.rollNo}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                      {/* Mark Input */}
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide select-none">Marks Out of 100:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.score}
                          onChange={(e) => handleScoreChange(stud.id, e.target.value)}
                          className="border border-slate-200 rounded-lg w-20 py-1 px-2.5 text-center text-xs font-bold focus:outline-blue-500 font-mono"
                        />
                      </div>

                      {/* Calculated Grade Output */}
                      <div className="flex items-center gap-1.5 select-none">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Grade:</span>
                        <span
                          className={`inline-block font-bold text-xs px-2.5 py-0.5 rounded ${
                            gradeLetter === 'A+'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : gradeLetter === 'A'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : gradeLetter === 'B'
                              ? 'bg-sky-50 text-sky-700 border border-sky-100'
                              : gradeLetter === 'C'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {gradeLetter}
                        </span>
                      </div>

                      {/* Remarks */}
                      <div className="flex items-center gap-2 flex-1 max-w-xs min-w-[150px]">
                        <input
                          type="text"
                          placeholder="Add teacher remarks..."
                          value={item.remarks}
                          onChange={(e) => handleRemarksChange(stud.id, e.target.value)}
                          className="border border-slate-200 rounded-lg py-1 px-3 text-xs w-full focus:outline-blue-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 bg-slate-50 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-sm transition cursor-pointer"
                >
                  Save Marks & Compute Grades
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No students enrolled in this Course/Semester.
            </div>
          )
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Please allocate subjects first to insert marks.
          </div>
        )}
      </div>
    </div>
  );
}
