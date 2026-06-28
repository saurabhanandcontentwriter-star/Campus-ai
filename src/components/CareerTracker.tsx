import React, { useState } from 'react';
import { Student, PlacementOpportunity } from '../types';
import { Briefcase, FileText, CheckCircle, ExternalLink, Bookmark, Plus, Users, Compass, ChevronRight, Clock, ShieldAlert } from 'lucide-react';

interface CareerTrackerProps {
  students: Student[];
  onAwardPoints?: (points: number, reason: string) => void;
}

interface PreparationResource {
  id: string;
  title: string;
  category: 'Aptitude' | 'Coding' | 'Interview' | 'DBMS';
  description: string;
  resourceLink: string;
}

export default function CareerTracker({ students, onAwardPoints }: CareerTrackerProps) {
  // Placement Opportunities state (in local storage)
  const [opportunities, setOpportunities] = useState<PlacementOpportunity[]>(() => {
    const saved = localStorage.getItem('sms_placements');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'pl1',
        title: 'Backend Software Engineering Intern (PHP/Node)',
        company: 'InnovateTech Solutions',
        type: 'Internship',
        location: 'Bengaluru, India (Hybrid)',
        stipendOrPackage: '₹25,000 / month',
        deadline: '2026-07-10',
        description: 'Join the server architecture team to optimize relational MySQL databases, implement lazy loaded REST controllers, and integrate security gateways.',
        skillsRequired: ['PHP', 'MySQL', 'Node.js', 'REST APIs'],
        appliedStudentIds: ['st1']
      },
      {
        id: 'pl2',
        title: 'Junior Full Stack Developer',
        company: 'CloudSphere Global Services',
        type: 'Full-Time',
        location: 'Hyderabad, India (On-site)',
        stipendOrPackage: '₹6.5 LPA (CTC)',
        deadline: '2026-07-22',
        description: 'Design and deploy scalable web architectures. Work closely with frontend product managers and database administrators to build modern cloud pipelines.',
        skillsRequired: ['React', 'Express', 'MySQL', 'Tailwind CSS', 'TypeScript'],
        appliedStudentIds: []
      },
      {
        id: 'pl3',
        title: 'Database Administrator Associate',
        company: 'Triumph DBMS Systems',
        type: 'Full-Time',
        location: 'Pune, India (Remote)',
        stipendOrPackage: '₹5.2 LPA (CTC)',
        deadline: '2026-07-05',
        description: 'Conduct security audit trails, monitor relational index execution, optimize query configurations, and manage backup restores.',
        skillsRequired: ['MySQL', 'Database Security', 'Linux', 'SQL Optimization'],
        appliedStudentIds: ['st2']
      }
    ];
  });

  // Track application statuses (applied student mapping to job ids with states: Applied, Shortlisted, Interview Scheduled, Offered)
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, 'Applied' | 'Shortlisted' | 'Interview' | 'Offered'>>(() => {
    return {
      'st1-pl1': 'Shortlisted',
      'st2-pl3': 'Interview'
    };
  });

  const [prepResources] = useState<PreparationResource[]>([
    { id: 'res1', title: 'Top 50 PHP & OOP Interview Questions', category: 'DBMS', description: 'Comprehensive guide covering abstract classes, SQL injections prevention, and magic arrays.', resourceLink: '#' },
    { id: 'res2', title: 'Relational Schema Optimization Guide', category: 'DBMS', description: 'Practical cheatsheet on normal forms definitions (1NF-3NF) and index joins.', resourceLink: '#' },
    { id: 'res3', title: 'Quantitative Aptitude Practice Set', category: 'Aptitude', description: 'A database of numerical series, logical sequences, and clock-ratio puzzles for pre-screening exams.', resourceLink: '#' },
    { id: 'res4', title: 'Data Structures Coding Interview Sheet', category: 'Coding', description: 'Cheat sheet for trees traversal, linked list reversals, and sorting complexity averages.', resourceLink: '#' }
  ]);

  // Selected testing student profile
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id || '');
  const currentStudent = students.find(s => s.id === activeStudentId);

  const saveOpportunities = (updated: PlacementOpportunity[]) => {
    setOpportunities(updated);
    localStorage.setItem('sms_placements', JSON.stringify(updated));
  };

  const handleApplyOpportunity = (job: PlacementOpportunity) => {
    if (!activeStudentId) return;

    if (job.appliedStudentIds.includes(activeStudentId)) {
      alert("This student profile has already submitted an application for this position.");
      return;
    }

    const updated = opportunities.map(op => {
      if (op.id === job.id) {
        return {
          ...op,
          appliedStudentIds: [...op.appliedStudentIds, activeStudentId]
        };
      }
      return op;
    });

    saveOpportunities(updated);
    
    // Set status
    const key = `${activeStudentId}-${job.id}`;
    setApplicationStatuses(prev => ({
      ...prev,
      [key]: 'Applied'
    }));

    // Award Points
    if (onAwardPoints) {
      onAwardPoints(20, `Submitted Internship Application to ${job.company}`);
    }
  };

  // Get status of current student for a job
  const getJobStatus = (jobId: string) => {
    const key = `${activeStudentId}-${jobId}`;
    return applicationStatuses[key] || null;
  };

  return (
    <div className="space-y-6" id="career_tracker_module">
      {/* Top Config Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Placement Prep & Internship Gateway</h3>
            <p className="text-xs text-slate-500 font-medium">Review and apply to mock campus placements, track recruitment boards, and study preparatory interview guides.</p>
          </div>
        </div>

        {/* Candidate Switcher */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Mock Apply As Student</label>
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-blue-500"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job placements opportunities listings */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm">Active Placement Postings</h4>

          <div className="space-y-4">
            {opportunities.map(job => {
              const status = getJobStatus(job.id);
              const applied = status !== null;

              return (
                <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:border-blue-300 transition duration-150">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                        job.type === 'Internship'
                          ? 'bg-orange-50 text-orange-600 border border-orange-100'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      }`}>
                        {job.type}
                      </span>

                      <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {job.stipendOrPackage}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{job.title}</h5>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{job.company} • {job.location}</p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{job.description}</p>
                  </div>

                  {/* Skills required list */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-50">
                    {job.skillsRequired.map(skill => (
                      <span key={skill} className="bg-slate-50 text-slate-500 text-[9px] font-mono font-extrabold border border-slate-100 px-1.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer apply action */}
                  <div className="flex items-center justify-between text-xs font-semibold pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Apply before {job.deadline}
                    </span>

                    <div className="flex items-center gap-2">
                      {applied && (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${
                          status === 'Applied' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                          status === 'Shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          status === 'Interview' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          Status: {status}
                        </span>
                      )}

                      <button
                        onClick={() => handleApplyOpportunity(job)}
                        disabled={applied}
                        className={`font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition ${
                          applied
                            ? 'bg-green-50 text-green-700 border border-green-100 font-semibold'
                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                        }`}
                      >
                        {applied ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" /> Applied
                          </>
                        ) : (
                          'Submit Resume'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Placement preparation files & aptitude quizzes */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-600" />
              Syllabus Prep Materials
            </h4>
            <p className="text-xs text-slate-400">Excel at technical recruitment rounds. Click resource references to read notes.</p>

            <div className="space-y-3">
              {prepResources.map(res => (
                <div key={res.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition duration-150 flex justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                      res.category === 'DBMS' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      res.category === 'Coding' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                      {res.category}
                    </span>
                    <h5 className="font-extrabold text-slate-800 text-xs leading-snug">{res.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal font-medium">{res.description}</p>
                  </div>
                  
                  <a href={res.resourceLink} className="text-slate-400 hover:text-slate-800 pt-1">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
