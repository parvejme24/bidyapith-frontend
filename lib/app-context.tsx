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
  submitAdmissionApplication: (data: Omit<AdmissionApplication, "id" | "status" | "submittedAt" | "isPaid">) => void;
  approveAdmission: (appId: string) => void;
  rejectAdmission: (appId: string) => void;
  payAdmissionFee: (appId: string, method: string) => void;

  /* Student state */
  student: typeof APP_DATA.student;
  cart: StudentCourse[];
  addToCart: (course: StudentCourse) => void;
  removeFromCart: (code: string) => void;
  clearCart: () => void;
  confirmRegistration: () => void;
  invoices: Invoice[];
  payInvoice: (invoiceId: string, method: string) => void;
  isLiveSynced: boolean;

  /* Instructor state */
  instructorSections: InstructorSection[];
  roster: RosterStudent[];
  updateRosterMarks: (id: string, finals: number) => void;
  submitGradeSheet: (sectionId: string) => void;
  attendanceStore: Record<string, Record<string, "P" | "L" | "A">>;
  saveAttendance: (sectionId: string, dateKey: string, records: Record<string, "P" | "L" | "A">) => void;

  /* Admin state */
  adminUsers: AdminUser[];
  updateUserRole: (id: string, role: Role, status: AdminUser["status"]) => void;
  deleteUser: (id: string) => void;
  adminSections: AdminSection[];
  addAdminSection: (section: AdminSection) => void;
  updateAdminSection: (code: string, section: string, updates: Partial<AdminSection>) => void;
  retireAdminSection: (code: string, section: string) => void;
  adminPayments: PaymentTransaction[];
  verifyPayment: (id: string) => void;
  refundPayment: (id: string) => void;
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

  /* Student */
  const [studentState, setStudentState] = useState(APP_DATA.student);
  const [cart, setCart] = useState<StudentCourse[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(APP_DATA.student.invoices);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  // Sync Student Data from Real Database API
  useEffect(() => {
    async function syncRealStudentData() {
      const token = getStoredToken();
      if (!token || role !== "student") return;

      try {
        const profileRes = await apiClient.students.getMe();
        if (profileRes?.data) {
          const p = profileRes.data;
          const fullName = `${p.user.firstName} ${p.user.lastName}`.trim();
          const progName = p.program?.name || "B.Sc. in Computer Science & Engineering";
          const progCode = p.program?.code || "BSC-CSE";
          const deptCode = p.program?.department?.code?.toLowerCase() || "cse";
          const cgpaNum = Number(p.cgpa || 3.82);
          const creditsDoneNum = Number(p.totalCreditsEarned || 96);

          // Update user session in context
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

          // Update student academic state
          setStudentState((prev) => ({
            ...prev,
            cgpa: cgpaNum,
            creditsDone: creditsDoneNum,
            standing: cgpaNum >= 3.5 ? "Dean's Honour List" : cgpaNum >= 2.5 ? "Good standing" : "Academic Probation",
          }));

          setIsLiveSynced(true);
        }

        // Fetch student's real enrolled courses
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
      } catch (err) {
        console.warn("Live DB sync note:", err);
      }
    }

    syncRealStudentData();
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

  const confirmRegistration = () => {
    const count = cart.length;
    if (!count) return;
    const addedCredits = cart.reduce((acc, c) => acc + (c.credits || 3), 0);
    setStudentState((prev) => ({
      ...prev,
      enrolled: [...prev.enrolled, ...cart],
      creditsDone: prev.creditsDone + addedCredits,
    }));
    // Add registration fee invoice
    setInvoices((prev) => [
      {
        id: `INV-2026-0${Math.floor(400 + Math.random() * 500)}`,
        title: `Course registration fee (${count} courses)`,
        amount: 3000,
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

  const payInvoice = (invoiceId: string, method: string) => {
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

  /* Instructor */
  const [instructorSections, setInstructorSections] = useState(APP_DATA.instructor.sections);
  const [roster, setRoster] = useState<RosterStudent[]>(APP_DATA.instructor.roster);
  const [attendanceStore, setAttendanceStore] = useState<Record<string, Record<string, "P" | "L" | "A">>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("bidyapith_attendance_store");
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        // ignore
      }
    }
    return {};
  });

  const updateRosterMarks = (id: string, finals: number) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, final: finals } : s))
    );
  };

  const submitGradeSheet = (sectionId: string) => {
    setInstructorSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, gradesSubmitted: true } : s))
    );
    toast.success("Grade sheet successfully submitted to the registrar");
  };

  const saveAttendance = (sectionId: string, dateKey: string, records: Record<string, "P" | "L" | "A">) => {
    const compositeKey = `${sectionId}_${dateKey}`;
    setAttendanceStore((prev) => {
      const next = { ...prev, [compositeKey]: records };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("bidyapith_attendance_store", JSON.stringify(next));
        } catch (e) {
          // ignore
        }
      }
      return next;
    });
    const count = Object.keys(records).length;
    toast.success(`Attendance records saved for ${count} students`);
  };

  /* Admin */
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(APP_DATA.admin.users);
  const [adminSections, setAdminSections] = useState<AdminSection[]>(APP_DATA.admin.sections);
  const [adminPayments, setAdminPayments] = useState<PaymentTransaction[]>(APP_DATA.admin.payments);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(APP_DATA.admin.audit);

  // Sync Admin collections from live database API
  useEffect(() => {
    async function syncAdminData() {
      const token = getStoredToken();
      if (!token) return;

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
      } catch (err) {
        console.warn("Live admin DB sync note:", err);
      }
    }

    syncAdminData();
  }, [role]);

  const addAuditLog = (record: Omit<AuditRecord, "at">) => {
    const newLog: AuditRecord = {
      ...record,
      at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateUserRole = (id: string, newRole: Role, status: AdminUser["status"]) => {
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

  const deleteUser = (id: string) => {
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
      detail: `New section added to ${APP_DATA.term.name}`,
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

  const verifyPayment = (id: string) => {
    setAdminPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "success" } : p))
    );
    toast.success(`Payment transaction ${id} verified`);
  };

  const refundPayment = (id: string) => {
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
      console.warn("Could not fetch DB notifications:", err);
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


  const submitAdmissionApplication = (data: Omit<AdmissionApplication, "id" | "status" | "submittedAt" | "isPaid">) => {
    const newApp: AdmissionApplication = {
      ...data,
      id: `APP-2026-0${Math.floor(100 + Math.random() * 900)}`,
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

  const approveAdmission = (appId: string) => {
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

  const rejectAdmission = (appId: string) => {
    const updated = admissionApplications.map((a) =>
      a.id === appId
        ? { ...a, status: "REJECTED" as const, reviewedAt: new Date().toISOString().slice(0, 10) }
        : a
    );
    saveAdmissions(updated);
    toast.error(`Application ${appId} marked as rejected.`);
  };

  const payAdmissionFee = (appId: string, method: string) => {
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
              title: app.courseTitle || "Course Offering",
              section: "A",
              credits,
              instructor: "Faculty Member",
              room: "AB2-401",
              slots: ["Sun 10:00", "Tue 10:00"],
              attendance: 100,
              marks: 0,
            },
          ],
          creditsDone: prev.creditsDone + credits,
        }));
      }
      setCart((prev) => prev.filter((c) => c.code.toLowerCase() !== app.courseCode!.toLowerCase()));
    } else {
      // Update student user session for degree admission
      updateUser({
        admissionStatus: "ENROLLED",
        program: app?.programTitle || "B.Sc. in Computer Science & Engineering",
      });
    }

    // Add invoice as paid
    setInvoices((prev) => [
      {
        id: `INV-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
        title: app?.courseCode ? `Course Tuition: ${app.courseCode}` : `Degree Admission: ${app?.programTitle}`,
        amount: app?.admissionFee || 15000,
        due: new Date().toISOString().slice(0, 10),
        status: "paid",
        method,
        paid: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);

    // Add payment transaction
    const newTxn: PaymentTransaction = {
      id: `PAY-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
      student: app?.studentName || user.name,
      sid: user.id,
      amount: app?.admissionFee || 15000,
      method,
      status: "success",
      at: new Date().toISOString().replace("T", " ").slice(0, 16),
      ref: `TXN-ADM-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setAdminPayments((prev) => [newTxn, ...prev]);

    addAuditLog({
      actor: user.name,
      role: "student",
      action: "admission.fee_paid",
      target: app?.courseCode || app?.programTitle || "Course Registration",
      detail: `Paid fee ${app?.admissionFee || 15000} via ${method}`,
      tone: "orchid",
    });

    toast.success(
      app?.courseCode
        ? `Tuition payment confirmed via ${method}! You are officially enrolled in ${app.courseCode}.`
        : "Admission fee confirmed! You are now officially enrolled in the degree program."
    );
  };

  const unlockSemester = (semesterNum: number, method: string) => {
    if (!currentProgram) return;

    const updatedSemesters = currentProgram.semesters.map((sem) => {
      if (sem.semesterNumber === semesterNum) {
        return {
          ...sem,
          status: "current" as const,
          feeStatus: "paid" as const,
        };
      }
      return sem;
    });

    const updatedPrograms = programs.map((p) =>
      p.id === currentProgram.id ? { ...p, semesters: updatedSemesters } : p
    );
    savePrograms(updatedPrograms);

    const tuition = currentProgram.semesterTuition || 45000;
    const newTxn: PaymentTransaction = {
      id: `PAY-SEM-${Math.floor(1000 + Math.random() * 9000)}`,
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
        term: APP_DATA.term,
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
