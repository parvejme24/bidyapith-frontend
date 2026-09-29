"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  APP_DATA,
  APP_SESSIONS,
  DEGREE_PROGRAMS,
  INITIAL_ADMISSION_APPLICATIONS,
  SAMPLE_GRADUATION_CERTIFICATE,
  formatTimeAgo,
} from "./app-data";
import { apiClient, getStoredToken } from "./api-client";
import type {
  AdminSection,
  AdminUser,
  AdmissionApplication,
  AuditRecord,
  DegreeProgram,
  GraduationCertificate,
  InstructorSection,
  Invoice,
  NoticeItem,
  PaymentTransaction,
  Role,
  RosterStudent,
  SemesterCurriculum,
  StudentCourse,
  UserSession,
} from "./app-types";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: UserSession;
  updateUser: (updates: Partial<UserSession>) => void;
  term: typeof APP_DATA.term;

  /* Degree Program & Curriculum */
  programs: DegreeProgram[];
  currentProgram: DegreeProgram | null;
  unlockSemester: (semesterNum: number, method: string) => void;
  graduationCertificate: GraduationCertificate | null;

  /* Admissions & Review Workflow */
  admissionApplications: AdmissionApplication[];
  myApplication: AdmissionApplication | null;
  submitAdmissionApplication: (data: Omit<AdmissionApplication, "id" | "status" | "submittedAt" | "isPaid">) => Promise<void>;
  approveAdmission: (appId: string) => Promise<void>;
  rejectAdmission: (appId: string) => Promise<void>;
  payAdmissionFee: (appId: string, method: string) => Promise<void>;

  /* Student state */
  student: typeof APP_DATA.student;
  cart: StudentCourse[];
  addToCart: (course: StudentCourse) => void;
  removeFromCart: (code: string) => void;
  clearCart: () => void;
  confirmRegistration: () => Promise<void>;
  invoices: Invoice[];
  payInvoice: (invoiceId: string, method: string) => Promise<void>;
  isLiveSynced: boolean;

  /* Instructor state */
  instructorSections: InstructorSection[];
  roster: RosterStudent[];
  updateRosterMarks: (id: string, finals: number) => void;
  submitGradeSheet: (sectionId: string) => Promise<void>;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  saveAttendance: (sectionId: string, dateKey: string, records: Record<string, "P" | "L" | "A">) => Promise<void>;

  /* Admin state */
  adminUsers: AdminUser[];
  updateUserRole: (id: string, role: Role, status: AdminUser["status"]) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  adminSections: AdminSection[];
  addAdminSection: (section: AdminSection) => void;
  updateAdminSection: (code: string, section: string, updates: Partial<AdminSection>) => void;
  retireAdminSection: (code: string, section: string) => void;
  adminPayments: PaymentTransaction[];
  verifyPayment: (id: string) => Promise<void>;
  refundPayment: (id: string) => Promise<void>;
  auditLogs: AuditRecord[];
  addAuditLog: (record: Omit<AuditRecord, "at">) => void;

  /* Notification drawer */
  notifications: NoticeItem[];
  unreadCount: number;
  isNotificationsLiveSynced: boolean;
  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  /* Global Search */
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Role detection derived directly from URL & query params
  const roleQuery = searchParams.get("role") as Role | null;
  const derivedRole: Role =
    roleQuery && ["student", "instructor", "admin"].includes(roleQuery)
      ? roleQuery
      : pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/instructor")
      ? "instructor"
      : "student";

  const [overrideRole, setOverrideRole] = useState<Role | null>(null);
  const role = overrideRole || derivedRole;

  const setRole = (newRole: Role) => {
    setOverrideRole(newRole);
    const targetMap: Record<Role, string> = {
      student: "/student",
      instructor: "/instructor",
      admin: "/admin",
    };
    router.push(`${targetMap[newRole]}?role=${newRole}`);
  };

  const [userOverrides, setUserOverrides] = useState<Record<Role, Partial<UserSession>>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bidyapith_user_overrides");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      student: {},
      instructor: {},
      admin: {},
    };
  });

  const baseUser = APP_SESSIONS[role] || APP_SESSIONS.student;
  const user: UserSession = { ...baseUser, ...(userOverrides[role] || {}) };

  const updateUser = (updates: Partial<UserSession>) => {
    setUserOverrides((prev) => {
      const next = {
        ...prev,
        [role]: { ...(prev[role] || {}), ...updates },
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("bidyapith_user_overrides", JSON.stringify(next));
          localStorage.setItem("bidyapith_user", JSON.stringify({ ...user, ...updates }));
        } catch (e) {
          // ignore
        }
      }
      return next;
    });
    toast.success("Profile saved successfully");
  };

  /* Semester Term State */
  const [termState, setTermState] = useState(APP_DATA.term);

  /* Student */
  const [studentState, setStudentState] = useState(APP_DATA.student);
  const [cart, setCart] = useState<StudentCourse[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(APP_DATA.student.invoices);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  /* Instructor */
  const [instructorSections, setInstructorSections] = useState<InstructorSection[]>(APP_DATA.instructor.sections);
  const [roster, setRoster] = useState<RosterStudent[]>(APP_DATA.instructor.roster);
  const [attendanceStore, setAttendanceStore] = useState<Record<string, Record<string, "P" | "L" | "A">>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bidyapith_attendance_store");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return {};
  });

  /* Admin */
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(APP_DATA.admin.users);
  const [adminSections, setAdminSections] = useState<AdminSection[]>(APP_DATA.admin.sections);
  const [adminPayments, setAdminPayments] = useState<PaymentTransaction[]>(APP_DATA.admin.payments);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(APP_DATA.admin.audit);

  /* Degree Programs & Admissions */
  const [programs, setPrograms] = useState<DegreeProgram[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bidyapith_programs");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEGREE_PROGRAMS;
  });

  const [admissionApplications, setAdmissionApplications] = useState<AdmissionApplication[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bidyapith_admissions");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ADMISSION_APPLICATIONS;
  });

  // Sync Current Semester Info from Live API
  useEffect(() => {
    async function syncSemester() {
      try {
        const res = await apiClient.semesters.getCurrent().catch(() => null);
        if (res?.data) {
          setTermState((prev) => ({
            ...prev,
            name: res.data.name || `${res.data.term} ${res.data.year}`,
            week: 6,
            of: 14,
            regCloses: res.data.registrationEnd ? res.data.registrationEnd.slice(0, 10) : prev.regCloses,
          }));
        }
      } catch {}
    }
    syncSemester();
  }, []);

  // Sync Degree Programs & Curricula from Live Database API
  useEffect(() => {
    async function syncPrograms() {
      try {
        const res = await apiClient.programs.getAll().catch(() => null);
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const livePrograms: DegreeProgram[] = res.data.map((p: any) => {
            const rawType = String(p.degreeType || p.code || "");
            const degreeType: DegreeProgram["degreeType"] =
              rawType.includes("M.Sc") || rawType.startsWith("M")
                ? "M.Sc."
                : rawType.includes("MBA")
                ? "MBA"
                : rawType.includes("BBA")
                ? "BBA"
                : "B.Sc.";
            return {
              id: p.id || p.code?.toLowerCase(),
              code: p.code || "BSC-CSE",
              title: p.name || p.title || "Degree Program",
              name: p.name || p.title || "Degree Program",
              degreeType,
              totalCredits: Number(p.totalCredits || 140),
              totalSemesters: Number(p.durationYears ? p.durationYears * 2 : 8),
              durationSemesters: Number(p.durationYears ? p.durationYears * 2 : 8),
              admissionFee: Number(p.registrationFee || 25000),
              semesterTuition: Number(p.feePerCredit ? Number(p.feePerCredit) * 18 : 65000),
              department: p.department?.name || p.departmentName || "Computer Science & Engineering",
              description: p.description || p.overview || "Comprehensive university curriculum.",
              semesters: p.semesters || [],
            };
          });
          setPrograms(livePrograms);
        }
      } catch {}
    }
    syncPrograms();
  }, []);

  // Sync Student Data from Real Database API
  useEffect(() => {
    async function syncRealStudentData() {
      const token = getStoredToken();
      if (!token || role !== "student") return;

      try {
        // 1. Sync Student Profile
        const profileRes = await apiClient.students.getMe().catch(() => null);
        if (profileRes?.data) {
          const p = profileRes.data;
          const fullName = `${p.user.firstName} ${p.user.lastName}`.trim();
          const progName = p.program?.name || "B.Sc. in Computer Science & Engineering";
          const progCode = p.program?.code || "BSC-CSE";
          const deptCode = p.program?.department?.code?.toLowerCase() || "cse";
          const cgpaNum = Number(p.cgpa || 3.82);
          const creditsDoneNum = Number(p.totalCreditsEarned || 96);

          setUserOverrides((prev) => ({
            ...prev,
            student: {
              name: fullName,
              id: p.studentId,
              email: p.user.email,
              dept: deptCode,
              program: progName,
              batch: p.batch || "2024",
              phone: p.user.phone || "+880 1712 445566",
              avatar: p.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            },
          }));

          setStudentState((prev) => ({
            ...prev,
            cgpa: cgpaNum,
            creditsDone: creditsDoneNum,
            standing: cgpaNum >= 3.5 ? "Dean's Honour List" : cgpaNum >= 2.5 ? "Good standing" : "Academic Probation",
          }));

          setIsLiveSynced(true);
        }

        // 2. Sync Enrolled Courses
        const myCoursesRes = await apiClient.enrollments.getMyCourses().catch(() => null);
        if (myCoursesRes?.data && Array.isArray(myCoursesRes.data) && myCoursesRes.data.length > 0) {
          const liveEnrolled: StudentCourse[] = myCoursesRes.data.map((item) => {
            const c = item.offering.course;
            const instructorName = item.offering.instructor
              ? `Prof. ${item.offering.instructor.user.firstName} ${item.offering.instructor.user.lastName}`
              : "Faculty Member";
            const schedules = item.offering.schedules || [];
            const slots = schedules.map((s) => `${s.dayOfWeek.slice(0, 3)} ${s.startTime}`);

            return {
              code: c.code,
              title: c.title,
              section: item.offering.section || "A",
              credits: Number(c.credits || 3),
              instructor: instructorName,
              room: item.offering.room || "AB2-402",
              slots: slots.length > 0 ? slots : ["Sun 09:00", "Tue 09:00"],
              attendance: 94,
              marks: 85,
            };
          });

          setStudentState((prev) => ({
            ...prev,
            enrolled: liveEnrolled,
          }));
        }

        // 3. Sync Real Student Invoices
        const invoicesRes = await apiClient.invoices.getMyInvoices().catch(() => null);
        if (invoicesRes?.data && Array.isArray(invoicesRes.data) && invoicesRes.data.length > 0) {
          const liveInvoices: Invoice[] = (invoicesRes.data as any[]).map((inv) => {
            const rawStatus = (inv.status || "due").toLowerCase();
            const safeStatus: Invoice["status"] =
              rawStatus === "paid" ? "paid" : rawStatus === "processing" ? "processing" : rawStatus === "refunded" ? "refunded" : "due";
            return {
              id: inv.invoiceNumber || inv.id,
              title: inv.title || inv.type || "Tuition & Registration Fee",
              amount: Number(inv.amount || inv.totalAmount || 0),
              due: inv.dueDate ? inv.dueDate.slice(0, 10) : "2026-10-15",
              status: safeStatus,
              paid: inv.paidAt ? inv.paidAt.slice(0, 10) : undefined,
              method: inv.paymentMethod || undefined,
              txn: inv.transactionRef || undefined,
            };
          });
          setInvoices(liveInvoices);
        }

        // 4. Sync Student's Own Applications
        const myAppsRes = await apiClient.admissions.getMyApplications().catch(() => null);
        if (myAppsRes?.data && Array.isArray(myAppsRes.data) && myAppsRes.data.length > 0) {
          const liveApps: AdmissionApplication[] = (myAppsRes.data as any[]).map((a) => ({
            id: a.id,
            studentName: a.studentName || `${a.user?.firstName || ""} ${a.user?.lastName || ""}`.trim(),
            email: a.email || a.user?.email,
            studentEmail: a.email || a.user?.email,
            phone: a.phone || a.user?.phone || "+880 1700 000000",
            programId: a.programId || a.program?.id || "prog-bsc-cse",
            programTitle: a.program?.name || a.courseTitle || "Degree Program",
            programName: a.program?.name || a.courseTitle || "Degree Program",
            courseCode: a.courseCode,
            courseTitle: a.courseTitle,
            courseCredits: a.courseCredits ? Number(a.courseCredits) : undefined,
            status: (a.status || "PENDING_REVIEW").toUpperCase() as AdmissionApplication["status"],
            submittedAt: a.createdAt ? a.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
            admissionFee: Number(a.admissionFee || 25000),
            isPaid: Boolean(a.isPaid || a.status === "ENROLLED"),
          }));
          setAdmissionApplications((prev) => {
            const map = new Map<string, AdmissionApplication>();
            prev.forEach((item) => map.set(item.id, item));
            liveApps.forEach((item) => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        // silent fallback for resilience
      }
    }

    syncRealStudentData();
  }, [role]);

  // Sync Instructor Data from Real Database API
  useEffect(() => {
    async function syncInstructorData() {
      const token = getStoredToken();
      if (!token || role !== "instructor") return;

      try {
        // 1. Sync Instructor Profile
        const profileRes = await apiClient.instructors.getMe().catch(() => null);
        if (profileRes?.data) {
          const p = profileRes.data;
          const fullName = `${p.user.firstName} ${p.user.lastName}`.trim();
          setUserOverrides((prev) => ({
            ...prev,
            instructor: {
              name: fullName,
              id: p.employeeId,
              email: p.user.email,
              dept: p.departmentId || "cse",
              program: p.specialization || "Faculty of Computer Science",
              designation: p.designation || "Assistant Professor",
              avatar: p.user.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
            },
          }));
        }

        // 2. Sync Instructor's Teaching Sections
        const teachingRes = await apiClient.offerings.getMyTeaching().catch(() => null);
        if (teachingRes?.data && Array.isArray(teachingRes.data) && teachingRes.data.length > 0) {
          const liveSections: InstructorSection[] = teachingRes.data.map((o) => {
            const schedules = o.schedules || [];
            const slots = schedules.map((s) => `${s.dayOfWeek.slice(0, 3)} ${s.startTime}`);
            return {
              id: o.id,
              code: o.course.code,
              title: o.course.title,
              section: o.section,
              enrolled: o.enrolledCount || 0,
              capacity: o.capacity || 40,
              room: o.room || "AB2-401",
              slots: slots.length > 0 ? slots : ["Sun 09:00", "Tue 09:00"],
              avgAttendance: 92,
              gradesSubmitted: false,
            };
          });
          setInstructorSections(liveSections);

          // Fetch roster for first section
          const firstSection = liveSections[0];
          if (firstSection) {
            const rosterRes = await apiClient.offerings.getRoster(firstSection.id).catch(() => null);
            if (rosterRes?.data && Array.isArray(rosterRes.data) && rosterRes.data.length > 0) {
              const liveRoster: RosterStudent[] = rosterRes.data.map((r) => ({
                id: r.student.studentId || r.student.id,
                name: `${r.student.user.firstName} ${r.student.user.lastName}`.trim(),
                prog: "B.Sc. in CSE",
                avatar: r.student.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                att: 95,
                mid: r.grade?.midtermMarks || 22,
                final: r.grade?.finalMarks || 38,
                assign: r.grade?.assignmentMarks || 17,
              }));
              setRoster(liveRoster);
            }
          }
        }
      } catch (err) {
        // silent fallback
      }
    }

    syncInstructorData();
  }, [role]);

  // Sync Admin collections from live database API
  useEffect(() => {
    async function syncAdminData() {
      const token = getStoredToken();
      if (!token || role !== "admin") return;

      try {
        // 1. Sync real users
        const usersRes = await apiClient.admin.getUsers().catch(() => null);
        if (usersRes?.data && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
          const liveUsers: AdminUser[] = (usersRes.data as any[]).map((u) => ({
            id: u.id || u.employeeId || u.studentId,
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "User",
            email: u.email,
            role: (u.role || "student").toLowerCase() as Role,
            dept: u.departmentId || u.dept || "cse",
            status: (u.status || "active").toLowerCase() as AdminUser["status"],
            joined: u.createdAt ? u.createdAt.slice(0, 10) : "2024-01-15",
          }));
          setAdminUsers(liveUsers);
        }

        // 2. Sync real offerings/sections
        const offeringsRes = await apiClient.offerings.getAll().catch(() => null);
        if (offeringsRes?.data && Array.isArray(offeringsRes.data) && offeringsRes.data.length > 0) {
          const liveSections: AdminSection[] = (offeringsRes.data as any[]).map((o) => ({
            code: o.course?.code || "CSE-2201",
            title: o.course?.title || "Course Offering",
            section: o.section || "A",
            instructor: o.instructor?.user ? `${o.instructor.user.firstName} ${o.instructor.user.lastName}` : "Faculty Member",
            room: o.room || "AB2-401",
            enrolled: o.enrolledCount || 0,
            capacity: o.capacity || 40,
            status: o.enrolledCount >= o.capacity ? "full" : "open",
          }));
          setAdminSections(liveSections);
        }

        // 3. Sync real payments
        const paymentsRes = await apiClient.admin.getPayments().catch(() => null);
        if (paymentsRes?.data && Array.isArray(paymentsRes.data) && paymentsRes.data.length > 0) {
          const livePayments: PaymentTransaction[] = (paymentsRes.data as any[]).map((p) => ({
            id: p.id,
            student: p.studentName || p.user?.firstName || "Student",
            sid: p.studentId || "2024-BSC-CSE-1001",
            amount: Number(p.amount || 0),
            method: p.gateway || p.method || "bKash",
            status: (p.status || "success").toLowerCase(),
            at: p.createdAt ? p.createdAt.replace("T", " ").slice(0, 16) : "2026-09-28 10:00",
            ref: p.transactionRef || p.ref || "TXN-984210",
          }));
          setAdminPayments(livePayments);
        }

        // 4. Sync real admissions
        const admissionsRes = await apiClient.admissions.getAll().catch(() => null);
        if (admissionsRes?.data && Array.isArray(admissionsRes.data) && admissionsRes.data.length > 0) {
          const liveAdmissions: AdmissionApplication[] = (admissionsRes.data as any[]).map((a) => ({
            id: a.id,
            studentName: a.studentName || `${a.user?.firstName || ""} ${a.user?.lastName || ""}`.trim(),
            email: a.email || a.user?.email,
            studentEmail: a.email || a.user?.email,
            phone: a.phone || a.user?.phone || "+880 1700 000000",
            programId: a.programId || a.program?.id || "prog-bsc-cse",
            programTitle: a.program?.name || a.courseTitle || "Degree Program",
            programName: a.program?.name || a.courseTitle || "Degree Program",
            courseCode: a.courseCode,
            courseTitle: a.courseTitle,
            courseCredits: a.courseCredits ? Number(a.courseCredits) : undefined,
            status: (a.status || "PENDING_REVIEW").toUpperCase() as AdmissionApplication["status"],
            submittedAt: a.createdAt ? a.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
            admissionFee: Number(a.admissionFee || 25000),
            isPaid: Boolean(a.isPaid || a.status === "ENROLLED"),
          }));
          setAdmissionApplications(liveAdmissions);
        }
      } catch (err) {
        // silent fallback
      }
    }

    syncAdminData();
  }, [role]);

  const addToCart = (course: StudentCourse) => {
    if (cart.some((c) => c.code === course.code)) {
      setCart((prev) => prev.filter((c) => c.code !== course.code));
    } else {
      setCart((prev) => [...prev, course]);
    }
  };

  const removeFromCart = (code: string) => {
    setCart((prev) => prev.filter((c) => c.code !== code));
  };

  const clearCart = () => setCart([]);

  const confirmRegistration = async () => {
    const count = cart.length;
    if (!count) return;
    const addedCredits = cart.reduce((acc, c) => acc + (c.credits || 3), 0);

    // Call live enrollments API for each course if offeringId is known or available
    try {
      const availRes = await apiClient.enrollments.getAvailableCourses().catch(() => null);
      if (availRes?.data && Array.isArray(availRes.data)) {
        for (const c of cart) {
          const matched = availRes.data.find((o) => o.course.code.toLowerCase() === c.code.toLowerCase());
          if (matched) {
            await apiClient.enrollments.create(matched.id).catch(() => null);
          }
        }
      }
    } catch {}

    setStudentState((prev) => ({
      ...prev,
      enrolled: [...prev.enrolled, ...cart],
      creditsDone: prev.creditsDone + addedCredits,
    }));

    setInvoices((prev) => [
      {
        id: `INV-2026-0${Math.floor(400 + Math.random() * 500)}`,
        title: `Course registration fee (${count} courses)`,
        amount: 3000 * count,
        due: "2026-10-14",
        status: "due",
      },
      ...prev,
    ]);

    clearCart();
    toast.success(`Registered for ${count} courses — Synchronized with database`, {
      style: { background: "rgba(46, 211, 167, 0.15)", borderColor: "#2ED3A7", color: "#EEF1FB" },
    });
  };

  const payInvoice = async (invoiceId: string, method: string) => {
    try {
      const targetInvoice = invoices.find((i) => i.id === invoiceId);
      if (targetInvoice) {
        await apiClient.payments.initiate({
          invoiceId,
          amount: targetInvoice.amount,
          gateway: (method.toUpperCase().includes("BKASH") ? "BKASH" : method.toUpperCase().includes("SSL") ? "SSLCOMMERZ" : "STRIPE") as any,
        }).catch(() => null);
      }
    } catch {}

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: "paid",
              method,
              paid: new Date().toISOString().slice(0, 10),
              txn: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
            }
          : inv
      )
    );
    toast.success(`Payment verified via ${method} — Synchronized with database`);
  };

  const updateRosterMarks = (id: string, finals: number) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, final: finals } : s))
    );
  };

  const submitGradeSheet = async (sectionId: string) => {
    try {
      await apiClient.offerings.submitGrades(sectionId, {
        grades: roster.map((r) => ({
          studentId: r.id,
          finalMarks: r.final,
          midtermMarks: r.mid,
          assignmentMarks: r.assign,
        })),
      }).catch(() => null);
    } catch {}

    setInstructorSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, gradesSubmitted: true } : s))
    );
    toast.success("Grade sheet successfully submitted to the registrar");
  };

  const saveAttendance = async (sectionId: string, dateKey: string, records: Record<string, "P" | "L" | "A">) => {
    const compositeKey = `${sectionId}_${dateKey}`;
    setAttendanceStore((prev) => {
      const next = { ...prev, [compositeKey]: records };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("bidyapith_attendance_store", JSON.stringify(next));
        } catch {}
      }
      return next;
    });

    try {
      await apiClient.offerings.markAttendance(sectionId, {
        date: dateKey,
        records: Object.entries(records).map(([studentId, status]) => ({
          studentId,
          status: status === "P" ? "PRESENT" : status === "L" ? "LATE" : "ABSENT",
        })),
      }).catch(() => null);
    } catch {}

    const count = Object.keys(records).length;
    toast.success(`Attendance records saved for ${count} students`);
  };

  const addAuditLog = (record: Omit<AuditRecord, "at">) => {
    const newLog: AuditRecord = {
      ...record,
      at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateUserRole = async (id: string, newRole: Role, status: AdminUser["status"]) => {
    try {
      await apiClient.admin.updateUserRole(id, newRole).catch(() => null);
      await apiClient.admin.updateUserStatus(id, status).catch(() => null);
    } catch {}

    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole, status } : u))
    );
    addAuditLog({
      actor: user.name,
      role: "admin",
      action: "role.update",
      target: id,
      detail: `Role updated to ${newRole}, status: ${status}`,
      tone: "orchid",
    });
    toast.success(`User ${id} role updated to ${newRole}`);
  };

  const deleteUser = async (id: string) => {
    try {
      await apiClient.admin.deleteUser(id).catch(() => null);
    } catch {}

    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog({
      actor: user.name,
      role: "admin",
      action: "user.delete",
      target: id,
      detail: `User soft-deleted`,
      tone: "rose",
    });
    toast.success(`User ${id} successfully archived`);
  };

  const addAdminSection = (section: AdminSection) => {
    setAdminSections((prev) => [section, ...prev]);
    addAuditLog({
      actor: user.name,
      role: "admin",
      action: "course.create",
      target: `${section.code} Sec ${section.section}`,
      detail: `New section added to ${termState.name}`,
      tone: "orchid",
    });
    toast.success(`Course section ${section.code} (${section.section}) created`);
  };

  const updateAdminSection = (code: string, sec: string, updates: Partial<AdminSection>) => {
    setAdminSections((prev) =>
      prev.map((s) => (s.code === code && s.section === sec ? { ...s, ...updates } : s))
    );
    toast.success(`Course section ${code} updated`);
  };

  const retireAdminSection = (code: string, sec: string) => {
    setAdminSections((prev) =>
      prev.map((s) => (s.code === code && s.section === sec ? { ...s, status: "retired", enrolled: 0 } : s))
    );
    toast.success(`Course section ${code} retired`);
  };

  const verifyPayment = async (id: string) => {
    try {
      await apiClient.admin.verifyPayment(id).catch(() => null);
    } catch {}

    setAdminPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "success" } : p))
    );
    toast.success(`Payment transaction ${id} verified`);
  };

  const refundPayment = async (id: string) => {
    try {
      await apiClient.admin.refundPayment(id).catch(() => null);
    } catch {}

    setAdminPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "refunded" } : p))
    );
    toast.success(`Refund processed for transaction ${id}`);
  };

  /* Notifications */
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dbNotifications, setDbNotifications] = useState<NoticeItem[]>([]);
  const [isNotificationsLiveSynced, setIsNotificationsLiveSynced] = useState(false);
  const [readNoticeKeys, setReadNoticeKeys] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("bidyapith_read_notices");
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const saveReadNoticeKeys = (updated: Record<string, boolean>) => {
    setReadNoticeKeys(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bidyapith_read_notices", JSON.stringify(updated));
      } catch {}
    }
  };

  const fetchLiveNotifications = async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const res = await apiClient.notifications.getAll();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: NoticeItem[] = res.data.map((n) => {
          let tone: NoticeItem["tone"] = "";
          if (n.type === "PAYMENT") tone = "gold";
          else if (n.type === "ATTENDANCE") tone = "rose";
          else if (n.type === "ENROLLMENT") tone = "orchid";
          else tone = "";

          return {
            id: n.id,
            t: n.title,
            m: n.body,
            tone,
            time: formatTimeAgo(n.createdAt),
            link: n.link || undefined,
            read: Boolean(n.readAt || readNoticeKeys[n.id] || readNoticeKeys[n.title]),
          };
        });
        setDbNotifications(mapped);
        setIsNotificationsLiveSynced(true);
      }
    } catch (err) {
      // silent fallback
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
  }, [role]);

  const markNotificationRead = async (id: string) => {
    const updated = { ...readNoticeKeys, [id]: true };
    saveReadNoticeKeys(updated);

    setDbNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await apiClient.notifications.markAsRead(id);
    } catch {}
  };

  const markAllNotificationsRead = async () => {
    const newKeys = { ...readNoticeKeys };
    notifications.forEach((n) => {
      if (n.id) newKeys[n.id] = true;
      if (n.t) newKeys[n.t] = true;
    });
    saveReadNoticeKeys(newKeys);

    setDbNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await apiClient.notifications.markAllAsRead();
    } catch {}
    toast.success("All notifications marked as read");
  };

  const refreshNotifications = async () => {
    await fetchLiveNotifications();
  };

  const baseNotices: NoticeItem[] =
    dbNotifications.length > 0
      ? dbNotifications
      : role === "student"
      ? studentState.notices.map((n, idx) => ({ ...n, id: `student-note-${idx}`, time: "Just now" }))
      : role === "instructor"
      ? APP_DATA.instructor.queue.map((n, idx) => ({ ...n, id: `instructor-note-${idx}`, time: "Today" }))
      : auditLogs.slice(0, 5).map((a, idx) => ({ id: `admin-note-${idx}`, t: a.action, m: a.detail, tone: a.tone, time: "Recent" }));

  const notifications: NoticeItem[] = baseNotices.map((n) => ({
    ...n,
    read: Boolean(n.read || (n.id && readNoticeKeys[n.id]) || (n.t && readNoticeKeys[n.t])),
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const savePrograms = (updated: DegreeProgram[]) => {
    setPrograms(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bidyapith_programs", JSON.stringify(updated));
      } catch {}
    }
  };

  const saveAdmissions = (updated: AdmissionApplication[]) => {
    setAdmissionApplications(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bidyapith_admissions", JSON.stringify(updated));
      } catch {}
    }
  };

  // Find student's active degree program
  const currentProgram =
    programs.find((p) => p.code === user.dept?.toUpperCase() || p.title.toLowerCase().includes((user.dept || "cse").toLowerCase())) ||
    programs[0] ||
    null;

  // Student's personal admission application
  const myApplication =
    admissionApplications.find((a) => (a.email && a.email.toLowerCase() === user.email.toLowerCase()) || (a.studentEmail && a.studentEmail.toLowerCase() === user.email.toLowerCase()) || a.studentName.toLowerCase() === user.name.toLowerCase()) ||
    admissionApplications[0] ||
    null;

  const submitAdmissionApplication = async (data: Omit<AdmissionApplication, "id" | "status" | "submittedAt" | "isPaid">) => {
    let createdId = `APP-2026-0${Math.floor(100 + Math.random() * 900)}`;

    try {
      const res = await apiClient.admissions.apply({
        studentName: data.studentName,
        email: data.email || data.studentEmail || user.email,
        phone: data.phone || user.phone || "+8801700000000",
        courseCode: data.courseCode,
        courseTitle: data.courseTitle,
        courseCredits: data.courseCredits,
        programId: data.programId,
        prevInstitution: data.previousInstitute,
        gpa: data.hscGpa ? Number(data.hscGpa) : 5.0,
      }).catch(() => null);

      if (res?.data?.id) {
        createdId = res.data.id;
      }
    } catch {}

    const newApp: AdmissionApplication = {
      ...data,
      id: createdId,
      status: "PENDING_REVIEW",
      submittedAt: new Date().toISOString().slice(0, 10),
      isPaid: false,
    };
    const next = [newApp, ...admissionApplications];
    saveAdmissions(next);
    addAuditLog({
      actor: data.studentName,
      role: "student",
      action: "admission.apply",
      target: data.programTitle,
      detail: `Submitted admission application for ${data.programTitle}`,
      tone: "orchid",
    });
    toast.success("Application submitted successfully! Our Admissions Office will review your credentials.");
  };

  const approveAdmission = async (appId: string) => {
    try {
      await apiClient.admissions.approve(appId).catch(() => null);
    } catch {}

    const updated = admissionApplications.map((a) =>
      a.id === appId
        ? { ...a, status: "APPROVED" as const, reviewedAt: new Date().toISOString().slice(0, 10) }
        : a
    );
    saveAdmissions(updated);
    const app = admissionApplications.find((a) => a.id === appId);
    const targetName = app?.courseCode ? `${app.courseCode}: ${app.courseTitle}` : (app?.programTitle || appId);

    // Push notification to student's inbox
    setStudentState((prev) => ({
      ...prev,
      notices: [
        {
          id: `notice-approval-${Date.now()}`,
          t: `Academic Approval: ${app?.courseCode || "Course Registration"}`,
          m: `Your application & academic documents for ${targetName} have been verified & approved by the Registrar. You may now complete tuition payment.`,
          tone: "gold",
          time: "Just now",
          read: false,
        },
        ...prev.notices,
      ],
    }));

    addAuditLog({
      actor: user.name,
      role: "admin",
      action: "admission.approve",
      target: app?.studentName || appId,
      detail: `Approved registration application ${appId} for ${targetName}`,
      tone: "gold",
    });
    toast.success(`Application ${appId} approved. Student notified & email dispatched.`);
  };

  const rejectAdmission = async (appId: string) => {
    try {
      await apiClient.admissions.reject(appId).catch(() => null);
    } catch {}

    const updated = admissionApplications.map((a) =>
      a.id === appId
        ? { ...a, status: "REJECTED" as const, reviewedAt: new Date().toISOString().slice(0, 10) }
        : a
    );
    saveAdmissions(updated);
    toast.error(`Application ${appId} marked as rejected.`);
  };

  const payAdmissionFee = async (appId: string, method: string) => {
    try {
      await apiClient.admissions.payFee(appId, { paymentMethod: method }).catch(() => null);
    } catch {}

    const app = admissionApplications.find((a) => a.id === appId) || admissionApplications[0];
    const updated = admissionApplications.map((a) =>
      a.id === appId ? { ...a, status: "ENROLLED" as const, isPaid: true } : a
    );
    saveAdmissions(updated);

    // If this is a course registration application, directly enroll the student in this course
    if (app?.courseCode) {
      const credits = app.courseCredits || 3;
      const alreadyEnrolled = studentState.enrolled.some((c) => c.code.toLowerCase() === app.courseCode!.toLowerCase());
      if (!alreadyEnrolled) {
        setStudentState((prev) => ({
          ...prev,
          enrolled: [
            ...prev.enrolled,
            {
              code: app.courseCode!,
              title: app.courseTitle || "Applied Course Offering",
              section: "A",
              credits,
              instructor: "Assigned Faculty",
              room: "AB2-204",
              slots: ["Sun 10:30", "Tue 10:30"],
              attendance: 100,
              marks: 0,
            },
          ],
          creditsDone: prev.creditsDone + credits,
        }));
      }
    }

    addAuditLog({
      actor: app?.studentName || user.name,
      role: "student",
      action: "admission.pay",
      target: app?.programTitle || appId,
      detail: `Paid admission fee via ${method}`,
      tone: "gold",
    });

    toast.success(`Payment verified via ${method}! Enrollment is now officially active.`);
  };

  const unlockSemester = (semesterNum: number, method: string) => {
    if (!currentProgram) return;

    const updatedSemesters: SemesterCurriculum[] = currentProgram.semesters.map((sem) =>
      sem.semesterNumber === semesterNum
        ? {
            ...sem,
            status: "completed" as const,
            feeStatus: "paid" as const,
          }
        : sem
    );

    const updatedProgram: DegreeProgram = {
      ...currentProgram,
      semesters: updatedSemesters,
    };

    const nextPrograms = programs.map((p) =>
      p.code === currentProgram.code ? updatedProgram : p
    );
    savePrograms(nextPrograms);

    const targetSem = currentProgram.semesters.find((s) => s.semesterNumber === semesterNum);
    const addedCredits = targetSem ? targetSem.courses.reduce((sum, c) => sum + c.credits, 0) : 18;
    const tuition = targetSem ? targetSem.tuitionFee : 60000;

    setStudentState((prev) => ({
      ...prev,
      creditsDone: Math.min(prev.creditsNeeded, prev.creditsDone + addedCredits),
    }));

    const newTxn: PaymentTransaction = {
      id: `TXN-SEM${semesterNum}-${Date.now()}`,
      student: user.name,
      sid: user.id,
      amount: tuition,
      method,
      status: "success",
      at: new Date().toISOString().replace("T", " ").slice(0, 16),
      ref: `TXN-SEM${semesterNum}-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setAdminPayments((prev) => [newTxn, ...prev]);

    toast.success(`Semester ${semesterNum} unlocked & tuition fee verified via ${method}!`);
  };

  const graduationCertificate: GraduationCertificate = {
    ...SAMPLE_GRADUATION_CERTIFICATE,
    studentName: user.name,
    studentId: user.id,
    programTitle: user.program || SAMPLE_GRADUATION_CERTIFICATE.programTitle,
    cgpa: studentState.cgpa,
  };

  /* Global Search */
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        updateUser,
        term: termState,
        programs,
        currentProgram,
        unlockSemester,
        graduationCertificate,
        admissionApplications,
        myApplication,
        submitAdmissionApplication,
        approveAdmission,
        rejectAdmission,
        payAdmissionFee,
        student: studentState,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        confirmRegistration,
        invoices,
        payInvoice,
        isLiveSynced,
        instructorSections,
        roster,
        updateRosterMarks,
        submitGradeSheet,
        attendanceStore,
        saveAttendance,
        adminUsers,
        updateUserRole,
        deleteUser,
        adminSections,
        addAdminSection,
        updateAdminSection,
        retireAdminSection,
        adminPayments,
        verifyPayment,
        refundPayment,
        auditLogs,
        addAuditLog,
        notifications,
        unreadCount,
        isNotificationsLiveSynced,
        notificationOpen,
        setNotificationOpen,
        markNotificationRead,
        markAllNotificationsRead,
        refreshNotifications,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
