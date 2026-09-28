import type {
  AdminSection,
  AdminUser,
  AdmissionApplication,
  AttendanceLogRecord,
  AuditRecord,
  DegreeProgram,
  GraduationCertificate,
  InstructorSection,
  Invoice,
  NoticeItem,
  PaymentTransaction,
  RosterStudent,
  ScheduleItem,
  SemesterCurriculum,
  StudentCourse,
  TranscriptTerm,
  UserSession,
} from "./app-types";

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Administrator",
};

export const DEGREE_PROGRAMS: DegreeProgram[] = [
  {
    id: "prog-bsc-cse",
    code: "BSC-CSE",
    title: "Bachelor of Science in Computer Science & Engineering",
    degreeType: "B.Sc.",
    totalCredits: 140,
    totalSemesters: 8,
    admissionFee: 15000,
    semesterTuition: 45000,
    department: "Computer Science & Engineering",
    description: "Accredited 4-year professional engineering program with specializations in AI, Systems, and Software Architecture.",
    semesters: [
      {
        semesterNumber: 1,
        title: "Semester 1",
        termName: "Fall 2024",
        status: "completed",
        feeStatus: "paid",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-1101", title: "Introduction to Programming", credits: 3, type: "Core", instructor: "Sabina Yasmin", room: "AB2-401" },
          { code: "CSE-1102", title: "Programming Laboratory", credits: 1.5, type: "Lab", instructor: "Sabina Yasmin", room: "LAB-301" },
          { code: "MAT-1101", title: "Differential & Integral Calculus", credits: 3, type: "General", instructor: "Dr. Selim Reza", room: "AB1-112" },
          { code: "PHY-1101", title: "Engineering Physics I", credits: 3, type: "General", instructor: "Prof. Dr. Mahfuz Alam", room: "AB1-205" },
          { code: "ENG-1101", title: "English Language & Academic Writing", credits: 3, type: "General", instructor: "Dr. Sadia Noor", room: "AB4-102" },
        ],
      },
      {
        semesterNumber: 2,
        title: "Semester 2",
        termName: "Spring 2025",
        status: "completed",
        feeStatus: "paid",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-1201", title: "Discrete Mathematics", credits: 3, type: "Core", prereq: "MAT-1101", instructor: "Dr. Tanvir Ahmed", room: "AB2-301" },
          { code: "CSE-1202", title: "Object-Oriented Programming (Java/C++)", credits: 3, type: "Core", prereq: "CSE-1101", instructor: "Dr. Nafisa Haque", room: "AB2-302" },
          { code: "CSE-1203", title: "OOP Laboratory", credits: 1.5, type: "Lab", instructor: "Dr. Nafisa Haque", room: "LAB-302" },
          { code: "MAT-1201", title: "Calculus II & Coordinate Geometry", credits: 3, type: "General", prereq: "MAT-1101", instructor: "Dr. Sumaiya Karim", room: "AB1-114" },
          { code: "EEE-1101", title: "Basic Electrical Circuits", credits: 3, type: "General", instructor: "Prof. Dr. Kamal Hossain", room: "AB1-201" },
        ],
      },
      {
        semesterNumber: 3,
        title: "Semester 3",
        termName: "Fall 2025",
        status: "completed",
        feeStatus: "paid",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-2101", title: "Data Structures & Algorithms", credits: 3, type: "Core", prereq: "CSE-1202", instructor: "Prof. Dr. Mahmud Hasan", room: "AB2-402" },
          { code: "CSE-2102", title: "Algorithms Laboratory", credits: 1.5, type: "Lab", instructor: "Prof. Dr. Mahmud Hasan", room: "LAB-304" },
          { code: "EEE-2101", title: "Digital Logic Design", credits: 3, type: "Core", prereq: "EEE-1101", instructor: "Dr. Rubel Mia", room: "AB1-204" },
          { code: "MAT-2101", title: "Linear Algebra & Matrices", credits: 3, type: "General", prereq: "MAT-1201", instructor: "Dr. Selim Reza", room: "AB1-114" },
        ],
      },
      {
        semesterNumber: 4,
        title: "Semester 4",
        termName: "Spring 2026",
        status: "completed",
        feeStatus: "paid",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-2201", title: "Database Management Systems", credits: 3, type: "Core", prereq: "CSE-2101", instructor: "Dr. Tanvir Ahmed", room: "AB2-305" },
          { code: "CSE-2202", title: "DBMS Lab & SQL Studio", credits: 1.5, type: "Lab", instructor: "Dr. Tanvir Ahmed", room: "LAB-305" },
          { code: "CSE-2203", title: "Computer Organization & Architecture", credits: 3, type: "Core", prereq: "EEE-2101", instructor: "Dr. Sabbir Rahman", room: "AB2-404" },
          { code: "MAT-2201", title: "Probability & Statistics for Engineers", credits: 3, type: "General", prereq: "MAT-2101", instructor: "Dr. Sumaiya Karim", room: "AB1-115" },
        ],
      },
      {
        semesterNumber: 5,
        title: "Semester 5",
        termName: "Fall 2026",
        status: "current",
        feeStatus: "paid",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-3101", title: "Operating Systems Principles", credits: 3, type: "Core", prereq: "CSE-2203", instructor: "Dr. Sabbir Rahman", room: "AB2-405", schedule: "Sun 10:30, Tue 10:30" },
          { code: "CSE-3102", title: "Software Engineering & Agile Methodologies", credits: 3, type: "Core", prereq: "CSE-2201", instructor: "Prof. Dr. Ayesha Rahman", room: "AB2-501", schedule: "Mon 09:00, Wed 09:00" },
          { code: "CSE-3103", title: "Microprocessors & Embedded Systems", credits: 3, type: "Core", prereq: "CSE-2203", instructor: "Dr. Rubel Mia", room: "AB1-208", schedule: "Tue 14:00, Thu 14:00" },
          { code: "MAT-3101", title: "Numerical Analysis & Methods", credits: 3, type: "General", prereq: "MAT-2201", instructor: "Dr. Selim Reza", room: "AB1-118", schedule: "Sun 14:30, Tue 14:30" },
        ],
      },
      {
        semesterNumber: 6,
        title: "Semester 6",
        termName: "Spring 2027",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-3201", title: "Computer Networks & Protocols", credits: 3, type: "Core", prereq: "CSE-3101", instructor: "Prof. Dr. Mahmud Hasan" },
          { code: "CSE-3202", title: "Web & Cloud Architecture", credits: 3, type: "Core", prereq: "CSE-3102", instructor: "Dr. Nafisa Haque" },
          { code: "CSE-3203", title: "Theory of Computation & Automata", credits: 3, type: "Core", prereq: "CSE-1201", instructor: "Dr. Tanvir Ahmed" },
          { code: "ENG-3201", title: "Technical Communication & Ethics", credits: 3, type: "General", instructor: "Dr. Sadia Noor" },
        ],
      },
      {
        semesterNumber: 7,
        title: "Semester 7",
        termName: "Fall 2027",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-4101", title: "Artificial Intelligence & Machine Learning", credits: 3, type: "Core", prereq: "CSE-2101", instructor: "Dr. Nafisa Haque" },
          { code: "CSE-4102", title: "Machine Learning Lab", credits: 1.5, type: "Lab", instructor: "Dr. Nafisa Haque" },
          { code: "CSE-4103", title: "Compiler Design & Construction", credits: 3, type: "Core", prereq: "CSE-3203", instructor: "Dr. Sabbir Rahman" },
          { code: "CSE-4100", title: "Senior Capstone Design Project I", credits: 3, type: "Thesis", prereq: "CSE-3102", instructor: "Prof. Dr. Ayesha Rahman" },
        ],
      },
      {
        semesterNumber: 8,
        title: "Semester 8",
        termName: "Spring 2028",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 45000,
        courses: [
          { code: "CSE-4201", title: "Distributed Systems & Cloud Computing", credits: 3, type: "Core", prereq: "CSE-3201", instructor: "Prof. Dr. Mahmud Hasan" },
          { code: "CSE-4202", title: "Cybersecurity & Cryptography", credits: 3, type: "Core", prereq: "CSE-3201", instructor: "Dr. Tanvir Ahmed" },
          { code: "CSE-4200", title: "Senior Capstone Thesis & Defense", credits: 3, type: "Thesis", prereq: "CSE-4100", instructor: "Prof. Dr. Ayesha Rahman" },
        ],
      },
    ],
  },
  {
    id: "prog-msc-dsai",
    code: "MSC-DSAI",
    title: "Master of Science in Data Science & Artificial Intelligence",
    degreeType: "M.Sc.",
    totalCredits: 36,
    totalSemesters: 4,
    admissionFee: 20000,
    semesterTuition: 55000,
    department: "Computer Science & Engineering",
    description: "Advanced post-graduate degree for research and cutting-edge industrial leadership in Machine Learning, Deep Neural Networks, and Big Data.",
    semesters: [
      {
        semesterNumber: 1,
        title: "Semester 1",
        termName: "Fall 2025",
        status: "completed",
        feeStatus: "paid",
        tuitionFee: 55000,
        courses: [
          { code: "DSAI-5101", title: "Advanced Machine Learning Theory", credits: 3, type: "Core", instructor: "Dr. Nafisa Haque" },
          { code: "DSAI-5102", title: "Mathematical Foundations for Data Science", credits: 3, type: "Core", instructor: "Dr. Selim Reza" },
          { code: "DSAI-5103", title: "Distributed Big Data Systems", credits: 3, type: "Core", instructor: "Prof. Dr. Mahmud Hasan" },
        ],
      },
      {
        semesterNumber: 2,
        title: "Semester 2",
        termName: "Spring 2026",
        status: "completed",
        feeStatus: "paid",
        tuitionFee: 55000,
        courses: [
          { code: "DSAI-5201", title: "Deep Neural Architectures & Transformers", credits: 3, type: "Core", prereq: "DSAI-5101", instructor: "Dr. Nafisa Haque" },
          { code: "DSAI-5202", title: "Natural Language Processing & LLMs", credits: 3, type: "Elective", instructor: "Prof. Dr. Ayesha Rahman" },
          { code: "DSAI-5203", title: "Computer Vision & Visual Intelligence", credits: 3, type: "Elective", instructor: "Dr. Sabbir Rahman" },
        ],
      },
      {
        semesterNumber: 3,
        title: "Semester 3",
        termName: "Fall 2026",
        status: "current",
        feeStatus: "paid",
        tuitionFee: 55000,
        courses: [
          { code: "DSAI-6101", title: "Reinforcement Learning & Decision Making", credits: 3, type: "Core", prereq: "DSAI-5201", instructor: "Dr. Nafisa Haque", schedule: "Sun 18:00, Tue 18:00" },
          { code: "DSAI-6102", title: "AI Ethics, Governance & Safety", credits: 3, type: "Core", instructor: "Prof. Dr. Ayesha Rahman", schedule: "Mon 18:00, Wed 18:00" },
          { code: "DSAI-6100", title: "Graduate Thesis Proposal & Methodology", credits: 3, type: "Thesis", instructor: "Prof. Dr. Ayesha Rahman", schedule: "Fri 10:00" },
        ],
      },
      {
        semesterNumber: 4,
        title: "Semester 4",
        termName: "Spring 2027",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 55000,
        courses: [
          { code: "DSAI-6200", title: "Master of Science Thesis Defense", credits: 6, type: "Thesis", prereq: "DSAI-6100", instructor: "Prof. Dr. Ayesha Rahman" },
          { code: "DSAI-6201", title: "Graduate Research Colloquium", credits: 3, type: "Elective", instructor: "Prof. Dr. Mahmud Hasan" },
        ],
      },
    ],
  },
  {
    id: "prog-msc-swe",
    code: "MSC-SWE",
    title: "Master of Science in Software Engineering & Cybersecurity",
    degreeType: "M.Sc.",
    totalCredits: 36,
    totalSemesters: 4,
    admissionFee: 20000,
    semesterTuition: 52000,
    department: "Computer Science & Engineering",
    description: "Postgraduate curriculum focused on enterprise software architecture, cloud microservices, and zero-trust cybersecurity.",
    semesters: [
      {
        semesterNumber: 1,
        title: "Semester 1",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 52000,
        courses: [
          { code: "SWE-5101", title: "Enterprise Software Architecture", credits: 3, type: "Core" },
          { code: "SWE-5102", title: "Advanced Cybersecurity Principles", credits: 3, type: "Core" },
          { code: "SWE-5103", title: "Cloud Native Microservices", credits: 3, type: "Core" },
        ],
      },
      {
        semesterNumber: 2,
        title: "Semester 2",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 52000,
        courses: [
          { code: "SWE-5201", title: "DevSecOps & Automated Reliability", credits: 3, type: "Core" },
          { code: "SWE-5202", title: "Cryptography & Blockchain Engineering", credits: 3, type: "Core" },
        ],
      },
      {
        semesterNumber: 3,
        title: "Semester 3",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 52000,
        courses: [
          { code: "SWE-6101", title: "Software Quality Engineering", credits: 3, type: "Core" },
          { code: "SWE-6100", title: "Thesis Proposal", credits: 3, type: "Thesis" },
        ],
      },
      {
        semesterNumber: 4,
        title: "Semester 4",
        status: "locked",
        feeStatus: "due",
        tuitionFee: 52000,
        courses: [
          { code: "SWE-6200", title: "Master Thesis & Defense", credits: 6, type: "Thesis" },
        ],
      },
    ],
  },
  {
    id: "prog-bsc-eee",
    code: "BSC-EEE",
    title: "Bachelor of Science in Electrical & Electronic Engineering",
    degreeType: "B.Sc.",
    totalCredits: 144,
    totalSemesters: 8,
    admissionFee: 15000,
    semesterTuition: 46000,
    department: "Electrical & Electronic Engineering",
    description: "4-year engineering curriculum covering power electronics, telecommunications, and VLSI microchip design.",
    semesters: [],
  },
  {
    id: "prog-bba-gen",
    code: "BBA-GEN",
    title: "Bachelor of Business Administration",
    degreeType: "BBA",
    totalCredits: 124,
    totalSemesters: 8,
    admissionFee: 15000,
    semesterTuition: 40000,
    department: "Business Administration",
    description: "Comprehensive business management degree with concentrations in Finance, Marketing, and Supply Chain.",
    semesters: [],
  },
];

export const INITIAL_ADMISSION_APPLICATIONS: AdmissionApplication[] = [
  {
    id: "APP-2026-0841",
    studentName: "Rafiul Karim",
    email: "student001@bidyapith.edu",
    phone: "+880 1712 445566",
    programId: "prog-bsc-cse",
    programTitle: "B.Sc. in Computer Science & Engineering",
    degreeType: "B.Sc.",
    previousDegree: "Higher Secondary Certificate (HSC) Science",
    previousCgpa: "5.00 / 5.00",
    status: "ENROLLED",
    submittedAt: "2024-01-05",
    reviewedAt: "2024-01-08",
    admissionFee: 15000,
    isPaid: true,
    notes: "Verified top merit candidate. Admission fee paid via bKash.",
  },
  {
    id: "APP-2026-0922",
    studentName: "Tahsin Mahmud",
    email: "tahsin.m@gmail.com",
    phone: "+880 1715 889900",
    programId: "prog-msc-dsai",
    programTitle: "M.Sc. in Data Science & Artificial Intelligence",
    degreeType: "M.Sc.",
    previousDegree: "B.Sc. in CSE (First Class Honours)",
    previousCgpa: "3.84 / 4.00",
    status: "APPROVED",
    submittedAt: "2026-09-12",
    reviewedAt: "2026-09-20",
    admissionFee: 20000,
    isPaid: false,
    notes: "Approved by Admission Committee. Eligible for admission fee payment.",
  },
  {
    id: "APP-2026-0935",
    studentName: "Farzana Binte Karim",
    email: "farzana.karim@gmail.com",
    phone: "+880 1718 112233",
    programId: "prog-bsc-cse",
    programTitle: "B.Sc. in Computer Science & Engineering",
    degreeType: "B.Sc.",
    previousDegree: "HSC Science (Dhaka Board)",
    previousCgpa: "4.95 / 5.00",
    status: "PENDING_REVIEW",
    submittedAt: "2026-09-24",
    admissionFee: 15000,
    isPaid: false,
    notes: "Documents submitted. Awaiting credential verification.",
  },
  {
    id: "APP-2026-0940",
    studentName: "Zubair Al Mahir",
    email: "zubair.mahir@gmail.com",
    phone: "+880 1719 334455",
    programId: "prog-msc-swe",
    programTitle: "M.Sc. in Software Engineering",
    degreeType: "M.Sc.",
    previousDegree: "B.Sc. in Computer Science",
    previousCgpa: "3.72 / 4.00",
    status: "APPROVED",
    submittedAt: "2026-09-18",
    reviewedAt: "2026-09-22",
    admissionFee: 20000,
    isPaid: false,
    notes: "Academic board approved. Admission payment link active.",
  },
];

export const SAMPLE_GRADUATION_CERTIFICATE: GraduationCertificate = {
  certificateNumber: "BU-2026-DEG-884920",
  studentName: "Rafiul Karim",
  studentId: "2024-BSC-CSE-1001",
  programTitle: "Bachelor of Science in Computer Science & Engineering",
  degreeType: "Bachelor of Science",
  cgpa: 3.82,
  creditsCompleted: 140,
  honors: "Summa Cum Laude (Highest Distinction)",
  graduationDate: "September 25, 2026",
  issueDate: "September 28, 2026",
  chancellorName: "Prof. Dr. M. Shamsul Alam",
  registrarName: "Sabina Yeasmin",
  verificationHash: "0x8f2d4e7a91c3b5d2e0f81a74c6e93b1d5a7f2e4c",
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.[0] || "U").toUpperCase();
  const first = parts[0]?.[0] || "";
  const last = parts[parts.length - 1]?.[0] || "";
  return `${first}${last}`.toUpperCase();
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatTaka(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString("en-US")}`;
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return "just now";
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return "recent";
  }
}

export function computeGrade(total: number): [string, number] {
  if (total >= 80) return ["A+", 4.0];
  if (total >= 75) return ["A", 3.75];
  if (total >= 70) return ["A-", 3.5];
  if (total >= 65) return ["B+", 3.25];
  if (total >= 60) return ["B", 3.0];
  if (total >= 55) return ["B-", 2.75];
  if (total >= 50) return ["C+", 2.5];
  if (total >= 45) return ["C", 2.25];
  if (total >= 40) return ["D", 2.0];
  return ["F", 0.0];
}

export const APP_SESSIONS: Record<string, UserSession> = {
  student: {
    role: "student",
    name: "Rafiul Karim",
    id: "2024-BSC-CSE-1001",
    email: "student001@bidyapith.edu",
    dept: "cse",
    program: "B.Sc. in Computer Science & Engineering",
    batch: "2024",
    advisor: "Prof. Dr. Ayesha Rahman",
    phone: "+880 1712 445566",
    altEmail: "rafiul.personal@gmail.com",
    address: "House 24, Road 7, Dhanmondi, Dhaka-1209",
    admitted: "2024-01-15",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  },
  instructor: {
    role: "instructor",
    name: "Prof. Dr. Ayesha Rahman",
    id: "FAC-0101",
    email: "ayesha.rahman@bidyapith.edu",
    dept: "cse",
    program: "Professor & Head, CSE",
    batch: "",
    office: "Sun & Tue, 2–4 PM · Room 512",
    phone: "+880 1711 223344",
    altEmail: "ayesha.rahman.academic@gmail.com",
    address: "Faculty Quarter 4B, University Campus, Dhaka",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  },
  admin: {
    role: "admin",
    name: "Parvej Admin",
    id: "ADM-0001",
    email: "devparvejme@gmail.com",
    dept: "Admin",
    program: "System Administrator",
    batch: "",
    office: "Administration Block, Room 101",
    phone: "+880 1700 000002",
    altEmail: "parvej.admin@gmail.com",
    address: "Admin Residence 12A, Uttara Sector 4, Dhaka",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  },
};

const BANGLA_FIRST_NAMES = [
  'Rafiul', 'Ayesha', 'Tanvir', 'Sabina', 'Mahmud', 'Nusrat', 'Kamal', 'Farhana',
  'Shahriar', 'Sadia', 'Rezaul', 'Mitali', 'Nafisa', 'Sharmin', 'Imran', 'Tariq',
  'Farid', 'Tasnim', 'Sabbir', 'Anisur', 'Sumaiya', 'Rakib', 'Nazmul', 'Mehedi',
  'Tahsin', 'Samira', 'Zubair', 'Lamia', 'Fahim', 'Nabila', 'Ahsan', 'Tamanna',
  'Jubayer', 'Ishrat', 'Asif', 'Rubaba', 'Saad', 'Munira', 'Arman', 'Raisa',
  'Shakib', 'Anika', 'Rifat', 'Nafis', 'Suhana', 'Moin', 'Afia', 'Zayan',
  'Rumana', 'Tanzeem', 'Shazia', 'Adnan', 'Zareen', 'Faiaz', 'Bushra', 'Salman',
  'Fariha', 'Habib', 'Sania', 'Rayhan', 'Jannat', 'Mahir', 'Mahira', 'Siam',
  'Suraiya', 'Nahian', 'Tasfia', 'Kazi', 'Mahnur', 'Zawad', 'Samia', 'Ibtisam',
  'Shadman', 'Nawrin', 'Maruf', 'Lubna', 'Tamjid', 'Sadaf', 'Tanjim', 'Afreen',
  'Wasif', 'Nuzhat', 'Farhan', 'Naveed', 'Zubeda', 'Munim', 'Abrar', 'Ateeq',
  'Faheem', 'Samiya', 'Sharaf', 'Nayeed', 'Subah', 'Rownak', 'Sifat', 'Naim'
];

const BANGLA_LAST_NAMES = [
  'Karim', 'Rahman', 'Ahmed', 'Yeasmin', 'Hasan', 'Jahan', 'Hossain', 'Islam',
  'Kabir', 'Noor', 'Karim', 'Saha', 'Haque', 'Akter', 'Chowdhury', 'Hasan',
  'Uddin', 'Khan', 'Mia', 'Reza', 'Binte Karim', 'Huda', 'Alam', 'Mahmood',
  'Talukder', 'Sikder', 'Bhuiyan', 'Molla', 'Mirza', 'Siddiqui', 'Majumder', 'Dewan'
];

const PROGS = ['BSC-CSE', 'BSC-EEE', 'BSC-CIV', 'BBA-GEN', 'BSC-MAT', 'BSC-PHY', 'BA-ENG', 'LLB-HON', 'BPH-PRO', 'BSS-ECO'];
const DEPTS = ['cse', 'eee', 'civ', 'bba', 'mat', 'phy', 'eng', 'law', 'pha', 'eco'];

// Generate 100 students for admin user list
const GENERATED_STUDENTS: AdminUser[] = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1;
  const padded = String(n).padStart(3, '0');
  const prog = PROGS[(n - 1) % PROGS.length]!;
  const dept = DEPTS[(n - 1) % DEPTS.length]!;
  const first = BANGLA_FIRST_NAMES[(n - 1) % BANGLA_FIRST_NAMES.length]!;
  const last = BANGLA_LAST_NAMES[(n * 3) % BANGLA_LAST_NAMES.length]!;
  return {
    id: `2024-${prog}-${String(1000 + n)}`,
    name: `${first} ${last}`,
    email: `student${padded}@bidyapith.edu`,
    role: "student",
    dept,
    status: n === 35 ? "suspended" : n === 80 ? "graduated" : "active",
    joined: `202${3 + (n % 4)}-01-15`,
  };
});

const INSTRUCTOR_USERS: AdminUser[] = [
  { id: "FAC-0101", name: "Prof. Dr. Ayesha Rahman", email: "ayesha.rahman@bidyapith.edu", role: "instructor", dept: "cse", status: "active", joined: "2009-01-15" },
  { id: "FAC-0102", name: "Dr. Tanvir Ahmed", email: "tanvir.ahmed@bidyapith.edu", role: "instructor", dept: "cse", status: "active", joined: "2012-08-01" },
  { id: "FAC-0103", name: "Dr. Nafisa Haque", email: "nafisa.haque@bidyapith.edu", role: "instructor", dept: "cse", status: "active", joined: "2019-01-10" },
  { id: "FAC-0104", name: "Dr. Sabbir Rahman", email: "sabbir.rahman@bidyapith.edu", role: "instructor", dept: "cse", status: "active", joined: "2020-07-15" },
  { id: "FAC-0105", name: "Prof. Dr. Mahmud Hasan", email: "mahmud.hasan@bidyapith.edu", role: "instructor", dept: "cse", status: "active", joined: "2008-01-15" },
  { id: "FAC-0106", name: "Sabina Yasmin", email: "sabina.yasmin@bidyapith.edu", role: "instructor", dept: "cse", status: "active", joined: "2022-01-15" },
  { id: "FAC-0107", name: "Prof. Dr. Kamal Hossain", email: "kamal.hossain@bidyapith.edu", role: "instructor", dept: "eee", status: "active", joined: "2006-01-15" },
  { id: "FAC-0108", name: "Dr. Rubel Mia", email: "rubel.mia@bidyapith.edu", role: "instructor", dept: "eee", status: "active", joined: "2014-01-15" },
  { id: "FAC-0109", name: "Dr. Farhana Tasnim", email: "farhana.tasnim@bidyapith.edu", role: "instructor", dept: "eee", status: "active", joined: "2018-01-15" },
  { id: "FAC-0110", name: "Dr. Nusrat Jahan", email: "nusrat.jahan@bidyapith.edu", role: "instructor", dept: "civ", status: "active", joined: "2013-01-15" },
  { id: "FAC-0111", name: "Dr. Imran Chowdhury", email: "imran.chowdhury@bidyapith.edu", role: "instructor", dept: "civ", status: "active", joined: "2017-01-15" },
  { id: "FAC-0112", name: "Prof. Dr. Shahriar Kabir", email: "shahriar.kabir@bidyapith.edu", role: "instructor", dept: "bba", status: "active", joined: "2004-01-15" },
  { id: "FAC-0113", name: "Dr. Sharmin Akter", email: "sharmin.akter@bidyapith.edu", role: "instructor", dept: "bba", status: "active", joined: "2018-01-15" },
  { id: "FAC-0114", name: "Dr. Rakib Hasan", email: "rakib.hasan@bidyapith.edu", role: "instructor", dept: "bba", status: "active", joined: "2020-01-15" },
  { id: "FAC-0115", name: "Dr. Selim Reza", email: "selim.reza@bidyapith.edu", role: "instructor", dept: "mat", status: "active", joined: "2005-01-15" },
  { id: "FAC-0116", name: "Dr. Sumaiya Karim", email: "sumaiya.karim@bidyapith.edu", role: "instructor", dept: "mat", status: "active", joined: "2016-01-15" },
  { id: "FAC-0117", name: "Prof. Dr. Mahfuz Alam", email: "mahfuz.alam@bidyapith.edu", role: "instructor", dept: "phy", status: "active", joined: "2007-01-15" },
  { id: "FAC-0118", name: "Dr. Sadia Noor", email: "sadia.noor@bidyapith.edu", role: "instructor", dept: "eng", status: "active", joined: "2015-01-15" },
  { id: "FAC-0119", name: "Prof. Dr. Rezaul Karim", email: "rezaul.karim@bidyapith.edu", role: "instructor", dept: "law", status: "active", joined: "2011-01-15" },
  { id: "FAC-0120", name: "Dr. Mitali Saha", email: "mitali.saha@bidyapith.edu", role: "instructor", dept: "pha", status: "active", joined: "2016-01-15" },
  { id: "FAC-0121", name: "Dr. Farhana Islam", email: "farhana.islam@bidyapith.edu", role: "instructor", dept: "eco", status: "active", joined: "2014-01-15" },
];

const ADMIN_USERS: AdminUser[] = [
  { id: "ADM-0001", name: "Parvej Admin", email: "devparvejme@gmail.com", role: "admin", status: "active", joined: "2022-01-01" },
  { id: "ADM-0002", name: "System Administrator", email: "admin@bidyapith.edu", role: "admin", status: "active", joined: "2020-01-01" },
  { id: "ADM-0003", name: "Sabina Yeasmin (Registrar)", email: "registrar@bidyapith.edu", role: "admin", status: "active", joined: "2015-06-01" },
  { id: "ADM-0004", name: "Prof. Dr. Kamal Hossain (Controller)", email: "controller@bidyapith.edu", role: "admin", status: "active", joined: "2016-01-01" },
  { id: "ADM-0005", name: "Md. Jahangir Alam (Admissions)", email: "admissions@bidyapith.edu", role: "admin", status: "active", joined: "2017-09-01" },
  { id: "ADM-0006", name: "Farzana Rahman (Finance)", email: "finance@bidyapith.edu", role: "admin", status: "active", joined: "2018-03-01" },
];

const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
];

// Roster students for instructor grading view
const ROSTER_STUDENTS: RosterStudent[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  const first = BANGLA_FIRST_NAMES[i % BANGLA_FIRST_NAMES.length]!;
  const last = BANGLA_LAST_NAMES[(i * 2) % BANGLA_LAST_NAMES.length]!;
  return {
    id: `2024-BSC-CSE-${String(1000 + n)}`,
    name: `${first} ${last}`,
    prog: "B.Sc. in CSE",
    mid: 22 + (i % 7),
    assign: 18 + (i % 3),
    final: i < 15 ? 42 + (i % 8) : null,
    att: 82 + (i % 18),
    avatar: STUDENT_AVATARS[i % STUDENT_AVATARS.length],
  };
});

export const APP_DATA = {
  term: {
    name: "Fall 2026",
    week: 6,
    of: 15,
    regOpens: "2026-09-02",
    regCloses: "2026-09-25",
    classesFrom: "2026-09-28",
  },

  /* Student mock data */
  student: {
    cgpa: 3.82,
    creditsDone: 96,
    creditsNeeded: 140,
    attendance: 94,
    standing: "Good standing",

    passed: ["CSE-1101", "CSE-1102", "CSE-1201", "MAT-1101", "PHY-1101", "ENG-1101", "EEE-1101"],

    gpaHistory: [
      { label: "Fall '24", value: 3.65 },
      { label: "Spring '25", value: 3.72 },
      { label: "Fall '25", value: 3.78 },
      { label: "Spring '26", value: 3.88 },
    ],

    enrolled: [
      {
        code: "CSE-2201",
        title: "Data Structures & Algorithms",
        section: "A",
        credits: 3,
        instructor: "Prof. Dr. Mahmud Hasan",
        room: "AB2-402",
        slots: ["Mon 10:30", "Wed 10:30"],
        attendance: 96,
        marks: 88,
      },
      {
        code: "CSE-2303",
        title: "Database Systems",
        section: "A",
        credits: 3,
        instructor: "Dr. Tanvir Ahmed",
        room: "AB2-305",
        slots: ["Tue 09:00", "Thu 09:00"],
        attendance: 92,
        marks: 81,
      },
      {
        code: "CSE-4108",
        title: "Artificial Intelligence & Machine Learning",
        section: "A",
        credits: 3,
        instructor: "Dr. Nafisa Haque",
        room: "AB3-208",
        slots: ["Thu 14:00", "Sat 14:00"],
        attendance: 98,
        marks: 92,
      },
      {
        code: "MAT-2101",
        title: "Linear Algebra",
        section: "A",
        credits: 3,
        instructor: "Dr. Selim Reza",
        room: "AB1-114",
        slots: ["Tue 14:30", "Thu 14:30"],
        attendance: 88,
        marks: 76,
      },
    ] as StudentCourse[],

    cart: [] as StudentCourse[],

    transcript: [
      {
        term: "Spring 2026",
        gpa: 3.88,
        credits: 15,
        rows: [
          { code: "CSE-1201", title: "Discrete Mathematics", credits: 3, grade: "A+", point: 4.0 },
          { code: "CSE-2202", title: "Object-Oriented Programming", credits: 3, grade: "A", point: 3.75 },
          { code: "MAT-1201", title: "Calculus II", credits: 3, grade: "A+", point: 4.0 },
          { code: "EEE-1101", title: "Basic Electrical Engineering", credits: 3, grade: "A-", point: 3.5 },
          { code: "ENG-1101", title: "English Composition", credits: 3, grade: "A", point: 3.75 },
        ],
      },
      {
        term: "Fall 2025",
        gpa: 3.75,
        credits: 16.5,
        rows: [
          { code: "CSE-1101", title: "Introduction to Programming", credits: 3, grade: "A+", point: 4.0 },
          { code: "CSE-1102", title: "Programming Lab", credits: 1.5, grade: "A+", point: 4.0 },
          { code: "MAT-1101", title: "Calculus I", credits: 3, grade: "A", point: 3.75 },
          { code: "PHY-1101", title: "Physics I", credits: 3, grade: "B+", point: 3.25 },
        ],
      },
    ] as TranscriptTerm[],

    invoices: [
      {
        id: "INV-2026-1001",
        title: "Fall 2026 Tuition (12 credits)",
        amount: 45000,
        due: "2026-10-10",
        status: "due",
      },
      {
        id: "INV-2026-0982",
        title: "Registration & Activity Fee",
        amount: 5000,
        due: "2026-09-15",
        status: "paid",
        method: "bKash",
        paid: "2026-09-08",
        txn: "TXN-984210",
      },
      {
        id: "INV-2026-0412",
        title: "Spring 2026 Tuition (15 credits)",
        amount: 54000,
        due: "2026-02-15",
        status: "paid",
        method: "Stripe Card",
        paid: "2026-02-10",
        txn: "TXN-881944",
      },
    ] as Invoice[],

    scheduleToday: [
      { time: "09:00 - 10:30", code: "CSE-2303", section: "A", room: "AB2-305", state: "done" },
      { time: "10:30 - 12:00", code: "CSE-2201", section: "A", room: "AB2-402", state: "now" },
      { time: "14:00 - 15:30", code: "MAT-2101", section: "A", room: "AB1-114", state: "next" },
    ] as ScheduleItem[],

    attendanceLog: [
      { code: "CSE-2201", held: 12, present: 11, late: 1, absent: 0, pct: 96 },
      { code: "CSE-2303", held: 12, present: 11, late: 0, absent: 1, pct: 92 },
      { code: "CSE-4108", held: 10, present: 10, late: 0, absent: 0, pct: 100 },
      { code: "MAT-2101", held: 12, present: 10, late: 1, absent: 1, pct: 88 },
    ] as AttendanceLogRecord[],

    attendanceLogs: [
      { code: "CSE-2201", held: 12, present: 11, late: 1, absent: 0, pct: 96 },
      { code: "CSE-2303", held: 12, present: 11, late: 0, absent: 1, pct: 92 },
      { code: "CSE-4108", held: 10, present: 10, late: 0, absent: 0, pct: 100 },
      { code: "MAT-2101", held: 12, present: 10, late: 1, absent: 1, pct: 88 },
    ] as AttendanceLogRecord[],

    notices: [
      { t: "Fall 2026 Registration Open", m: "Complete your online course registration before 25 September.", tone: "orchid" },
      { t: "Midterm Schedule Published", m: "Midterm exams commence on 18 October. Check the exam portal for seat allocations.", tone: "gold" },
      { t: "Tuition Due Reminder", m: "Please clear your Fall 2026 tuition dues by 10 October.", tone: "rose" },
    ] as NoticeItem[],
  },

  /* Instructor mock data */
  instructor: {
    sections: [
      {
        id: "sec-cse-2201",
        code: "CSE-2201",
        title: "Data Structures & Algorithms",
        section: "A",
        room: "AB2-402",
        slots: ["Mon 10:30", "Wed 10:30"],
        enrolled: 42,
        capacity: 45,
        gradesSubmitted: false,
        avgAttendance: 94,
      },
      {
        id: "sec-cse-4210",
        code: "CSE-4210",
        title: "Distributed Systems",
        section: "A",
        room: "AB2-405",
        slots: ["Sun 09:00", "Tue 09:00"],
        enrolled: 36,
        capacity: 40,
        gradesSubmitted: true,
        avgAttendance: 91,
      },
    ] as InstructorSection[],

    today: [
      { time: "09:00 - 10:30", code: "CSE-4210", section: "A", room: "AB2-405", state: "done" },
      { time: "10:30 - 12:00", code: "CSE-2201", section: "A", room: "AB2-402", state: "now" },
      { time: "14:00 - 15:30", code: "CSE-2201", section: "B", room: "AB2-403", state: "next" },
    ] as ScheduleItem[],

    roster: ROSTER_STUDENTS,

    queue: [
      { t: "Grade Submission Deadline", m: "Submit Fall 2026 continuous assessment marks by 20 October.", tone: "gold" },
      { t: "Advisory Clearance", m: "14 assigned advisees are waiting for course registration approval.", tone: "orchid" },
    ] as NoticeItem[],
  },

  /* Admin mock data */
  admin: {
    kpi: {
      students: 9240,
      faculty: 312,
      revenue: 124800000,
      pending: 14,
    },

    admissionsTrend: [
      { label: "Jun", value: 340 },
      { label: "Jul", value: 680 },
      { label: "Aug", value: 1420 },
      { label: "Sep", value: 2480 },
    ],

    bySchool: [
      { label: "Engineering", value: 4200, color: "#2ED3A7" },
      { label: "Business", value: 3100, color: "#9B8CFF" },
      { label: "Science", value: 2400, color: "#FFB454" },
      { label: "Arts & Law", value: 2700, color: "#6FD8FF" },
    ],

    collections: [
      { label: "Tuition", value: 8.4 },
      { label: "Admission", value: 2.1 },
      { label: "Exam Fee", value: 1.2 },
      { label: "Late Fees", value: 0.7 },
    ],

    users: [...ADMIN_USERS, ...INSTRUCTOR_USERS, ...GENERATED_STUDENTS],

    sections: [
      { code: "CSE-1101", title: "Introduction to Programming", section: "A", instructor: "Sabina Yasmin", room: "AB2-401", enrolled: 45, capacity: 45, status: "full" },
      { code: "CSE-2201", title: "Data Structures & Algorithms", section: "A", instructor: "Prof. Dr. Mahmud Hasan", room: "AB2-402", enrolled: 42, capacity: 45, status: "open" },
      { code: "CSE-2303", title: "Database Systems", section: "A", instructor: "Dr. Tanvir Ahmed", room: "AB2-305", enrolled: 41, capacity: 45, status: "open" },
      { code: "CSE-4108", title: "Machine Learning & AI", section: "A", instructor: "Dr. Nafisa Haque", room: "AB3-208", enrolled: 45, capacity: 45, status: "full" },
      { code: "EEE-1101", title: "Basic Electrical Engineering", section: "A", instructor: "Prof. Dr. Kamal Hossain", room: "AB1-201", enrolled: 38, capacity: 45, status: "open" },
      { code: "MAT-1101", title: "Calculus I", section: "A", instructor: "Dr. Selim Reza", room: "AB1-112", enrolled: 44, capacity: 45, status: "open" },
      { code: "BBA-1101", title: "Principles of Management", section: "A", instructor: "Prof. Dr. Shahriar Kabir", room: "AB4-101", enrolled: 40, capacity: 50, status: "open" },
      { code: "LAW-1101", title: "Jurisprudence", section: "A", instructor: "Prof. Dr. Rezaul Karim", room: "AB4-301", enrolled: 35, capacity: 40, status: "open" },
    ] as AdminSection[],

    payments: [
      { id: "PAY-2026-901", student: "Rafiul Karim", sid: "2024-BSC-CSE-1001", amount: 5000, method: "bKash", status: "success", at: "2026-09-08 11:24", ref: "TXN-984210" },
      { id: "PAY-2026-902", student: "Ayesha Rahman", sid: "2024-BSC-CSE-1002", amount: 45000, method: "Stripe Card", status: "success", at: "2026-09-08 14:10", ref: "TXN-984211" },
      { id: "PAY-2026-903", student: "Tanvir Ahmed", sid: "2024-BSC-EEE-1003", amount: 42000, method: "SSLCommerz", status: "success", at: "2026-09-09 09:40", ref: "TXN-984212" },
      { id: "PAY-2026-904", student: "Sabina Yeasmin", sid: "2024-BBA-1004", amount: 38000, method: "bKash", status: "pending", at: "2026-09-09 16:30", ref: "TXN-984213" },
      { id: "PAY-2026-905", student: "Imran Chowdhury", sid: "2024-BSC-CIV-1005", amount: 40000, method: "Stripe Card", status: "success", at: "2026-09-10 10:15", ref: "TXN-984214" },
    ] as PaymentTransaction[],

    audit: [
      { at: "2026-09-28 03:10:00", actor: "System Seed", role: "system", action: "db.seed", target: "University DB", detail: "Seeded 100 students, 25 instructors, 10 departments, 6 admins", tone: "orchid" },
      { at: "2026-09-28 02:45:12", actor: "Parvej Admin", role: "admin", action: "semester.status", target: "Fall 2026", detail: "Status updated to REGISTRATION", tone: "gold" },
      { at: "2026-09-28 01:12:00", actor: "Prof. Dr. Ayesha Rahman", role: "instructor", action: "grade.submit", target: "CSE-4210 Sec A", detail: "Grade sheet submitted to exam controller", tone: "" },
      { at: "2026-09-27 18:20:44", actor: "System Gateway", role: "system", action: "payment.webhook", target: "INV-2026-0982", detail: "bKash payment IPN verified ৳5,000", tone: "orchid" },
    ] as AuditRecord[],
  },
};
