"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { UserManageModal } from "@/components/dashboard/admin/user-manage-modal";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusPill } from "@/components/dashboard/status-pill";
import { useApp } from "@/lib/app-context";
import { formatShortDate, getInitials } from "@/lib/app-data";
import type { AdminUser } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const { adminUsers, updateUserRole, deleteUser } = useApp();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

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
            <p className="text-[0.72rem] text-ink-faint">{r.email}</p>
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
        <button
          onClick={() => setSelectedUser(r)}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          Manage
        </button>
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
        <button
          onClick={() => toast.success("Invite sent — POST /admin/users/invite")}
          className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="plus" className="size-3.5" />
          <span>Invite user</span>
        </button>
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
    </DashboardLayout>
  );
}
