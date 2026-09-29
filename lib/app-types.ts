export type Role = "student" | "instructor" | "admin";
export type AdmissionStatus = "PENDING_REVIEW" | "APPROVED" | "PAYMENT_PENDING" | "ENROLLED" | "GRADUATED" | "REJECTED";

export interface CurriculumCourse {
  code: string;
  title: string;
  credits: number;
  prereq?: string;
  instructor?: string;
  type: "Core" | "Lab" | "General" | "Elective" | "Thesis";
  room?: string;
  schedule?: string;
}

export interface SemesterCurriculum {
  semesterNumber: number;
  title: string;
  termName?: string;
  status: "completed" | "current" | "locked";
  feeStatus: "paid" | "due" | "unlocked";
  tuitionFee: number;
  courses: CurriculumCourse[];
}

export interface DegreeProgram {
  id: string;
  code: string;
  title: string;
  name?: string;
  degreeType: "B.Sc." | "M.Sc." | "BBA" | "MBA";
  totalCredits: number;
  totalSemesters: number;
  durationSemesters?: number;
  admissionFee: number;
  semesterTuition: number;
  department: string;
  description: string;
  semesters: SemesterCurriculum[];
}

export interface AttachedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface AdmissionApplication {
  id: string;
  studentName: string;
  email?: string;
  studentEmail?: string;
  phone: string;
  programId: string;
  programTitle: string;
  programName?: string;
  degreeType?: "B.Sc." | "M.Sc.";
  applicationType?: "DEGREE_ADMISSION" | "COURSE_REGISTRATION";
  courseCode?: string;
  courseTitle?: string;
  courseCredits?: number;
  previousDegree?: string;
  previousInstitute?: string;
  previousCgpa?: string;
  hscGpa?: string;
  bachelorGpa?: string;
  status: AdmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  admissionFee: number;
  isPaid?: boolean;
  paymentStatus?: "PAID" | "PENDING";
  attachedDocuments?: AttachedDocument[];
  motivationStatement?: string;
  notes?: string;
}


export interface GraduationCertificate {
  certificateNumber: string;
  studentName: string;
  studentId: string;
  programTitle: string;
  degreeType: string;
  cgpa: number;
  creditsCompleted: number;
  honors: string;
  graduationDate: string;
  issueDate: string;
  chancellorName: string;
  registrarName: string;
  verificationHash: string;
}

export interface UserSession {
  role: Role;
  name: string;
  id: string;
  email: string;
  dept?: string;
  program?: string;
  programId?: string;
  degreeType?: "B.Sc." | "M.Sc.";
  admissionStatus?: AdmissionStatus;
  currentSemester?: number;
  batch?: string;
  advisor?: string;
  office?: string;
  phone: string;
  admitted?: string;
  avatar?: string;
  altEmail?: string;
  address?: string;
}

export interface StudentCourse {
  code: string;
  title: string;
  section: string;
  credits: number;
  instructor: string;
  room: string;
  slots: string[];
  attendance: number;
  marks: number;
}

export interface AttendanceLogRecord {
  code: string;
  held: number;
  present: number;
  late: number;
  absent: number;
  pct?: number;
}

export interface TermResultRow {
  code: string;
  title: string;
  credits: number;
  grade: string;
  point: number;
}

export interface TranscriptTerm {
  term: string;
  gpa: number;
  credits: number;
  rows: TermResultRow[];
}

export interface Invoice {
  id: string;
  title: string;
  amount: number;
  due: string;
  status: "due" | "paid" | "processing" | "refunded";
  method?: string;
  paid?: string;
  txn?: string;
}

export interface NoticeItem {
  id?: string;
  t: string;
  m: string;
  tone?: "gold" | "rose" | "orchid" | "jade" | "";
  time?: string;
  link?: string;
  read?: boolean;
}

export interface InstructorSection {
  id: string;
  code: string;
  title: string;
  section: string;
  room: string;
  slots: string[];
  enrolled: number;
  capacity: number;
  gradesSubmitted: boolean;
  avgAttendance: number;
}

export interface RosterStudent {
  id: string;
  name: string;
  prog: string;
  mid: number;
  assign: number;
  final: number | null;
  att: number;
  avatar?: string;
}

export interface ScheduleItem {
  time: string;
  code: string;
  section: string;
  room: string;
  state: "done" | "now" | "next";
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  dept?: string;
  status: "active" | "suspended" | "graduated" | "on leave";
  joined: string;
  avatar?: string;
}

export interface PaymentTransaction {
  id: string;
  student: string;
  sid: string;
  amount: number;
  method: string;
  status: "success" | "pending" | "failed" | "refunded";
  at: string;
  ref: string;
}

export interface AuditRecord {
  at: string;
  actor: string;
  role: "admin" | "instructor" | "student" | "system";
  action: string;
  target: string;
  detail: string;
  tone?: "gold" | "rose" | "orchid" | "jade" | "";
}

export interface AdminSection {
  code: string;
  title: string;
  section: string;
  instructor: string;
  room: string;
  enrolled: number;
  capacity: number;
  status: "open" | "full" | "retired";
}
