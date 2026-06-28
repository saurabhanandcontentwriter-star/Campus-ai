export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  courseId: string;
  semester: string;
  joiningDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  duration: string; // e.g., "3 Years"
  semesterCount: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  courseId: string;
  semester: string;
  maxMarks: number;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  examType: 'Sessional 1' | 'Sessional 2' | 'Semester End';
  marksObtained: number;
  maxMarks: number;
  grade: string; // A+, A, B, C, F
  remarks?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'Present' | 'Absent';
}

export interface ReportChapter {
  id: number;
  title: string;
  section: string;
  icon: string;
  content: string;
  subsections?: { title: string; content: string }[];
  codeSnippets?: { filename: string; language: string; code: string }[];
}

export interface VivaQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ==========================================
// CAMPUSSPHERE AI ADDITIONAL DOMAIN MODELS
// ==========================================

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Hackathon' | 'Technical' | 'Sports' | 'Seminar' | 'Cultural';
  organizer: string;
  registeredCount: number;
  registeredStudentIds: string[];
}

export interface DiscussionThread {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  authorName: string;
  authorRoll: string;
  date: string;
  resolved: boolean;
  replies: {
    id: string;
    authorName: string;
    authorRoll: string;
    content: string;
    date: string;
  }[];
}

export interface PlacementOpportunity {
  id: string;
  title: string;
  company: string;
  type: 'Internship' | 'Full-Time';
  location: string;
  stipendOrPackage: string;
  deadline: string;
  description: string;
  skillsRequired: string[];
  appliedStudentIds: string[];
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  bookCode: string;
  available: boolean;
  ebookUrl?: string;
}

export interface LibraryIssue {
  id: string;
  studentId: string;
  bookId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
}

export interface LostFoundItem {
  id: string;
  itemName: string;
  type: 'Lost' | 'Found';
  category: 'Electronics' | 'Documents' | 'Books' | 'Personal' | 'Other';
  description: string;
  date: string;
  location: string;
  reporterName: string;
  reporterContact: string;
  resolved: boolean;
}

export interface FeedbackSubmission {
  id: string;
  department: 'BCA' | 'CSE' | 'Library' | 'Administration' | 'General';
  feedbackType: 'Suggestion' | 'Complaint' | 'Appreciation';
  content: string;
  date: string;
  isAnonymous: boolean;
  status: 'Pending' | 'Under Review' | 'Resolved';
}

export interface SkillPortfolio {
  studentId: string;
  bio: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    githubLink?: string;
  }[];
  certificates: {
    title: string;
    issuer: string;
    date: string;
    fileUrl?: string;
  }[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface StudentLeaderboardEntry {
  studentId: string;
  points: number;
  badges: string[]; // Badge IDs
}

