"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { APP_DATA, APP_SESSIONS } from "./app-data";
import type {
  AdminSection,
  AdminUser,
  AuditRecord,
  InstructorSection,
  Invoice,
  NoticeItem,
  PaymentTransaction,
  Role,
  RosterStudent,
  StudentCourse,
  UserSession,
} from "./app-types";

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: UserSession;
  updateUser: (updates: Partial<UserSession>) => void;
  term: typeof APP_DATA.term;

  /* Student state */
  student: typeof APP_DATA.student;
  cart: StudentCourse[];
  addToCart: (course: StudentCourse) => void;
  removeFromCart: (code: string) => void;
  clearCart: () => void;
  confirmRegistration: () => void;
  invoices: Invoice[];
  payInvoice: (invoiceId: string, method: string) => void;

  /* Instructor state */
  instructorSections: InstructorSection[];
  roster: RosterStudent[];
  updateRosterMarks: (id: string, finals: number) => void;
  submitGradeSheet: (sectionId: string) => void;
  saveAttendance: (marksCount: number) => void;

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
  notificationOpen: boolean;
  setNotificationOpen: (open: boolean) => void;

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

  const [userOverrides, setUserOverrides] = useState<Record<Role, Partial<UserSession>>>({
    student: {},
    instructor: {},
    admin: {},
  });

  const baseUser = APP_SESSIONS[role] || APP_SESSIONS.student;
  const user: UserSession = { ...baseUser, ...(userOverrides[role] || {}) };

  const updateUser = (updates: Partial<UserSession>) => {
    setUserOverrides((prev) => ({
      ...prev,
      [role]: { ...(prev[role] || {}), ...updates },
    }));
    toast.success("Profile saved — PATCH /users/me");
  };

  /* Student */
  const [studentState, setStudentState] = useState(APP_DATA.student);
  const [cart, setCart] = useState<StudentCourse[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>(APP_DATA.student.invoices);

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
        due: "2026-09-14",
        status: "due",
      },
      ...prev,
    ]);
    clearCart();
    toast.success(`Registered for ${count} courses — POST /registrations`);
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
    toast.success(`Redirecting to ${method} — POST /payments/initiate`);
  };

  /* Instructor */
  const [instructorSections, setInstructorSections] = useState(APP_DATA.instructor.sections);
  const [roster, setRoster] = useState<RosterStudent[]>(APP_DATA.instructor.roster);

  const updateRosterMarks = (id: string, finals: number) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, final: finals } : s))
    );
  };

  const submitGradeSheet = (sectionId: string) => {
    setInstructorSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, gradesSubmitted: true } : s))
    );
    toast.success("Grade sheet submitted — POST /grades/submit");
  };

  const saveAttendance = (marksCount: number) => {
    toast.success(`${marksCount} attendance records saved — POST /attendance`);
  };

  /* Admin */
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(APP_DATA.admin.users);
  const [adminSections, setAdminSections] = useState<AdminSection[]>(APP_DATA.admin.sections);
  const [adminPayments, setAdminPayments] = useState<PaymentTransaction[]>(APP_DATA.admin.payments);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>(APP_DATA.admin.audit);

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
    toast.success(`User ${id} updated — PATCH /admin/users/${id}`);
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
    toast.success(`User ${id} archived — deletedAt set`);
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
    toast.success(`${section.code} created — POST /admin/sections`);
  };

  const updateAdminSection = (code: string, sec: string, updates: Partial<AdminSection>) => {
    setAdminSections((prev) =>
      prev.map((s) => (s.code === code && s.section === sec ? { ...s, ...updates } : s))
    );
    toast.success(`${code} updated — PATCH /admin/sections`);
  };

  const retireAdminSection = (code: string, sec: string) => {
    setAdminSections((prev) =>
      prev.map((s) => (s.code === code && s.section === sec ? { ...s, status: "retired", enrolled: 0 } : s))
    );
    toast.success(`${code} retired — status set to retired`);
  };

  const verifyPayment = (id: string) => {
    setAdminPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "success" } : p))
    );
    toast.success(`Re-queried — GET /payments/${id}/verify`);
  };

  const refundPayment = (id: string) => {
    setAdminPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "refunded" } : p))
    );
    toast.success(`Refund requested — POST /payments/${id}/refund`);
  };

  /* Notifications */
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notifications: NoticeItem[] =
    role === "student"
      ? studentState.notices
      : role === "instructor"
      ? APP_DATA.instructor.queue
      : auditLogs.slice(0, 5).map((a) => ({ t: a.action, m: a.detail, tone: a.tone }));

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
        student: studentState,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        confirmRegistration,
        invoices,
        payInvoice,
        instructorSections,
        roster,
        updateRosterMarks,
        submitGradeSheet,
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
        notificationOpen,
        setNotificationOpen,
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
