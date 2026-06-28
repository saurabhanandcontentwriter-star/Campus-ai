import React, { useState } from 'react';
import { Course, Subject } from '../types';
import { BookOpen, FolderPlus, Plus, Grid, ListOrdered, GraduationCap } from 'lucide-react';

interface CourseManagerProps {
  courses: Course[];
  subjects: Subject[];
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
}

export default function CourseManager({
  courses,
  subjects,
  onAddCourse,
  onAddSubject,
}: CourseManagerProps) {
  // Course form state
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('3 Years');
  const [semesterCount, setSemesterCount] = useState(6);

  // Subject form state
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [targetCourseId, setTargetCourseId] = useState(courses[0]?.id || '');
  const [targetSemester, setTargetSemester] = useState('1st Sem');

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseName) {
      alert('Please fill out all course fields.');
      return;
    }
    onAddCourse({
      code: courseCode.toUpperCase(),
      name: courseName,
      duration: courseDuration,
      semesterCount,
    });
    setCourseCode('');
    setCourseName('');
    alert('Academic course registered successfully!');
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode || !subjectName || !targetCourseId) {
      alert('Please fill out all subject fields.');
      return;
    }
    onAddSubject({
      code: subjectCode.toUpperCase(),
      name: subjectName,
      courseId: targetCourseId,
      semester: targetSemester,
      maxMarks: 100,
    });
    setSubjectCode('');
    setSubjectName('');
    alert('Academic subject mapped successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="course_manager_module">
      {/* 1. Courses Card */}
      <div className="space-y-6">
        {/* Course Registrar Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Course Registrar Portal
          </h3>

          <form onSubmit={handleAddCourseSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Duration</label>
                <select
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                >
                  <option value="1 Year">1 Year (Diploma)</option>
                  <option value="2 Years">2 Years (PostGrad)</option>
                  <option value="3 Years">3 Years (UnderGrad)</option>
                  <option value="4 Years">4 Years (B.Tech)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bachelor of Computer Applications"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition ml-auto cursor-pointer"
            >
              <FolderPlus className="h-4 w-4" />
              Register Course
            </button>
          </form>
        </div>

        {/* Existing Courses List */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2">Academic Degrees Registered</h4>
          <div className="divide-y divide-slate-100">
            {courses.map((c) => {
              const subCount = subjects.filter((s) => s.courseId === c.id).length;
              return (
                <div key={c.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs bg-slate-100 text-slate-700 py-0.5 px-2 rounded font-mono mr-2 border border-slate-200 select-none">
                      {c.code}
                    </span>
                    <span className="text-sm text-slate-800 font-bold">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-blue-600 font-bold">{subCount} subjects mapped</span>
                    <p className="text-[10px] text-slate-400 capitalize font-medium">{c.duration}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Subjects Card */}
      <div className="space-y-6">
        {/* Subject Registrar Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2 select-none">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Curriculum Subject Mapper
          </h3>

          <form onSubmit={handleAddSubjectSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA-501"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java Programming"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Course Allocation *</label>
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                >
                  <option value="">Choose Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Semester Mapped *</label>
                <select
                  value={targetSemester}
                  onChange={(e) => setTargetSemester(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-blue-500 font-semibold"
                >
                  <option value="1st Sem">1st Semester</option>
                  <option value="2nd Sem">2nd Semester</option>
                  <option value="3rd Sem">3rd Semester</option>
                  <option value="4th Sem">4th Semester</option>
                  <option value="5th Sem">5th Semester</option>
                  <option value="6th Sem">6th Semester</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition ml-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Map Syllabus Subject
            </button>
          </form>
        </div>

        {/* Mapped Subjects grouped display */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs max-h-80 overflow-y-auto">
          <h4 className="font-bold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2">Academic Subjects Catalog</h4>
          <div className="space-y-4">
            {courses.map((c) => {
              const courseSubs = subjects.filter((s) => s.courseId === c.id);
              if (courseSubs.length === 0) return null;

              return (
                <div key={c.id} className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-blue-700 bg-blue-50/60 border border-blue-100/50 py-1 px-2.5 rounded flex items-center justify-between uppercase tracking-wide select-none">
                    <span>{c.code} - {c.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono font-normal normal-case">Course ID: {c.id}</span>
                  </h5>
                  <div className="divide-y divide-slate-100 pl-2">
                    {courseSubs.map((sub) => (
                      <div key={sub.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 font-semibold">{sub.code}</span>
                          <span className="text-slate-800 font-semibold">{sub.name}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[9px] bg-slate-100 py-0.5 px-1.5 rounded font-bold border border-slate-200 select-none">
                          {sub.semester}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
