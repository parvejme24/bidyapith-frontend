"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Check, ChevronDown, KeyRound, Mail, ShieldAlert, Trash2, UserCog } from "lucide-react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const ROLE_OPTIONS: Array<{ value: Role; label: string; desc: string }> = [
  { value: "student", label: "Student", desc: "Course enrollment, attendance, grades, and fees" },
  { value: "instructor", label: "Instructor", desc: "Grade submission, attendance roster, and sections" },
  { value: "admin", label: "Registrar / Admin", desc: "Full administrative access and auditing" },
];

const STATUS_OPTIONS: Array<{ value: AdminUser["status"]; label: string; tone: string }> = [
  { value: "active", label: "Active", tone: "text-jade" },
  { value: "suspended", label: "Suspended", tone: "text-rose" },
  { value: "graduated", label: "Graduated", tone: "text-orchid" },
  { value: "on leave", label: "On Leave", tone: "text-marigold" },
];

export function UserManageModal({
  user,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: UserManageModalProps) {
  const [role, setRole] = useState<Role>(user?.role || "student");
  const [status, setStatus] = useState<AdminUser["status"]>(user?.status || "active");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  if (!isOpen || !user) return null;

  const currentRole = ROLE_OPTIONS.find((r) => r.value === role) || ROLE_OPTIONS[0];
  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  const handleSave = () => {
    onSave(user.id, role, status);
    toast.success(`Updated ${user.name}'s role to ${role.toUpperCase()} (${status})`);
    onClose();
  };

  const handleDelete = () => {
    onDelete(user.id);
    toast.success(`User ${user.name} removed`);
    onClose();
  };

  const handleSendOtpCredentials = () => {
    setIsSendingOtp(true);
    const mockOtp = Math.floor(100000 + Math.random() * 900000);
    setTimeout(() => {
      setIsSendingOtp(false);
      toast.success(`Login OTP ${mockOtp} & password reset link sent to ${user.email}`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <GlassCard className="w-full max-w-lg p-5 sm:p-6 shadow-2xl border-white/20 rounded-md sm:rounded-lg">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "size-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0",
                role === "admin"
                  ? "bg-gradient-to-br from-[#D3CBFF] to-[#9B8CFF] text-[#171141]"
                  : role === "instructor"
                  ? "bg-gradient-to-br from-[#FFD9A6] to-[#FFB454] text-[#33230A]"
                  : "bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620]"
              )}
            >
              {getInitials(user.name)}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-ink truncate">{user.name}</h3>
              <p className="text-xs text-ink-faint font-mono truncate">
                {user.id} · {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <DashboardIcon name="close" className="size-3.5" />
          </button>
        </div>

        {/* Body Fields */}
        <div className="space-y-4 my-5">
          {/* System Role Selection with Shadcn Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              System Access Role
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full flex items-center justify-between gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-sm text-ink outline-none hover:bg-white/[0.07] hover:border-white/25 focus:border-jade/50 transition-colors cursor-pointer"
              >
                <div className="text-left min-w-0">
                  <span className="font-semibold text-ink block">{currentRole.label}</span>
                  <span className="text-[0.72rem] text-ink-faint block truncate">
                    {currentRole.desc}
                  </span>
                </div>
                <ChevronDown className="size-4 text-ink-faint shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[calc(100vw-3rem)] sm:w-[440px] max-w-full rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {ROLE_OPTIONS.map((opt) => {
                  const isSelected = role === opt.value;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setRole(opt.value)}
                      className={cn(
                        "flex items-start justify-between p-3 rounded-md text-xs cursor-pointer transition-colors",
                        isSelected
                          ? "bg-jade/15 text-ink font-semibold"
                          : "text-ink-muted hover:bg-white/[0.08] hover:text-ink"
                      )}
                    >
                      <div>
                        <span className={cn("font-bold block", isSelected ? "text-jade" : "text-ink")}>
                          {opt.label}
                        </span>
                        <span className="text-[0.7rem] text-ink-faint block mt-0.5">
                          {opt.desc}
                        </span>
                      </div>
                      {isSelected && <Check className="size-4 text-jade shrink-0 mt-0.5" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Account Status Selection with Shadcn Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Account Status
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full flex items-center justify-between gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:bg-white/[0.07] hover:border-white/25 focus:border-jade/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      status === "active"
                        ? "bg-jade"
                        : status === "suspended"
                        ? "bg-rose"
                        : status === "graduated"
                        ? "bg-orchid"
                        : "bg-marigold"
                    )}
                  />
                  <span className="font-semibold text-ink">{currentStatus.label}</span>
                </div>
                <ChevronDown className="size-4 text-ink-faint shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = status === opt.value;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer font-medium transition-colors",
                        isSelected
                          ? "bg-jade/15 text-jade font-semibold"
                          : "text-ink-muted hover:bg-white/[0.08] hover:text-ink"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-2 rounded-full shrink-0",
                            opt.value === "active"
                              ? "bg-jade"
                              : opt.value === "suspended"
                              ? "bg-rose"
                              : opt.value === "graduated"
                              ? "bg-orchid"
                              : "bg-marigold"
                          )}
                        />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick OTP / Security Action */}
          <div className="p-3 rounded-md border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-jade" />
                <span>One-Time Passcode (OTP)</span>
              </span>
              <p className="text-[0.68rem] text-ink-faint mt-0.5 truncate">
                Send direct login OTP & credential reset link to user
              </p>
            </div>
            <button
              type="button"
              disabled={isSendingOtp}
              onClick={handleSendOtpCredentials}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-jade/15 text-jade hover:bg-jade/25 border border-jade/30 transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center gap-1"
            >
              <Mail className="size-3" />
              <span>{isSendingOtp ? "Sending..." : "Send OTP"}</span>
            </button>
          </div>

          <p className="text-[0.7rem] text-ink-faint">
            Role and permission updates are immutably signed and recorded in the university audit ledger with your administrator ID.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs text-rose hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Soft delete user</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs rounded-md")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs rounded-md")}
            >
              Save Changes
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
