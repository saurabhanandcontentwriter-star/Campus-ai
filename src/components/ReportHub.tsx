import React, { useState } from 'react';
import { reportChapters } from '../data/reportData';
import { Search, Copy, Check, Printer, FileText, ChevronRight, Layout, Database, Network, GitMerge, FileCode } from 'lucide-react';

export default function ReportHub() {
  const [activeChapterId, setActiveChapterId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [umlTab, setUmlTab] = useState<'usecase' | 'class' | 'sequence' | 'activity'>('usecase');
  const [printMode, setPrintMode] = useState<'active' | 'full'>('full');

  // Search filter
  const filteredChapters = reportChapters.filter((ch) =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChapter = reportChapters.find((ch) => ch.id === activeChapterId) || reportChapters[0];

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates((prev) => ({ ...prev, [filename]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [filename]: false }));
    }, 2000);
  };

  const handlePrintActive = () => {
    setPrintMode('active');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintFull = () => {
    setPrintMode('full');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Render SVG System Architecture (Chapter 11)
  const renderSystemArchitecture = () => (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 my-6">
      <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider text-center select-none">Interactive System Architecture Diagram</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center max-w-2xl mx-auto py-4">
        {/* Tier 1 */}
        <div className="bg-white p-4 rounded-lg border-2 border-blue-600 shadow-xs text-center space-y-2">
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full select-none">TIER 1 (Presentation)</span>
          <h5 className="font-bold text-sm text-slate-800">Client Web Browser</h5>
          <p className="text-[10px] text-slate-500 font-medium">HTML5 / Tailwind CSS / Vanilla JS</p>
        </div>
        {/* Sync Indicator */}
        <div className="flex flex-col items-center justify-center text-slate-400 h-10 md:h-auto">
          <span className="text-[10px] font-mono text-blue-600 font-bold">HTTP / Ajax</span>
          <div className="hidden md:block w-full border-t-2 border-dashed border-slate-300 relative">
            <span className="absolute right-0 top-1/2 -translate-y-1/2 border-r-2 border-b-2 border-slate-300 w-2 h-2 transform rotate-45"></span>
          </div>
          <span className="md:hidden">⬇</span>
        </div>
        {/* Tier 2 */}
        <div className="bg-slate-900 p-4 rounded-lg text-white shadow-xs text-center space-y-2 border border-slate-800">
          <span className="text-[9px] font-bold text-blue-300 bg-slate-800 px-2 py-0.5 rounded-full select-none">TIER 2 (Application)</span>
          <h5 className="font-bold text-sm">PHP Apache Server</h5>
          <p className="text-[10px] text-slate-400 font-medium font-mono">PDO Execution & Session Engine</p>
        </div>
        {/* Sync Indicator */}
        <div className="hidden md:block"></div>
        <div className="flex flex-col items-center justify-center text-slate-400 h-10 md:h-auto">
          <span className="text-[10px] font-mono text-emerald-500 font-bold">SQL Queries</span>
          <div className="hidden md:block w-full border-t-2 border-dashed border-slate-300 relative">
            <span className="absolute right-0 top-1/2 -translate-y-1/2 border-r-2 border-b-2 border-slate-300 w-2 h-2 transform rotate-45"></span>
          </div>
          <span className="md:hidden">⬇</span>
        </div>
        {/* Tier 3 */}
        <div className="bg-emerald-950 p-4 rounded-lg text-emerald-400 shadow-xs text-center space-y-2 border border-emerald-800">
          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-full select-none">TIER 3 (Database)</span>
          <h5 className="font-bold text-sm text-emerald-300">MySQL Database</h5>
          <p className="text-[10px] text-emerald-500 font-medium">Structured Relational Indexes</p>
        </div>
      </div>
    </div>
  );

  // Render SVG ERD Diagram (Chapter 14)
  const renderERD = () => (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-6 my-6">
      <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider text-center select-none">Entity Relationship Diagram (ERD Schema Map)</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {/* Course Entity */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="bg-slate-900 text-white font-mono text-[10px] font-bold p-1.5 rounded text-center mb-2 select-none">
            COURSES
          </div>
          <ul className="text-[10px] font-mono space-y-1.5 text-slate-600">
            <li>🔑 <span className="font-bold text-blue-600">id</span> (INT)</li>
            <li>▫ code (VARCHAR)</li>
            <li>▫ name (VARCHAR)</li>
            <li>▫ duration (VARCHAR)</li>
          </ul>
        </div>

        {/* Student Entity */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="bg-slate-900 text-white font-mono text-[10px] font-bold p-1.5 rounded text-center mb-2 select-none">
            STUDENTS
          </div>
          <ul className="text-[10px] font-mono space-y-1.5 text-slate-600">
            <li>🔑 <span className="font-bold text-blue-600">id</span> (INT)</li>
            <li>▫ roll_no (VARCHAR) [U]</li>
            <li>🔗 course_id (INT)</li>
            <li>▫ name (VARCHAR)</li>
            <li>▫ email (VARCHAR)</li>
            <li>▫ semester (VARCHAR)</li>
          </ul>
        </div>

        {/* Attendance Entity */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="bg-slate-900 text-white font-mono text-[10px] font-bold p-1.5 rounded text-center mb-2 select-none">
            ATTENDANCE
          </div>
          <ul className="text-[10px] font-mono space-y-1.5 text-slate-600">
            <li>🔑 <span className="font-bold text-blue-600">id</span> (INT)</li>
            <li>🔗 student_id (INT)</li>
            <li>🔗 subject_id (INT)</li>
            <li>▫ date (DATE)</li>
            <li>▫ status (ENUM)</li>
          </ul>
        </div>

        {/* Marks Entity */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="bg-slate-900 text-white font-mono text-[10px] font-bold p-1.5 rounded text-center mb-2 select-none">
            MARKS
          </div>
          <ul className="text-[10px] font-mono space-y-1.5 text-slate-600">
            <li>🔑 <span className="font-bold text-blue-600">id</span> (INT)</li>
            <li>🔗 student_id (INT)</li>
            <li>🔗 subject_id (INT)</li>
            <li>▫ exam_type (ENUM)</li>
            <li>▫ marks_obtained (INT)</li>
            <li>▫ grade (VARCHAR)</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-3 rounded border border-dashed border-slate-200 text-center max-w-xl mx-auto">
        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
          🔗 <span className="text-slate-800 uppercase font-bold text-[9px]">Foreign Key Constraints Summary:</span>  
          <br />
          `students.course_id` references `courses.id` (ON DELETE CASCADE) | 
          `attendance.student_id` references `students.id` (ON DELETE CASCADE) | 
          `marks.student_id` references `students.id` (ON DELETE CASCADE)
        </p>
      </div>
    </div>
  );

  // Render SVG DFD Diagrams (Chapter 13)
  const renderDFD = () => (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-6 my-6 text-slate-800">
      <div className="space-y-4">
        <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider text-center select-none">Level 0 DFD (Context Level)</h4>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto bg-white p-4 rounded-lg border border-slate-200">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center font-bold text-xs w-28 select-none text-blue-700">
            Admin / Faculty
          </div>
          
          <div className="text-slate-400 text-xs font-mono select-none">➡ Credentials, Marks ➡</div>

          <div className="p-4 bg-blue-600 text-white rounded-full font-bold text-xs text-center w-36 h-36 flex flex-col items-center justify-center select-none">
            <span>Process 0.0</span>
            <span className="text-[9px] text-blue-200 mt-1 uppercase font-extrabold font-mono tracking-wide">Student Mgt System</span>
          </div>

          <div className="text-slate-400 text-xs font-mono select-none">➡ Academic Reports ➡</div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-center font-bold text-xs w-28 select-none text-emerald-700">
            Database Storage
          </div>
        </div>
      </div>
    </div>
  );

  // Render UML diagrams beautifully (Chapter 15)
  const renderUML = () => (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 my-6 text-slate-800">
      <div className="flex justify-center border-b border-slate-200 select-none">
        {(['usecase', 'class', 'sequence', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setUmlTab(tab)}
            className={`px-4 py-2 text-xs font-bold capitalize transition border-b-2 cursor-pointer ${
              umlTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'usecase' ? 'Use Case' : tab === 'class' ? 'Class Map' : tab === 'sequence' ? 'Sequence Flow' : 'Activity Node'}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 min-h-64 flex flex-col justify-center items-center">
        {umlTab === 'usecase' && (
          <div className="space-y-4 text-center max-w-md">
            <span className="text-[9px] font-bold text-blue-600 uppercase font-mono tracking-widest bg-blue-50 px-2 py-0.5 rounded-full select-none">Use Case Model</span>
            <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-2 text-xs">
              <div className="font-bold text-slate-700 mb-2">ACTORS: Administrator, Faculty</div>
              <div className="space-y-1 text-left font-mono text-[11px] text-slate-600">
                <div className="bg-white p-1.5 rounded shadow-2xs border border-slate-100">● Log in securely</div>
                <div className="bg-white p-1.5 rounded shadow-2xs border border-slate-100">● Register degrees & Syllabus mapped elements</div>
                <div className="bg-white p-1.5 rounded shadow-2xs border border-slate-100">● Modify Student Profile directories</div>
                <div className="bg-white p-1.5 rounded shadow-2xs border border-slate-100">● Mark Student Attendance status</div>
                <div className="bg-white p-1.5 rounded shadow-2xs border border-slate-100">● Insert Examination marks</div>
              </div>
            </div>
          </div>
        )}

        {umlTab === 'class' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full text-left">
            <div className="bg-slate-50 border border-blue-200 p-4 rounded shadow-xs font-mono text-xs">
              <div className="font-bold bg-blue-600 text-white p-1 rounded text-center select-none">Class: Student</div>
              <div className="py-2 border-b border-slate-200 text-[10px] space-y-0.5">
                <p>+ id: INT</p>
                <p>+ rollNo: VARCHAR</p>
                <p>+ courseId: INT</p>
                <p>+ semester: VARCHAR</p>
              </div>
              <div className="pt-2 text-[10px] space-y-0.5 text-blue-600">
                <p>+ save(): Boolean</p>
                <p>+ update(): Boolean</p>
                <p>+ getAttendance(): Float</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-emerald-200 p-4 rounded shadow-xs font-mono text-xs">
              <div className="font-bold bg-emerald-700 text-white p-1 rounded text-center select-none">Class: Course</div>
              <div className="py-2 border-b border-slate-200 text-[10px] space-y-0.5">
                <p>+ id: INT</p>
                <p>+ code: VARCHAR</p>
                <p>+ name: VARCHAR</p>
              </div>
              <div className="pt-2 text-[10px] space-y-0.5 text-emerald-700">
                <p>+ addSubject(): Boolean</p>
                <p>+ getStudents(): Array</p>
              </div>
            </div>
          </div>
        )}

        {umlTab === 'sequence' && (
          <div className="space-y-3 font-mono text-xs w-full max-w-md">
            <h5 className="font-bold text-center text-slate-700">Attendance Submission Loop</h5>
            <div className="space-y-2 text-[11px] bg-slate-50 p-4 rounded border border-slate-200">
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-blue-600">Client UI</span>
                <span className="text-slate-400">➡ Action Submits Roster ➡</span>
                <span className="font-bold text-slate-800">PHP API</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-slate-800">PHP API</span>
                <span className="text-slate-400">➡ Parameterized SQL ➡</span>
                <span className="font-bold text-emerald-800">MySQL Server</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-bold text-emerald-800">MySQL Server</span>
                <span className="text-emerald-600">◀ Success Response ◀</span>
                <span className="font-bold text-blue-600">Client UI</span>
              </div>
            </div>
          </div>
        )}

        {umlTab === 'activity' && (
          <div className="space-y-4 max-w-sm text-center text-xs">
            <h5 className="font-bold text-slate-700">Dynamic Grading Node</h5>
            <div className="flex flex-col items-center gap-2 font-mono">
              <div className="bg-slate-900 text-white py-1 px-3 rounded-full text-[10px] select-none">Start Node</div>
              <div className="text-slate-400">⬇</div>
              <div className="border border-slate-200 p-2 rounded bg-slate-50">Input Numerical Marks Score</div>
              <div className="text-slate-400">⬇</div>
              <div className="border border-blue-200 p-3 rounded bg-blue-50/50 font-bold">
                Does Marks Score Exceed Bound {'>'} 100?
              </div>
              <div className="flex gap-12 w-full justify-center">
                <div>
                  <span className="text-red-500 font-bold">Yes</span>
                  <p className="text-[10px] text-red-500 border border-red-200 p-1 rounded mt-1">Validation Error</p>
                </div>
                <div>
                  <span className="text-green-500 font-bold">No</span>
                  <p className="text-[10px] text-green-600 border border-green-200 p-1 rounded mt-1">Grade Computation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="report_hub_module">
      {/* Search and Sidebar Chapters Selector */}
      <div className="lg:col-span-1 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search report chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-3 max-h-[70vh] overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 select-none">
            Table of Chapters ({filteredChapters.length})
          </div>

          {filteredChapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapterId(ch.id)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeChapterId === ch.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`font-mono text-[9px] ${activeChapterId === ch.id ? 'text-blue-200' : 'text-slate-400'}`}>
                  {ch.section}
                </span>
                <span className="truncate">{ch.title}</span>
              </div>
              <ChevronRight className={`h-3 w-3 shrink-0 ${activeChapterId === ch.id ? 'text-blue-200' : 'text-slate-300'}`} />
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handlePrintActive}
            className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print Active Chapter
          </button>

          <button
            onClick={handlePrintFull}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-500/15 animate-pulse"
          >
            <Printer className="h-4 w-4" />
            Print Full 26-Ch Thesis (PDF)
          </button>
        </div>
      </div>

      {/* Main Chapter Viewer */}
      <div id="report-active-chapter-print-area" className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded select-none uppercase tracking-wide border border-blue-100">
              Syllabus Section {activeChapter.section}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">{activeChapter.title}</h2>
          </div>
        </div>

        {/* Dynamic Interactive Renderings inside Chapter View */}
        {activeChapterId === 11 && renderSystemArchitecture()}
        {activeChapterId === 13 && renderDFD()}
        {activeChapterId === 14 && renderERD()}
        {activeChapterId === 15 && renderUML()}

        {/* Narrative Text */}
        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4 font-medium">
          {activeChapter.content}
        </div>

        {/* Extra subsections */}
        {activeChapter.subsections && (
          <div className="space-y-4 pt-4">
            {activeChapter.subsections.map((sub, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-950">{sub.title}</h4>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-medium">{sub.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Copyable code snippets */}
        {activeChapter.codeSnippets && (
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5 select-none">
              <FileCode className="h-4 w-4 text-blue-600" />
              Syllabus Script Code Portal
            </h4>

            {activeChapter.codeSnippets.map((sn, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg shadow-inner overflow-hidden">
                <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800 select-none">
                  <span className="text-[10px] font-mono text-blue-400 font-semibold">{sn.filename}</span>
                  <button
                    onClick={() => handleCopyCode(sn.filename, sn.code)}
                    className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedStates[sn.filename] ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs text-slate-200 font-mono text-left select-text max-h-96">
                  <code>{sn.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ----------------- ACADEMIC THESIS PRINT OUT LAYER (HIDDEN IN SCREEN, SHOWN IN PRINT) ----------------- */}
      <div id="academic-thesis-print-container" className="hidden print:block bg-white text-black p-12 max-w-4xl mx-auto font-serif text-left">
         {/* COVER PAGE */}
         <div className="flex flex-col items-center justify-between text-center min-h-[9.5in] border-4 border-double border-slate-800 p-8 mb-12 page-break">
            <div className="space-y-4">
              <span className="text-xs tracking-widest font-sans font-extrabold uppercase text-slate-500">A CAPSTONE PROJECT THESIS REPORT</span>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 font-sans mt-2">STUDENT MANAGEMENT SYSTEM</h1>
              <p className="text-xs italic text-slate-500 mt-1">An Automated 3-Tier Enterprise Academic Information Ledger</p>
            </div>
            
            <div className="my-12 space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">SUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE AWARD OF</p>
              <h2 className="text-lg font-bold font-sans text-slate-800">BACHELOR OF COMPUTER APPLICATIONS (BCA)</h2>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-lg text-left text-xs my-8 border-t border-b border-slate-200 py-6 font-sans">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SUBMITTED BY:</p>
                <p className="font-extrabold text-slate-800 text-sm mt-1">Aarav Sharma</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Roll No: BCA-2026-004</p>
                <p className="text-[11px] text-slate-500 font-semibold">Semester V Student</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">UNDER THE GUIDANCE OF:</p>
                <p className="font-extrabold text-slate-800 text-sm mt-1">Dr. Alok Kumar</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Head of Department (HOD)</p>
                <p className="text-[11px] text-slate-500">BCA & Computer Science</p>
              </div>
            </div>

            <div className="space-y-1.5 font-sans">
              <p className="text-xs font-bold text-slate-700">DEPARTMENT OF COMPUTER SCIENCE & APPLICATIONS</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">CampusSphere National University</p>
              <p className="text-[11px] font-mono font-bold text-slate-400 mt-4">Academic Year: 2025 - 2026</p>
            </div>
         </div>

         {/* TABLE OF CONTENTS */}
         <div className="page-break space-y-6 py-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 border-b-2 border-slate-800 pb-2 font-sans uppercase text-center">Table of Contents</h2>
            <div className="space-y-3 max-w-2xl mx-auto pt-6 text-xs font-sans">
              {reportChapters.map((ch) => (
                <div key={ch.id} className="flex justify-between items-center border-b border-dotted border-slate-200 pb-1">
                  <div className="flex gap-2">
                    <span className="font-mono font-bold text-slate-400 w-12">{ch.section}</span>
                    <span className="font-bold text-slate-800">{ch.title}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-bold">Page {ch.id + 2}</span>
                </div>
              ))}
            </div>
         </div>

         {/* ALL 26 CHAPTERS PRINT FLOW */}
         {reportChapters.map((ch) => (
            <div key={ch.id} className="page-break space-y-6 py-8 text-slate-900 border-b border-slate-100">
               <div className="border-b border-slate-300 pb-2">
                  <span className="text-[10px] font-mono text-blue-600 font-black tracking-widest uppercase block mb-1">
                    Syllabus Section {ch.section}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-sans">{ch.title}</h3>
               </div>

               {/* Render corresponding diagrams directly on print! */}
               {ch.id === 11 && (
                 <div className="my-6 p-4 border border-slate-200 rounded-xl bg-slate-50">
                   <h4 className="text-xs font-bold font-sans text-slate-400 uppercase tracking-wider mb-3 text-center">Fig 11.1: Web 3-Tier Core Infrastructure Architecture</h4>
                   {renderSystemArchitecture()}
                 </div>
               )}
               {ch.id === 13 && (
                 <div className="my-6 p-4 border border-slate-200 rounded-xl bg-slate-50">
                   <h4 className="text-xs font-bold font-sans text-slate-400 uppercase tracking-wider mb-3 text-center">Fig 13.1: Data Flow Diagram (Context Level)</h4>
                   {renderDFD()}
                 </div>
               )}
               {ch.id === 14 && (
                 <div className="my-6 p-4 border border-slate-200 rounded-xl bg-slate-50">
                   <h4 className="text-xs font-bold font-sans text-slate-400 uppercase tracking-wider mb-3 text-center">Fig 14.1: Database Schema ERD Mapping</h4>
                   {renderERD()}
                 </div>
               )}
               {ch.id === 15 && (
                 <div className="my-6 space-y-8 p-4 border border-slate-200 rounded-xl bg-slate-50">
                   <h4 className="text-xs font-bold font-sans text-slate-400 uppercase tracking-wider mb-3 text-center">Fig 15.1: UML Static and Behavioral Models</h4>
                   
                   <div className="space-y-6 text-xs font-sans">
                     <div className="bg-white p-4 rounded-lg border border-slate-200">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block border-b pb-1 mb-2">Model A: Use Case Flow</span>
                       <div className="mt-2 text-xs">
                         <p className="font-bold mb-1">Actors: Admin & Faculty</p>
                         <p className="text-[11px] text-slate-600">Secure credential authentication, register semesters, modify student records, log attendance logs, compute grades ledger.</p>
                       </div>
                     </div>

                     <div className="bg-white p-4 rounded-lg border border-slate-200">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block border-b pb-1 mb-2">Model B: System Class Mapping</span>
                       <div className="mt-2 grid grid-cols-2 gap-4 font-mono text-[10px]">
                         <div className="bg-slate-50 p-2 rounded border border-slate-200">
                           <p className="font-bold">Class Student</p>
                           <p className="text-slate-500 mt-1">Attributes: id, rollNo, courseId, semester</p>
                           <p className="text-slate-500">Methods: save(), update(), getAttendance()</p>
                         </div>
                         <div className="bg-slate-50 p-2 rounded border border-slate-200">
                           <p className="font-bold">Class Course</p>
                           <p className="text-slate-500 mt-1">Attributes: id, code, name</p>
                           <p className="text-slate-500">Methods: addSubject(), getStudents()</p>
                         </div>
                       </div>
                     </div>

                     <div className="bg-white p-4 rounded-lg border border-slate-200">
                       <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block border-b pb-1 mb-2">Model C: Attendance Sequence Diagram</span>
                       <div className="mt-2 font-mono text-[10px] space-y-1 text-slate-600">
                         <p>Client Browser ➡ Submit Roster Form ➡ PHP API Session Validator</p>
                         <p>PHP API Session Validator ➡ Executes Prepared SQL ➡ MySQL Server Instance</p>
                         <p>MySQL Server Instance ◀ Confirmation Record Row ◀ UI Table Redraw</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )}

               {/* Chapter Narrative Text */}
               <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line space-y-4 font-medium text-justify">
                 {ch.content}
               </div>

               {/* Extra subsections */}
               {ch.subsections && (
                 <div className="space-y-4 pt-4">
                   {ch.subsections.map((sub, sidx) => (
                     <div key={sidx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                       <h4 className="font-bold text-sm text-slate-950 font-sans">{sub.title}</h4>
                       <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed text-justify">{sub.content}</p>
                     </div>
                   ))}
                 </div>
               )}

               {/* Code Snippets */}
               {ch.codeSnippets && (
                 <div className="space-y-4 pt-4">
                   <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider select-none font-sans">Source Scripts Appendix</h4>
                   {ch.codeSnippets.map((sn, cidx) => (
                     <div key={cidx} className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50 text-slate-800">
                       <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-[10px] font-mono font-bold">
                         {sn.filename}
                       </div>
                       <pre className="p-3 text-[10px] font-mono overflow-x-auto text-left leading-normal whitespace-pre-wrap">
                         <code>{sn.code}</code>
                       </pre>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         ))}
      </div>

      {/* DYNAMIC STYLESHEET INJECTION FOR THE PERFECT PDF-READY SUBMISSION REPORT */}
      <style>{`
        @media print {
          /* Hide all screen-only elements globally */
          body * {
            visibility: hidden !important;
          }
          
          /* Show active chapter print or full print container exclusively */
          ${printMode === 'full' ? `
            #academic-thesis-print-container,
            #academic-thesis-print-container * {
              visibility: visible !important;
            }
            #academic-thesis-print-container {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              display: block !important;
              background: white !important;
              color: black !important;
              padding: 40px !important;
              margin: 0 !important;
            }
          ` : `
            #report-active-chapter-print-area,
            #report-active-chapter-print-area * {
              visibility: visible !important;
            }
            #report-active-chapter-print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              display: block !important;
              background: white !important;
              color: black !important;
              padding: 40px !important;
              margin: 0 !important;
            }
          `}

          .page-break {
            page-break-before: always !important;
            break-before: page !important;
          }

          /* Ensure custom code fragments, text and outlines look incredibly crisp */
          pre, code {
            white-space: pre-wrap !important;
            word-break: break-all !important;
            font-size: 8.5pt !important;
            font-family: monospace !important;
          }

          h1 { font-size: 24pt !important; font-weight: bold !important; line-height: 1.2 !important; }
          h2 { font-size: 18pt !important; font-weight: bold !important; line-height: 1.3 !important; }
          h3 { font-size: 14pt !important; font-weight: bold !important; line-height: 1.3 !important; }
          p, td, li { font-size: 10pt !important; line-height: 1.6 !important; }
        }
      `}</style>
    </div>
  );
}
