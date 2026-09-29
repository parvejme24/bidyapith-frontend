"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  Layers,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { Meter } from "@/components/dashboard/meter";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { formatTaka } from "@/lib/format";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import {
  useGetCoursesQuery,
} from "@/lib/redux/api/coursesApi";
import {
  useGetOfferingsQuery,
} from "@/lib/redux/api/offeringsApi";
import {
  useGetAdmissionsQuery,
} from "@/lib/redux/api/admissionsApi";
import {
  PUBLIC_COURSE_CATALOG,
  getCoursePublicDetails,
} from "./course-catalog-data";
import type { PublicCourseDetails } from "./course-public-details-modal";

interface CourseCatalogCardsProps {
  onOpenDetails: (course: PublicCourseDetails) => void;
}

export function CourseCatalogCards({ onOpenDetails }: CourseCatalogCardsProps) {
  const router = useRouter();
  const { student } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");

  // RTK Query hooks for live DB data
  const { data: dbCoursesRes, isLoading: coursesLoading } = useGetCoursesQuery();
  const { data: dbOfferingsRes, isLoading: offeringsLoading } = useGetOfferingsQuery();
  const { data: dbAdmissionsRes } = useGetAdmissionsQuery();

  const enrolledCodes = useMemo(
    () => new Set(student.enrolled.map((c) => c.code.toLowerCase())),
    [student.enrolled]
  );

  const appliedMap = useMemo(() => {
    const map = new Map<string, string>();
    const applications = dbAdmissionsRes?.data || [];
    applications.forEach((app: any) => {
      if (app.courseCode) {
        map.set(app.courseCode.toLowerCase(), app.status);
      }
    });
    return map;
  }, [dbAdmissionsRes]);

  // Merge live API courses with rich catalog details
  const allCourses: PublicCourseDetails[] = useMemo(() => {
    const map = new Map<string, PublicCourseDetails>();

    // 1. Preset rich catalog items
    PUBLIC_COURSE_CATALOG.forEach((c) => map.set(c.code.toLowerCase(), c));

    // 2. Real DB Offerings from live API
    if (dbOfferingsRes?.data && Array.isArray(dbOfferingsRes.data)) {
      dbOfferingsRes.data.forEach((offering: any) => {
        const c = offering.course;
        if (c?.code) {
          const codeKey = c.code.toLowerCase();
          const existing = map.get(codeKey);
          const instructorName = offering.instructor?.user
            ? `Prof. ${offering.instructor.user.firstName} ${offering.instructor.user.lastName}`
            : existing?.instructor || "Faculty Member";

          const schedules = offering.schedules || [];
          const scheduleStr =
            schedules.length > 0
              ? schedules.map((s: any) => `${s.dayOfWeek.slice(0, 3)} ${s.startTime}`).join(", ")
              : existing?.schedule || "Sun 10:00, Tue 10:00";

          map.set(codeKey, {
            code: c.code,
            title: c.title || existing?.title || "Academic Course",
            department: c.department?.name || existing?.department || "Computer Science & Engineering",
            credits: Number(c.credits || existing?.credits || 3),
            type: c.type === "CORE" ? "Core" : c.type === "ELECTIVE" ? "Elective" : "General",
            instructor: instructorName,
            room: offering.room || existing?.room || "AB2-401",
            schedule: scheduleStr,
            tuitionFee: Number(c.credits || 3) * 5000,
            prereq: c.prerequisites?.[0]?.prerequisiteCourse?.code || existing?.prereq,
            seats: offering.capacity || existing?.seats || 45,
            taken: offering.enrolledCount || existing?.taken || 30,
            description: c.description || existing?.description || `Detailed syllabus for ${c.title}`,
            learningOutcomes: existing?.learningOutcomes || [
              `Master core theoretical principles of ${c.title}.`,
              "Complete practical laboratory and real-world system implementations.",
            ],
            modules: existing?.modules || [
              { week: "Week 1–6", topic: "Theoretical Foundations", details: "Core lectures & algorithmic frameworks." },
              { week: "Week 7–12", topic: "Applied Laboratory", details: "Project implementation & examination." },
            ],
          });
        }
      });
    }

    // 3. Real DB Courses from live API
    if (dbCoursesRes?.data && Array.isArray(dbCoursesRes.data)) {
      dbCoursesRes.data.forEach((c: any) => {
        const codeKey = c.code.toLowerCase();
        if (!map.has(codeKey)) {
          map.set(codeKey, getCoursePublicDetails(c.code));
        }
      });
    }

    return Array.from(map.values());
  }, [dbCoursesRes, dbOfferingsRes]);

  const departments = [
    { id: "ALL", label: "All Departments" },
    { id: "cse", label: "Computer Science (CSE)" },
    { id: "eee", label: "Electrical (EEE)" },
    { id: "bba", label: "Business (BBA)" },
    { id: "civ", label: "Civil Eng (CIV)" },
    { id: "mat", label: "Mathematics & Physics" },
    { id: "law", label: "Law & Justice" },
  ];

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDept === "ALL" ||
        (selectedDept === "cse" && (course.code.startsWith("CSE") || course.code.startsWith("DSAI") || course.code.startsWith("SWE"))) ||
        (selectedDept === "eee" && course.code.startsWith("EEE")) ||
        (selectedDept === "bba" && (course.code.startsWith("BBA") || course.code.startsWith("ECO"))) ||
        (selectedDept === "civ" && course.code.startsWith("CIV")) ||
        (selectedDept === "mat" && (course.code.startsWith("MAT") || course.code.startsWith("PHY"))) ||
        (selectedDept === "law" && (course.code.startsWith("LAW") || course.code.startsWith("PHA") || course.code.startsWith("ENG")));

      return matchesSearch && matchesDept;
    });
  }, [allCourses, searchQuery, selectedDept]);

  const handleApply = (course: PublicCourseDetails) => {
    router.push(`/student/registration/apply?courseCode=${encodeURIComponent(course.code)}`);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search by course code, title, or professor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-ink placeholder:text-ink-faint focus:outline-none focus:border-jade/50 focus:bg-white/[0.07] transition-all"
          />
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="size-3.5 text-ink-faint shrink-0 mr-1" />
          {departments.map((dept) => (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                selectedDept === dept.id
                  ? "bg-jade text-night-900 shadow-sm"
                  : "bg-white/5 text-ink-muted hover:text-ink hover:bg-white/10"
              )}
            >
              {dept.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {(coursesLoading || offeringsLoading) && (
        <div className="flex items-center gap-2 text-xs text-jade font-mono p-3 rounded-xl bg-jade/10 border border-jade/20">
          <RefreshCw className="size-3.5 animate-spin" />
          <span>Synchronizing live course offerings from PostgreSQL Database...</span>
        </div>
      )}

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-ink-faint">
            <BookOpen className="size-10 mx-auto mb-3 text-ink-faint/60" />
            <p className="text-base font-semibold text-ink">No courses match your search</p>
            <p className="text-xs mt-1">Try searching by course code (e.g. CSE-4108) or clear filters.</p>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCodes.has(course.code.toLowerCase());
            const appliedStatus = appliedMap.get(course.code.toLowerCase());
            const isFull = course.taken >= course.seats;
            const seatsRemaining = Math.max(0, course.seats - course.taken);

            return (
              <GlassCard
                key={course.code}
                className={cn(
                  "flex flex-col justify-between p-5 rounded-2xl border-white/10 bg-white/[0.03] hover:border-jade/40 hover:bg-white/[0.05] transition-all duration-200 group relative",
                  isEnrolled && "border-jade/40 bg-jade/[0.04]",
                  appliedStatus && !isEnrolled && "border-amber-400/40 bg-amber-400/[0.03]"
                )}
              >
                <div>
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-jade px-2.5 py-0.5 rounded-md bg-jade/10 border border-jade/25">
                        {course.code}
                      </span>
                      <span className="text-[11px] font-mono text-ink-faint">
                        {course.credits} Credits · {course.type}
                      </span>
                    </div>

                    {isEnrolled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-jade bg-jade/15 border border-jade/30 px-2 py-0.5 rounded">
                        <CheckCircle2 className="size-3" /> Enrolled
                      </span>
                    ) : appliedStatus === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-cyan-400 bg-cyan-400/15 border border-cyan-400/30 px-2 py-0.5 rounded">
                        <FileCheck className="size-3" /> Approved (Pay Fee)
                      </span>
                    ) : appliedStatus === "PENDING_REVIEW" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">
                        <Sparkles className="size-3" /> Application Under Review
                      </span>
                    ) : isFull ? (
                      <span className="text-[11px] font-bold font-mono text-rose bg-rose/15 border border-rose/30 px-2 py-0.5 rounded">
                        Full Section
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold font-mono text-jade/90">
                        {seatsRemaining} Seats Open
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <h3 className="font-display text-base sm:text-lg font-bold text-ink group-hover:text-jade transition-colors leading-snug">
                    {course.title}
                  </h3>

                  {/* Department & Syllabus summary */}
                  <p className="text-xs text-ink-muted line-clamp-2 mt-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Meta Details List */}
                  <div className="mt-4 space-y-1.5 text-xs text-ink-faint font-mono">
                    <div className="flex items-center gap-2">
                      <User className="size-3.5 text-jade shrink-0" />
                      <span className="truncate">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-marigold shrink-0" />
                      <span className="truncate">{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{course.room}</span>
                    </div>
                  </div>

                  {/* Seats progress bar */}
                  <div className="mt-4 pt-3 border-t border-white/8 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-ink-faint">Class Capacity</span>
                      <span className="text-ink font-semibold">
                        {course.taken} / {course.seats} enrolled ({Math.round((course.taken / course.seats) * 100)}%)
                      </span>
                    </div>
                    <Meter
                      value={course.taken}
                      max={course.seats}
                      className="h-1.5"
                      tone={isFull ? "hot" : course.taken > 35 ? "warn" : "jade"}
                    />
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-ink-faint">Course Fee</span>
                    <span className="text-sm font-bold font-mono text-jade">{formatTaka(course.tuitionFee)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(course)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-ink transition-colors cursor-pointer"
                    >
                      Public Details
                    </button>

                    {isEnrolled ? (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-jade/20 text-jade cursor-default"
                      >
                        Enrolled
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(course)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 transition-all shadow-sm cursor-pointer"
                      >
                        <span>Register</span>
                        <ArrowRight className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
