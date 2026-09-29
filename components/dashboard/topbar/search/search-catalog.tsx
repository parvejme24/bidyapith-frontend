import React from "react";
import {
  Award,
  BookOpen,
  Calendar,
  CreditCard,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";
import type {
  AdminSection,
  InstructorSection,
  PaymentTransaction,
  Role,
  StudentCourse,
} from "@/lib/app-types";
import type { SearchItem } from "./types";

export function getStudentSearchCatalog(
  enrolledCourses: StudentCourse[] = []
): SearchItem[] {
  return [
    {
      id: "student-dash",
      title: "Student Dashboard Overview",
      subtitle: "Current semester academic progress, GPA standing & schedule",
      category: "Navigation",
      href: "/student?role=student",
      icon: <LayoutDashboard className="size-4 text-jade" />,
    },
    {
      id: "student-reg",
      title: "Course Registration & Advising",
      subtitle: "Advising portal, elective selection & credit check",
      category: "Course",
      href: "/student/registration?role=student",
      icon: <BookOpen className="size-4 text-jade" />,
    },
    {
      id: "student-courses",
      title: "Enrolled Courses & Timetable",
      subtitle: "Weekly routine, classrooms & faculty instructors",
      category: "Course",
      href: "/student/courses?role=student",
      icon: <GraduationCap className="size-4 text-orchid" />,
    },
    {
      id: "student-att",
      title: "Attendance Tracker & Clearance",
      subtitle: "Session attendance records, exam eligibility (min 75%)",
      category: "Attendance",
      href: "/student/attendance?role=student",
      icon: <Calendar className="size-4 text-marigold" />,
    },
    {
      id: "student-res",
      title: "Semester Results & GPA Transcript",
      subtitle: "Grading records, CGPA ledger & completed credits",
      category: "Study",
      href: "/student/results?role=student",
      icon: <Award className="size-4 text-orchid" />,
    },
    {
      id: "student-fees",
      title: "Tuition Fees & Payments",
      subtitle: "Due installment invoices, bKash / cards checkout",
      category: "Finance",
      href: "/student/fees?role=student",
      icon: <CreditCard className="size-4 text-rose" />,
    },
    {
      id: "student-prof",
      title: "Student Academic Profile",
      subtitle: "Contact details, degree requirements & batch standing",
      category: "Navigation",
      href: "/profile?role=student",
      icon: <User className="size-4 text-sky-400" />,
    },
    ...enrolledCourses.map((c) => ({
      id: `st-c-${c.code}`,
      title: `${c.code}: ${c.title}`,
      subtitle: `Sec ${c.section} · ${c.instructor} · Room ${c.room} · ${c.credits} Credits`,
      category: "Course" as const,
      href: "/student/courses?role=student",
      icon: <BookOpen className="size-4 text-jade" />,
    })),
  ];
}

export function getInstructorSearchCatalog(
  sections: InstructorSection[] = []
): SearchItem[] {
  return [
    {
      id: "inst-dash",
      title: "Faculty Dashboard",
      subtitle: "Teaching load, assigned sections & schedule",
      category: "Navigation",
      href: "/instructor?role=instructor",
      icon: <LayoutDashboard className="size-4 text-jade" />,
    },
    {
      id: "inst-att",
      title: "Class Attendance Management",
      subtitle: "Mark daily session attendance, roster pan & live rates",
      category: "Attendance",
      href: "/instructor/attendance?role=instructor",
      icon: <Calendar className="size-4 text-marigold" />,
    },
    {
      id: "inst-grades",
      title: "Continuous Assessment Grade Entry",
      subtitle: "Submit midterm marks, final assessments & grade lock",
      category: "Teaching",
      href: "/instructor/grades?role=instructor",
      icon: <Award className="size-4 text-orchid" />,
    },
    {
      id: "inst-prof",
      title: "Faculty Profile & Research",
      subtitle: "Academic designation, room office & research interests",
      category: "Navigation",
      href: "/profile?role=instructor",
      icon: <User className="size-4 text-sky-400" />,
    },
    ...sections.map((s) => ({
      id: `inst-sec-${s.code}-${s.section}`,
      title: `${s.title} (${s.code} · Sec ${s.section})`,
      subtitle: `Room: ${s.room} · Enrolled: ${s.enrolled}/${s.capacity}`,
      category: "Section" as const,
      href: "/instructor/attendance?role=instructor",
      icon: <BookOpen className="size-4 text-orchid" />,
    })),
  ];
}

export function getAdminSearchCatalog(
  sections: AdminSection[] = [],
  payments: PaymentTransaction[] = []
): SearchItem[] {
  return [
    {
      id: "admin-dash",
      title: "Admin Command Center",
      subtitle: "University KPIs, admissions analytics & revenue trends",
      category: "Navigation",
      href: "/admin?role=admin",
      icon: <LayoutDashboard className="size-4 text-jade" />,
    },
    {
      id: "admin-users",
      title: "User Management & Roles",
      subtitle: "Manage students, onboard faculty instructors with OTP, assign roles & access",
      category: "User",
      href: "/admin/users?role=admin",
      icon: <Users className="size-4 text-sky-400" />,
    },
    {
      id: "admin-courses",
      title: "Course Catalog & Section Allocation",
      subtitle: "Schedule sections, assign faculty instructors & manage room capacities",
      category: "Section",
      href: "/admin/courses?role=admin",
      icon: <BookOpen className="size-4 text-orchid" />,
    },
    {
      id: "admin-payments",
      title: "Payment Transactions & Gateway Hub",
      subtitle: "Verify bKash / Cards IPN webhooks, process refunds & audit tuition fees",
      category: "Finance",
      href: "/admin/payments?role=admin",
      icon: <CreditCard className="size-4 text-rose" />,
    },
    {
      id: "admin-academic",
      title: "Academic Term, Deadlines & Notices",
      subtitle: "Configure semester operational status, exam dates & broadcast notices",
      category: "Navigation",
      href: "/admin/academic?role=admin",
      icon: <Calendar className="size-4 text-jade" />,
    },
    {
      id: "admin-audit",
      title: "System Audit & Security Logs",
      subtitle: "Immutable record of all admin role changes, grading approvals & financial IPNs",
      category: "Audit",
      href: "/admin/audit?role=admin",
      icon: <FileCheck className="size-4 text-purple-400" />,
    },
    {
      id: "admin-prof",
      title: "Admin Superuser Profile",
      subtitle: "Superuser settings, security credentials & contact information",
      category: "Navigation",
      href: "/profile?role=admin",
      icon: <User className="size-4 text-sky-400" />,
    },
    ...sections.map((sec) => ({
      id: `admin-sec-${sec.code}-${sec.section}`,
      title: `${sec.title} (${sec.code} · Sec ${sec.section})`,
      subtitle: `Instructor: ${sec.instructor} · Room: ${sec.room} · Enrolled: ${sec.enrolled}/${sec.capacity}`,
      category: "Section" as const,
      href: "/admin/courses?role=admin",
      icon: <BookOpen className="size-4 text-jade" />,
    })),
    ...payments.map((p) => ({
      id: `pay-${p.id}`,
      title: `${p.student} - ৳${p.amount.toLocaleString()} (${p.method})`,
      subtitle: `Txn: ${p.ref} · SID: ${p.sid} · Status: ${p.status.toUpperCase()} · ${p.at}`,
      category: "Finance" as const,
      href: "/admin/payments?role=admin",
      icon: <CreditCard className="size-4 text-rose" />,
    })),
  ];
}

export function getSearchPlaceholder(role: Role): string {
  switch (role) {
    case "student":
      return "Search courses, grades, attendance, fees...";
    case "instructor":
      return "Search teaching sections, roster students, marks...";
    case "admin":
      return "Search users & roles, sections, payments, logs...";
    default:
      return "Search portal...";
  }
}
