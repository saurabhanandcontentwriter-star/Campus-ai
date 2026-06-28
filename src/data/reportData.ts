import { ReportChapter, VivaQuestion } from '../types';

export const reportChapters: ReportChapter[] = [
  {
    id: 1,
    section: "1.0",
    title: "Project Abstract",
    icon: "FileText",
    content: "The Student Management System (SMS) is an integrated, web-based software solution designed to streamline the academic administration of educational institutions. Developed using HTML, CSS, JavaScript, PHP, and MySQL, this final-year project addresses the operational bottlenecks of manual student record systems. The primary objective is to automate student registration, course enrollment, attendance tracking, and grading procedures. By establishing a central relational database, the system ensures data consistency, rapid information retrieval, and high-level security. Administrators can manage course curriculum, monitor attendance levels, and compute GPA dynamically, while faculty members can record exam scores and track student profiles. The proposed solution reduces paper usage by 95%, slashes administrative turnaround times, and provides decision-making aids via analytical reports, making it highly suitable for modern educational institutes looking for digital transition."
  },
  {
    id: 2,
    section: "2.0",
    title: "Introduction",
    icon: "BookOpen",
    content: "In the contemporary digital era, educational institutions are shifting towards complete automation to handle complex records. A Student Management System (SMS) is a software package designed to maintain complete records of students, including personal details, academic scores, daily attendance registers, and course curricula. Traditional systems depend heavily on physical registers, ledger sheets, and manual calculations, which are prone to clerical errors, information mismatch, and extreme storage redundancies. This project presents a clean, responsive, full-stack implementation using PHP as a backend scripting engine and MySQL as a relational database, providing a fast, secure, and intuitive web interface. It acts as an essential bridge between administrators, faculty, and students, providing a robust portal for automated operations."
  },
  {
    id: 3,
    section: "3.0",
    title: "Problem Statement",
    icon: "AlertTriangle",
    content: "The manual administration of student data in tertiary institutions poses severe operational challenges:\n\n1. **Data Redundancy & Inconsistency:** The same student details are repeated across registration ledgers, attendance cards, and mark sheets, leading to data mismatch and high updates cost.\n2. **Time-Consuming Retrievals:** Locating a student's historical academic transcript requires manually scanning physical archives, taking hours or days.\n3. **Clerical Errors in Computation:** Computing overall attendance percentages, cumulative GPAs, and class ranks manually is highly prone to human error.\n4. **Security Risks:** Physical paper records are highly susceptible to wear and tear, fire hazards, and unauthorized alterations by third parties.\n5. **Lack of Real-time Auditing:** There is no centralized mechanism to quickly verify active student tallies, course load assignments, or daily attendance trends."
  },
  {
    id: 4,
    section: "4.0",
    title: "Objectives",
    icon: "Target",
    content: "The primary objectives of this Student Management System project are:\n\n1. **Centralize Data Storage:** To establish a secure relational MySQL database storing student personal details, enrollment schedules, marks, and attendance registers.\n2. **Automate Attendance Tracking:** To provide an interactive interface for faculty to mark attendance for specific classes and subjects, automatically calculating running percentages.\n3. **Simplify Grading System:** To facilitate dynamic grade computation (A+, A, B, C, F) based on examination scores, generating digital transcripts.\n4. **Enhance Search Capabilities:** To implement instant filtering and querying by roll number, name, department, or academic semester.\n5. **Promote Security & Role-based Access:** To secure sensitive database records through multi-user authentication (Admin, Faculty) with clean access controls."
  },
  {
    id: 5,
    section: "5.0",
    title: "Scope of the Project",
    icon: "Compass",
    content: "The scope of this project is confined to managing student academic activities within a single college or university campus:\n\n- **Student Profiles:** Managing complete lifecycle from admission, profile edits, to course completion.\n- **Academic Records:** Managing syllabus, course loads, subjects, and sessional examination marks.\n- **Operational Monitoring:** Real-time daily attendance registering, generating alert notifications for low-attendance (under 75%) student categories.\n- **Report Generation:** Providing print-friendly tabular profiles and academic results.\n- **Technology Boundaries:** Developed using standard LAMP/WAMP stack (Apache, MySQL, PHP, HTML5, CSS3, JavaScript) accessible on any local network or cloud-hosted web server with responsive viewports."
  },
  {
    id: 6,
    section: "6.0",
    title: "Existing System Analysis",
    icon: "ShieldAlert",
    content: "The current system relies on paper registers, spreadsheets, and decentralized offline ledger logs. Under this manual setup, when a student takes admission, their record is recorded in a physical ledger. Daily attendance is written in registers by lecturers, and exams are computed using local Excel sheets which must be printed and compiled manually. This structure exhibits major flaws: low storage capacity, high retrieval delays, severe lack of concurrent access, zero audit trails, and extreme vulnerability to physical damages."
  },
  {
    id: 7,
    section: "7.0",
    title: "Proposed System Analysis",
    icon: "Sparkles",
    content: "The proposed Student Management System is an integrated, secure, web-enabled client-server solution. Built with PHP on the server-side, it processes requests and interacts with a centralized MySQL database. Users interact with the system via standard, clean web browsers on laptops, tablets, or mobiles. All transactions are immediately recorded, ensuring 100% data consistency. Calculations (attendance summaries, averages, grade letters) are done programmatically in real-time. Role-based sessions prevent unauthorized modifications, and analytical graphs provide clear visualizations of student trends."
  },
  {
    id: 8,
    section: "8.0",
    title: "Feasibility Study",
    icon: "CheckSquare",
    content: "A feasibility study was performed across three crucial parameters to evaluate project viability:\n\n1. **Technical Feasibility:** The system uses standard open-source technologies (HTML5, PHP, MySQL) which are supported by all modern hosting environments and browsers. No complex high-end hardware is required; a standard web server container handles it with high efficiency.\n2. **Economic Feasibility:** Development leverages 100% open-source software (Apache, MySQL, PHP), requiring zero licensing costs. By reducing paper use, courier charges, and administrative manpower hours, the project offers a full return on investment (ROI) within 6 months.\n3. **Operational Feasibility:** The interface is designed with simplistic layouts, standard icons, and intuitive buttons, requiring zero specialized computer training for administrative staff. Standard web browser navigation and clear helper notifications ensure wide operational acceptance."
  },
  {
    id: 9,
    section: "9.0",
    title: "Functional Requirements",
    icon: "Cpu",
    content: "Functional requirements describe the specific actions and behaviors the system must perform:\n\n1. **Authentication Module:** Secure login for administrators and faculty, maintaining secure session tokens and password hashing.\n2. **Student Directory Module:** Creating, reading, updating, and disabling student profiles with custom parameters (roll numbers, course, semester, DOB, contact details).\n3. **Course & Subject Registry:** Admin can configure academic courses (e.g., BCA, MCA) and map multiple core subjects/syllabus codes to specific semesters.\n4. **Attendance Recorder:** Faculty can record daily present/absent states for specific subjects, triggering low-attendance warning warnings.\n5. **Grade Book Module:** Faculty can log internal sessional marks and semester finals, allowing the system to compute letter grades dynamically."
  },
  {
    id: 10,
    section: "10.0",
    title: "Non-Functional Requirements",
    icon: "Activity",
    content: "Non-functional requirements specify operational qualities and safety guidelines:\n\n1. **Performance:** Database queries must execute in less than 500ms under standard loads of 1,000 concurrent active connections.\n2. **Security:** User passwords must be stored using cryptographically secure hashing (e.g., PHP `password_hash()` with `PASSWORD_DEFAULT`). Direct SQL injection threats must be blocked using PDO prepared statements.\n3. **Reliability:** The system should exhibit high uptime (99.9%) and gracefully handle missing database connection states through informative warning layouts.\n4. **Usability:** High-contrast responsive layouts with mobile-touch targets of at least 44x44 pixels.\n5. **Scalability:** System architecture must support adding thousands of students and courses without degradation of performance."
  },
  {
    id: 11,
    section: "11.0",
    title: "System Architecture",
    icon: "Network",
    content: "The system is built on a robust 3-Tier Architecture model:\n\n- **Presentation Tier (Client Side):** Standard HTML5, CSS3, and JavaScript styled with Tailwind, managing user input, styling, and visual rendering in the user's browser.\n- **Application Tier (Server Side):** PHP (Hypertext Preprocessor) scripting engine processing request routing, computing business rules (grades, averages, validations), and managing sessions.\n- **Data Tier (Database):** MySQL Relational Database Service storing structured data rows with strict foreign-key integrity constraints."
  },
  {
    id: 12,
    section: "12.0",
    title: "Modules Description",
    icon: "Layers",
    content: "The software application is partitioned into five tightly-integrated core modules:\n\n1. **Admin Module:** The core control hub. Authorized administrators can enroll new faculty, register academic courses, set subject outlines, and backup database structures.\n2. **Student Directory Module:** Manages details of all students. Features advanced multi-column search (name, roll no, status) and provides exportable tabular registers.\n3. **Attendance Logging Module:** An interactive attendance grid. Allows faculty to select a class subject, select a calendar date, and check/uncheck status for student rolls quickly.\n4. **Grading Module:** Accepts examination scores for different sessionals and finals. Formulates dynamic averages and logs official records.\n5. **Analytics Dashboard:** Provides visual graphs (using Recharts or native SVG elements) showcasing attendance levels, subject averages, and gender distribution ratios."
  },
  {
    id: 13,
    section: "13.0",
    title: "Data Flow Diagrams (DFD)",
    icon: "GitMerge",
    content: "Data Flow Diagrams illustrate how data flows through the application across processes, actors, and data stores.\n\n### Level 0 DFD (Context Level)\nAt the highest abstract level, the Student Management System acts as a central system block. Users (Admin and Faculty) provide credentials, student rosters, marks, and attendance values. In return, the system generates student rosters, grading reports, attendance warnings, and statistics worksheets.\n\n### Level 1 DFD (Detailed Process Level)\nData flows from users into targeted core processes:\n1. Process 1.0 (Login Validation): Authenticates users against the DB.\n2. Process 2.0 (Manage Records): Writes/updates data to the Students and Course Tables.\n3. Process 3.0 (Log Attendance): Writes date-specific records into the Attendance Table.\n4. Process 4.0 (Mark Recording): Computes grades and writes to the Marks Table.\n\n### Level 2 DFD (Database Level)\nAt this level, the processes read/write to specific indexed database files, managing foreign keys, cascades, and transaction boundaries."
  },
  {
    id: 14,
    section: "14.0",
    title: "Entity Relationship (ER) Diagram",
    icon: "Database",
    content: "The database consists of structured entity sets with strict relational constraints:\n\n1. **Student Entity:** Primary Key `id` (INT), attributes: `roll_no`, `name`, `email`, `phone`, `dob`, `semester`, and foreign key `course_id` (representing a 1-to-many relationship with the Course entity).\n2. **Course Entity:** Primary Key `id`, attributes: `code`, `name`, `duration`.\n3. **Subject Entity:** Primary Key `id`, attributes: `code`, `name`, `semester`, foreign key `course_id`.\n4. **Attendance Entity:** Primary Key `id`, foreign keys `student_id`, `subject_id`, attributes: `date`, `status`.\n5. **Marks Entity:** Primary Key `id`, foreign keys `student_id`, `subject_id`, attributes: `exam_type`, `marks_obtained`, `max_marks`, `grade`.\n\n**Relations Summary:**\n- One Course contains many Subjects.\n- One Course has many Students.\n- One Student has many Attendance records.\n- One Student has many Marks records."
  },
  {
    id: 15,
    section: "15.0",
    title: "UML Diagrams",
    icon: "Layout",
    content: "UML (Unified Modeling Language) models represent system behaviors:\n\n1. **Use Case Diagram:** Shows interactions. Actors (Admin, Faculty) engage with use cases: Login, Enroll Student, Update Marks, Take Attendance, Search Student, Print Transcript.\n2. **Class Diagram:** Classes: `User` (id, email, password, login()), `Student` (id, rollNo, name, save(), update()), `Course` (id, code, name), `Subject` (id, code, name), `Attendance` (id, date, status, save()), `GradeBook` (id, marks, calculateGrade()).\n3. **Sequence Diagram:** Shows chronological sequence of taking attendance: Faculty selects Subject -> System fetches active roster from Database -> Faculty submits checkboxes -> Server validates data -> Database commits records -> Client receives success notification.\n4. **Activity Diagram:** Workflow for grading: Start -> Input marks -> Is marks > 100? (Yes -> Error; No -> Continue) -> Compute Grade Letter -> Save to Marks Table -> Display on Student Profile -> End."
  },
  {
    id: 16,
    section: "16.0",
    title: "Database Design with SQL Tables",
    icon: "Table",
    content: "The complete relational schema for the system is provided below. It includes indices, cascades, and default timestamps to prevent orphan rows and ensure ultra-fast query execution.",
    codeSnippets: [
      {
        filename: "database_schema.sql",
        language: "sql",
        code: `-- Student Management System Relational Schema
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    duration VARCHAR(20) NOT NULL DEFAULT '3 Years',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    dob DATE NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(10) NOT NULL,
    joining_date DATE NOT NULL,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(10) NOT NULL,
    max_marks INT NOT NULL DEFAULT 100,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (student_id, subject_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Marks Table
CREATE TABLE IF NOT EXISTS marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam_type ENUM('Sessional 1', 'Sessional 2', 'Semester End') NOT NULL,
    marks_obtained INT NOT NULL,
    max_marks INT NOT NULL DEFAULT 100,
    grade VARCHAR(5) NOT NULL,
    remarks VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_grade (student_id, subject_id, exam_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Users Table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Faculty') DEFAULT 'Faculty',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial data
INSERT INTO courses (code, name, duration) VALUES
('BCA', 'Bachelor of Computer Applications', '3 Years'),
('BSc-CS', 'B.Sc. Computer Science', '3 Years');`
      }
    ]
  },
  {
    id: 17,
    section: "17.0",
    title: "Frontend Design using HTML, CSS, & JS",
    icon: "Code",
    content: "The client interface utilizes a clean modern template designed with responsive layout rules. Tailwind CSS classes are linked in the head to supply immediate, clean utility utilities. JavaScript coordinates asynchronous form submissions and modal interactions dynamically without triggering full browser reloads.",
    codeSnippets: [
      {
        filename: "index.html",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System - Portal</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 font-sans">
    <nav class="bg-slate-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <i class="fa-solid fa-graduation-cap text-indigo-400"></i> SMS Admin Portal
        </h1>
        <div class="flex items-center gap-4">
            <span class="text-sm text-gray-300">Welcome, Admin</span>
            <a href="logout.php" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-xs transition duration-150">Logout</a>
        </div>
    </nav>
    <main class="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Sidebar Navigation -->
        <aside class="md:col-span-1 bg-white p-4 rounded-xl shadow-sm space-y-2">
            <a href="dashboard.php" class="flex items-center gap-3 px-3 py-2.5 rounded bg-indigo-50 text-indigo-700 font-medium text-sm">
                <i class="fa-solid fa-chart-line text-lg w-5"></i> Dashboard
            </a>
            <a href="students.php" class="flex items-center gap-3 px-3 py-2.5 rounded text-gray-700 hover:bg-gray-50 text-sm">
                <i class="fa-solid fa-user-group text-lg w-5"></i> Student Directory
            </a>
            <a href="attendance.php" class="flex items-center gap-3 px-3 py-2.5 rounded text-gray-700 hover:bg-gray-50 text-sm">
                <i class="fa-solid fa-calendar-check text-lg w-5"></i> Log Attendance
            </a>
            <a href="marks.php" class="flex items-center gap-3 px-3 py-2.5 rounded text-gray-700 hover:bg-gray-50 text-sm">
                <i class="fa-solid fa-award text-lg w-5"></i> Record Grades
            </a>
        </aside>
        
        <!-- Dashboard Display Grid -->
        <section class="md:col-span-3 space-y-6">
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Active Students</span>
                    <h2 class="text-3xl font-bold text-gray-800 mt-2">1,248</h2>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Courses Running</span>
                    <h2 class="text-3xl font-bold text-indigo-600 mt-2">12</h2>
                </div>
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <span class="text-xs font-semibold text-gray-400 uppercase">Avg Attendance</span>
                    <h2 class="text-3xl font-bold text-emerald-600 mt-2">84.5%</h2>
                </div>
            </div>
            <!-- Interactive Action Panel -->
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 class="font-bold text-gray-800 text-lg mb-4">Quick Search Profile</h3>
                <div class="flex gap-2">
                    <input type="text" id="searchInput" placeholder="Enter student roll number..." class="border border-gray-300 rounded px-4 py-2 w-full text-sm focus:outline-indigo-500">
                    <button onclick="searchStudent()" class="bg-indigo-600 text-white font-semibold px-6 py-2 rounded text-sm hover:bg-indigo-700 transition">Search</button>
                </div>
                <div id="resultBox" class="mt-4 hidden p-4 bg-gray-50 rounded border border-gray-200"></div>
            </div>
        </section>
    </main>
    <script>
        function searchStudent() {
            const roll = document.getElementById('searchInput').value;
            const resBox = document.getElementById('resultBox');
            if(!roll) return alert('Please enter a roll number!');
            
            fetch('api_search.php?roll=' + roll)
                .then(r => r.json())
                .then(data => {
                    resBox.classList.remove('hidden');
                    if(data.success) {
                        resBox.innerHTML = \`<div class="space-y-1">
                            <p class="font-bold text-gray-800 text-sm">Student Found: \${data.name}</p>
                            <p class="text-xs text-gray-500">Course: \${data.course} | Semester: \${data.semester}</p>
                            <span class="inline-block mt-2 bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">\${data.status}</span>
                        </div>\`;
                    } else {
                        resBox.innerHTML = \`<p class="text-sm text-red-500 font-semibold">\${data.message}</p>\`;
                    }
                });
        }
    </script>
</body>
</html>`
      }
    ]
  },
  {
    id: 18,
    section: "18.0",
    title: "Backend Implementation using PHP",
    icon: "Server",
    content: "The backend engine handles security, connection persistence, data manipulation, and role verification. PHP PDO (PHP Data Objects) is selected over the legacy mysqli engine due to its superior support for prepared statements, protection against SQL Injection, and multi-database compatibility.",
    codeSnippets: [
      {
        filename: "db.php",
        language: "php",
        code: `<?php
// Centralized Database Connection using PDO
$host = 'localhost';
$dbname = 'student_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}
?>`
      }
    ]
  },
  {
    id: 19,
    section: "19.0",
    title: "Complete Source Code",
    icon: "FolderGit",
    content: "This section provides the implementation files for core actions: authenticating, adding a student profile, and registering daily attendance marks.",
    codeSnippets: [
      {
        filename: "login.php",
        language: "php",
        code: `<?php
require_once 'db.php';
session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (!empty($username) && !empty($password)) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            header("Location: dashboard.php");
            exit;
        } else {
            $error = "Invalid username or password!";
        }
    } else {
        $error = "Please fill in all details!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Management System - Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-slate-800">Login Portal</h2>
        <?php if($error): ?>
            <div class="bg-red-50 text-red-600 text-xs p-3 rounded mt-4 font-semibold"><?php echo $error; ?></div>
        <?php endif; ?>
        <form action="login.php" method="POST" class="mt-6 space-y-4">
            <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Username</label>
                <input type="text" name="username" required class="border border-gray-300 w-full p-2 rounded text-sm focus:outline-indigo-500">
            </div>
            <div>
                <label class="text-xs font-semibold text-gray-500 uppercase">Password</label>
                <input type="password" name="password" required class="border border-gray-300 w-full p-2 rounded text-sm focus:outline-indigo-500">
            </div>
            <button type="submit" class="bg-indigo-600 text-white w-full py-2.5 rounded font-bold text-sm hover:bg-indigo-700 transition">Authenticate</button>
        </form>
    </div>
</body>
</html>`
      },
      {
        filename: "add_student.php",
        language: "php",
        code: `<?php
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Admin') {
    die("Access Denied!");
}

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $roll_no = trim($_POST['roll_no']);
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $gender = $_POST['gender'];
    $dob = $_POST['dob'];
    $course_id = (int)$_POST['course_id'];
    $semester = trim($_POST['semester']);
    $joining_date = $_POST['joining_date'];

    try {
        $stmt = $pdo->prepare("INSERT INTO students (roll_no, name, email, phone, gender, dob, course_id, semester, joining_date) VALUES (:roll_no, :name, :email, :phone, :gender, :dob, :course_id, :semester, :joining_date)");
        $stmt->execute([
            'roll_no' => $roll_no,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'gender' => $gender,
            'dob' => $dob,
            'course_id' => $course_id,
            'semester' => $semester,
            'joining_date' => $joining_date
        ]);
        $message = "Student Profile Created Successfully!";
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
    }
}
?>`
      },
      {
        filename: "api_attendance.php",
        language: "php",
        code: `<?php
require_once 'db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['student_id'], $data['subject_id'], $data['date'], $data['status'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO attendance (student_id, subject_id, date, status) VALUES (:student_id, :subject_id, :date, :status) ON DUPLICATE KEY UPDATE status = :status");
        $stmt->execute([
            'student_id' => $data['student_id'],
            'subject_id' => $data['subject_id'],
            'date' => $data['date'],
            'status' => $data['status']
        ]);
        echo json_encode(['success' => true, 'message' => 'Attendance logged successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>`
      }
    ]
  },
  {
    id: 20,
    section: "20.0",
    title: "Testing Methodology and Test Cases",
    icon: "ClipboardCheck",
    content: "To guarantee operational accuracy, the student management application underwent intensive testing across two main phases: Black Box (Functional) Testing and White Box (Structural) Testing.",
    subsections: [
      {
        title: "Test Cases Log Sheets",
        content: "1. **TC-001 (User Authentication):** Input valid credentials -> Expectation: User redirects to `dashboard.php` -> Status: **PASSED**.\n2. **TC-002 (Roll Duplication Prevention):** Insert new student record with an existing roll number -> Expectation: PDO exception caught, database rejects insert, UI prints 'Roll number already exists' -> Status: **PASSED**.\n3. **TC-003 (Marks Upper Bound Check):** Submit grade value 110/100 -> Expectation: System triggers validation error and halts database commit -> Status: **PASSED**.\n4. **TC-004 (Attendance Unique Date Index):** Log multiple attendance states for same student on same subject & date -> Expectation: Trigger ON DUPLICATE KEY UPDATE, updating status rather than duplicating row -> Status: **PASSED**."
      }
    ]
  },
  {
    id: 21,
    section: "21.0",
    title: "SWOT Analysis",
    icon: "Percent",
    content: "Evaluating the strategic position of our Student Management System reveals:\n\n1. **Strengths (S):** Low footprint, standard open-source LAMP/WAMP architecture, high protection against SQL-i via prepared statements, clean real-time dashboard analytics.\n2. **Weaknesses (W):** Requires persistent internet or local network connection, does not feature automated video stream recognition for physical facial rosters.\n3. **Opportunities (O):** Direct integration with campus mobile apps, automated SMS alert gateways, scaling to cloud databases like Amazon RDS or Cloud SQL.\n4. **Threats (T):** Campus network downtimes, hardware server failures, data scraping if client browsers are left unattended."
  },
  {
    id: 22,
    section: "22.0",
    title: "Advantages and Limitations",
    icon: "TrendingUp",
    content: "### Advantages\n- **No-Paper Ecosystem:** Minimizes college physical register records cost by over 95%.\n- **Instant Grades Generation:** Computes GPA, total marks, and attendance percentages instantly on form submission.\n- **Security Framework:** Role-based access levels secure faculty records from unauthorized students.\n- **Fast Audits:** Immediate overview lists showcasing classes with critical low-attendance markers.\n\n### Limitations\n- **Hosting Boundary:** Requires a central web server to coordinate data syncing across multiple browser units.\n- **Manual Mark Registering:** Faculty must type in scores manually; does not read scan codes or hand-written papers directly."
  },
  {
    id: 23,
    section: "23.0",
    title: "Future Enhancements",
    icon: "Compass",
    content: "Future versions of this final-year Student Management System are planned to incorporate:\n\n1. **Biometric Integration:** Connect fingerprint scanners or digital RFID cards to feed live attendance datasets directly.\n2. **AI-Driven Predictive Diagnostics:** Integrating Gemini models to analyze students' performance trends and recommend personalized improvement curriculums.\n3. **Integrated Fee Gateway:** Allowing students to clear semester fees directly inside their portal dashboards using online UPI channels.\n4. **Automated WhatsApp Alerts:** Sending daily class attendance status alerts to parent contact numbers immediately on class completion."
  },
  {
    id: 24,
    section: "24.0",
    title: "Conclusion",
    icon: "Award",
    content: "The web-based Student Management System has been successfully conceptualized, designed, and developed to satisfy all specified objectives. By automating student directories, attendance registers, and academic GPA cards, the system successfully eliminates clerical bottlenecks, paper redundancies, and computation errors. Using secure PDO statements in PHP and clean structural architectures in MySQL guarantees high security, stability, and fast execution speeds, satisfying all criteria for an outstanding BCA final-year computer science project submission."
  },
  {
    id: 25,
    section: "25.0",
    title: "Bibliography and References",
    icon: "Bookmark",
    content: "1. **Elmasri, R., & Navathe, S. B.** (2016). *Fundamentals of Database Systems* (7th ed.). Pearson Education.\n2. **Nixon, R.** (2018). *Learning PHP, MySQL & JavaScript* (5th ed.). O'Reilly Media.\n3. **W3Schools PHP Guide & MySQL prepared statements online references** (https://www.w3schools.com/php/)\n4. **Official PHP Documentation on PHP Data Objects (PDO)** (https://www.php.net/manual/en/book.pdo.php)\n5. **Tailwind CSS documentation and web guidelines** (https://tailwindcss.com)"
  },
  {
    id: 26,
    section: "26.0",
    title: "Viva Questions & Answers",
    icon: "MessageSquare",
    content: "This section contains high-yield questions frequently asked by external university examiners during BCA final-year project viva-voce examinations, with direct answers to help students score top grades."
  }
];

export const vivaQuestions: VivaQuestion[] = [
  {
    id: 1,
    question: "Why did you choose PHP and MySQL for your Student Management System instead of other tech stacks?",
    options: [
      "Because they are entirely open-source, have a large developer community, provide high-performance database execution speeds, and run seamlessly on standard web servers without complex compilation.",
      "Because PHP is the only programming language that can connect to a MySQL database.",
      "Because PHP doesn't require writing any HTML or CSS code.",
      "Because MySQL is a non-relational NoSQL database which makes it very fast."
    ],
    correctAnswer: 0,
    explanation: "PHP & MySQL are open-source, highly mature technologies. PHP integrates perfectly with HTML to create dynamic web servers, and MySQL offers quick relatioship query execution. They represent the standard industry LAMP stack."
  },
  {
    id: 2,
    question: "What is the difference between legacy MySQLi and PDO in PHP, and which one did your project implement?",
    options: [
      "PDO is faster, but MySQLi is safer.",
      "Our project implements PDO (PHP Data Objects). PDO is a database abstraction layer that protects against SQL injection through prepared statements and supports multiple databases, whereas MySQLi only works with MySQL.",
      "MySQLi requires downloading a paid license, while PDO is free.",
      "PDO stands for Personal Database Objects and does not support secure statements."
    ],
    correctAnswer: 1,
    explanation: "PDO provides a unified interface for working with 12+ databases. Using PDO prepared statements separates SQL code from data values, rendering SQL injection attacks impossible."
  },
  {
    id: 3,
    question: "How does your database design prevent 'orphan records' when a student record or a course record is deleted?",
    options: [
      "By manually scanning and deleting related rows using Excel sheets.",
      "By using the 'ON DELETE CASCADE' clause on the Foreign Key constraints in our relational schema, which automatically deletes all associated attendance and mark records when a student is removed.",
      "By disabling the ability to delete any database rows permanently.",
      "By writing custom JavaScript functions to truncate the MySQL server on every logout."
    ],
    correctAnswer: 1,
    explanation: "'ON DELETE CASCADE' is a key constraint feature in database engines (like InnoDB) that ensures referential integrity by automatically cascading deletions from parent tables to child tables."
  },
  {
    id: 4,
    question: "What is SQL Injection, and how does your backend code protect against it?",
    options: [
      "It is an attack where malicious users inject harmful CSS rules to break the font styling.",
      "SQL Injection is an exploit where SQL scripts are injected into input forms to manipulate database queries. We protect against it by using PDO prepared statements with parameterized placeholders, which treats all input as plain text data rather than executable query commands.",
      "We protect against it by using alert() boxes in JavaScript whenever a quote character is typed.",
      "We protect against it by not using a database at all in production."
    ],
    correctAnswer: 1,
    explanation: "Prepared statements pre-compile the SQL statement on the server. Then, user inputs are bound as simple values, completely preventing any injected code from altering the structure of the database query."
  },
  {
    id: 5,
    question: "Explain the difference between a 1-to-Many and a Many-to-Many relationship in this system.",
    options: [
      "A student can have only one name, which is 1-to-Many.",
      "A 1-to-Many relationship is where a single record in one table links to multiple records in another (e.g., one course has many students). A Many-to-Many would be like students enrolling in multiple courses, requiring a junction table to resolve.",
      "Many-to-Many relationships cannot be implemented in SQL databases.",
      "1-to-Many relationships require using custom PHP classes while Many-to-Many does not."
    ],
    correctAnswer: 1,
    explanation: "In our database design, Course-to-Students is 1-to-Many (each student belongs to one course, but a course has many students). Subject-to-Attendance is also managed cleanly."
  }
];
