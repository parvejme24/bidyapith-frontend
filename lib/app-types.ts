export type Role = "student" | "instructor" | "admin";

export interface UserSession {
  role: Role;
  name: string;
  id: string;
  email: string;
  dept?: string;
  program?: string;
  batch?: string;
  advisor?: string;
  office?: string;
  phone: string;
  admitted?: string;
  avatar?: string;
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
  t: string;
  m: string;
  tone?: "gold" | "rose" | "orchid" | "";
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
  tone?: "gold" | "rose" | "orchid" | "";
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
