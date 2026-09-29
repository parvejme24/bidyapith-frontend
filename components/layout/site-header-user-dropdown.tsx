"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteHeaderUserDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  avatarUrl: string;
  userName: string;
  userEmail: string;
  userRole: string;
  dashboardHref: string;
  profileHref: string;
  onLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function SiteHeaderUserDropdown({
  isOpen,
  onToggle,
  onClose,
  avatarUrl,
  userName,
  userEmail,
  userRole,
  dashboardHref,
  profileHref,
  onLogout,
  dropdownRef,
}: SiteHeaderUserDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative size-9 rounded-full p-0.5 border transition-all cursor-pointer overflow-hidden",
          isOpen
            ? "border-jade ring-2 ring-jade/30 scale-105"
            : "border-white/20 hover:border-jade/60 hover:scale-105"
        )}
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        <img
          src={avatarUrl}
          alt={userName}
          className="size-full rounded-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl sm:rounded-2xl border border-white/15 bg-night-900/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-1.5">
            <img
              src={avatarUrl}
              alt={userName}
              className="size-10 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">{userName}</p>
              <p className="text-[0.72rem] text-ink-faint truncate">{userEmail}</p>
              <span className="inline-block text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-jade/15 text-jade mt-1">
                {userRole.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              href={dashboardHref}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-jade/10 hover:text-jade transition-colors"
              onClick={onClose}
            >
              <LayoutDashboard className="size-4 text-jade" />
              <span>Open Dashboard</span>
            </Link>

            <Link
              href={profileHref}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-white/[0.07] transition-colors"
              onClick={onClose}
            >
              <User className="size-4 text-ink-muted" />
              <span>My Profile</span>
            </Link>
          </div>

          {/* Divider & Sign Out */}
          <div className="my-1.5 border-t border-white/10 pt-1.5">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose hover:bg-rose/10 transition-colors text-left cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
