"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, gradJadeClass, leadClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  CalendarCheck,
  BookOpenCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface ShowcaseItem {
  id: string;
  title: string;
  category: "Student Workspace" | "Faculty Workspace" | "Administration";
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  image: string;
  highlights: string[];
  link: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "student-dashboard",
    title: "Student Academic Dashboard",
    category: "Student Workspace",
    icon: GraduationCap,
    description:
      "A unified, real-time academic cockpit displaying cumulative CGPA progressions, term-by-term credit breakdowns, degree completion gauge, and live tuition balances.",
    image: "/screenshots/student-dashboard.png",
    highlights: [
      "Dynamic CGPA trend curves powered by Recharts",
      "Real-time degree progress circular gauge",
      "Instant registration window status and alert center",
      "Automated financial holds and tuition due notices",
    ],
    link: "/login",
  },
  {
    id: "course-registration",
    title: "Course Registration Engine",
    category: "Student Workspace",
    icon: BookOpenCheck,
    description:
      "Interactive self-service course registration with real-time seat availability gauges, automatic prerequisite validation, and schedule clash detection.",
    image: "/screenshots/course-registration.png",
    highlights: [
      "Live seat capacity and enrollment progress bars",
      "Departmental categorization and instant search",
      "Automatic timetable conflict prevention",
      "Direct section registration with tuition fee calculations",
    ],
    link: "/login",
  },
  {
    id: "student-attendance",
    title: "Student Attendance Record",
    category: "Student Workspace",
    icon: CalendarCheck,
    description:
      "Detailed lecture-by-lecture attendance tracking with monthly progression analytics, clearance status badges, and 75% exam eligibility verification.",
    image: "/screenshots/student-attendance.png",
    highlights: [
      "Monthly attendance percentage breakdown per course",
      "Automated 75% examination eligibility clearance status",
      "Daily lecture audit log with Present/Late/Absent breakdown",
      "One-click PDF & printable attendance slip export",
    ],
    link: "/login",
  },
  {
    id: "instructor-grades",
    title: "Instructor Grade Entry & Ledger",
    category: "Faculty Workspace",
    icon: Award,
    description:
      "High-density grading spreadsheet allowing faculty members to input continuous assessments, assignments, and final exam marks with live weighted GPA computation.",
    image: "/screenshots/instructor-grades.png",
    highlights: [
      "Keyboard-friendly tabular grade input interface",
      "Automatic UGC-compliant letter grade and GPA mapping",
      "Batch draft saving and formal grade sheet submission",
      "CSV template import and export support",
    ],
    link: "/login",
  },
  {
    id: "instructor-attendance",
    title: "Instructor Attendance Matrix",
    category: "Faculty Workspace",
    icon: CheckCircle2,
    description:
      "Comprehensive monthly calendar matrix for taking daily class attendance across all enrolled section students with horizontal panning and instant calculation.",
    image: "/screenshots/instructor-attendance.png",
    highlights: [
      "Calendar-based daily session marking (Present, Late, Absent)",
      "Real-time section average attendance computation",
      "Automatic highlighting of students at risk (<75%)",
      "Monthly CSV roster attendance reports",
    ],
    link: "/login",
  },
];

export function PortalPreview() {
  const [activeId, setActiveId] = useState<string>("student-dashboard");
  const activeItem = SHOWCASE_ITEMS.find((item) => item.id === activeId) || SHOWCASE_ITEMS[0];

  return (
    <section className="py-16 md:py-24 border-t border-white/5" id="workspaces">
      <div className={shellClass}>
        <Reveal>
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              Integrated Campus Experience
            </span>
            <h2 className={displayClass.d2}>
              Purpose-built portals for{" "}
              <span className={gradJadeClass}>every campus role</span>
            </h2>
            <p className={cn(leadClass, "mt-4")}>
              Explore the actual interfaces used by students, faculty, and administrators to manage
              academics, grading, attendance, and enrollment with zero friction.
            </p>
          </div>
        </Reveal>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {SHOWCASE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border cursor-pointer",
                  isActive
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-950/40"
                    : "bg-white/[0.03] border-white/10 text-ink-muted hover:bg-white/[0.07] hover:text-ink hover:border-white/20"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-ink-faint")} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Display Card */}
        <GlassCard strong className="overflow-hidden p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Screenshot Frame */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-50 blur-xl transition-all duration-500 group-hover:opacity-75" />
              <div className="relative overflow-hidden rounded-xl border border-white/15 bg-neutral-950/80 shadow-2xl">
                {/* Browser-like window header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/90 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-ink-faint truncate max-w-[200px] sm:max-w-xs">
                    https://bidyapith.edu/{activeItem.id.replace("-", "/")}
                  </span>
                  <div className="w-8" />
                </div>

                {/* Screenshot Image */}
                <div className="relative w-full aspect-[16/10] bg-neutral-900">
                  <Image
                    src={activeItem.image}
                    alt={activeItem.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Feature Description & Highlights */}
            <div className="flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                {activeItem.category}
              </span>
              <h3 className={cn(displayClass.d3, "text-xl sm:text-2xl")}>{activeItem.title}</h3>
              <p className="text-sm sm:text-base text-ink-muted mt-3 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-medium text-ink-faint uppercase tracking-wider">
                  Key Capabilities
                </p>
                <ul className="space-y-2.5">
                  {activeItem.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-base">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={activeItem.link}
                  className={cn(buttonClass({ variant: "primary", size: "sm" }), "gap-2")}
                >
                  <span>Launch Live Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/admissions"
                  className={cn(buttonClass({ variant: "ghost", size: "sm" }), "gap-1.5")}
                >
                  <span>Admissions Info</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
