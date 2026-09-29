"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import { removeStoredToken } from "@/lib/api-client";
import { useApp } from "@/lib/app-context";
import { ROLE_LABELS } from "@/lib/format";

export function UserMenu() {
  const router = useRouter();
  const { role, user } = useApp();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    removeStoredToken();
    toast.success("Signed out successfully");
    setUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setUserMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 pl-1 group hover:opacity-90 transition-opacity cursor-pointer"
        aria-label="User menu"
        aria-expanded={userMenuOpen}
      >
        <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        <div className="hidden lg:block text-left leading-none">
          <span className="text-xs font-semibold text-ink block group-hover:text-jade transition-colors">
            {user.name.split(" ")[0]}
          </span>
          <span className="text-[0.68rem] text-ink-faint font-mono">{user.id}</span>
        </div>
      </button>

      {/* User Dropdown Menu */}
      {userMenuOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-xl border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 rounded-lg bg-white/[0.04] border border-white/8 mb-1.5 flex items-center gap-3">
            <UserAvatar name={user.name} avatar={user.avatar} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-ink truncate">{user.name}</p>
              <p className="text-[0.7rem] text-ink-faint font-mono truncate mt-0.5">
                {user.email || user.id}
              </p>
              <span className="inline-block text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-jade/15 text-jade border border-jade/25 mt-1 uppercase tracking-wider">
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <Link
              href={`/profile?role=${role}`}
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-white/[0.08] transition-colors"
            >
              <User className="size-3.5 text-ink-muted" />
              <span>My Profile</span>
            </Link>
            <Link
              href={`/${role}?role=${role}`}
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-ink-muted hover:text-ink hover:bg-white/[0.08] transition-colors"
            >
              <LayoutDashboard className="size-3.5 text-jade" />
              <span>Dashboard Home</span>
            </Link>
          </div>

          <div className="my-1 border-t border-white/10 pt-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose hover:bg-rose/15 transition-colors cursor-pointer text-left"
            >
              <LogOut className="size-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
