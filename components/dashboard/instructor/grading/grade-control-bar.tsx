"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InstructorSection, RosterStudent } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Check,
  ChevronDown,
  Lock,
  Save,
  Search,
  Send,
  Unlock,
  Wand2,
} from "lucide-react";
import type { SectionStudent } from "./grade-types";

interface GradeControlBarProps {
  sections: InstructorSection[];
  selectedSec: string;
  onSelectSection: (secId: string) => void;
  currentSection: InstructorSection;
  currentStudents: SectionStudent[];
  roster: RosterStudent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLocked: boolean;
  onToggleLock: (locked: boolean) => void;
  enteredCount: number;
  onAutofillAssignments: () => void;
  onSaveDraft: () => void;
  onOpenSubmitModal: () => void;
}

export function GradeControlBar({
  sections,
  selectedSec,
  onSelectSection,
  currentSection,
  currentStudents,
  roster,
  searchQuery,
  onSearchChange,
  isLocked,
  onToggleLock,
  enteredCount,
  onAutofillAssignments,
  onSaveDraft,
  onOpenSubmitModal,
}: GradeControlBarProps) {
  return (
    <GlassCard className="p-3.5 sm:p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div className="flex flex-wrap items-center gap-3 grow">
        <div className="grow sm:grow-0 min-w-[240px] sm:min-w-[260px]">
          <span className="block text-xs font-semibold text-ink-muted mb-1.5">
            Assigned Course & Section
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-3 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-ink hover:border-jade/50 hover:bg-white/[0.09] transition-all cursor-pointer outline-none shadow-sm">
              <div className="flex items-center gap-2 truncate">
                <BookOpen className="size-4 text-jade shrink-0" />
                <span className="font-bold text-jade">
                  {currentSection?.code || "Course"}
                </span>
                <span className="text-ink-muted">· Section {currentSection?.section}</span>
                <span className="text-xs text-ink-faint">({currentStudents.length} students)</span>
              </div>
              <ChevronDown className="size-4 text-ink-muted shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[320px] sm:w-[340px] rounded-xl border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl z-50 text-xs"
            >
              <div className="px-3 py-1.5 text-[0.68rem] font-bold text-ink-faint uppercase tracking-wider">
                Your Assigned Classes ({sections.length})
              </div>
              {sections.map((s) => {
                const isSelected = selectedSec === s.id;
                const count = s.enrolled || roster.length;
                return (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => onSelectSection(s.id)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-colors",
                      isSelected
                        ? "bg-jade/15 text-jade"
                        : "text-ink hover:bg-white/[0.08] hover:text-ink"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn("font-bold text-sm", isSelected ? "text-jade" : "text-ink")}>
                        {s.code}
                      </span>
                      <span className="text-ink-muted">Section {s.section}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.72rem] text-ink-faint">
                        {count} enrolled
                      </span>
                      {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search bar inside section */}
        <div className="relative grow sm:max-w-xs">
          <span className="block text-xs font-semibold text-ink-muted mb-1.5">
            Search Roster
          </span>
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search student or ID..."
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] pl-9 pr-3 py-2 text-xs font-medium text-ink outline-none focus:border-jade"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {!isLocked ? (
          <>
            <button
              type="button"
              onClick={onAutofillAssignments}
              className={cn(
                buttonClass({ variant: "ghost", size: "sm" }),
                "text-xs flex items-center gap-1.5 cursor-pointer hover:border-jade/40"
              )}
              title="Autofill empty assignment marks"
            >
              <Wand2 className="size-3.5 text-marigold" />
              <span className="hidden sm:inline">Autofill</span>
            </button>

            <button
              type="button"
              onClick={onSaveDraft}
              className={cn(
                buttonClass({ variant: "ghost", size: "sm" }),
                "text-xs flex items-center gap-1.5 cursor-pointer hover:border-jade/40"
              )}
            >
              <Save className="size-3.5 text-jade" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={onOpenSubmitModal}
              disabled={enteredCount === 0}
              className={cn(
                buttonClass({ variant: "primary", size: "sm" }),
                "text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              )}
            >
              <Send className="size-3.5" />
              <span>Submit Grade Sheet</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-jade/15 text-jade border border-jade/30">
              <Lock className="size-3.5" /> Grades Locked & Submitted
            </span>
            <button
              type="button"
              onClick={() => onToggleLock(false)}
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs text-ink-muted hover:text-ink cursor-pointer")}
            >
              <Unlock className="size-3.5" /> Unlock
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
