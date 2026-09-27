"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "@/components/dashboard/icons";
import { Meter } from "@/components/dashboard/meter";
import { BrandLogo } from "@/components/site/brand-logo";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { ROLE_LABELS } from "@/lib/app-data";
import type { Role } from "@/lib/app-types";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  tag?: string;
  group?: string;
}

const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  student: [
    { group: "Study", href: "", label: "", icon: "" },
    { href: "/student", label: "Overview", icon: "home" },
    { href: "/student/registration", label: "Registration", icon: "cart", tag: "Open" },
    { href: "/student/courses", label: "My courses", icon: "book" },
    { href: "/student/attendance", label: "Attendance", icon: "check" },
    { href: "/student/results", label: "Results", icon: "award" },
    { group: "Account", href: "", label: "", icon: "" },
    { href: "/student/fees", label: "Fees & payments", icon: "card", tag: "Due" },
    { href: "/profile", label: "Profile", icon: "user" },
  ],
  instructor: [
    { group: "Teaching", href: "", label: "", icon: "" },
    { href: "/instructor", label: "Overview", icon: "home" },
    { href: "/instructor/attendance", label: "Take attendance", icon: "check" },
    { href: "/instructor/grades", label: "Grade entry", icon: "award", tag: "3" },
    { group: "Account", href: "", label: "", icon: "" },
    { href: "/profile", label: "Profile", icon: "user" },
  ],
  admin: [
    { group: "Operations", href: "", label: "", icon: "" },
    { href: "/admin", label: "Overview", icon: "home" },
    { href: "/admin/users", label: "Users & roles", icon: "users" },
    { href: "/admin/courses", label: "Courses & sections", icon: "layers" },
    { href: "/admin/payments", label: "Payments", icon: "card" },
    { group: "System", href: "", label: "", icon: "" },
    { href: "/admin/audit", label: "Audit log", icon: "activity" },
    { href: "/profile", label: "Profile", icon: "user" },
  ],
};

interface AppSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({ mobileOpen, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { role, term } = useApp();
  const navItems = DASHBOARD_NAV[role] || DASHBOARD_NAV.student;

  const isActive = (href: string) => {
    if (!href) return false;
    if (href === "/student" || href === "/instructor" || href === "/admin" || href === "/profile") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile scrim overlay */}
      <div
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 md:w-[268px] flex flex-col justify-between p-5 bg-[rgba(11,16,48,0.92)] lg:bg-[rgba(11,16,48,0.72)] border-r border-white/9 backdrop-blur-[24px] backdrop-saturate-150 transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col gap-5 overflow-y-auto">
          {/* Logo Lockup */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              onClick={onCloseMobile}
            >
              <BrandLogo variant="mark" imgClassName="h-9 w-auto" decorative />
              <div>
                <span className="font-display text-lg font-bold block leading-tight text-ink group-hover:text-jade transition-colors">
                  Bidyapith
                </span>
                <span className="text-[0.68rem] tracking-widest uppercase text-ink-faint font-semibold">
                  {ROLE_LABELS[role]}
                </span>
              </div>
            </Link>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-ink-faint hover:text-ink"
              aria-label="Close menu"
            >
              <DashboardIcon name="close" className="size-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 mt-2">
            {navItems.map((item, idx) => {
              if (item.group) {
                return (
                  <p
                    key={idx}
                    className="text-[0.68rem] font-bold tracking-widest uppercase text-ink-faint pt-4 pb-1.5 px-3"
                  >
                    {item.group}
                  </p>
                );
              }

              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={`${item.href}?role=${role}`}
                  onClick={onCloseMobile}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-[0.9rem] font-medium transition-all duration-200 group border border-transparent",
                    active
                      ? "bg-jade/12 border-jade/30 text-ink font-semibold"
                      : "text-ink-muted hover:text-ink hover:bg-white/[0.055]"
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors",
                      active ? "text-jade" : "text-ink-faint group-hover:text-ink"
                    )}
                  >
                    <DashboardIcon name={item.icon} className="size-4" />
                  </span>
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="ml-auto text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-marigold/20 text-[#FFD9A6]">
                      {item.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="space-y-3 pt-4 border-t border-white/8">
          <GlassCard className="p-3 bg-white/[0.035] shadow-none border-white/8">
            <p className="text-[0.7rem] text-ink-faint">{term.name}</p>
            <p className="text-xs font-semibold text-ink mt-0.5">
              Week {term.week} of {term.of}
            </p>
            <Meter
              value={term.week}
              max={term.of}
              className="mt-2 h-1.5"
              tone="jade"
            />
          </GlassCard>

          <Link
            href="/login"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ink-muted hover:text-rose hover:bg-rose/10 transition-colors"
          >
            <DashboardIcon name="out" className="size-4" />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
