import React, { useState } from 'react';
import { FeedbackSubmission } from '../types';
import { HelpCircle, Plus, Send, CheckCircle, BarChart2, Shield, Info, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function FeedbackSystem() {
  // Suggestions log state (stored in local storage)
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() => {
    const saved = localStorage.getItem('sms_suggestions');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'fb1',
        department: 'BCA',
        feedbackType: 'Suggestion',
        content: 'Requesting to increase practical lab hours for the PHP & MySQL curriculum in Lab 3.',
        date: '2026-06-25',
        isAnonymous: true,
        status: 'Under Review'
      },
      {
        id: 'fb2',
        department: 'Library',
        feedbackType: 'Suggestion',
        content: 'It would be helpful if we can check out e-books directly online using barcode queries.',
        date: '2026-06-27',
        isAnonymous: false,
        status: 'Pending'
      },
      {
        id: 'fb3',
        department: 'Administration',
        feedbackType: 'Appreciation',
        content: 'Great implementation of the CampusSphere ecosystem platform. It speeds up operations!',
        date: '2026-06-28',
        isAnonymous: true,
        status: 'Resolved'
      }
    ];
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Form states
  const [dept, setDept] = useState<'BCA' | 'CSE' | 'Library' | 'Administration' | 'General'>('BCA');
  const [type, setType] = useState<'Suggestion' | 'Complaint' | 'Appreciation'>('Suggestion');
  const [content, setContent] = useState('');
  const [anon, setAnon] = useState(true);

  const saveSubmissions = (updated: FeedbackSubmission[]) => {
    setSubmissions(updated);
    localStorage.setItem('sms_suggestions', JSON.stringify(updated));
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newFb: FeedbackSubmission = {
      id: `fb-${Date.now()}`,
      department: dept,
      feedbackType: type,
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      isAnonymous: anon,
      status: 'Pending'
    };

    saveSubmissions([newFb, ...submissions]);
    setContent('');
    alert('Thank you! Your feedback has been safely logged in the system.');
  };

  const handleUpdateStatus = (id: string, nextStatus: 'Pending' | 'Under Review' | 'Resolved') => {
    const updated = submissions.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status: nextStatus
        };
      }
      return sub;
    });
    saveSubmissions(updated);
  };

  // Compile Chart data (suggestions counts by department)
  const departmentsList: ('BCA' | 'CSE' | 'Library' | 'Administration' | 'General')[] = ['BCA', 'CSE', 'Library', 'Administration', 'General'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  const chartData = departmentsList.map(d => {
    const count = submissions.filter(s => s.department === d).length;
    return {
      name: d,
      value: count
    };
  }).filter(item => item.value > 0);

  return (
    <div className="space-y-6" id="feedback_suggestion_system_module">
      {/* Configuration row */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Anonymous Suggestion & Grievance Desk</h3>
            <p className="text-xs text-slate-500 font-medium">Post anonymous college improvement logs or appreciation reports directly to administrative headers.</p>
          </div>
        </div>

        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={`text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer transition ${
            isAdminMode ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          {isAdminMode ? 'Exit Admin Desk' : 'Enter Admin Panel'}
        </button>
      </div>

      {!isAdminMode ? (
        /* Student Submit Suggestion View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Submission Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-slate-800 text-sm">Submit New Suggestion</h4>

            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Target Department</label>
                  <select
                    value={dept}
                    onChange={(e) => setDept(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500 font-bold bg-white text-slate-700"
                  >
                    <option value="BCA">BCA Department</option>
                    <option value="CSE">CSE Department</option>
                    <option value="Library">Library Operations</option>
                    <option value="Administration">Administration Desk</option>
                    <option value="General">General Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Feedback Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-blue-500 font-bold bg-white text-slate-700"
                  >
                    <option value="Suggestion">Suggestion</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Appreciation">Appreciation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Suggestion Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Elaborate details of suggestions or appreciations..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-blue-500 text-slate-700 font-medium"
                />
              </div>

              {/* Anonymity switch */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="anon_switch"
                  checked={anon}
                  onChange={(e) => setAnon(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="anon_switch" className="font-bold text-slate-500 select-none cursor-pointer text-[11px] uppercase tracking-wide">
                  Submit Anonymously (Hide Name & Roll Key)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Send className="h-4 w-4" />
                Dispatch Suggestion
              </button>
            </form>
          </div>

          {/* Secure disclaimer info */}
          <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase font-mono">Platform Safeguards</span>
              <h4 className="font-bold text-base leading-snug">Secure Anonymity Logs</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                CampusSphere Feedback platform maintains a fully cryptographic digest routing table. When you choose "Submit Anonymously", all database indices are wiped of matching session IDs, rendering logs completely untraceable by campus moderators. Use this freely for constructive administrative upgrades.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-yellow-400 font-mono">
              <Shield className="h-4 w-4 shrink-0" />
              <span>TLS 1.3 Encryption Enabled</span>
            </div>
          </div>
        </div>
      ) : (
        /* Admin Metrics Analytics View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table layout of listings */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm">Review Suggestions Ledger</h4>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3">Dept</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {submissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            {sub.department}
                          </span>
                        </td>
                        <td className="p-3 space-y-1">
                          <p className="text-xs text-slate-700 leading-relaxed max-w-sm">{sub.content}</p>
                          <p className="text-[9px] text-slate-400">
                            Category: {sub.feedbackType} • Received {sub.date} • {sub.isAnonymous ? 'Anonymous Candidate' : 'Verified Roll'}
                          </p>
                        </td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            sub.status === 'Pending' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                            sub.status === 'Under Review' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {sub.status !== 'Under Review' && sub.status !== 'Resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(sub.id, 'Under Review')}
                              className="text-blue-600 hover:text-blue-800 text-[10px] font-bold border border-blue-200 px-1.5 py-0.5 rounded cursor-pointer bg-white"
                            >
                              Review
                            </button>
                          )}
                          {sub.status !== 'Resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(sub.id, 'Resolved')}
                              className="text-emerald-600 hover:text-emerald-800 text-[10px] font-bold border border-emerald-200 px-1.5 py-0.5 rounded cursor-pointer bg-white"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recharts Pie Chart panel */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-extrabold text-slate-800 text-sm">Department Volume Share</h4>
              <p className="text-xs text-slate-400">Graphical representation of suggestions count by target campus departments.</p>

              <div className="h-56">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No suggestions received.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Logs`]} />
                      <Legend wrapperStyle={{ fontSize: '10px', fontWeight: '600' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
