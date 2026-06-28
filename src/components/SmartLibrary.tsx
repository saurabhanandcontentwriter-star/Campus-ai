import React, { useState } from 'react';
import { Student, LibraryBook, LibraryIssue } from '../types';
import { BookOpen, Search, Bookmark, Calendar, Clock, Download, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SmartLibraryProps {
  students: Student[];
}

export default function SmartLibrary({ students }: SmartLibraryProps) {
  // Books catalog state (in local storage)
  const [books] = useState<LibraryBook[]>([
    { id: 'b1', title: 'Web Development with PHP, MySQL & Laravel', author: 'Dr. Ramesh Kumar', category: 'Web Technologies', bookCode: 'LIB-BCA-501', available: true, ebookUrl: '#' },
    { id: 'b2', title: 'Software Engineering: Architecture Principles', author: 'Prof. S. Sridhar', category: 'Software Engineering', bookCode: 'LIB-BCA-502', available: false, ebookUrl: '#' },
    { id: 'b3', title: 'Data Structures and Algorithms in C++', author: 'Narasimha Karumanchi', category: 'Computer Science', bookCode: 'LIB-CS-301', available: true, ebookUrl: '#' },
    { id: 'b4', title: 'Core Java Programming: Comprehensive Edition', author: 'E. Balagurusamy', category: 'Programming', bookCode: 'LIB-MCA-101', available: true, ebookUrl: '#' },
    { id: 'b5', title: 'Introduction to Relational Databases', author: 'C.J. Date', category: 'Databases', bookCode: 'LIB-CS-201', available: true, ebookUrl: '#' }
  ]);

  // Issue history
  const [issues] = useState<LibraryIssue[]>([
    { id: 'is1', studentId: 'st1', bookId: 'b2', issueDate: '2026-06-20', dueDate: '2026-07-05' },
    { id: 'is2', studentId: 'st1', bookId: 'b5', issueDate: '2026-06-10', dueDate: '2026-06-25', returnDate: '2026-06-24' },
    { id: 'is3', studentId: 'st2', bookId: 'b1', issueDate: '2026-06-15', dueDate: '2026-06-30' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id || '');

  // Filter books
  const filteredBooks = books.filter(b => {
    const categoryMatch = selectedCategory === 'All' || b.category === selectedCategory;
    const searchMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.bookCode.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Unique categories list
  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  // Active student issue details
  const activeStudentIssues = issues.filter(is => is.studentId === activeStudentId).map(is => {
    const book = books.find(b => b.id === is.bookId);
    
    // Check if overdue
    const today = new Date();
    const due = new Date(is.dueDate);
    const isOverdue = !is.returnDate && today > due;

    return {
      ...is,
      bookTitle: book?.title || 'Unknown Volume',
      bookCode: book?.bookCode || 'N/A',
      isOverdue
    };
  });

  return (
    <div className="space-y-6" id="smart_library_module">
      {/* Top Config Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Smart Library catalog & Issue history</h3>
            <p className="text-xs text-slate-500 font-medium">Verify physical volume availability, audit active checkouts, and discover recommended reading.</p>
          </div>
        </div>

        {/* Member Selector */}
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Audit Member Profile</label>
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
        {/* Left Column: Catalog list and search filter */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h4 className="font-extrabold text-slate-800 text-sm">Volume Directory Search</h4>

            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-slate-200 rounded-lg py-1 px-2.5 text-xs font-semibold focus:outline-blue-500 bg-white text-slate-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="relative">
                <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title, code, author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-slate-200 rounded-lg py-1.5 pl-8.5 pr-3 text-xs focus:outline-blue-500 font-medium w-48"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-mono font-bold border border-slate-200 px-1.5 py-0.5 rounded">
                      {book.bookCode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{book.category}</span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-xs leading-snug">{book.title}</h5>
                  <p className="text-[11px] text-slate-400 font-medium">Author: {book.author}</p>
                </div>

                <div className="text-right space-y-2">
                  <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                    book.available 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {book.available ? 'Available' : 'Issued'}
                  </span>

                  {book.ebookUrl && (
                    <a
                      href={book.ebookUrl}
                      className="block text-blue-600 hover:text-blue-800 text-[10px] font-bold flex items-center gap-0.5 justify-end"
                    >
                      <Download className="h-3 w-3" /> E-Book
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Member issue log status & due-date warnings */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-slate-800 text-sm">Active Issue Card</h4>
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <p className="text-xs text-slate-500 font-medium border-b border-slate-100 pb-2">
              Books currently checked out by {students.find(s => s.id === activeStudentId)?.name || 'Member'}:
            </p>

            {activeStudentIssues.length === 0 ? (
              <div className="text-center py-6 text-slate-400 italic text-xs">No volumes currently checked out.</div>
            ) : (
              <div className="space-y-3">
                {activeStudentIssues.map(is => (
                  <div key={is.id} className="p-3.5 border border-slate-100 bg-slate-50/50 rounded-xl space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-slate-800 text-xs leading-snug max-w-[70%]">{is.bookTitle}</h5>
                      <span className="font-mono text-[9px] text-slate-400 font-bold uppercase">{is.bookCode}</span>
                    </div>

                    <div className="text-[10px] font-semibold text-slate-400 grid grid-cols-2 gap-2 pt-1 border-t border-slate-100/40">
                      <div>
                        <span>Issue Date:</span>
                        <p className="text-slate-600 font-bold">{is.issueDate}</p>
                      </div>
                      <div>
                        <span>Due Date:</span>
                        <p className={`font-bold ${is.isOverdue ? 'text-red-600' : 'text-slate-600'}`}>{is.dueDate}</p>
                      </div>
                    </div>

                    {is.returnDate ? (
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 w-max uppercase">
                        <CheckCircle2 className="h-3 w-3" /> Returned on {is.returnDate}
                      </span>
                    ) : is.isOverdue ? (
                      <span className="text-[9px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded flex items-center gap-1 w-max uppercase animate-pulse">
                        <AlertTriangle className="h-3 w-3" /> Overdue Fine Triggered
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1 w-max uppercase">
                        <Clock className="h-3 w-3" /> Due Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
