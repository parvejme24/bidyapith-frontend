"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { getInitials, ROLE_LABELS } from "@/lib/app-data";
import type { Role } from "@/lib/app-types";
import { cn } from "@/lib/utils";

interface AppTopbarProps {
  title: string;
  crumb?: string;
  onOpenMobileMenu: () => void;
}

export function AppTopbar({ title, crumb, onOpenMobileMenu }: AppTopbarProps) {
  const { role, setRole, user, notifications, notificationOpen, setNotificationOpen, searchQuery, setSearchQuery } = useApp();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-3.5 bg-[rgba(11,16,48,0.85)] border-b border-white/8 backdrop-blur-[20px] backdrop-saturate-150">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
          aria-label="Open sidebar menu"
        >
          <DashboardIcon name="menu" className="size-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="text-xs md:text-sm text-ink-faint flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
          <span>{crumb || ROLE_LABELS[role]}</span>
          <span>/</span>
          <b className="text-ink font-semibold">{title}</b>
        </div>

        {/* Right tools */}
        <div className="ml-auto flex items-center gap-2.5">
          {/* Global search */}
          <label className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-muted focus-within:border-jade/50 focus-within:bg-white/[0.08] min-w-[200px] lg:min-w-[240px]">
            <DashboardIcon name="search" className="size-3.5 text-ink-faint" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search portal..."
              className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
            />
          </label>

          {/* Role switcher */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-ink outline-none hover:bg-white/10 focus:border-jade/60 cursor-pointer shadow-sm"
            aria-label="Switch demo role"
          >
            <option value="student" className="bg-night-800 text-ink">
              Student demo
            </option>
            <option value="instructor" className="bg-night-800 text-ink">
              Instructor demo
            </option>
            <option value="admin" className="bg-night-800 text-ink">
              Registrar / Admin demo
            </option>
          </select>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/10 transition-colors"
              aria-label="Notifications"
            >
              <DashboardIcon name="bell" className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-marigold shadow-[0_0_0_2px_rgba(11,16,48,0.9)]" />
            </button>

            {/* Notification Drawer Popover */}
            {notificationOpen && (
              <div className="absolute right-0 top-11 w-80 sm:w-96 z-50 animate-in fade-in zoom-in-95 duration-200">
                <GlassCard className="p-4 shadow-2xl border-white/20 bg-night-800/95 backdrop-blur-2xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <h3 className="font-display font-semibold text-sm text-ink">
                      Notifications & Updates
                    </h3>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="text-ink-faint hover:text-ink text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {notifications.map((item, idx) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <span
                          className={cn(
                            "size-2 rounded-full mt-1.5 shrink-0",
                            item.tone === "gold" && "bg-marigold",
                            item.tone === "rose" && "bg-rose",
                            item.tone === "orchid" && "bg-orchid",
                            !item.tone && "bg-jade"
                          )}
                        />
                        <div>
                          <p className="font-semibold text-ink leading-tight">{item.t}</p>
                          <p className="text-ink-muted mt-0.5 leading-relaxed">{item.m}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>

          {/* User profile avatar badge */}
          <Link
            href={`/profile?role=${role}`}
            className="flex items-center gap-2 pl-1 group hover:opacity-90 transition-opacity"
          >
            <span
              className={cn(
                "size-8 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0 shadow-sm",
                user.avatar === "gold"
                  ? "bg-gradient-to-br from-[#FFD9A6] to-[#FFB454] text-[#33230A]"
                  : user.avatar === "orchid"
                  ? "bg-gradient-to-br from-[#D3CBFF] to-[#9B8CFF] text-[#171141]"
                  : "bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620]"
              )}
            >
              {getInitials(user.name)}
            </span>
            <div className="hidden lg:block text-left leading-none">
              <span className="text-xs font-semibold text-ink block group-hover:text-jade transition-colors">
                {user.name.split(" ")[0]}
              </span>
              <span className="text-[0.68rem] text-ink-faint font-mono">{user.id}</span>
            </div>
          </Link>
        </div>
      </header>
    </>
  );
}
