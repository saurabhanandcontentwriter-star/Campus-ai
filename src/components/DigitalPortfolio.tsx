import React, { useState } from 'react';
import { Student, SkillPortfolio } from '../types';
import { Award, Briefcase, Plus, Trash, Globe, Terminal, Mail, Phone, Calendar, Download, FileText, User } from 'lucide-react';

interface DigitalPortfolioProps {
  students: Student[];
}

export default function DigitalPortfolio({ students }: DigitalPortfolioProps) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');

  // Master Portfolio Database in LocalStorage (fallback on seed portfolios)
  const [portfolios, setPortfolios] = useState<Record<string, SkillPortfolio>>(() => {
    const saved = localStorage.getItem('sms_portfolios');
    if (saved) return JSON.parse(saved);

    // Seed beautiful initial portfolios
    return {
      'st1': {
        studentId: 'st1',
        bio: 'BCA final year student focused on full-stack web architectures and database designs. Passionate about software craftsmanship.',
        skills: ['React', 'PHP', 'Laravel', 'MySQL', 'Tailwind CSS', 'TypeScript'],
        projects: [
          { title: 'CampusSphere AI Ecosystem', description: 'BCA Final-Year capstone system unifying academic operations with cloud AI endpoints.', techStack: ['Express', 'Vite', 'Gemini AI', 'MySQL'] },
          { title: 'Secure E-Voting Vault', description: 'An end-to-end encrypted ledger system using hash blocks and salted password digests.', techStack: ['PHP', 'Blowfish', 'MariaDB'] }
        ],
        certificates: [
          { title: 'Google Advanced Cloud Architect', issuer: 'Google Cloud Training', date: '2025-11-12' },
          { title: 'Certified MySQL Database Admin', issuer: 'Oracle Academy', date: '2025-06-20' }
        ]
      },
      'st2': {
        studentId: 'st2',
        bio: 'Aspiring AI engineer and developer specializing in natural language models, semantic analysis, and smart student widgets.',
        skills: ['Python', 'FastAPI', 'PyTorch', 'TypeScript', 'Gemini SDK', 'MongoDB'],
        projects: [
          { title: 'Syllabus Quiz Bot', description: 'Machine learning parser translating textbook syllabi directly into complete multiple-choice formats.', techStack: ['FastAPI', 'Gemini API', 'React'] }
        ],
        certificates: [
          { title: 'Deep Learning Specialization', issuer: 'Coursera (DeepLearning.AI)', date: '2025-08-30' }
        ]
      }
    };
  });

  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Fallback default portfolio if none exists
  const activePortfolio: SkillPortfolio = portfolios[selectedStudentId] || {
    studentId: selectedStudentId,
    bio: 'BCA Scholar active in coding, development, and college hackathons.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'SQL'],
    projects: [],
    certificates: []
  };

  // Sync state and local storage
  const savePortfolio = (updated: SkillPortfolio) => {
    const nextPortfolios = { ...portfolios, [selectedStudentId]: updated };
    setPortfolios(nextPortfolios);
    localStorage.setItem('sms_portfolios', JSON.stringify(nextPortfolios));
  };

  // State form controllers
  const [newSkill, setNewSkill] = useState('');
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projLink, setProjLink] = useState('');

  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');

  const handleUpdateBio = (nextBio: string) => {
    savePortfolio({ ...activePortfolio, bio: nextBio });
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (activePortfolio.skills.includes(newSkill.trim())) return;

    savePortfolio({
      ...activePortfolio,
      skills: [...activePortfolio.skills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    savePortfolio({
      ...activePortfolio,
      skills: activePortfolio.skills.filter(s => s !== skill)
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim()) return;

    const parsedTech = projTech.split(',').map(s => s.trim()).filter(Boolean);
    const newProj = {
      title: projTitle.trim(),
      description: projDesc.trim(),
      techStack: parsedTech,
      githubLink: projLink.trim() || undefined
    };

    savePortfolio({
      ...activePortfolio,
      projects: [...activePortfolio.projects, newProj]
    });

    setProjTitle('');
    setProjDesc('');
    setProjTech('');
    setProjLink('');
  };

  const handleRemoveProject = (idx: number) => {
    savePortfolio({
      ...activePortfolio,
      projects: activePortfolio.projects.filter((_, i) => i !== idx)
    });
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    const newCert = {
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      date: certDate || new Date().toISOString().split('T')[0]
    };

    savePortfolio({
      ...activePortfolio,
      certificates: [...activePortfolio.certificates, newCert]
    });

    setCertTitle('');
    setCertIssuer('');
    setCertDate('');
  };

  const handleRemoveCertificate = (idx: number) => {
    savePortfolio({
      ...activePortfolio,
      certificates: activePortfolio.certificates.filter((_, i) => i !== idx)
    });
  };

  // Triggers window browser print with a customized resume CSS layer
  const handlePrintResume = () => {
    window.print();
  };

  if (!activeStudent) {
    return <div className="text-center py-10 text-slate-400">No student selected or available.</div>;
  }

  return (
    <div className="space-y-6" id="digital_portfolio_module">
      {/* Portfolio Config Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Placement Skill Portfolio Manager</h3>
            <p className="text-xs text-slate-500 font-medium">Build placement profiles, catalog projects & certifications, and generate downloadable placement CVs.</p>
          </div>
        </div>

        {/* Selected Student */}
        <div className="min-w-[200px]">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Profile Student</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-blue-500 font-semibold"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Interactive Editor Forms */}
        <div className="lg:col-span-2 space-y-6 print:hidden">
          {/* Bio Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Professional Bio & Skills
            </h4>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Candidate Professional Summary</label>
              <textarea
                value={activePortfolio.bio}
                onChange={(e) => handleUpdateBio(e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-lg p-3 text-xs focus:outline-blue-500 font-medium"
                placeholder="Write a powerful introductory summary highlighting your degree track and software development ambitions..."
              />
            </div>

            {/* Tech Tags add/remove */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Technical Skill Tags</label>
              <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. PHP, SpringBoot, Node.js..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
                <button
                  type="submit"
                  className="bg-slate-900 text-white rounded-lg p-2 hover:bg-slate-800 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {activePortfolio.skills.map(skill => (
                  <span key={skill} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-slate-200">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-600 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Projects Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-600" />
              Software & Research Capstones
            </h4>

            <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="md:col-span-2">
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated Library Ledger"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Project Brief Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Summarize the core features, architectural blueprints, and what business/academic problems it resolves..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs focus:outline-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Express, Tailwind"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Repository/Deploy URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={projLink}
                  onChange={(e) => setProjLink(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>

              <div className="md:col-span-2 flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Project
                </button>
              </div>
            </form>

            {/* Projects List */}
            {activePortfolio.projects.length > 0 && (
              <div className="space-y-3 pt-2">
                {activePortfolio.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="border border-slate-100 rounded-xl p-4 flex items-start justify-between bg-white shadow-xs">
                    <div className="space-y-1.5 max-w-[85%]">
                      <h5 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                        {proj.title}
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </h5>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{proj.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map(t => (
                          <span key={t} className="bg-slate-50 text-slate-500 text-[9px] font-mono font-bold border border-slate-100 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveProject(pIdx)}
                      className="text-slate-300 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Professional Certifications & Awards
            </h4>

            <form onSubmit={handleAddCertificate} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Certification Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Practitioner"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Issuing Authority</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Date Achieved</label>
                <input
                  type="date"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>

              <div className="md:col-span-3 flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Certificate
                </button>
              </div>
            </form>

            {/* Certifications List */}
            {activePortfolio.certificates.length > 0 && (
              <div className="space-y-2 pt-2">
                {activePortfolio.certificates.map((cert, cIdx) => (
                  <div key={cIdx} className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-white shadow-xs">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{cert.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cert.issuer} • Issued {cert.date}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCertificate(cIdx)}
                      className="text-slate-300 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Beautiful placement visual mock & print-ready layout */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 print:col-span-3 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Placement CV Preview</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">A4 Standard Format</p>
            </div>
            
            <button
              onClick={handlePrintResume}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Download Resume
            </button>
          </div>

          {/* Printable Resume Canvas */}
          <div className="space-y-6 text-slate-800 font-sans select-text leading-relaxed">
            {/* Header section */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">{activeStudent.name}</h3>
              <p className="text-xs font-bold text-blue-600 font-mono tracking-widest uppercase">BCA Final-Year Professional Skill Profile</p>
              
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Mail className="h-3 w-3" /> {activeStudent.email}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="h-3 w-3" /> {activeStudent.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Roll: {activeStudent.rollNo}
                </span>
              </div>
            </div>

            {/* Double column layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
              {/* Sidebar (Skills, metadata) */}
              <div className="md:col-span-1 space-y-5 print:col-span-1">
                <div className="space-y-2">
                  <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1 font-mono">Technical Stack</h5>
                  <div className="flex flex-wrap gap-1">
                    {activePortfolio.skills.map(s => (
                      <span key={s} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1 font-mono">Academic Track</h5>
                  <div className="text-[11px] space-y-1.5 font-medium text-slate-600">
                    <p><span className="font-bold text-slate-800">Degree:</span> Bachelor of Computer Applications</p>
                    <p><span className="font-bold text-slate-800">Current Semester:</span> {activeStudent.semester}</p>
                    <p><span className="font-bold text-slate-800">Department:</span> Computer Applications</p>
                    <p><span className="font-bold text-slate-800">Enrolled:</span> {activeStudent.joiningDate}</p>
                  </div>
                </div>
              </div>

              {/* Main content (Bio, projects, certifications) */}
              <div className="md:col-span-2 space-y-5 print:col-span-2">
                <div className="space-y-2">
                  <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1 font-mono">Executive Summary</h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activePortfolio.bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1 font-mono">Core Software Projects</h5>
                  {activePortfolio.projects.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No capstone projects cataloged yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {activePortfolio.projects.map((proj, idx) => (
                        <div key={idx} className="space-y-1 text-xs">
                          <p className="font-bold text-slate-800 flex items-center justify-between">
                            <span>{proj.title}</span>
                            {proj.githubLink && <span className="text-[10px] text-slate-400 font-mono font-normal">Repo Listed</span>}
                          </p>
                          <p className="text-slate-500 leading-relaxed font-medium">{proj.description}</p>
                          <div className="flex gap-1.5 pt-0.5">
                            {proj.techStack.map(t => (
                              <span key={t} className="text-[9px] font-mono font-bold text-blue-600">#{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h5 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-300 pb-1 font-mono">Certificates & Awards</h5>
                  {activePortfolio.certificates.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No professional certificates cataloged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activePortfolio.certificates.map((cert, idx) => (
                        <div key={idx} className="text-xs flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{cert.title}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{cert.issuer}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{cert.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
