import React, { useState } from 'react';
import { Student, CampusEvent } from '../types';
import { Calendar, MapPin, Clock, Award, Users, Plus, Check, Bell, AlertCircle, Info } from 'lucide-react';

interface CampusEventHubProps {
  students: Student[];
  onAwardPoints?: (points: number, reason: string) => void;
}

export default function CampusEventHub({ students, onAwardPoints }: CampusEventHubProps) {
  // Mock event registry in local storage
  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('sms_events');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'ev1',
        title: 'SphereHack 2026 – Annual Tech Hackathon',
        description: 'A 24-hour hackathon for BCA and engineering departments to build sustainable campus software applications. Mentored by industrial experts.',
        date: '2026-07-15',
        time: '09:00 AM',
        location: 'Main Seminar Hall & Lab 3',
        category: 'Hackathon',
        organizer: 'BCA Tech Club',
        registeredCount: 42,
        registeredStudentIds: ['st1']
      },
      {
        id: 'ev2',
        title: 'Database Security & SQL Safeguarding Seminar',
        description: 'Industry seminar focusing on modern SQL injection vectors, sanitization practices, and JWT session hardening.',
        date: '2026-07-03',
        time: '02:00 PM',
        location: 'Virtual Classroom 1',
        category: 'Seminar',
        organizer: 'CSE Faculty',
        registeredCount: 85,
        registeredStudentIds: ['st2', 'st3']
      },
      {
        id: 'ev3',
        title: 'CampusSphere Sports Meet',
        description: 'Inter-department sports meets covering track and field events, chess, badminton, and futsal championships.',
        date: '2026-07-20',
        time: '08:00 AM',
        location: 'College Sports Ground',
        category: 'Sports',
        organizer: 'Physical Education Dept',
        registeredCount: 120,
        registeredStudentIds: []
      }
    ];
  });

  const [notifications, setNotifications] = useState<string[]>([
    "Database Security Seminar starts in 5 days. Ensure registration is completed.",
    "SphereHack 2026 registrations are open! Awarding +15 leaderboard points upon submission."
  ]);

  // Form states to create new events
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loc, setLoc] = useState('');
  const [cat, setCat] = useState<'Hackathon' | 'Technical' | 'Sports' | 'Seminar' | 'Cultural'>('Technical');
  const [organizer, setOrganizer] = useState('');

  // Selected student for testing registration action
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id || '');

  const saveEvents = (updatedEvents: CampusEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('sms_events', JSON.stringify(updatedEvents));
  };

  const handleRegisterEvent = (event: CampusEvent) => {
    if (!activeStudentId) {
      alert("Please select a student profile to register.");
      return;
    }

    if (event.registeredStudentIds.includes(activeStudentId)) {
      alert("This student is already registered for this event.");
      return;
    }

    const updated = events.map(ev => {
      if (ev.id === event.id) {
        return {
          ...ev,
          registeredCount: ev.registeredCount + 1,
          registeredStudentIds: [...ev.registeredStudentIds, activeStudentId]
        };
      }
      return ev;
    });

    saveEvents(updated);
    
    // Add real-time notification
    const studentName = students.find(s => s.id === activeStudentId)?.name || 'Student';
    setNotifications(prev => [
      `Registration Successful! ${studentName} is signed up for "${event.title}".`,
      ...prev
    ]);

    // Award Leaderboard points!
    if (onAwardPoints) {
      onAwardPoints(15, `Registered for Campus Event: ${event.title}`);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !date) return;

    const newEv: CampusEvent = {
      id: `ev-${Date.now()}`,
      title,
      description: desc,
      date,
      time: time || '10:00 AM',
      location: loc || 'Campus Auditorium',
      category: cat,
      organizer: organizer || 'General Admin',
      registeredCount: 0,
      registeredStudentIds: []
    };

    const nextEvents = [newEv, ...events];
    saveEvents(nextEvents);

    setNotifications(prev => [
      `New Event Published: "${title}" scheduled on ${date}.`,
      ...prev
    ]);

    // reset forms
    setTitle('');
    setDesc('');
    setDate('');
    setTime('');
    setLoc('');
    setOrganizer('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6" id="campus_event_hub_module">
      {/* Event Header Config */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Campus Events Hub & Scheduler</h3>
            <p className="text-xs text-slate-500 font-medium">College notifications system, active registration desks, and academic scheduler.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* User Select for Registration Test */}
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Register As student</label>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-blue-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition self-end"
          >
            <Plus className="h-4 w-4" />
            Host Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Registered Events Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm">Upcoming Campus Events</h4>
          
          <div className="grid grid-cols-1 gap-4">
            {events.map(ev => {
              const isRegistered = ev.registeredStudentIds.includes(activeStudentId);
              
              return (
                <div key={ev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:border-blue-300 transition duration-150">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                        ev.category === 'Hackathon' 
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : ev.category === 'Seminar'
                          ? 'bg-purple-50 text-purple-600 border border-purple-100'
                          : ev.category === 'Sports'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {ev.category}
                      </span>

                      <span className="text-[11px] text-slate-400 font-bold font-mono">
                        Organizer: {ev.organizer}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-800 text-sm leading-snug">{ev.title}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{ev.description}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {ev.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {ev.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {ev.registeredCount} Registered
                      </span>

                      <button
                        onClick={() => handleRegisterEvent(ev)}
                        disabled={isRegistered}
                        className={`font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer transition ${
                          isRegistered 
                            ? 'bg-green-50 text-green-700 border border-green-100' 
                            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Registered
                          </>
                        ) : (
                          'Register'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Bulletin & Notification Desk */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-blue-600 animate-swing" />
            Live Event Notifications
          </h4>

          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0" />
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest font-mono">Bulletin Desk</span>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No notification alerts logged currently.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-lg text-xs leading-relaxed font-mono flex gap-2">
                    <span className="text-blue-500 font-bold shrink-0">►</span>
                    <span className="text-slate-300 font-medium">{notif}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Host Event Dialog Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-800 text-sm">Publish New College Event</h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base focus:outline-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA Alumni Networking Dinner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly cover scheduling, key takeaways, targets..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-blue-500 font-medium text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="Lab 2 / Virtual Hall"
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-bold"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase mb-1">Host Organizer</label>
                <input
                  type="text"
                  placeholder="BCA Tech Club"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-blue-500 font-semibold"
                />
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 px-4 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg cursor-pointer transition shadow-xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
