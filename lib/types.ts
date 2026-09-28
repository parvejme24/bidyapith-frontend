export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type SiteMeta = {
  name: string;
  bangla: string;
  founded: number;
  semester: string;
  admissionCloses: string;
  address: string;
  phone: string;
  email: string;
};

export type Stat = {
  label: string;
  value: number;
  suffix: string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type EnrolmentSlice = ChartPoint & {
  color: string;
};

export type SeatFill = {
  label: string;
  filled: number;
  total: number;
};

export type Department = {
  id: string;
  name: string;
  school: string;
  head: string;
  programs: number;
  courses: number;
  faculty: number;
};

export type Program = {
  code: string;
  name: string;
  dept: string;
  school: string;
  level: string;
  credits: number;
  years: number;
  seats: number;
  filled: number;
  tuition: number;
  tag: string;
  about: string;
  highlights: string[];
};

export type Course = {
  code: string;
  title: string;
  dept: string;
  credits: number;
  level: number;
  semester: string;
  prereq: string;
  instructor: string;
  seats: number;
  taken: number;
};

export type FacultyMember = {
  name: string;
  dept: string;
  role: string;
  field: string;
  email: string;
  office: string;
  since: number;
  papers: number;
  bio: string;
  avatar?: string;
};

export type Notice = {
  id: number;
  title: string;
  date: string;
  type: string;
  pinned: boolean;
  body: string;
};

export type CampusEvent = {
  title: string;
  date: string;
  place: string;
  time: string;
};

export type AdmissionStep = {
  title: string;
  text: string;
};

export type KeyDate = {
  label: string;
  date: string;
  status: "done" | "live" | "next";
};

export type FeeRow = {
  program: string;
  admission: number;
  perCredit: number;
  semester: number;
  total: number;
};

export type Scholarship = {
  name: string;
  cover: string;
  who: string;
  accent: "jade" | "gold" | "orchid" | "rose";
};

export type Faq = {
  q: string;
  a: string;
};

export type Voice = {
  name: string;
  meta: string;
  quote: string;
  av: 1 | 2 | 3 | 4;
};

export type Milestone = {
  year: string;
  title: string;
  text: string;
};

export type Leader = {
  name: string;
  role: string;
  note: string;
  av: 1 | 2 | 3 | 4;
};

export type Database = {
  meta: SiteMeta;
  stats: Stat[];
  enrolment: EnrolmentSlice[];
  intake: ChartPoint[];
  registrations: ChartPoint[];
  seats: SeatFill[];
  departments: Department[];
  programs: Program[];
  courses: Course[];
  faculty: FacultyMember[];
  notices: Notice[];
  events: CampusEvent[];
  admissionSteps: AdmissionStep[];
  keyDates: KeyDate[];
  fees: FeeRow[];
  scholarships: Scholarship[];
  faqs: Faq[];
  voices: Voice[];
  milestones: Milestone[];
  leadership: Leader[];
};

export type Collection = keyof Database;
