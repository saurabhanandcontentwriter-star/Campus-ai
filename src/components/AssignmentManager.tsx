import React, { useState, useEffect } from 'react';
import { Student, Subject } from '../types';
import { 
  FileText, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  BookOpen, 
  UserCheck, 
  ChevronRight, 
  Send,
  Sparkles,
  Inbox
} from 'lucide-react';

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  creatorName: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText: string;
  fileName?: string;
  submittedAt: string;
  status: 'Pending' | 'Graded';
  marksObtained?: number;
  feedback?: string;
}

interface AssignmentManagerProps {
  students: Student[];
  subjects: Subject[];
  onAwardPoints?: (points: number, reason: string) => void;
}

// Initial seed data
const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    subjectId: 's1', // Database Systems
    title: 'Relational Algebra & Normalization Exercises',
    description: 'Solve the relational algebra queries and normalize the given tables to BCNF. Provide SQL schemas.',
    dueDate: '2026-07-05',
    maxMarks: 50,
    creatorName: 'Dr. Alok Kumar',
    createdAt: '2026-06-25'
  },
  {
    id: 'asg-2',
    subjectId: 's2', // Computer Networks
    title: 'Socket Programming & TCP Handshake Analysis',
    description: 'Implement a multi-threaded server using socket API in Python. Analyze TCP connection state machine.',
    dueDate: '2026-07-10',
    maxMarks: 100,
    creatorName: 'Dr. Sarah Thomas',
    createdAt: '2026-06-27'
  }
];

const SEED_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'st1',
    submissionText: 'Created the database schema in 3NF and normalized to BCNF. Verified via functional dependencies matrix.',
    fileName: 'relational_normalization_v2.sql',
    submittedAt: '2026-06-27T10:30:00Z',
    status: 'Graded',
    marksObtained: 46,
    feedback: 'Excellent breakdown of functional dependencies. Queries are optimal.'
  }
];

export default function AssignmentManager({ students, subjects, onAwardPoints }: AssignmentManagerProps) {
  // Sync states with Local Storage
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('sms_assignments_v1');
    return saved ? JSON.parse(saved) : SEED_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('sms_submissions_v1');
    return saved ? JSON.parse(saved) : SEED_SUBMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('sms_assignments_v1', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sms_submissions_v1', JSON.stringify(submissions));
  }, [submissions]);

  // View Roles: student vs teacher
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('Dr. Alok Kumar');

  // Teacher states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgSubject, setNewAsgSubject] = useState(subjects[0]?.id || '');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgDueDate, setNewAsgDueDate] = useState('2026-07-15');
  const [newAsgMaxMarks, setNewAsgMaxMarks] = useState(50);

  // Grade Form State
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [marksValue, setMarksValue] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');

  // Student States
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [solutionFile, setSolutionFile] = useState('');

  // Active student object
  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Handle Assignment Creation (Teacher action)
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim() || !newAsgDesc.trim()) {
      alert("Please fill in the title and instructions.");
      return;
    }

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      subjectId: newAsgSubject,
      title: newAsgTitle,
      description: newAsgDesc,
      dueDate: newAsgDueDate,
      maxMarks: Number(newAsgMaxMarks),
      creatorName: selectedTeacher,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAssignments(prev => [...prev, newAsg]);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setShowCreateForm(false);
    
    if (onAwardPoints) {
      onAwardPoints(10, 'Uploaded New Semester Assignment Sheet');
    }
  };

  // Handle Student Submission
  const handleSubmitSolution = (asgId: string) => {
    if (!solutionText.trim()) {
      alert("Please enter a response message or solution notes.");
      return;
    }

    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: asgId,
      studentId: selectedStudentId,
      submissionText: solutionText,
      fileName: solutionFile.trim() || 'assignment_submission.pdf',
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };

    setSubmissions(prev => [...prev, newSub]);
    setSubmittingAsgId(null);
    setSolutionText('');
    setSolutionFile('');

    if (onAwardPoints) {
      onAwardPoints(20, 'Submitted Assignment Solutions');
    }
  };

  // Handle Teacher Grading Action
  const handleGradeSubmission = (subId: string, maxMarks: number) => {
    if (marksValue < 0 || marksValue > maxMarks) {
      alert(`Invalid marks. Must be between 0 and ${maxMarks}`);
      return;
    }

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === subId) {
        return {
          ...sub,
          status: 'Graded',
          marksObtained: marksValue,
          feedback: feedbackText
        };
      }
      return sub;
    }));

    setGradingSubmissionId(null);
    setFeedbackText('');
    setMarksValue(0);

    if (onAwardPoints) {
      onAwardPoints(10, 'Graded Student Semester Submission');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Session/Role Config Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Assignment Control Desk</h3>
          <p className="text-xs text-slate-500 mt-0.5">Define your role to upload, submit, or evaluate curriculum worksheets.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role selector */}
          <div className="bg-slate-100 p-1 rounded-lg flex border border-slate-200">
            <button
              onClick={() => setUserRole('student')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                userRole === 'student' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={() => setUserRole('teacher')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                userRole === 'teacher' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher Console
            </button>
          </div>

          {/* Context selectors */}
          {userRole === 'student' ? (
            <select
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg p-2 focus:outline-blue-500"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          ) : (
            <select
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg p-2 focus:outline-blue-500"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="Dr. Alok Kumar">Dr. Alok Kumar (DBMS)</option>
              <option value="Dr. Sarah Thomas">Dr. Sarah Thomas (CN)</option>
              <option value="Prof. Marcus Williams">Prof. Marcus Williams (AI)</option>
            </select>
          )}
        </div>
      </div>

      {/* ----------------- TEACHER VIEW ----------------- */}
      {userRole === 'teacher' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">Active Homework Sheets</h4>
              <p className="text-xs text-slate-400 mt-0.5">Manage tasks created by {selectedTeacher}.</p>
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>

          {/* Creation Form Overlay/Dossier */}
          {showCreateForm && (
            <form onSubmit={handleCreateAssignment} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div className="md:col-span-2 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Worksheet Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Relational Normalization Assignment"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-blue-500 font-semibold text-slate-800"
                    value={newAsgTitle}
                    onChange={(e) => setNewAsgTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Instructions & Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide detailed instructions, list files or schemas to use, specify evaluation metrics..."
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-blue-500 text-slate-700"
                    value={newAsgDesc}
                    onChange={(e) => setNewAsgDesc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-2">Meta Settings</h5>
                
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Associated Subject</label>
                  <select
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded p-1.5 focus:outline-blue-500"
                    value={newAsgSubject}
                    onChange={(e) => setNewAsgSubject(e.target.value)}
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Submission Deadline</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 text-slate-850 text-xs rounded p-1.5 focus:outline-blue-500"
                    value={newAsgDueDate}
                    onChange={(e) => setNewAsgDueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-bold uppercase">Max Grade Limit (Marks)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 text-slate-850 text-xs rounded p-1.5 focus:outline-blue-500 font-mono"
                    value={newAsgMaxMarks}
                    onChange={(e) => setNewAsgMaxMarks(Number(e.target.value))}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg transition shadow-sm"
                  >
                    Deploy
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Submissions Grading desk */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h5 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Inbox className="w-4 h-4 text-slate-400" /> Received Submissions Ledger
              </h5>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase rounded-full">
                {submissions.filter(s => s.status === 'Pending').length} Pending Review
              </span>
            </div>

            {submissions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {submissions.map(sub => {
                  const asg = assignments.find(a => a.id === sub.assignmentId);
                  const stud = students.find(s => s.id === sub.studentId);
                  if (!asg) return null;

                  return (
                    <div key={sub.id} className="p-5 hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs">
                      <div className="space-y-2.5 max-w-3xl">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-slate-800 text-sm">{asg.title}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                            sub.status === 'Graded' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {sub.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] font-medium">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> student: <strong>{stud ? stud.name : 'N/A'}</strong> ({stud?.rollNo})</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> attachment: <strong className="text-blue-600 font-mono">{sub.fileName}</strong></span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {sub.submissionText}
                        </div>

                        {sub.status === 'Graded' && (
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-[11px] text-emerald-800 space-y-1">
                            <p><strong>Grade Score Card:</strong> {sub.marksObtained} / {asg.maxMarks} Marks</p>
                            <p><strong>Professor Comments:</strong> {sub.feedback || 'Excellent work.'}</p>
                          </div>
                        )}
                      </div>

                      {sub.status === 'Pending' && (
                        <div className="shrink-0 w-full md:w-64 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <h6 className="font-bold text-xs text-slate-800">Grade Student Response</h6>
                          
                          {gradingSubmissionId === sub.id ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold uppercase block">Award Marks (Max: {asg.maxMarks})</label>
                                <input
                                  type="number"
                                  min="0"
                                  max={asg.maxMarks}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-xs font-bold focus:outline-blue-500"
                                  value={marksValue}
                                  onChange={(e) => setMarksValue(Number(e.target.value))}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 font-bold uppercase block">Feedback remarks</label>
                                <textarea
                                  rows={2}
                                  placeholder="Add evaluation comments..."
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-xs focus:outline-blue-500"
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setGradingSubmissionId(null)}
                                  className="flex-1 bg-white border border-slate-200 text-[10px] font-bold py-1.5 rounded"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleGradeSubmission(sub.id, asg.maxMarks)}
                                  className="flex-1 bg-green-600 text-white text-[10px] font-bold py-1.5 rounded"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setGradingSubmissionId(sub.id);
                                setMarksValue(asg.maxMarks);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg transition cursor-pointer"
                            >
                              Grade Solution Sheet
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50/50">
                <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 italic">No submissions pending review in active ledger.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ----------------- STUDENT VIEW ----------------- */}
      {userRole === 'student' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] tracking-wider uppercase font-bold text-blue-100">Student Assignment Desk</span>
              <h4 className="text-base font-black">Hi {activeStudent ? activeStudent.name : 'Student'}!</h4>
              <p className="text-xs text-blue-100">Review, write, and submit your responses to weekly homework questions.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-lg border border-white/10 flex items-center gap-3">
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-white/60 block leading-none">Graded</span>
                <span className="text-lg font-black">{submissions.filter(s => s.studentId === selectedStudentId && s.status === 'Graded').length}</span>
              </div>
              <div className="w-px h-6 bg-white/20"></div>
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-white/60 block leading-none">Pending</span>
                <span className="text-lg font-black">{submissions.filter(s => s.studentId === selectedStudentId && s.status === 'Pending').length}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs font-black text-slate-900 tracking-wider uppercase">Current Assigned Homework Sheets</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(asg => {
                const sub = subjects.find(s => s.id === asg.subjectId);
                const submission = submissions.find(s => s.assignmentId === asg.id && s.studentId === selectedStudentId);

                return (
                  <div key={asg.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
                    {/* Status accent indicator */}
                    <div className={`absolute top-0 inset-x-0 h-1 ${
                      submission?.status === 'Graded' ? 'bg-green-500' : submission?.status === 'Pending' ? 'bg-yellow-400' : 'bg-slate-300'
                    }`} />

                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 font-mono font-bold text-[9px] rounded">
                          {sub ? sub.code : 'CS'}
                        </span>
                        
                        {submission ? (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                            submission.status === 'Graded' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                          }`}>
                            {submission.status === 'Graded' ? 'Graded Score' : 'Response Submitted'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> Action Required
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{asg.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{asg.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono">
                      <span>Deadline: <strong className="text-slate-600">{asg.dueDate}</strong></span>
                      <span>Marks: <strong className="text-slate-600">{asg.maxMarks} pts</strong></span>
                    </div>

                    {/* Submit solution panel toggle */}
                    {submission ? (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1">
                        <p className="text-slate-500"><strong>Your attachment:</strong> {submission.fileName}</p>
                        {submission.status === 'Graded' ? (
                          <div className="pt-2 border-t border-slate-200/60 text-emerald-800">
                            <p className="font-bold">Scored: {submission.marksObtained} / {asg.maxMarks} Marks</p>
                            <p className="italic mt-0.5">"{submission.feedback || 'Good work!'}"</p>
                          </div>
                        ) : (
                          <p className="text-amber-700 italic pt-1">Evaluating submission. Feedback will appear here.</p>
                        )}
                      </div>
                    ) : submittingAsgId === asg.id ? (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase block">Solution Notes / Submission text</label>
                          <textarea
                            rows={3}
                            placeholder="Type out your answers, code block snippets, or normalization steps..."
                            className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:outline-blue-500 font-mono"
                            value={solutionText}
                            onChange={(e) => setSolutionText(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-bold uppercase block">Filename attachment (Mock)</label>
                          <input
                            type="text"
                            placeholder="e.g. normalization_queries.sql"
                            className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:outline-blue-500 font-mono"
                            value={solutionFile}
                            onChange={(e) => setSolutionFile(e.target.value)}
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSubmittingAsgId(null)}
                            className="flex-1 bg-white border border-slate-200 text-xs py-1.5 rounded font-bold transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSubmitSolution(asg.id)}
                            className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded font-bold transition shadow-sm"
                          >
                            Upload Solution
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSubmittingAsgId(asg.id)}
                        className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Solution Sheet
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
