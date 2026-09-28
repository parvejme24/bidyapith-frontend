"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { Meter } from "@/components/dashboard/meter";
import { StatusPill } from "@/components/dashboard/status-pill";
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
  Layers,
  MapPin,
  Search,
  Trash2,
  User,
} from "lucide-react";
import type { AdminSection } from "@/lib/app-types";

interface CourseCardGridProps {
  sections: AdminSection[];
  search: string;
  setSearch: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  onEditSection: (sec: AdminSection) => void;
  onRetireSection: (code: string, sec: string) => void;
}

export function CourseCardGrid({
  sections,
  search,
  setSearch,
  selectedStatus,
  setSelectedStatus,
  onEditSection,
  onRetireSection,
}: CourseCardGridProps) {
  const filteredSections = sections.filter((s) => {
    const matchesSearch =
      !search.trim() ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.instructor.toLowerCase().includes(search.toLowerCase()) ||
      s.room.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;

    return matchesSearch && matchesStatus;
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
              placeholder="Search course sections..."
              className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
            />
          </label>

          {/* Status Filter with Shadcn Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all outline-none cursor-pointer select-none",
                selectedStatus !== "all"
                  ? "border-jade/40 bg-jade/12 text-jade ring-1 ring-jade/30"
                  : "border-white/10 bg-white/[0.04] text-ink-muted hover:bg-white/[0.08] hover:text-ink"
              )}
            >
              <span>
                {selectedStatus === "all"
                  ? "All Section Statuses"
                  : selectedStatus === "open"
                  ? "Open Sections"
                  : selectedStatus === "full"
                  ? "Full Sections"
                  : "Retired"}
              </span>
              <ChevronDown className="size-3 text-ink-faint opacity-80 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              {[
                { value: "all", label: "All Section Statuses" },
                { value: "open", label: "Open Sections" },
                { value: "full", label: "Full Sections" },
                { value: "retired", label: "Retired" },
              ].map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer font-medium transition-colors",
                    selectedStatus === opt.value
                      ? "bg-jade/15 text-jade font-semibold"
                      : "text-ink-muted hover:bg-white/[0.08] hover:text-ink"
                  )}
                >
                  <span>{opt.label}</span>
                  {selectedStatus === opt.value && <Check className="size-3.5 text-jade shrink-0" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="text-xs text-ink-faint font-mono">
          Showing {filteredSections.length} of {sections.length} sections
        </span>
      </GlassCard>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map((sec) => {
          const pct = sec.capacity > 0 ? Math.round((sec.enrolled / sec.capacity) * 100) : 0;
          return (
            <GlassCard
              key={`${sec.code}-${sec.section}`}
              className="p-5 flex flex-col justify-between hover:border-jade/30 transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/8">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-jade group-hover:underline">
                        {sec.code}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 text-ink font-bold border border-white/10">
                        Sec {sec.section}
                      </span>
                    </div>
                    <h3 className="font-bold text-ink text-sm truncate mt-1">
                      {sec.title}
                    </h3>
                  </div>
                  <StatusPill tone={sec.status === "open" ? "ok" : sec.status === "full" ? "warn" : "mute"}>
                    {sec.status}
                  </StatusPill>
                </div>

                {/* Section Details */}
                <div className="py-3 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-ink">
                    <User className="size-3.5 text-orchid shrink-0" />
                    <span className="font-medium truncate">{sec.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-faint">
                    <MapPin className="size-3.5 text-marigold shrink-0" />
                    <span className="font-mono">
                      Allocated Room: <b className="text-ink">{sec.room}</b>
                    </span>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[0.7rem]">
                      <span className="text-ink-faint">Seat Allocation:</span>
                      <span className="font-mono font-bold text-ink">
                        {sec.enrolled} / {sec.capacity} ({pct}%)
                      </span>
                    </div>
                    <Meter value={sec.enrolled} max={sec.capacity} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="pt-3 border-t border-white/8 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onEditSection(sec)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-jade/40 text-xs font-semibold text-ink transition-colors cursor-pointer"
                >
                  <Layers className="size-3 text-jade" />
                  <span>Configure Section</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRetireSection(sec.code, sec.section)}
                  className="size-7 rounded-md border border-white/10 bg-white/[0.04] hover:bg-rose/15 hover:border-rose/30 text-ink-faint hover:text-rose transition-colors flex items-center justify-center cursor-pointer"
                  title="Retire section"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
