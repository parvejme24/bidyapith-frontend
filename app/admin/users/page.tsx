"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Mail,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
} from "lucide-react";
import { AddInstructorModal } from "@/components/dashboard/admin/add-instructor-modal";
import { UserManageModal } from "@/components/dashboard/admin/user-manage-modal";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusPill } from "@/components/dashboard/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/app-context";
import { formatShortDate, getInitials } from "@/lib/app-data";
import type { AdminUser } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const { adminUsers, updateUserRole, deleteUser, addAuditLog } = useApp();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [addInstructorOpen, setAddInstructorOpen] = useState(false);

  const handleSendQuickOtp = (u: AdminUser) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    toast.success(`One-time login passcode (OTP: ${otp}) sent to ${u.email}`);
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      key: "name",
      label: "User",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "size-7 rounded-full flex items-center justify-center font-display text-[0.68rem] font-bold shrink-0",
              r.role === "admin"
                ? "bg-gradient-to-br from-[#D3CBFF] to-[#9B8CFF] text-[#171141]"
                : r.role === "instructor"
                ? "bg-gradient-to-br from-[#FFD9A6] to-[#FFB454] text-[#33230A]"
                : "bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620]"
            )}
          >
            {getInitials(r.name)}
          </span>
          <div>
            <p className="font-semibold text-ink leading-tight">{r.name}</p>
            <p className="text-[0.72rem] text-ink-faint font-mono">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (r) => <span className="font-mono text-xs text-ink-faint">{r.id}</span>,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (r) => (
        <StatusPill
          tone={
            r.role === "admin"
              ? "info"
              : r.role === "instructor"
              ? "warn"
              : "mute"
          }
        >
          {r.role}
        </StatusPill>
      ),
    },
    {
      key: "dept",
      label: "Department",
      render: (r) => (
        <span className="text-xs uppercase tracking-wider font-mono text-ink-muted">
          {r.dept || "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <StatusPill
          tone={
            r.status === "active"
              ? "ok"
              : r.status === "suspended"
              ? "bad"
              : "mute"
          }
        >
          {r.status}
        </StatusPill>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      sortable: true,
      render: (r) => (
        <span className="text-xs text-ink-faint">{formatShortDate(r.joined)}</span>
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
              onClick={() => setSelectedUser(r)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink hover:bg-white/[0.08] hover:text-jade font-medium"
            >
              <UserCog className="size-3.5 text-jade" />
              <span>Manage Role & Status</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSendQuickOtp(r)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink-muted hover:bg-white/[0.08] hover:text-ink font-medium"
            >
              <KeyRound className="size-3.5 text-marigold" />
              <span>Send Login OTP</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 bg-white/10" />
            <DropdownMenuItem
              onClick={() => {
                deleteUser(r.id);
                toast.success(`User ${r.name} soft deleted`);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-rose hover:bg-rose/15 font-medium"
            >
              <Trash2 className="size-3.5" />
              <span>Delete User</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Users & Roles"
      subtitle={`${adminUsers.length} accounts · Role changes and permissions are audited`}
      requiredRole="admin"
      crumb="Admin / Operations"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAddInstructorOpen(true)}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs rounded-md flex items-center gap-1.5")}
          >
            <UserPlus className="size-3.5" />
            <span>Add Instructor</span>
          </button>
          <button
            type="button"
            onClick={() => toast.success("User invitation link copied")}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs rounded-md")}
          >
            <Plus className="size-3.5" />
            <span>Invite user</span>
          </button>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={adminUsers}
        searchKeys={["name", "email", "id", "dept"]}
        searchPlaceholder="Search name, email, or ID..."
        pageSize={8}
        initialSortKey="name"
        filters={[
          {
            id: "role",
            label: "All roles",
            options: [
              { value: "student", label: "Students" },
              { value: "instructor", label: "Instructors" },
              { value: "admin", label: "Admins" },
            ],
            match: (r, v) => r.role === v,
          },
          {
            id: "status",
            label: "All statuses",
            options: [
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
              { value: "graduated", label: "Graduated" },
            ],
            match: (r, v) => r.status === v,
          },
        ]}
      />

      {/* Edit User Modal */}
      {selectedUser && (
        <UserManageModal
          user={selectedUser}
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          onSave={(id, role, status) => updateUserRole(id, role, status)}
          onDelete={(id) => deleteUser(id)}
        />
      )}

      {/* Add Instructor Modal with Email & OTP */}
      {addInstructorOpen && (
        <AddInstructorModal
          isOpen={addInstructorOpen}
          onClose={() => setAddInstructorOpen(false)}
          onCreated={(newInst) => {
            // Update local state in context
            addAuditLog({
              actor: "Administrator",
              role: "admin",
              action: "CREATE",
              target: `User (${newInst.name})`,
              detail: `Created Instructor account for ${newInst.email} with OTP notification`,
            });
          }}
        />
      )}
    </DashboardLayout>
  );
}

