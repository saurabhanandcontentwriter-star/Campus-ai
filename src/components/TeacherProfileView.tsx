import React, { useState } from 'react';
import { Subject } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Award, 
  Briefcase, 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  Activity, 
  ShieldCheck, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  office: string;
  bio: string;
  rating: number;
  specialties: string[];
  schedule: { day: string; time: string; subject: string; class: string }[];
  reviews: { student: string; rating: number; text: string; date: string }[];
}

const SEED_TEACHERS: TeacherProfile[] = [
  {
    id: 't1',
    name: 'Dr. Alok Kumar',
    email: 'alok.kumar@college.edu',
    phone: '+91 98765 11100',
    department: 'BCA & Computer Science',
    designation: 'Senior Professor & HOD',
    office: 'Block A, Room 304',
    bio: 'Over 15 years of academic lecturing and research experience. Specializes in advanced relational systems, database query optimization, and transaction concurrency models.',
    rating: 4.8,
    specialties: ['Database Systems', 'SQL Architecture', 'Data Warehousing', 'Query Optimization'],
    schedule: [
      { day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Database Management Systems', class: 'BCA 5th Sem' },
      { day: 'Wednesday', time: '11:00 AM - 12:30 PM', subject: 'Advanced SQL Lab', class: 'BCA 5th Sem' },
      { day: 'Friday', time: '02:00 PM - 03:30 PM', subject: 'Data Warehousing Seminar', class: 'BCA 3rd Sem' }
    ],
    reviews: [
      { student: 'Amit Sharma', rating: 5, text: 'Dr. Alok makes relational normalization extremely logical! The query performance labs were top notch.', date: '2026-06-20' },
      { student: 'Sneha Reddy', rating: 4.5, text: 'Clear instruction style, but exams are moderately tricky. Love his DBMS lectures!', date: '2026-06-18' }
    ]
  },
  {
    id: 't2',
    name: 'Dr. Sarah Thomas',
    email: 'sarah.thomas@college.edu',
    phone: '+91 98765 22200',
    department: 'BCA & Computer Engineering',
    designation: 'Associate Professor',
    office: 'Block B, Room 102',
    bio: 'Network architect and cybersecurity consultant. Passionate about internet-of-things (IoT), TCP/IP socket design, and network infrastructure automation.',
    rating: 4.9,
    specialties: ['Computer Networks', 'Network Security', 'Cryptography', 'Python Socket API'],
    schedule: [
      { day: 'Tuesday', time: '10:45 AM - 12:15 PM', subject: 'Computer Networks & Security', class: 'BCA 5th Sem' },
      { day: 'Thursday', time: '09:00 AM - 10:30 AM', subject: 'Socket Programming Lab', class: 'BCA 5th Sem' },
      { day: 'Thursday', time: '01:30 PM - 03:00 PM', subject: 'Intro to Cryptography', class: 'BCA 1st Sem' }
    ],
    reviews: [
      { student: 'Priya Patel', rating: 5, text: 'The packet capture labs using Wireshark are super fun. She explained the 3-way TCP handshake beautifully.', date: '2026-06-24' }
    ]
  },
  {
    id: 't3',
    name: 'Prof. Marcus Williams',
    email: 'marcus.williams@college.edu',
    phone: '+91 98765 33300',
    department: 'BCA & Machine Learning',
    designation: 'Lecturer & AI Lab Lead',
    office: 'Block C, Room 405 (AI Hub)',
    bio: 'Former machine learning engineer at Tech Corp. Specializes in building modern artificial intelligence interfaces, agentic systems, and deep learning algorithms.',
    rating: 4.7,
    specialties: ['Artificial Intelligence', 'Machine Learning', 'Gemini SDK Integrations', 'TypeScript'],
    schedule: [
      { day: 'Monday', time: '01:30 PM - 03:00 PM', subject: 'Intro to AI Systems', class: 'BCA 3rd Sem' },
      { day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Holographic Agents Lab', class: 'BCA 5th Sem' },
      { day: 'Thursday', time: '03:15 PM - 04:45 PM', subject: 'Fullstack AI Development', class: 'BCA 5th Sem' }
    ],
    reviews: [
      { student: 'Rahul Verma', rating: 5, text: 'Prof. Marcus is extremely energetic! Love how he integrated LLM agent workflows directly in our final year syllabus.', date: '2026-06-26' }
    ]
  }
];

interface TeacherProfileViewProps {
  onAwardPoints?: (points: number, reason: string) => void;
}

export default function TeacherProfileView({ onAwardPoints }: TeacherProfileViewProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t1');

  const activeTeacher = SEED_TEACHERS.find(t => t.id === selectedTeacherId) || SEED_TEACHERS[0];

  const handleRecommendTeacher = () => {
    if (onAwardPoints) {
      onAwardPoints(10, 'Left Recommendation for Faculty Advisor');
    }
    alert(`Thank you for submitting your appreciation review for ${activeTeacher.name}!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Teacher Selection Row */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Faculty Directory Index</h3>
          <p className="text-xs text-slate-500 mt-0.5">Toggle active academic staff to load bios, specializations, ratings, and time-tables.</p>
        </div>
        <select
          className="bg-slate-50 border border-slate-200 text-slate-850 text-xs font-semibold rounded-lg p-2.5 focus:outline-blue-500 w-full md:w-64"
          value={selectedTeacherId}
          onChange={(e) => setSelectedTeacherId(e.target.value)}
        >
          {SEED_TEACHERS.map(t => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.designation})
            </option>
          ))}
        </select>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Left Column - Portrait Bio and Specialties */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-4">
            
            {/* Custom high fidelity teacher avatar placeholder */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200 flex items-center justify-center relative shadow-sm text-indigo-600 font-extrabold text-3xl">
              {activeTeacher.name.split(' ').pop()?.charAt(0)}
              <span className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white p-1 rounded-lg border-2 border-white"><ShieldCheck className="w-4 h-4" /></span>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-slate-900 text-base">{activeTeacher.name}</h4>
              <p className="text-xs text-indigo-600 font-bold">{activeTeacher.designation}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{activeTeacher.department}</p>
            </div>

            {/* Overall Rating index */}
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-100 text-xs font-bold leading-none">
              <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
              <span>{activeTeacher.rating} / 5.0 Rating</span>
            </div>

            {/* Short Bio description */}
            <p className="text-xs text-slate-600 leading-relaxed font-sans border-t border-slate-50 pt-4 text-left">
              {activeTeacher.bio}
            </p>

            {/* Quick Contact fields */}
            <div className="w-full text-left text-xs space-y-2.5 pt-4 border-t border-slate-100 text-slate-500">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{activeTeacher.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{activeTeacher.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{activeTeacher.office}</span>
              </div>
            </div>
          </div>

          {/* Specialties / Core research fields */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase">Instruction Focus</h4>
            
            <div className="flex flex-wrap gap-2">
              {activeTeacher.specialties.map(spec => (
                <span 
                  key={spec}
                  className="px-2.5 py-1 bg-indigo-50 border border-indigo-100/50 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" /> {spec}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - TimeTable and Reviews */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Lecture Schedule / Weekly TimeTable */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> Active Lecture Time-Table
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Recorded scheduled offline class timings in active curriculum ledger.</p>
            </div>

            <div className="space-y-3">
              {activeTeacher.schedule.map((sched, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                      {sched.day.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-xs">{sched.subject}</h5>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">{sched.class}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{sched.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Reviews & Peer Feedback */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" /> Peer Recommendations
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Anonymized feedback left by student advisees.</p>
              </div>

              <button
                onClick={handleRecommendTeacher}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Recommend Advisor
              </button>
            </div>

            <div className="space-y-3">
              {activeTeacher.reviews.map((rev, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 text-xs">{rev.student}</span>
                    <div className="flex items-center gap-1 text-yellow-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 stroke-yellow-500" /> {rev.rating}
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed italic font-sans">
                    "{rev.text}"
                  </p>

                  <span className="text-[9px] text-slate-400 font-mono block pt-1">
                    Submitted: {new Date(rev.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
