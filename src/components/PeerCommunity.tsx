import React, { useState } from 'react';
import { Student, Subject, DiscussionThread } from '../types';
import { MessageSquare, Users, Check, Clock, Plus, CornerDownRight, AlertCircle, BookOpen, User, Lock, CheckCircle2 } from 'lucide-react';

interface PeerCommunityProps {
  students: Student[];
  subjects: Subject[];
  onAwardPoints?: (points: number, reason: string) => void;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subjectCode: string;
  membersCount: number;
  members: string[];
}

export default function PeerCommunity({ students, subjects, onAwardPoints }: PeerCommunityProps) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');

  // Discussion Forums state (stored in local storage)
  const [threads, setThreads] = useState<DiscussionThread[]>(() => {
    const saved = localStorage.getItem('sms_threads');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'th1',
        subjectId: 's1',
        title: 'Trouble configuring Vite proxy with server.ts',
        content: 'I keep getting 404 on my API calls when running "npm run dev". Has anyone successfully mounted the Vite middleware to the Express server in a unified port setup?',
        authorName: 'Saurabh Anand',
        authorRoll: 'BCA2026-102',
        date: '2026-06-27',
        resolved: false,
        replies: [
          {
            id: 'r1',
            authorName: 'Amit Sharma',
            authorRoll: 'BCA2026-101',
            content: 'Yes! Make sure your API endpoints in server.ts are declared BEFORE you instantiate and mount the Vite dev server middleware. Vite middleware intercepts all routing fallbacks.',
            date: '2026-06-27'
          }
        ]
      },
      {
        id: 'th2',
        subjectId: 's2',
        title: 'UML Use Case vs System Sequence Diagrams',
        content: 'Is it required to draw separate sequence diagrams for each use case, or can we make a high-level system boundary sequence diagram?',
        authorName: 'Priyanka Patel',
        authorRoll: 'BCA2026-103',
        date: '2026-06-26',
        resolved: true,
        replies: [
          {
            id: 'r2',
            authorName: 'Rahul Verma',
            authorRoll: 'BCA2026-104',
            content: 'Our software engineering guide says to make high-level sequence diagrams for primary use cases like Student Enrollment and Fee Auditing.',
            date: '2026-06-26'
          }
        ]
      }
    ];
  });

  // Study Groups state (stored in local storage)
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('sms_studygroups');
    if (saved) return JSON.parse(saved);

    return [
      { id: 'g1', name: 'Laravel Dev Hackers', description: 'Collaborating on final-year database triggers, MVC schemas, and blades.', subjectCode: 'BCA-501', membersCount: 4, members: ['st1', 'st2'] },
      { id: 'g2', name: 'Software Architects Hub', description: 'Preparing mock UML diagrams, ERDs, and data flows for thesis review.', subjectCode: 'BCA-502', membersCount: 3, members: ['st3'] }
    ];
  });

  // active state author roll
  const [activeAuthorId, setActiveAuthorId] = useState(students[0]?.id || '');
  const activeStudent = students.find(s => s.id === activeAuthorId);

  // New thread form states
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  // Reply state
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Study group form
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupSub, setGroupSub] = useState(subjects[0]?.code || 'BCA-501');

  const saveThreads = (updated: DiscussionThread[]) => {
    setThreads(updated);
    localStorage.setItem('sms_threads', JSON.stringify(updated));
  };

  const saveStudyGroups = (updated: StudyGroup[]) => {
    setStudyGroups(updated);
    localStorage.setItem('sms_studygroups', JSON.stringify(updated));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim() || !activeStudent) return;

    const newTh: DiscussionThread = {
      id: `th-${Date.now()}`,
      subjectId: selectedSubject,
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
      authorName: activeStudent.name,
      authorRoll: activeStudent.rollNo,
      date: new Date().toISOString().split('T')[0],
      resolved: false,
      replies: []
    };

    saveThreads([newTh, ...threads]);
    setNewThreadTitle('');
    setNewThreadContent('');

    // Award Points
    if (onAwardPoints) {
      onAwardPoints(10, 'Created Forum Doubt Thread');
    }
  };

  const handleAddReply = (threadId: string) => {
    const text = replyText[threadId];
    if (!text || !text.trim() || !activeStudent) return;

    const updated = threads.map(th => {
      if (th.id === threadId) {
        return {
          ...th,
          replies: [
            ...th.replies,
            {
              id: `rep-${Date.now()}`,
              authorName: activeStudent.name,
              authorRoll: activeStudent.rollNo,
              content: text.trim(),
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return th;
    });

    saveThreads(updated);
    setReplyText(prev => ({ ...prev, [threadId]: '' }));

    // Award Points for helping peer
    if (onAwardPoints) {
      onAwardPoints(10, 'Replied to Doubts Discussion Forum');
    }
  };

  const handleToggleResolve = (threadId: string) => {
    const updated = threads.map(th => {
      if (th.id === threadId) {
        return {
          ...th,
          resolved: !th.resolved
        };
      }
      return th;
    });
    saveThreads(updated);
  };

  const handleCreateStudyGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !groupDesc.trim()) return;

    const newG: StudyGroup = {
      id: `g-${Date.now()}`,
      name: groupName.trim(),
      description: groupDesc.trim(),
      subjectCode: groupSub,
      membersCount: 1,
      members: activeAuthorId ? [activeAuthorId] : []
    };

    saveStudyGroups([newG, ...studyGroups]);
    setGroupName('');
    setGroupDesc('');

    if (onAwardPoints) {
      onAwardPoints(10, `Created Study Group: ${groupName}`);
    }
  };

  const handleJoinStudyGroup = (group: StudyGroup) => {
    if (!activeAuthorId) return;
    if (group.members.includes(activeAuthorId)) {
      alert("This student has already joined this study circle!");
      return;
    }

    const updated = studyGroups.map(g => {
      if (g.id === group.id) {
        return {
          ...g,
          membersCount: g.membersCount + 1,
          members: [...g.members, activeAuthorId]
        };
      }
      return g;
    });

    saveStudyGroups(updated);

    if (onAwardPoints) {
      onAwardPoints(10, `Joined Study Group: ${group.name}`);
    }
  };

  // Filter threads for current subject
  const currentThreads = threads.filter(th => th.subjectId === selectedSubject);

  return (
    <div className="space-y-6" id="peer_community_module">
      {/* Forum Configurations */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Peer-to-Peer Learning Forums</h3>
            <p className="text-xs text-slate-500 font-medium">Clear doubts, participate in academic forums, and collaborate in student circles.</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Active Student Selector */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Post As Student</label>
            <select
              value={activeAuthorId}
              onChange={(e) => setActiveAuthorId(e.target.value)}
              className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-blue-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Forum Category</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-blue-500"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} Syllabus</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Doubts Forums threads list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Thread Form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-blue-600" />
              Post a New Doubt in {subjects.find(s => s.id === selectedSubject)?.code}
            </h4>

            <form onSubmit={handleCreateThread} className="space-y-3 text-xs font-medium">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Problem summary (e.g. Normalization vs Denormalization differences)"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-blue-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <textarea
                  required
                  rows={2}
                  placeholder="Elaborate on what code is failing, paste terminal traces, or outline theoretical questions..."
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-xs focus:outline-blue-500 font-medium text-slate-700"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-5 rounded-lg cursor-pointer transition shadow-xs"
                >
                  Publish Doubt
                </button>
              </div>
            </form>
          </div>

          {/* Active Thread Listings */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm">Active Discussions</h4>

            {currentThreads.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-400 italic">No forum threads posted under this subject yet. Be the first to start the discussion!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentThreads.map(th => (
                  <div key={th.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-800 text-sm leading-snug">{th.title}</h5>
                          <button
                            onClick={() => handleToggleResolve(th.id)}
                            className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase flex items-center gap-0.5 ${
                              th.resolved
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}
                          >
                            {th.resolved ? (
                              <>
                                <Check className="h-3 w-3" /> Resolved
                              </>
                            ) : (
                              'Unresolved'
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">
                          Posted by {th.authorName} ({th.authorRoll}) • {th.date}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-lg border border-slate-100">{th.content}</p>

                    {/* Replies listing */}
                    {th.replies.length > 0 && (
                      <div className="space-y-3 pt-2 pl-4 border-l-2 border-slate-100">
                        {th.replies.map(rep => (
                          <div key={rep.id} className="space-y-1.5">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold font-mono">
                              <CornerDownRight className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{rep.authorName} ({rep.authorRoll})</span>
                              <span>• {rep.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg shadow-2xs font-medium">
                              {rep.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Reply */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="Provide clarification or solve doubt..."
                        value={replyText[th.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [th.id]: e.target.value }))}
                        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-1.5 text-xs focus:outline-blue-500 font-medium"
                      />
                      <button
                        onClick={() => handleAddReply(th.id)}
                        disabled={!(replyText[th.id] || '').trim()}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-1.5 px-4 rounded-lg cursor-pointer transition disabled:opacity-40"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Study Circles scheduler */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-600" />
              Academic Study Circles
            </h4>
            <p className="text-xs text-slate-400">Join small dedicated student groups working on specific syllabus benchmarks.</p>

            {/* List Study Groups */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {studyGroups.map(g => {
                const alreadyJoined = g.members.includes(activeAuthorId);
                return (
                  <div key={g.id} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-extrabold text-slate-800 text-xs">{g.name}</h5>
                      <span className="bg-blue-50 text-blue-700 text-[9px] font-mono font-bold px-1.5 rounded-sm">
                        {g.subjectCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{g.description}</p>
                    
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100/50 text-[10px] font-semibold text-slate-400">
                      <span>{g.membersCount} Members active</span>
                      <button
                        onClick={() => handleJoinStudyGroup(g)}
                        disabled={alreadyJoined}
                        className={`text-[10px] font-bold py-1 px-2.5 rounded transition cursor-pointer ${
                          alreadyJoined
                            ? 'bg-green-50 text-green-700 border border-green-100 font-semibold'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {alreadyJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create Study Group Form */}
            <form onSubmit={handleCreateStudyGroup} className="space-y-2.5 border-t border-slate-100 pt-3 text-xs">
              <p className="font-bold text-[10px] uppercase text-slate-400">Launch Study Circle</p>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Group Name (e.g. MySQL Queries Hackers)"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold text-slate-800"
                />
              </div>
              <div>
                <textarea
                  required
                  rows={2}
                  placeholder="Group description..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500 font-medium text-slate-700"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <select
                  value={groupSub}
                  onChange={(e) => setGroupSub(e.target.value)}
                  className="border border-slate-200 rounded-lg p-1 text-xs font-semibold focus:outline-blue-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.code}>{s.code}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs cursor-pointer transition shadow-2xs"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
