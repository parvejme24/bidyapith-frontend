"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatShortDate, getInitials, ROLE_LABELS } from "@/lib/app-data";
import { DB } from "@/lib/data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ProfileView() {
  const { user, updateUser, role } = useApp();

  const [phone, setPhone] = useState(user.phone || "");
  const [altEmail, setAltEmail] = useState("");
  const [address, setAddress] = useState(DB.meta.address || "");

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ phone });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      toast.error("Please fill in current and new password");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New passwords do not match");
      return;
    }
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    toast.success("Password updated — PATCH /auth/password");
  };

  const detailsList = [
    { label: "Full Name", value: user.name },
    { label: "User ID", value: user.id },
    { label: "Official Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Designation / Role", value: ROLE_LABELS[role] },
    user.program ? { label: "Program / Post", value: user.program } : null,
    user.batch ? { label: "Batch", value: user.batch } : null,
    user.advisor ? { label: "Academic Advisor", value: user.advisor } : null,
    user.office ? { label: "Office Location", value: user.office } : null,
    user.admitted ? { label: "Admitted Date", value: formatShortDate(user.admitted) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
      {/* Left Column: Profile Card & Edit Contact */}
      <div className="space-y-6">
        {/* Profile Card */}
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/8">
            <span
              className={cn(
                "size-16 rounded-full flex items-center justify-center font-display font-bold text-xl shrink-0 shadow-lg",
                user.avatar === "gold"
                  ? "bg-gradient-to-br from-[#FFD9A6] to-[#FFB454] text-[#33230A]"
                  : user.avatar === "orchid"
                  ? "bg-gradient-to-br from-[#D3CBFF] to-[#9B8CFF] text-[#171141]"
                  : "bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620]"
              )}
            >
              {getInitials(user.name)}
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">{user.name}</h2>
              <p className="text-xs font-mono text-ink-faint mt-0.5">
                {user.id} · {ROLE_LABELS[role]}
              </p>
            </div>
          </div>

          <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
            {detailsList.map((item, idx) => (
              <div key={idx}>
                <dt className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
                  {item.label}
                </dt>
                <dd className="mt-1 font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>

        {/* Edit Contact Details Form */}
        <GlassCard className="p-6 md:p-8">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">
            Edit Contact Details
          </h3>
          <form onSubmit={handleSaveContact} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                  Mobile Number
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1712 000000"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-jade font-mono"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                  Alternate Personal Email
                </span>
                <input
                  type="email"
                  value={altEmail}
                  onChange={(e) => setAltEmail(e.target.value)}
                  placeholder="personal@gmail.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-jade"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                Present Residential Address
              </span>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House, road, area, city"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-jade resize-none"
              />
            </label>

            <button
              type="submit"
              className={cn(buttonClass({ variant: "primary", size: "sm" }))}
            >
              Save Profile Changes
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Right Column: Password & Active Sessions */}
      <div className="space-y-6">
        {/* Security / Password */}
        <GlassCard className="p-6 md:p-7">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">
            Security & Password
          </h3>
          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Current Password
              </span>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                New Password
              </span>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Confirm New Password
              </span>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade"
              />
            </label>

            <button
              type="submit"
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "w-full mt-2")}
            >
              Update Password
            </button>
          </form>
        </GlassCard>

        {/* Active Sessions */}
        <GlassCard className="p-6 md:p-7">
          <h3 className="font-display text-lg font-semibold text-ink mb-4">
            Active Sessions
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex gap-3 pb-3 border-b border-white/8">
              <span className="size-2 rounded-full bg-jade mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-ink">macOS / Chrome · Dhaka, BD</p>
                <p className="text-ink-faint mt-0.5">Current device · Active now</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="size-2 rounded-full bg-orchid mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-ink">Android Mobile App · Dhaka, BD</p>
                <p className="text-ink-faint mt-0.5">Last active 2 days ago</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Other sessions revoked — POST /auth/logout-all")}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "w-full mt-5 text-xs text-ink-muted")}
          >
            Sign out all other sessions
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
