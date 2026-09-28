"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  GraduationCap,
  Grid,
  KeyRound,
  LayoutList,
  MoreHorizontal,
  Plus,
  Trash2,
  UserCheck,
} from "lucide-react";
import { AddInstructorModal } from "@/components/dashboard/admin/add-instructor-modal";
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
import type { InstructorData } from "@/components/dashboard/admin/instructors/instructor-types";
import { InstructorStats } from "@/components/dashboard/admin/instructors/instructor-stats";
import { InstructorCardGrid } from "@/components/dashboard/admin/instructors/instructor-card-grid";

const DEPT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "cse", label: "Computer Science (CSE)" },
  { value: "eee", label: "Electrical Eng (EEE)" },
  { value: "civ", label: "Civil Eng (CIV)" },
  { value: "bba", label: "Business Admin (BBA)" },
  { value: "mat", label: "Mathematics (MAT)" },
  { value: "phy", label: "Physics (PHY)" },
  { value: "eng", label: "English (ENG)" },
  { value: "law", label: "Law (LAW)" },
  { value: "pha", label: "Pharmacy (PHA)" },
  { value: "eco", label: "Economics (ECO)" },
];

export default function AdminInstructorsPage() {
  const { adminUsers, deleteUser, addAuditLog } = useApp();
  const [instructors, setInstructors] = useState<InstructorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  // Layout View State: "table" vs "cards"
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch real instructors from Database API
  useEffect(() => {
    async function loadInstructors() {
      setLoading(true);
      try {
        const res = await apiClient.instructors.getAll();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: InstructorData[] = res.data.map((inst: any) => ({
            id: inst.employeeId || inst.id,
            name: `${inst.user?.firstName || ""} ${inst.user?.lastName || ""}`.trim() || "Faculty Member",
            email: inst.user?.email || "faculty@bidyapith.edu",
            dept: inst.departmentId || "cse",
            designation: inst.designation || "Assistant Professor",
            phone: inst.user?.phone || "+880 1711 000000",
            room: inst.specialization ? `Room ${inst.specialization}` : "AB2-501",
            status: "active",
            joined: "2024-01-15",
            sectionsCount: 2,
            studentsCount: 78,
            avatar: inst.user?.avatar,
          }));
          setInstructors(mapped);
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
      const local = adminUsers.filter((u) => u.role === "instructor");
      const mapped: InstructorData[] = local.map((u, i) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        dept: u.dept || "cse",
        designation: i % 3 === 0 ? "Professor & Head" : i % 2 === 0 ? "Associate Professor" : "Assistant Professor",
        phone: "+880 1711 " + String(200000 + i),
        room: `AB2-${400 + i}`,
        status: u.status,
        joined: u.joined,
        sectionsCount: 2 + (i % 2),
        studentsCount: 70 + (i % 20),
        avatar: u.avatar,
      }));
      setInstructors(mapped);
    }

    loadInstructors();
  }, [adminUsers]);

  const handleSendQuickOtp = (inst: InstructorData) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    toast.success(`Login OTP ${otp} & password reset dispatched to ${inst.email}`);
  };

  const handleDeleteInstructor = (id: string, name: string) => {
    deleteUser(id);
    setInstructors((prev) => prev.filter((item) => item.id !== id));
    addAuditLog({
      actor: "Parvej Admin",
      role: "admin",
      action: "instructor.delete",
      target: name,
      detail: `Removed instructor account ${id}`,
      tone: "rose",
    });
    toast.success(`Instructor ${name} removed`);
  };

  const activeCount = instructors.filter((i) => i.status === "active").length;
  const deptsCount = Array.from(new Set(instructors.map((i) => i.dept))).length;

  const columns: ColumnDef<InstructorData>[] = [
    {
      key: "name",
      label: "Faculty Member",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            name={r.name}
            avatar={r.avatar}
            size="sm"
            tone="gold"
          />
          <div>
            <p className="font-semibold text-ink leading-tight">{r.name}</p>
            <p className="text-[0.72rem] text-jade font-medium">{r.designation}</p>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "Employee ID",
      sortable: true,
      render: (r) => <span className="font-mono text-xs text-ink-faint font-semibold">{r.id}</span>,
    },
    {
      key: "dept",
      label: "Department",
      sortable: true,
      render: (r) => (
        <span className="inline-block text-[0.68rem] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-ink-muted border border-white/10">
          {r.dept}
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
      key: "room",
      label: "Office Room",
      render: (r) => <span className="text-xs font-mono text-ink-faint">{r.room || "AB2-501"}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <StatusPill tone={r.status === "active" ? "ok" : r.status === "suspended" ? "bad" : "warn"}>
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
              onClick={() => toast.success(`Viewing academic workload for ${r.name}`)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink hover:bg-white/[0.08] hover:text-jade font-medium"
            >
              <BookOpen className="size-3.5 text-jade" />
              <span>Course Assignments</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Faculty evaluation report for ${r.name}`)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink hover:bg-white/[0.08] hover:text-sky-400 font-medium"
            >
              <GraduationCap className="size-3.5 text-sky-400" />
              <span>Student Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              onClick={() => handleDeleteInstructor(r.id, r.name)}
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
      title="Faculty & Instructors"
      subtitle={`Active directory of faculty instructors · ${isLiveSynced ? "Database connected" : "Local ledger"}`}
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
              <span className="hidden sm:inline">Table</span>
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
          </div>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs flex items-center gap-1.5 cursor-pointer shadow-sm")}
          >
            <Plus className="size-3.5" />
            <span>Onboard New Faculty</span>
          </button>
        </div>
      }
    >
      {/* 4 Stat Tiles */}
      <InstructorStats
        totalCount={instructors.length}
        activeCount={activeCount}
        deptsCount={deptsCount}
      />

      {/* Main Content Area: Table vs Cards */}
      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={instructors}
          searchKeys={["name", "email", "id", "dept", "designation"]}
          searchPlaceholder="Search faculty by name, ID, department..."
          pageSize={10}
          filters={[
            {
              id: "dept",
              label: "All Departments",
              options: DEPT_OPTIONS.filter((d) => d.value !== "all"),
              match: (r, v) => r.dept.toLowerCase() === v.toLowerCase(),
            },
            {
              id: "status",
              label: "All Status",
              options: [
                { value: "active", label: "Active" },
                { value: "on leave", label: "On Leave" },
                { value: "suspended", label: "Suspended" },
              ],
              match: (r, v) => r.status === v,
            },
          ]}
        />
      ) : (
        <InstructorCardGrid
          instructors={instructors}
          search={search}
          setSearch={setSearch}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          deptOptions={DEPT_OPTIONS}
          onSendQuickOtp={handleSendQuickOtp}
          onDeleteInstructor={handleDeleteInstructor}
        />
      )}

      {/* Add New Instructor Modal */}
      <AddInstructorModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={() => {
          const updated = adminUsers.filter((u) => u.role === "instructor");
          setInstructors(
            updated.map((u, i) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              dept: u.dept || "cse",
              designation: "Assistant Professor",
              phone: "+880 1711 998877",
              room: "AB2-502",
              status: "active",
              joined: "2026-09-28",
              avatar: u.avatar,
            }))
          );
        }}
      />
    </DashboardLayout>
  );
}
