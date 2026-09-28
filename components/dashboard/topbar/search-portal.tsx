"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  Calendar,
  CreditCard,
  FileCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Search,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { APP_DATA } from "@/lib/app-data";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "Navigation"
    | "Course"
    | "Study"
    | "Teaching"
    | "Section"
    | "Student"
    | "User"
    | "Attendance"
    | "Finance"
    | "Notice"
    | "Advising"
    | "Audit";
  href: string;
  icon: React.ReactNode;
}

export function SearchPortal() {
  const router = useRouter();
  const { role, searchQuery, setSearchQuery } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInputMobileRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputMobileRef.current?.focus();
        setSearchFocused(true);
      } else if (e.key === "Escape") {
        setSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Role-tailored dynamic search catalog
  const allSearchItems: SearchItem[] = useMemo(() => {
    if (role === "student") {
      return [
        {
          id: "student-dash",
          title: "Student Dashboard Overview",
          subtitle: "Current semester academic progress, GPA standing & schedule",
          category: "Navigation",
          href: "/student?role=student",
          icon: <LayoutDashboard className="size-4 text-jade" />,
        },
        {
          id: "student-reg",
          title: "Course Registration & Advising",
          subtitle: "Advising portal, elective selection & credit check",
          category: "Course",
          href: "/student/registration?role=student",
          icon: <BookOpen className="size-4 text-jade" />,
        },
        {
          id: "student-courses",
          title: "Enrolled Courses & Timetable",
          subtitle: "Weekly routine, classrooms & faculty instructors",
          category: "Course",
          href: "/student/courses?role=student",
          icon: <GraduationCap className="size-4 text-orchid" />,
        },
        {
          id: "student-att",
          title: "Attendance Tracker & Clearance",
          subtitle: "Session attendance records, exam eligibility (min 75%)",
          category: "Attendance",
          href: "/student/attendance?role=student",
          icon: <Calendar className="size-4 text-marigold" />,
        },
        {
          id: "student-res",
          title: "Semester Results & GPA Transcript",
          subtitle: "Grading records, CGPA ledger & completed credits",
          category: "Study",
          href: "/student/results?role=student",
          icon: <Award className="size-4 text-orchid" />,
        },
        {
          id: "student-fees",
          title: "Tuition Fees & Payments",
          subtitle: "Due installment invoices, bKash / cards checkout",
          category: "Finance",
          href: "/student/fees?role=student",
          icon: <CreditCard className="size-4 text-rose" />,
        },
        {
          id: "student-prof",
          title: "Student Academic Profile",
          subtitle: "Contact details, degree requirements & batch standing",
          category: "Navigation",
          href: "/profile?role=student",
          icon: <User className="size-4 text-sky-400" />,
        },
        ...APP_DATA.student.enrolled.map((c) => ({
          id: `st-c-${c.code}`,
          title: `${c.code}: ${c.title}`,
          subtitle: `Sec ${c.section} · ${c.instructor} · Room ${c.room} · ${c.credits} Credits`,
          category: "Course" as const,
          href: "/student/courses?role=student",
          icon: <BookOpen className="size-4 text-jade" />,
        })),
      ];
    }

    if (role === "instructor") {
      return [
        {
          id: "inst-dash",
          title: "Faculty Dashboard",
          subtitle: "Teaching load, assigned sections & schedule",
          category: "Navigation",
          href: "/instructor?role=instructor",
          icon: <LayoutDashboard className="size-4 text-jade" />,
        },
        {
          id: "inst-att",
          title: "Class Attendance Management",
          subtitle: "Mark daily session attendance, roster pan & live rates",
          category: "Attendance",
          href: "/instructor/attendance?role=instructor",
          icon: <Calendar className="size-4 text-marigold" />,
        },
        {
          id: "inst-grades",
          title: "Continuous Assessment Grade Entry",
          subtitle: "Submit midterm marks, final assessments & grade lock",
          category: "Teaching",
          href: "/instructor/grades?role=instructor",
          icon: <Award className="size-4 text-orchid" />,
        },
        {
          id: "inst-prof",
          title: "Faculty Profile & Research",
          subtitle: "Academic designation, room office & research interests",
          category: "Navigation",
          href: "/profile?role=instructor",
          icon: <User className="size-4 text-sky-400" />,
        },
        ...APP_DATA.instructor.sections.map((s) => ({
          id: `inst-sec-${s.code}-${s.section}`,
          title: `${s.title} (${s.code} · Sec ${s.section})`,
          subtitle: `Room: ${s.room} · Schedule: ${s.slots.join(", ")} · Enrolled: ${s.enrolled}/${s.capacity}`,
          category: "Section" as const,
          href: "/instructor/attendance?role=instructor",
          icon: <BookOpen className="size-4 text-orchid" />,
        })),
      ];
    }

    // Admin Catalog
    return [
      {
        id: "admin-dash",
        title: "Admin Command Center",
        subtitle: "University KPIs, admissions analytics & revenue trends",
        category: "Navigation",
        href: "/admin?role=admin",
        icon: <LayoutDashboard className="size-4 text-jade" />,
      },
      {
        id: "admin-users",
        title: "User Management & Roles",
        subtitle: "Manage students, onboard faculty instructors with OTP, assign roles & access",
        category: "User",
        href: "/admin/users?role=admin",
        icon: <Users className="size-4 text-sky-400" />,
      },
      {
        id: "admin-courses",
        title: "Course Catalog & Section Allocation",
        subtitle: "Schedule sections, assign faculty instructors & manage room capacities",
        category: "Section",
        href: "/admin/courses?role=admin",
        icon: <BookOpen className="size-4 text-orchid" />,
      },
      {
        id: "admin-payments",
        title: "Payment Transactions & Gateway Hub",
        subtitle: "Verify bKash / Cards IPN webhooks, process refunds & audit tuition fees",
        category: "Finance",
        href: "/admin/payments?role=admin",
        icon: <CreditCard className="size-4 text-rose" />,
      },
      {
        id: "admin-academic",
        title: "Academic Term, Deadlines & Notices",
        subtitle: "Configure semester operational status, exam dates & broadcast notices",
        category: "Navigation",
        href: "/admin/academic?role=admin",
        icon: <Calendar className="size-4 text-jade" />,
      },
      {
        id: "admin-audit",
        title: "System Audit & Security Logs",
        subtitle: "Immutable record of all admin role changes, grading approvals & financial IPNs",
        category: "Audit",
        href: "/admin/audit?role=admin",
        icon: <FileCheck className="size-4 text-purple-400" />,
      },
      {
        id: "admin-prof",
        title: "Admin Superuser Profile",
        subtitle: "Superuser settings, security credentials & contact information",
        category: "Navigation",
        href: "/profile?role=admin",
        icon: <User className="size-4 text-sky-400" />,
      },
      ...APP_DATA.admin.sections.map((sec) => ({
        id: `admin-sec-${sec.code}-${sec.section}`,
        title: `${sec.title} (${sec.code} · Sec ${sec.section})`,
        subtitle: `Instructor: ${sec.instructor} · Room: ${sec.room} · Enrolled: ${sec.enrolled}/${sec.capacity}`,
        category: "Section" as const,
        href: "/admin/courses?role=admin",
        icon: <BookOpen className="size-4 text-jade" />,
      })),
      ...APP_DATA.admin.payments.map((p) => ({
        id: `pay-${p.id}`,
        title: `${p.student} - ৳${p.amount.toLocaleString()} (${p.method})`,
        subtitle: `Txn: ${p.ref} · SID: ${p.sid} · Status: ${p.status.toUpperCase()} · ${p.at}`,
        category: "Finance" as const,
        href: "/admin/payments?role=admin",
        icon: <CreditCard className="size-4 text-rose" />,
      })),
    ];
  }, [role]);

  // Role-specific search placeholder
  const searchPlaceholder = useMemo(() => {
    switch (role) {
      case "student":
        return "Search courses, grades, attendance, fees...";
      case "instructor":
        return "Search teaching sections, roster students, marks...";
      case "admin":
        return "Search 127 users & roles, sections, payments, logs...";
      default:
        return "Search portal...";
    }
  }, [role]);

  // Filtered search results
  const filteredResults = searchQuery.trim()
    ? allSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectResult = (href: string) => {
    setSearchFocused(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      {/* Desktop / Tablet Search Input */}
      <div
        className={cn(
          "hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-muted transition-all min-w-[180px] md:min-w-[220px] lg:min-w-[260px]",
          searchFocused && "border-jade/50 bg-white/[0.08] ring-2 ring-jade/20"
        )}
      >
        <Search className="size-3.5 text-ink-faint shrink-0" />
        <input
          ref={searchInputRef}
          value={searchQuery}
          onFocus={() => setSearchFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="size-4 text-ink-faint hover:text-ink flex items-center justify-center cursor-pointer"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[0.62rem] font-mono text-ink-faint bg-white/5 border border-white/10 rounded">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Mobile Search Trigger Button (< sm) */}
      <button
        type="button"
        onClick={() => {
          setSearchFocused(true);
          setTimeout(() => searchInputMobileRef.current?.focus(), 50);
        }}
        className="sm:hidden size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Search portal"
      >
        <Search className="size-4" />
      </button>

      {/* Live Search Results Dropdown */}
      {searchFocused && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:left-auto sm:top-full sm:mt-2.5 sm:w-[480px] md:w-[540px] max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="rounded-xl border border-white/20 bg-night-900/98 backdrop-blur-2xl p-2.5 sm:p-3.5 shadow-2xl max-h-[85vh] sm:max-h-[500px] flex flex-col">
            {/* Mobile Search Input Bar */}
            <div className="sm:hidden flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-ink mb-2">
              <Search className="size-4 text-jade shrink-0" />
              <input
                ref={searchInputMobileRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="size-6 text-ink-faint hover:text-ink flex items-center justify-center cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchFocused(false)}
                className="text-xs font-semibold text-jade hover:underline pl-1 cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-white/10 text-xs shrink-0">
              <span className="font-semibold text-ink-faint uppercase tracking-wider text-[0.68rem] truncate mr-2">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : role === "student"
                  ? "Student Quick Access"
                  : role === "instructor"
                  ? "Faculty Directory & Routine"
                  : "Admin Directory & Ledger"}
              </span>
              <span className="text-[0.65rem] text-ink-faint font-mono shrink-0">
                {filteredResults.length > 0 ? `${filteredResults.length} matches` : "Live index"}
              </span>
            </div>

            <div className="overflow-y-auto space-y-1 pr-1 flex-1 overscroll-contain">
              {(searchQuery ? filteredResults : allSearchItems.slice(0, 8)).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectResult(item.href)}
                  className="w-full text-left flex items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-white/[0.08] hover:border-jade/30 border border-transparent transition-all group cursor-pointer"
                >
                  <div className="size-8 sm:size-9 rounded-md bg-white/5 flex items-center justify-center shrink-0 border border-white/8 group-hover:bg-jade/15 group-hover:border-jade/30 transition-colors mt-0.5">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <p className="text-xs font-semibold text-ink group-hover:text-jade transition-colors truncate">
                        {item.title}
                      </p>
                      <span
                        className={cn(
                          "text-[0.62rem] font-semibold px-2 py-0.5 rounded-full shrink-0",
                          item.category === "Navigation" && "bg-white/5 text-ink-faint border border-white/10",
                          (item.category === "Course" || item.category === "Study") &&
                            "bg-jade/15 text-jade border border-jade/20",
                          (item.category === "Teaching" || item.category === "Section") &&
                            "bg-orchid/15 text-orchid border border-orchid/20",
                          (item.category === "Student" || item.category === "User") &&
                            "bg-sky-500/15 text-sky-400 border border-sky-500/20",
                          item.category === "Attendance" &&
                            "bg-marigold/15 text-marigold border border-marigold/20",
                          item.category === "Finance" &&
                            "bg-rose/15 text-rose border border-rose/20",
                          (item.category === "Notice" || item.category === "Advising") &&
                            "bg-amber-400/15 text-amber-400 border border-amber-400/20",
                          item.category === "Audit" &&
                            "bg-purple-400/15 text-purple-400 border border-purple-400/20"
                        )}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-ink-muted line-clamp-2 sm:line-clamp-1 mt-0.5 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}

              {searchQuery && filteredResults.length === 0 && (
                <div className="py-8 text-center text-xs text-ink-muted">
                  <Search className="size-6 text-ink-faint mx-auto mb-2 opacity-50" />
                  <p>No matching portal records found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-ink-faint text-[0.7rem] mt-1">
                    Try searching for course codes (CSE-2201), student IDs, or section titles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
