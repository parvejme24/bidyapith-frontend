"use client";

import React from "react";
import { Calendar as CalendarIcon, Check, ChevronDown, Loader2, Save } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { DatePickerField } from "@/components/dashboard/shared/date-picker-field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export interface AcademicTermConfig {
  id?: string;
  name: string;
  year: number;
  status: "UPCOMING" | "REGISTRATION" | "RUNNING" | "GRADING" | "COMPLETED";
  regOpens: string;
  regCloses: string;
  addDropCloses: string;
  classesFrom: string;
  midtermStarts: string;
  finalStarts: string;
  intakeCapacity: number;
  applicantsCount: number;
  acceptedCount: number;
}

interface SemesterTimelineCardProps {
  termConfig: AcademicTermConfig;
  setTermConfig: React.Dispatch<React.SetStateAction<AcademicTermConfig>>;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export function SemesterTimelineCard({
  termConfig,
  setTermConfig,
  onSave,
  saving,
}: SemesterTimelineCardProps) {
  return (
    <GlassCard className="p-5 sm:p-7">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-md bg-jade/15 border border-jade/30 text-jade flex items-center justify-center shrink-0">
            <CalendarIcon className="size-4" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              Semester Timeline & Enrollment Deadlines
            </h3>
            <p className="text-xs text-ink-faint">
              Control registration windows, add/drop periods and exam dates with live database synchronization
            </p>
          </div>
        </div>
        {termConfig.id && (
          <span className="text-[0.68rem] px-2 py-0.5 rounded-full border border-jade/30 bg-jade/10 text-jade font-mono">
            Live DB Term
          </span>
        )}
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              Academic Term
            </label>
            <input
              value={termConfig.name}
              onChange={(e) => setTermConfig({ ...termConfig, name: e.target.value })}
              className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              Term Operational Status
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className="w-full flex items-center justify-between rounded-md border border-white/15 bg-white/[0.04] hover:bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-jade outline-none focus:border-jade cursor-pointer transition-colors text-left"
              >
                <span className="truncate">
                  {termConfig.status === "UPCOMING"
                    ? "UPCOMING (Pre-registration)"
                    : termConfig.status === "REGISTRATION"
                    ? "REGISTRATION (Live Enrollment)"
                    : termConfig.status === "RUNNING"
                    ? "RUNNING (Classes Ongoing)"
                    : termConfig.status === "GRADING"
                    ? "GRADING (Assessment Submission)"
                    : "COMPLETED (Archived)"}
                </span>
                <ChevronDown className="size-3 text-ink-faint shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-lg bg-night-900/98 border-white/15 backdrop-blur-xl p-1 shadow-2xl">
                {[
                  { value: "UPCOMING" as const, label: "UPCOMING (Pre-registration)" },
                  { value: "REGISTRATION" as const, label: "REGISTRATION (Live Enrollment)" },
                  { value: "RUNNING" as const, label: "RUNNING (Classes Ongoing)" },
                  { value: "GRADING" as const, label: "GRADING (Assessment Submission)" },
                  { value: "COMPLETED" as const, label: "COMPLETED (Archived)" },
                ].map((statusOpt) => (
                  <DropdownMenuItem
                    key={statusOpt.value}
                    onClick={() => setTermConfig({ ...termConfig, status: statusOpt.value })}
                    className={cn(
                      "flex items-center justify-between text-xs py-2 px-2.5 rounded-md cursor-pointer transition-colors",
                      termConfig.status === statusOpt.value
                        ? "bg-jade/15 text-jade font-semibold"
                        : "text-ink-muted hover:text-ink hover:bg-white/5"
                    )}
                  >
                    <span>{statusOpt.label}</span>
                    {termConfig.status === statusOpt.value && <Check className="size-3.5 text-jade" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Deadlines Dates using reusable DatePickerField */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DatePickerField
            label="Registration Opens"
            value={termConfig.regOpens}
            onChange={(val) => setTermConfig({ ...termConfig, regOpens: val })}
          />
          <DatePickerField
            label="Registration Closes"
            value={termConfig.regCloses}
            onChange={(val) => setTermConfig({ ...termConfig, regCloses: val })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DatePickerField
            label="Classes Commencement Date"
            value={termConfig.classesFrom}
            onChange={(val) => setTermConfig({ ...termConfig, classesFrom: val })}
          />
          <DatePickerField
            label="Add / Drop Window Closes"
            value={termConfig.addDropCloses}
            onChange={(val) => setTermConfig({ ...termConfig, addDropCloses: val })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DatePickerField
            label="Midterm Exam Week Starts"
            value={termConfig.midtermStarts}
            onChange={(val) => setTermConfig({ ...termConfig, midtermStarts: val })}
          />
          <DatePickerField
            label="Final Exam Week Starts"
            value={termConfig.finalStarts}
            onChange={(val) => setTermConfig({ ...termConfig, finalStarts: val })}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className={cn(
              buttonClass({ variant: "primary", size: "sm" }),
              "w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            )}
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            <span>{saving ? "Saving to Database..." : "Save Term Deadlines & Configurations"}</span>
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
