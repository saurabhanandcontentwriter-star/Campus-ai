import React from 'react';
import { Student, Course, Badge, StudentLeaderboardEntry, Attendance, Grade, CampusEvent } from '../types';
import { Award, Trophy, Star, Shield, TrendingUp, Calendar, Zap, CheckCircle2 } from 'lucide-react';

interface LeaderboardProps {
  students: Student[];
  courses: Course[];
  attendance: Attendance[];
  grades: Grade[];
}

export default function Leaderboard({ students, courses, attendance, grades }: LeaderboardProps) {
  // Static Badges Dictionary
  const BADGES: Badge[] = [
    { id: 'bd_academic', name: 'Academic Ace', icon: '🎓', description: 'Awarded for scoring an average grade above 90% in ledger exams.' },
    { id: 'bd_attendance', name: 'Attendance Champion', icon: '⚡', description: 'Awarded for keeping a class attendance rate of 90% or higher.' },
    { id: 'bd_events', name: 'Event Enthusiast', icon: '🎪', description: 'Awarded for registering for active campus hackathons or seminars.' },
    { id: 'bd_quiz', name: 'Quiz Master', icon: '🧠', description: 'Awarded for scoring perfect marks in the AI Syllabus Assessment Quiz.' }
  ];

  // Dynamic calculations of points and badges for each student
  const studentRankings = students.map(student => {
    // 1. Calculate Attendance Rate
    const studentLogs = attendance.filter(a => a.studentId === student.id);
    const presentCount = studentLogs.filter(a => a.status === 'Present').length;
    const attendanceRate = studentLogs.length > 0 ? Math.round((presentCount / studentLogs.length) * 100) : 85;

    // 2. Calculate Exam Average
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const examAvg = studentGrades.length > 0 ? studentGrades.reduce((acc, curr) => acc + curr.marksObtained, 0) / studentGrades.length : 82;

    // 3. Simulated Events Registrations
    const registeredEventsCount = student.id === 'st1' ? 1 : student.id === 'st2' ? 2 : student.id === 'st3' ? 1 : 0;

    // 4. Badge allocations based on criteria
    const earnedBadges: string[] = [];
    if (examAvg >= 90) earnedBadges.push('bd_academic');
    if (attendanceRate >= 90) earnedBadges.push('bd_attendance');
    if (registeredEventsCount >= 2) earnedBadges.push('bd_events');
    // st2 has cleared the quiz
    if (student.id === 'st2') earnedBadges.push('bd_quiz');

    // 5. Points calculation algorithm
    // - Attendance Rate: 2 points per %
    // - Exam Average: 3 points per average %
    // - Events Registered: 15 points per event
    // - Badges Earned: 25 points per badge
    const points = Math.round(
      (attendanceRate * 2) +
      (examAvg * 3) +
      (registeredEventsCount * 15) +
      (earnedBadges.length * 25)
    );

    return {
      ...student,
      attendanceRate,
      examAvg,
      earnedBadges,
      points
    };
  });

  // Sort student by total points descending
  const sortedRankings = [...studentRankings].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6" id="achievement_leaderboard_module">
      {/* Top Banner Row */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Trophy className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">CampusSphere Achievement Leaderboard</h3>
            <p className="text-xs text-slate-500 font-medium">Student reward logs and credit points, ranked chronologically by academic performance.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
          <Zap className="h-4 w-4 text-yellow-500 shrink-0" />
          <span>Active Season: Fall 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rankings list */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm">Active Student Standings</h4>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="p-3.5 text-center">Rank</th>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Academic Track</th>
                  <th className="p-3.5">Badges Earned</th>
                  <th className="p-3.5 text-right">Credit Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sortedRankings.map((student, idx) => {
                  const isTopThree = idx < 3;
                  const trophyColor = idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : 'text-amber-600';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 text-center font-bold">
                        {isTopThree ? (
                          <div className="flex justify-center">
                            <Trophy className={`h-4 w-4 ${trophyColor}`} />
                          </div>
                        ) : (
                          idx + 1
                        )}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono font-bold">{student.rollNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-500 font-semibold">
                        {courses.find(c => c.id === student.courseId)?.code || 'N/A'} • {student.semester}
                      </td>
                      <td className="p-3.5">
                        <div className="flex gap-1.5">
                          {student.earnedBadges.length === 0 ? (
                            <span className="text-slate-300 italic text-[10px]">No badges yet</span>
                          ) : (
                            student.earnedBadges.map(bId => {
                              const badge = BADGES.find(b => b.id === bId);
                              return (
                                <span
                                  key={bId}
                                  title={badge?.description}
                                  className="text-base cursor-help"
                                >
                                  {badge?.icon}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-right font-mono font-extrabold text-blue-600">
                        {student.points} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Badges Gallery */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm">Badges Gallery</h4>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <p className="text-xs text-slate-400 font-medium">Complete academic thresholds to earn special accolades across semesters.</p>

            <div className="space-y-3.5">
              {BADGES.map(badge => (
                <div key={badge.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex items-start gap-3">
                  <span className="text-2xl pt-1 select-none shrink-0">{badge.icon}</span>
                  <div className="space-y-0.5">
                    <h5 className="font-extrabold text-slate-800 text-xs">{badge.name}</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
