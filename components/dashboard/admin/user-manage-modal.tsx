"use client";

import React, { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { getInitials } from "@/lib/app-data";
import type { AdminUser, Role } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface UserManageModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, role: Role, status: AdminUser["status"]) => void;
  onDelete: (id: string) => void;
}

export function UserManageModal({
  user,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: UserManageModalProps) {
  const [role, setRole] = useState<Role>(user?.role || "student");
  const [status, setStatus] = useState<AdminUser["status"]>(user?.status || "active");

  if (!isOpen || !user) return null;

  const handleSave = () => {
    onSave(user.id, role, status);
    onClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <GlassCard className="w-full max-w-md p-6 md:p-8 shadow-2xl border-white/20">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="size-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620] font-display font-bold">
              {getInitials(user.name)}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">{user.name}</h3>
              <p className="text-xs text-ink-faint font-mono">{user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink"
            aria-label="Close modal"
          >
            <DashboardIcon name="close" className="size-4" />
          </button>
        </div>

        <div className="space-y-4 my-6">
          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              System Role
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade cursor-pointer"
            >
              <option value="student" className="bg-night-800">
                Student
              </option>
              <option value="instructor" className="bg-night-800">
                Instructor
              </option>
              <option value="admin" className="bg-night-800">
                Registrar / Admin
              </option>
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Account Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminUser["status"])}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade cursor-pointer"
            >
              <option value="active" className="bg-night-800">
                Active
              </option>
              <option value="suspended" className="bg-night-800">
                Suspended
              </option>
              <option value="graduated" className="bg-night-800">
                Graduated
              </option>
              <option value="on leave" className="bg-night-800">
                On Leave
              </option>
            </select>
          </label>

          <p className="text-xs text-ink-faint">
            Role updates are recorded in the security audit trail with the actor ID and timestamp.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-rose hover:underline"
          >
            Soft delete
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
            >
              Save Changes
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
