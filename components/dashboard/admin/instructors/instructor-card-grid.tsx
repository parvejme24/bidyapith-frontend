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
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import type { InstructorData } from "./instructor-types";

interface InstructorCardGridProps {
  instructors: InstructorData[];
  search: string;
  setSearch: (value: string) => void;
  selectedDept: string;
  setSelectedDept: (value: string) => void;
  deptOptions: { value: string; label: string }[];
  onSendQuickOtp: (inst: InstructorData) => void;
  onDeleteInstructor: (id: string, name: string) => void;
}

export function InstructorCardGrid({
  instructors,
  search,
  setSearch,
  selectedDept,
  setSelectedDept,
  deptOptions,
  onSendQuickOtp,
  onDeleteInstructor,
}: InstructorCardGridProps) {
  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase()) ||
      inst.id.toLowerCase().includes(search.toLowerCase()) ||
      inst.dept.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === "all" || inst.dept.toLowerCase() === selectedDept.toLowerCase();

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
              placeholder="Search faculty..."
              className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
            />
          </label>

          {/* Department Filter Dropdown */}
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
          Showing {filteredInstructors.length} of {instructors.length} faculty members
        </span>
      </GlassCard>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstructors.map((inst) => (
          <GlassCard
            key={inst.id}
            className="p-5 flex flex-col justify-between hover:border-jade/30 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/8">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar
                    name={inst.name}
                    avatar={inst.avatar}
                    size="md"
                    tone="gold"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink text-sm truncate group-hover:text-jade transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-[0.72rem] text-jade font-semibold truncate mt-0.5">
                      {inst.designation}
                    </p>
                    <p className="text-[0.68rem] text-ink-faint font-mono truncate">
                      {inst.id} · {inst.dept.toUpperCase()}
                    </p>
                  </div>
                </div>
                <StatusPill tone={inst.status === "active" ? "ok" : "warn"}>
                  {inst.status}
                </StatusPill>
              </div>

              <div className="py-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-ink-muted">
                  <Mail className="size-3.5 text-ink-faint shrink-0" />
                  <span className="font-mono truncate">{inst.email}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Phone className="size-3.5 text-ink-faint shrink-0" />
                  <span className="font-mono">{inst.phone}</span>
                </div>
                <div className="flex items-center justify-between text-[0.72rem] pt-1 text-ink-faint">
                  <span>Faculty Office:</span>
                  <span className="font-mono text-ink font-semibold">{inst.room}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onSendQuickOtp(inst)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[0.7rem] font-semibold text-ink transition-colors cursor-pointer"
              >
                <KeyRound className="size-3 text-marigold" />
                <span>Send OTP</span>
              </button>
              <button
                type="button"
                onClick={() => onDeleteInstructor(inst.id, inst.name)}
                className="size-7 rounded-md border border-white/10 bg-white/[0.04] hover:bg-rose/15 hover:border-rose/30 text-ink-faint hover:text-rose transition-colors flex items-center justify-center cursor-pointer"
                title="Remove instructor"
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
