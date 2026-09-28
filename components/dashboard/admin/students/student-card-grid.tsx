"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  KeyRound,
  Mail,
  Search,
  Trash2,
} from "lucide-react";
import type { StudentData } from "./student-types";

interface StudentCardGridProps {
  students: StudentData[];
  search: string;
  setSearch: (value: string) => void;
  selectedDept: string;
  setSelectedDept: (value: string) => void;
  deptOptions: { value: string; label: string }[];
  onSendQuickOtp: (st: StudentData) => void;
  onDeleteStudent: (id: string, name: string) => void;
}

export function StudentCardGrid({
  students,
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  deptOptions,
  onSendQuickOtp,
  onDeleteStudent,
}: StudentCardGridProps) {
  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase()) ||
      st.id.toLowerCase().includes(search.toLowerCase()) ||
      st.dept.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === "all" || st.dept.toLowerCase() === selectedDept.toLowerCase();

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4">
      {/* Card Filter Toolbar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 grow">
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-muted focus-within:border-jade/50 focus-within:bg-white/[0.08] min-w-[240px] grow sm:grow-0">
            <Search className="size-4 text-ink-faint shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
            />
          </label>

          {/* Program Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors outline-none cursor-pointer",
                selectedDept !== "all"
                  ? "border-jade/40 bg-jade/10 text-jade"
                  : "border-white/10 bg-white/[0.04] text-ink hover:bg-white/[0.08]"
              )}
            >
              <span>
                {deptOptions.find((d) => d.value === selectedDept)?.label || selectedDept.toUpperCase()}
              </span>
              <ChevronDown className="size-3 text-ink-faint shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 rounded-lg bg-night-900/98 border-white/15 backdrop-blur-xl p-1 shadow-2xl z-50"
            >
              {deptOptions.map((dept) => (
                <DropdownMenuItem
                  key={dept.value}
                  onClick={() => setSelectedDept(dept.value)}
                  className={cn(
                    "flex items-center justify-between text-xs py-2 px-2.5 rounded-md cursor-pointer transition-colors",
                    selectedDept === dept.value
                      ? "bg-jade/15 text-jade font-semibold"
                      : "text-ink-muted hover:text-ink hover:bg-white/5"
                  )}
                >
                  <span>{dept.label}</span>
                  {selectedDept === dept.value && <Check className="size-3.5 text-jade" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="text-xs text-ink-faint font-mono">
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </GlassCard>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((st) => (
          <GlassCard
            key={st.id}
            className="p-5 flex flex-col justify-between hover:border-jade/30 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/8">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    name={st.name}
                    avatar={st.avatar}
                    size="md"
                    tone="jade"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink text-sm truncate group-hover:text-jade transition-colors">
                      {st.name}
                    </h3>
                    <p className="text-[0.68rem] text-ink-faint font-mono truncate mt-0.5">
                      {st.id}
                    </p>
                    <span className="inline-block text-[0.62rem] uppercase font-bold text-jade mt-0.5">
                      B.Sc. {st.dept.toUpperCase()}
                    </span>
                  </div>
                </div>
                <StatusPill tone={st.status === "active" ? "ok" : st.status === "graduated" ? "info" : "warn"}>
                  {st.status}
                </StatusPill>
              </div>

              <div className="py-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-faint">Academic CGPA:</span>
                  <span className="font-mono font-bold text-jade">{st.cgpa || "3.75"}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-faint">Completed Credits:</span>
                  <span className="font-mono text-ink font-semibold">{st.credits || "96"} / 140 Cr</span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted pt-1">
                  <Mail className="size-3.5 text-ink-faint shrink-0" />
                  <span className="font-mono truncate">{st.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSendQuickOtp(st)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[0.7rem] font-semibold text-ink transition-colors cursor-pointer"
              >
                <KeyRound className="size-3 text-marigold" />
                <span>Send Login OTP</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteStudent(st.id, st.name)}
                className="size-7 rounded-md border border-white/10 bg-white/[0.04] hover:bg-rose/15 hover:border-rose/30 text-ink-faint hover:text-rose transition-colors flex items-center justify-center cursor-pointer"
                title="Remove student"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
