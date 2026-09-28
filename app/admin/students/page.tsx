"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Award,
  BookOpen,
  GraduationCap,
  Grid,
  KeyRound,
  LayoutList,
  MoreHorizontal,
  Trash2,
  UserCheck,
} from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusPill } from "@/components/dashboard/status-pill";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/app-context";
import { apiClient } from "@/lib/api-client";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { StudentData } from "@/components/dashboard/admin/students/student-types";
import { StudentStats } from "@/components/dashboard/admin/students/student-stats";
import { StudentCardGrid } from "@/components/dashboard/admin/students/student-card-grid";
import { AdmissionReviewTable } from "@/components/dashboard/admin/admissions/admission-review-table";

const DEPT_OPTIONS = [
  { value: "all", label: "All Programs" },
  { value: "cse", label: "B.Sc. in CSE" },
  { value: "eee", label: "B.Sc. in EEE" },
  { value: "civ", label: "B.Sc. in Civil" },
  { value: "bba", label: "BBA General" },
  { value: "mat", label: "B.Sc. in Math" },
  { value: "phy", label: "B.Sc. in Physics" },
  { value: "eng", label: "B.A. in English" },
  { value: "law", label: "LLB Honors" },
  { value: "pha", label: "B.Pharm Pro" },
  { value: "eco", label: "BSS in Economics" },
];

export default function AdminStudentsPage() {
  const { adminUsers, deleteUser, addAuditLog, admissionApplications } = useApp();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  // Layout View State: "table" vs "cards" vs "admissions"
  const [viewMode, setViewMode] = useState<"table" | "cards" | "admissions">("table");
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");


  // Fetch real students from Database API
  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      try {
        const res = await apiClient.students.getAll();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: StudentData[] = res.data.map((st: any) => ({
            id: st.studentId || st.id,
            name: `${st.user?.firstName || ""} ${st.user?.lastName || ""}`.trim() || "Student Account",
            email: st.user?.email || "student@bidyapith.edu",
            dept: st.program?.code ? st.program.code.replace("BSC-", "").toLowerCase() : "cse",
            batch: st.batch || "2024",
            cgpa: st.cgpa || "3.75",
            credits: st.totalCreditsEarned || "96",
            phone: st.user?.phone || "+880 1712 000000",
            status: "active",
            joined: "2024-01-15",
            avatar: st.user?.avatar,
          }));
          setStudents(mapped);
          setIsLiveSynced(true);
        } else {
          fallbackToLocal();
        }
      } catch {
        fallbackToLocal();
      } finally {
        setLoading(false);
      }
    }

    function fallbackToLocal() {
      const local = adminUsers.filter((u) => u.role === "student");
      const mapped: StudentData[] = local.map((u, i) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        dept: u.dept || "cse",
        batch: "2024",
        cgpa: (3.4 + (i % 6) * 0.1).toFixed(2),
        credits: 90 + (i % 30),
        phone: "+880 1712 " + String(100000 + i),
        status: u.status,
        joined: u.joined,
        avatar: u.avatar,
      }));
      setStudents(mapped);
    }

    loadStudents();
  }, [adminUsers]);

  const handleSendQuickOtp = (st: StudentData) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    toast.success(`Login OTP ${otp} & password reset dispatched to ${st.email}`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    deleteUser(id);
    setStudents((prev) => prev.filter((item) => item.id !== id));
    addAuditLog({
      actor: "Parvej Admin",
      role: "admin",
      action: "student.delete",
      target: name,
      detail: `Removed student account ${id}`,
      tone: "rose",
    });
    toast.success(`Student ${name} removed`);
  };

  const activeCount = students.filter((s) => s.status === "active").length;
  const graduatedCount = students.filter((s) => s.status === "graduated").length;

  const columns: ColumnDef<StudentData>[] = [
    {
      key: "name",
      label: "Student Profile",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            name={r.name}
            avatar={r.avatar}
            size="sm"
            tone="jade"
          />
          <div>
            <p className="font-semibold text-ink leading-tight">{r.name}</p>
            <p className="text-[0.72rem] text-ink-muted font-mono">{r.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "dept",
      label: "Program / Major",
      sortable: true,
      render: (r) => (
        <div>
          <span className="inline-block text-[0.68rem] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-ink-muted border border-white/10">
            B.Sc. in {r.dept.toUpperCase()}
          </span>
          <p className="text-[0.68rem] text-ink-faint mt-0.5">Batch {r.batch || "2024"}</p>
        </div>
      ),
    },
    {
      key: "cgpa",
      label: "Academic CGPA",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-jade">{r.cgpa || "3.75"}</span>
          <span className="text-[0.68rem] text-ink-faint font-mono">/ 4.00</span>
        </div>
      ),
    },
    {
      key: "credits",
      label: "Earned Credits",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-ink-faint font-semibold">
          {r.credits || "96"} / 140 Cr
        </span>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (r) => (
        <div>
          <p className="text-xs text-ink-faint font-mono">{r.email}</p>
          <p className="text-[0.7rem] text-ink-muted font-mono">{r.phone}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <StatusPill tone={r.status === "active" ? "ok" : r.status === "graduated" ? "info" : "warn"}>
          {r.status}
        </StatusPill>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "h-7 px-2 text-xs rounded-md inline-flex items-center gap-1 cursor-pointer"
            )}
          >
            <span>Manage</span>
            <MoreHorizontal className="size-3.5 text-ink-faint" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <DropdownMenuItem
              onClick={() => handleSendQuickOtp(r)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink-muted hover:bg-white/[0.08] hover:text-ink font-medium"
            >
              <KeyRound className="size-3.5 text-marigold" />
              <span>Send Login OTP & Pass</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Viewing grade transcript for ${r.name}`)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink hover:bg-white/[0.08] hover:text-jade font-medium"
            >
              <Award className="size-3.5 text-jade" />
              <span>Academic Transcript</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Viewing registered courses for ${r.name}`)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink hover:bg-white/[0.08] hover:text-sky-400 font-medium"
            >
              <BookOpen className="size-3.5 text-sky-400" />
              <span>Registered Courses</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              onClick={() => handleDeleteStudent(r.id, r.name)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-rose hover:bg-rose/15 font-medium"
            >
              <Trash2 className="size-3.5" />
              <span>Remove Account</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout
      requiredRole="admin"
      title="Students & Admissions"
      subtitle={`University roster directory · ${isLiveSynced ? "Database connected" : "Local ledger"}`}
      actions={
        <div className="flex items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
              title="Table View"
            >
              <LayoutList className="size-3.5" />
              <span className="hidden sm:inline">Roster Directory</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                viewMode === "cards"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
              title="Card Grid View"
            >
              <Grid className="size-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("admissions")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer relative",
                viewMode === "admissions"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
              title="Admissions Review"
            >
              <GraduationCap className="size-3.5" />
              <span>Admission Applications</span>
              {admissionApplications.filter((a) => a.status === "PENDING_REVIEW").length > 0 && (
                <span className="size-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
              )}
            </button>
          </div>
        </div>
      }
    >
      {/* 4 Stat Tiles */}
      <StudentStats
        totalCount={students.length}
        activeCount={activeCount}
        graduatedCount={graduatedCount}
      />

      {/* Main Content Area: Table vs Cards vs Admissions Review */}
      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={students}
          searchKeys={["name", "email", "id", "dept"]}
          searchPlaceholder="Search students by name, ID, program..."
          pageSize={10}
          filters={[
            {
              id: "dept",
              label: "All Programs",
              options: DEPT_OPTIONS.filter((d) => d.value !== "all"),
              match: (r, v) => r.dept.toLowerCase() === v.toLowerCase(),
            },
            {
              id: "status",
              label: "All Status",
              options: [
                { value: "active", label: "Active" },
                { value: "graduated", label: "Graduated" },
                { value: "suspended", label: "Suspended" },
              ],
              match: (r, v) => r.status === v,
            },
          ]}
        />
      ) : viewMode === "cards" ? (
        <StudentCardGrid
          students={students}
          search={search}
          setSearch={setSearch}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          deptOptions={DEPT_OPTIONS}
          onSendQuickOtp={handleSendQuickOtp}
          onDeleteStudent={handleDeleteStudent}
        />
      ) : (
        <AdmissionReviewTable />
      )}
    </DashboardLayout>
  );
}

