import type {
  AdminSection,
  AdminUser,
  AttendanceLogRecord,
  AuditRecord,
  InstructorSection,
  Invoice,
  NoticeItem,
  PaymentTransaction,
  RosterStudent,
  ScheduleItem,
  StudentCourse,
  TranscriptTerm,
  UserSession,
} from "./app-types";

export const APP_SESSIONS: Record<string, UserSession> = {
  student: {
    role: "student",
    name: "Rafiul Karim",
    id: "2022-1-60-041",
    email: "rafiul.karim@student.bidyapith.edu.bd",
    dept: "cse",
    program: "B.Sc. in Computer Science & Engineering",
    batch: "Batch 22",
    advisor: "Dr. Tanvir Ahmed",
    phone: "+880 1712 445566",
    admitted: "2022-01-09",
    avatar: "",
  },
  instructor: {
    role: "instructor",
    name: "Prof. Dr. Ayesha Rahman",
    id: "FAC-0114",
    email: "ayesha.rahman@bidyapith.edu.bd",
    dept: "cse",
    program: "Professor & Head, CSE",
    batch: "",
    office: "Sun & Tue, 2–4 PM · Room 512",
    phone: "+880 1811 220044",
    avatar: "gold",
  },
  admin: {
    role: "admin",
    name: "Sabina Yeasmin",
    id: "ADM-0007",
    email: "registrar@bidyapith.edu.bd",
    dept: "",
    program: "Registrar",
    batch: "",
    office: "Administration block, Room 104",
    phone: "+880 1913 778899",
    avatar: "orchid",
  },
};

export const APP_DATA = {
  term: {
    name: "Fall 2026",
    week: 6,
    of: 15,
    regOpens: "2026-09-02",
    regCloses: "2026-09-14",
    classesFrom: "2026-09-21",
  },

  /* Student mock data */
  student: {
    cgpa: 3.71,
    creditsDone: 96,
    creditsNeeded: 148,
    attendance: 91,
    standing: "Good standing",

    enrolled: [
      {
        code: "CSE-3105",
        title: "Database Systems",
        section: "A",
        credits: 3,
        instructor: "Dr. Tanvir Ahmed",
        room: "AB2-401",
        slots: ["Sun 09:00", "Tue 09:00"],
        attendance: 94,
        marks: 78,
      },
      {
        code: "CSE-3210",
        title: "Operating Systems",
        section: "B",
        credits: 3,
        instructor: "Dr. Sabbir Rahman",
        room: "AB2-305",
        slots: ["Sun 11:00", "Wed 11:00"],
        attendance: 88,
        marks: 71,
      },
      {
        code: "CSE-4108",
        title: "Machine Learning",
        section: "A",
        credits: 3,
        instructor: "Dr. Nafisa Haque",
        room: "AB3-208",
        slots: ["Mon 14:00", "Wed 14:00"],
        attendance: 96,
        marks: 84,
      },
      {
        code: "MAT-2103",
        title: "Linear Algebra",
        section: "C",
        credits: 3,
        instructor: "Dr. Selim Reza",
        room: "AB1-112",
        slots: ["Tue 14:00", "Thu 14:00"],
        attendance: 82,
        marks: 66,
      },
      {
        code: "CSE-3106",
        title: "Database Systems Lab",
        section: "A",
        credits: 1,
        instructor: "Dr. Tanvir Ahmed",
        room: "Lab-3",
        slots: ["Thu 09:00"],
        attendance: 100,
        marks: 92,
      },
    ] as StudentCourse[],

    attendanceLog: [
      { code: "CSE-3105", held: 16, present: 15, late: 1, absent: 0 },
      { code: "CSE-3210", held: 16, present: 13, late: 1, absent: 2 },
      { code: "CSE-4108", held: 14, present: 13, late: 1, absent: 0 },
      { code: "MAT-2103", held: 17, present: 13, late: 2, absent: 2 },
      { code: "CSE-3106", held: 8, present: 8, late: 0, absent: 0 },
    ] as AttendanceLogRecord[],

    gpaHistory: [
      { label: "Sp 23", value: 3.42 },
      { label: "Fa 23", value: 3.55 },
      { label: "Sp 24", value: 3.61 },
      { label: "Fa 24", value: 3.78 },
      { label: "Sp 25", value: 3.84 },
      { label: "Fa 25", value: 3.79 },
    ],

    transcript: [
      {
        term: "Fall 2025",
        gpa: 3.79,
        credits: 15,
        rows: [
          { code: "CSE-3101", title: "Software Engineering", credits: 3, grade: "A", point: 4.0 },
          { code: "CSE-3204", title: "Computer Networks", credits: 3, grade: "A-", point: 3.7 },
          { code: "CSE-3110", title: "Theory of Computation", credits: 3, grade: "B+", point: 3.3 },
          { code: "MAT-3101", title: "Numerical Methods", credits: 3, grade: "A", point: 4.0 },
          { code: "ENG-2101", title: "Technical Writing", credits: 3, grade: "A-", point: 3.7 },
        ],
      },
      {
        term: "Spring 2025",
        gpa: 3.84,
        credits: 16,
        rows: [
          { code: "CSE-2201", title: "Data Structures & Algorithms", credits: 3, grade: "A", point: 4.0 },
          { code: "CSE-2205", title: "Digital Logic Design", credits: 3, grade: "A", point: 4.0 },
          { code: "CSE-2206", title: "Digital Logic Lab", credits: 1, grade: "A", point: 4.0 },
          { code: "MAT-2103", title: "Discrete Mathematics", credits: 3, grade: "A-", point: 3.7 },
          { code: "PHY-1101", title: "Physics I", credits: 3, grade: "B+", point: 3.3 },
          { code: "STA-2101", title: "Probability & Statistics", credits: 3, grade: "A", point: 4.0 },
        ],
      },
      {
        term: "Fall 2024",
        gpa: 3.78,
        credits: 15,
        rows: [
          { code: "CSE-1101", title: "Structured Programming", credits: 3, grade: "A", point: 4.0 },
          { code: "CSE-1102", title: "Programming Lab", credits: 1, grade: "A", point: 4.0 },
          { code: "MAT-1101", title: "Calculus I", credits: 3, grade: "A-", point: 3.7 },
          { code: "CHE-1101", title: "Chemistry", credits: 3, grade: "B+", point: 3.3 },
          { code: "ENG-1101", title: "English Composition", credits: 3, grade: "A", point: 4.0 },
          { code: "GED-1101", title: "Bangladesh Studies", credits: 2, grade: "A-", point: 3.7 },
        ],
      },
    ] as TranscriptTerm[],

    passed: [
      "CSE-1101",
      "CSE-2201",
      "CSE-2205",
      "MAT-1101",
      "MAT-2103",
      "PHY-1101",
      "CSE-3101",
      "CSE-3204",
      "EEE-1104",
    ],

    invoices: [
      { id: "INV-2026-0431", title: "Fall 2026 tuition — instalment 2", amount: 42500, due: "2026-09-15", status: "due", method: "" },
      { id: "INV-2026-0330", title: "Fall 2026 tuition — instalment 1", amount: 42500, due: "2026-08-15", status: "paid", method: "bKash", paid: "2026-08-11", txn: "8N4KQ2R7" },
      { id: "INV-2026-0295", title: "Course registration fee", amount: 3000, due: "2026-09-02", status: "paid", method: "Card", paid: "2026-09-02", txn: "TRX-99213" },
      { id: "INV-2026-0188", title: "Spring 2026 tuition — instalment 2", amount: 41000, due: "2026-03-15", status: "paid", method: "bKash", paid: "2026-03-14", txn: "5J1PX8W3" },
      { id: "INV-2026-0102", title: "Spring 2026 tuition — instalment 1", amount: 41000, due: "2026-02-15", status: "paid", method: "SSLCommerz", paid: "2026-02-12", txn: "SSL-77120" },
      { id: "INV-2025-0904", title: "Library fine", amount: 350, due: "2025-12-20", status: "paid", method: "Card", paid: "2025-12-18", txn: "TRX-88104" },
    ] as Invoice[],

    notices: [
      { t: "Registration closes in 8 days", m: "Add or drop courses before 14 September, 11:59 PM.", tone: "gold" },
      { t: "Instalment 2 due 15 September", m: "৳42,500 outstanding. A 2% late fee applies from 16 September.", tone: "rose" },
      { t: "CSE-4108 mid-term posted", m: "Machine Learning mid-term marks are visible in Results.", tone: "" },
      { t: "Advisor meeting booked", m: "Dr. Tanvir Ahmed, Sunday 11:30 AM, Room 512.", tone: "orchid" },
    ] as NoticeItem[],
  },

  /* Instructor mock data */
  instructor: {
    sections: [
      { id: "S1", code: "CSE-3105", title: "Database Systems", section: "A", room: "AB2-401", slots: ["Sun 09:00", "Tue 09:00"], enrolled: 41, capacity: 55, gradesSubmitted: false, avgAttendance: 92 },
      { id: "S2", code: "CSE-4210", title: "Distributed Systems", section: "A", room: "AB3-110", slots: ["Mon 11:00", "Wed 11:00"], enrolled: 27, capacity: 40, gradesSubmitted: false, avgAttendance: 87 },
      { id: "S3", code: "CSE-3106", title: "Database Systems Lab", section: "A", room: "Lab-3", slots: ["Thu 09:00"], enrolled: 41, capacity: 45, gradesSubmitted: true, avgAttendance: 96 },
      { id: "S4", code: "CSE-2201", title: "Data Structures & Algorithms", section: "C", room: "AB2-201", slots: ["Tue 14:00", "Thu 14:00"], enrolled: 58, capacity: 60, gradesSubmitted: false, avgAttendance: 84 },
    ] as InstructorSection[],

    roster: [
      { id: "2022-1-60-041", name: "Rafiul Karim", prog: "CSE", mid: 26, assign: 18, final: null, att: 94 },
      { id: "2022-1-60-044", name: "Nusaiba Haque", prog: "CSE", mid: 28, assign: 19, final: null, att: 98 },
      { id: "2022-1-60-052", name: "Tanjim Hasan", prog: "CSE", mid: 21, assign: 15, final: null, att: 82 },
      { id: "2022-1-60-058", name: "Sadia Islam", prog: "CSE", mid: 27, assign: 20, final: null, att: 96 },
      { id: "2022-1-60-063", name: "Mahin Chowdhury", prog: "CSE", mid: 19, assign: 14, final: null, att: 71 },
      { id: "2022-1-60-070", name: "Farhana Akter", prog: "CSE", mid: 25, assign: 17, final: null, att: 90 },
      { id: "2022-1-60-077", name: "Imran Sheikh", prog: "CSE", mid: 23, assign: 16, final: null, att: 88 },
      { id: "2022-1-60-081", name: "Anika Tabassum", prog: "CSE", mid: 29, assign: 20, final: null, att: 99 },
      { id: "2022-1-60-088", name: "Rakib Hossain", prog: "CSE", mid: 17, assign: 12, final: null, att: 64 },
      { id: "2022-1-60-092", name: "Sumaiya Noor", prog: "CSE", mid: 24, assign: 18, final: null, att: 92 },
      { id: "2022-1-60-097", name: "Jubayer Alam", prog: "CSE", mid: 22, assign: 15, final: null, att: 79 },
      { id: "2022-1-60-103", name: "Meherun Nesa", prog: "CSE", mid: 26, assign: 19, final: null, att: 95 },
    ] as RosterStudent[],

    today: [
      { time: "09:00", code: "CSE-3105", section: "A", room: "AB2-401", state: "done" },
      { time: "11:00", code: "CSE-4210", section: "A", room: "AB3-110", state: "now" },
      { time: "14:00", code: "CSE-2201", section: "C", room: "AB2-201", state: "next" },
    ] as ScheduleItem[],

    queue: [
      { t: "CSE-2201 section C grades due", m: "Deadline 20 September. 58 students, 0 submitted.", tone: "gold" },
      { t: "3 make-up requests", m: "Students asking for a make-up class in Distributed Systems.", tone: "orchid" },
      { t: "Attendance not taken", m: "CSE-3105 section A, Tuesday 9:00 slot.", tone: "rose" },
    ] as NoticeItem[],
  },

  /* Admin mock data */
  admin: {
    kpi: {
      students: 12480,
      faculty: 318,
      courses: 642,
      revenue: 48250000,
      pending: 37,
      activeSessions: 1943,
    },

    admissionsTrend: [
      { label: "Mar", value: 640 },
      { label: "Apr", value: 810 },
      { label: "May", value: 1180 },
      { label: "Jun", value: 1460 },
      { label: "Jul", value: 1720 },
      { label: "Aug", value: 2140 },
    ],

    bySchool: [
      { label: "Engineering", value: 4820, color: "#2ED3A7" },
      { label: "Business", value: 3140, color: "#FFB454" },
      { label: "Science", value: 1980, color: "#9B8CFF" },
      { label: "Arts", value: 1420, color: "#FF7E9D" },
      { label: "Law", value: 1120, color: "#7CE9CB" },
    ],

    collections: [
      { label: "Apr", value: 6.1 },
      { label: "May", value: 7.4 },
      { label: "Jun", value: 6.8 },
      { label: "Jul", value: 8.9 },
      { label: "Aug", value: 9.6 },
      { label: "Sep", value: 4.2 },
    ],

    users: [
      { id: "2022-1-60-041", name: "Rafiul Karim", email: "rafiul.karim@student.bidyapith.edu.bd", role: "student", dept: "cse", status: "active", joined: "2022-01-09" },
      { id: "2022-1-60-044", name: "Nusaiba Haque", email: "nusaiba.haque@student.bidyapith.edu.bd", role: "student", dept: "cse", status: "active", joined: "2022-01-09" },
      { id: "2021-2-40-118", name: "Tahmid Rahman", email: "tahmid.rahman@student.bidyapith.edu.bd", role: "student", dept: "bba", status: "active", joined: "2021-06-14" },
      { id: "2023-1-60-207", name: "Ayesha Siddika", email: "ayesha.siddika@student.bidyapith.edu.bd", role: "student", dept: "eee", status: "suspended", joined: "2023-01-11" },
      { id: "2020-1-30-076", name: "Mahin Chowdhury", email: "mahin.chowdhury@student.bidyapith.edu.bd", role: "student", dept: "civ", status: "active", joined: "2020-06-02" },
      { id: "FAC-0114", name: "Prof. Dr. Ayesha Rahman", email: "ayesha.rahman@bidyapith.edu.bd", role: "instructor", dept: "cse", status: "active", joined: "2009-03-01" },
      { id: "FAC-0121", name: "Dr. Tanvir Ahmed", email: "tanvir.ahmed@bidyapith.edu.bd", role: "instructor", dept: "cse", status: "active", joined: "2014-08-17" },
      { id: "FAC-0133", name: "Dr. Sabbir Rahman", email: "sabbir.rahman@bidyapith.edu.bd", role: "instructor", dept: "cse", status: "active", joined: "2017-01-22" },
      { id: "FAC-0140", name: "Prof. Dr. Kamal Hossain", email: "kamal.hossain@bidyapith.edu.bd", role: "instructor", dept: "eee", status: "active", joined: "2006-09-04" },
      { id: "FAC-0158", name: "Dr. Farhana Islam", email: "farhana.islam@bidyapith.edu.bd", role: "instructor", dept: "eco", status: "on leave", joined: "2015-02-10" },
      { id: "FAC-0166", name: "Dr. Nafisa Haque", email: "nafisa.haque@bidyapith.edu.bd", role: "instructor", dept: "cse", status: "active", joined: "2019-07-30" },
      { id: "FAC-0171", name: "Dr. Selim Reza", email: "selim.reza@bidyapith.edu.bd", role: "instructor", dept: "cse", status: "active", joined: "2012-11-05" },
      { id: "ADM-0007", name: "Sabina Yeasmin", email: "registrar@bidyapith.edu.bd", role: "admin", dept: "", status: "active", joined: "2011-04-18" },
      { id: "ADM-0012", name: "Ruhul Amin", email: "accounts@bidyapith.edu.bd", role: "admin", dept: "", status: "active", joined: "2016-10-03" },
      { id: "2023-1-60-233", name: "Sadia Islam", email: "sadia.islam@student.bidyapith.edu.bd", role: "student", dept: "cse", status: "active", joined: "2023-01-11" },
      { id: "2021-1-60-155", name: "Imran Sheikh", email: "imran.sheikh@student.bidyapith.edu.bd", role: "student", dept: "cse", status: "active", joined: "2021-01-10" },
      { id: "2022-3-20-064", name: "Meherun Nesa", email: "meherun.nesa@student.bidyapith.edu.bd", role: "student", dept: "eng", status: "active", joined: "2022-06-19" },
      { id: "2020-2-40-091", name: "Jubayer Alam", email: "jubayer.alam@student.bidyapith.edu.bd", role: "student", dept: "bba", status: "graduated", joined: "2020-01-12" },
      { id: "FAC-0179", name: "Dr. Rubel Mia", email: "rubel.mia@bidyapith.edu.bd", role: "instructor", dept: "eee", status: "active", joined: "2018-05-21" },
      { id: "2023-1-60-241", name: "Anika Tabassum", email: "anika.tabassum@student.bidyapith.edu.bd", role: "student", dept: "cse", status: "active", joined: "2023-01-11" },
      { id: "2021-1-60-160", name: "Rakib Hossain", email: "rakib.hossain@student.bidyapith.edu.bd", role: "student", dept: "cse", status: "suspended", joined: "2021-01-10" },
      { id: "2022-4-10-018", name: "Farhana Akter", email: "farhana.akter@student.bidyapith.edu.bd", role: "student", dept: "law", status: "active", joined: "2022-01-09" },
    ] as AdminUser[],

    payments: [
      { id: "TRX-20260907-01", student: "Rafiul Karim", sid: "2022-1-60-041", amount: 42500, method: "bKash", status: "pending", at: "2026-09-07T10:12:00", ref: "8N4KQ2R7" },
      { id: "TRX-20260906-14", student: "Nusaiba Haque", sid: "2022-1-60-044", amount: 42500, method: "Card", status: "success", at: "2026-09-06T16:41:00", ref: "TRX-99213" },
      { id: "TRX-20260906-09", student: "Tahmid Rahman", sid: "2021-2-40-118", amount: 38000, method: "SSLCommerz", status: "success", at: "2026-09-06T12:03:00", ref: "SSL-77120" },
      { id: "TRX-20260905-22", student: "Sadia Islam", sid: "2023-1-60-233", amount: 42500, method: "bKash", status: "failed", at: "2026-09-05T19:20:00", ref: "8N4KQ9X1" },
      { id: "TRX-20260905-18", student: "Imran Sheikh", sid: "2021-1-60-155", amount: 3000, method: "Card", status: "success", at: "2026-09-05T14:55:00", ref: "TRX-99044" },
      { id: "TRX-20260904-31", student: "Anika Tabassum", sid: "2023-1-60-241", amount: 42500, method: "bKash", status: "success", at: "2026-09-04T09:31:00", ref: "8N4KP2M6" },
      { id: "TRX-20260904-12", student: "Mahin Chowdhury", sid: "2020-1-30-076", amount: 40000, method: "SSLCommerz", status: "refunded", at: "2026-09-04T08:12:00", ref: "SSL-76904" },
      { id: "TRX-20260903-27", student: "Farhana Akter", sid: "2022-4-10-018", amount: 36500, method: "Card", status: "success", at: "2026-09-03T17:44:00", ref: "TRX-98871" },
      { id: "TRX-20260903-05", student: "Jubayer Alam", sid: "2020-2-40-091", amount: 3000, method: "bKash", status: "success", at: "2026-09-03T11:09:00", ref: "8N4KN7T2" },
      { id: "TRX-20260902-19", student: "Meherun Nesa", sid: "2022-3-20-064", amount: 33500, method: "Card", status: "pending", at: "2026-09-02T15:26:00", ref: "TRX-98620" },
      { id: "TRX-20260902-08", student: "Rakib Hossain", sid: "2021-1-60-160", amount: 42500, method: "bKash", status: "failed", at: "2026-09-02T10:47:00", ref: "8N4KM1B8" },
      { id: "TRX-20260901-24", student: "Ayesha Siddika", sid: "2023-1-60-207", amount: 41000, method: "SSLCommerz", status: "success", at: "2026-09-01T13:38:00", ref: "SSL-76512" },
    ] as PaymentTransaction[],

    audit: [
      { at: "2026-09-07T10:14:00", actor: "Sabina Yeasmin", role: "admin", action: "role.update", target: "2021-1-60-155", detail: "student → instructor rejected, reverted", tone: "rose" },
      { at: "2026-09-07T09:52:00", actor: "System", role: "system", action: "payment.webhook", target: "TRX-20260907-01", detail: "bKash callback received, status pending", tone: "gold" },
      { at: "2026-09-06T18:20:00", actor: "Dr. Tanvir Ahmed", role: "instructor", action: "grade.submit", target: "CSE-3106 section A", detail: "41 final grades submitted", tone: "" },
      { at: "2026-09-06T16:42:00", actor: "System", role: "system", action: "payment.success", target: "TRX-20260906-14", detail: "৳42,500 captured, invoice INV-2026-0431 settled", tone: "" },
      { at: "2026-09-06T11:05:00", actor: "Sabina Yeasmin", role: "admin", action: "course.create", target: "CSE-4310", detail: "Cloud Architecture added to Fall 2026", tone: "orchid" },
      { at: "2026-09-05T19:21:00", actor: "System", role: "system", action: "payment.failed", target: "TRX-20260905-22", detail: "Insufficient balance reported by gateway", tone: "rose" },
      { at: "2026-09-05T14:03:00", actor: "Ruhul Amin", role: "admin", action: "user.suspend", target: "2021-1-60-160", detail: "Unpaid dues over 60 days", tone: "rose" },
      { at: "2026-09-05T09:47:00", actor: "Prof. Dr. Ayesha Rahman", role: "instructor", action: "attendance.take", target: "CSE-3105 section A", detail: "41 marked, 2 absent", tone: "" },
      { at: "2026-09-04T15:30:00", actor: "Sabina Yeasmin", role: "admin", action: "semester.open", target: "Fall 2026", detail: "Course registration window opened", tone: "orchid" },
      { at: "2026-09-04T10:18:00", actor: "System", role: "system", action: "auth.login", target: "FAC-0121", detail: "Google sign-in from 103.108.x.x", tone: "" },
      { at: "2026-09-03T17:45:00", actor: "System", role: "system", action: "payment.success", target: "TRX-20260903-27", detail: "৳36,500 captured via card", tone: "" },
      { at: "2026-09-03T12:22:00", actor: "Ruhul Amin", role: "admin", action: "invoice.issue", target: "Batch 22", detail: "412 instalment-2 invoices generated", tone: "gold" },
      { at: "2026-09-02T16:00:00", actor: "Sabina Yeasmin", role: "admin", action: "course.softDelete", target: "CSE-2109", detail: "Retired, deletedAt set", tone: "rose" },
      { at: "2026-09-02T09:10:00", actor: "System", role: "system", action: "seed.run", target: "Fall 2026", detail: "642 sections created from template", tone: "" },
    ] as AuditRecord[],

    sections: [
      { code: "CSE-3105", title: "Database Systems", section: "A", instructor: "Dr. Tanvir Ahmed", room: "AB2-401", enrolled: 41, capacity: 55, status: "open" },
      { code: "CSE-3210", title: "Operating Systems", section: "B", instructor: "Dr. Sabbir Rahman", room: "AB2-305", enrolled: 55, capacity: 55, status: "full" },
      { code: "CSE-4108", title: "Machine Learning", section: "A", instructor: "Dr. Nafisa Haque", room: "AB3-208", enrolled: 45, capacity: 45, status: "full" },
      { code: "CSE-4210", title: "Distributed Systems", section: "A", instructor: "Prof. Dr. Ayesha Rahman", room: "AB3-110", enrolled: 27, capacity: 40, status: "open" },
      { code: "CSE-2201", title: "Data Structures & Algorithms", section: "C", instructor: "Prof. Dr. Ayesha Rahman", room: "AB2-201", enrolled: 58, capacity: 60, status: "open" },
      { code: "MAT-2103", title: "Linear Algebra", section: "C", instructor: "Dr. Selim Reza", room: "AB1-112", enrolled: 49, capacity: 60, status: "open" },
      { code: "EEE-2104", title: "Circuit Analysis II", section: "A", instructor: "Prof. Dr. Kamal Hossain", room: "AB1-208", enrolled: 44, capacity: 50, status: "open" },
      { code: "EEE-4205", title: "VLSI Design", section: "A", instructor: "Dr. Rubel Mia", room: "AB1-310", enrolled: 19, capacity: 35, status: "open" },
      { code: "BBA-1101", title: "Principles of Management", section: "A", instructor: "Prof. Dr. Shahriar Kabir", room: "BS-101", enrolled: 88, capacity: 90, status: "open" },
      { code: "CSE-2109", title: "Assembly Programming", section: "A", instructor: "Dr. Sabbir Rahman", room: "AB2-110", enrolled: 0, capacity: 40, status: "retired" },
    ] as AdminSection[],
  },
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu"];
export const HOURS = ["09:00", "11:00", "14:00", "16:00"];

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Registrar / Admin",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function formatTaka(amount: number): string {
  return `৳${amount.toLocaleString("en-IN")}`;
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatTimeAgo(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function computeGrade(marks: number): [string, number] {
  if (marks >= 80) return ["A", 4.0];
  if (marks >= 75) return ["A-", 3.7];
  if (marks >= 70) return ["B+", 3.3];
  if (marks >= 65) return ["B", 3.0];
  if (marks >= 60) return ["B-", 2.7];
  if (marks >= 55) return ["C+", 2.3];
  if (marks >= 50) return ["C", 2.0];
  if (marks >= 45) return ["D", 1.7];
  return ["F", 0.0];
}
