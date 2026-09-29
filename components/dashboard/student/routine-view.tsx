"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import type { StudentCourse } from "@/lib/app-types";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu"];
const HOURS = ["08:30", "10:00", "11:30", "13:00", "14:30", "16:00"];

interface RoutineViewProps {
  enrolled: StudentCourse[];
}

export function RoutineView({ enrolled }: RoutineViewProps) {
  return (
    <GlassCard className="p-5 md:p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">
          Weekly Timetable & Routine
        </h3>
        <span className="text-xs text-ink-faint">
          Fall 2026 Semester Schedule
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[68px_repeat(5,minmax(110px,1fr))] gap-2 min-w-[650px]">
          {/* Header Row */}
          <div className="h-8" />
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold uppercase tracking-wider text-ink-faint py-1.5 rounded-md bg-white/[0.02]"
            >
              {day}
            </div>
          ))}

          {/* Time Slots */}
          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="text-right text-xs font-mono text-ink-faint pr-2 pt-3">
                {hour}
              </div>

              {DAYS.map((day) => {
                const match = enrolled.find((c) =>
                  c.slots.some((s) => s === `${day} ${hour}`)
                );

                if (!match) {
                  return (
                    <div
                      key={day}
                      className="min-h-[64px] rounded-md border border-dashed border-white/8 bg-white/[0.01]"
                    />
                  );
                }

                const isLab = match.credits === 1;
                const isMath = match.code.startsWith("MAT");

                return (
                  <div
                    key={day}
                    className={cn(
                      "min-h-[64px] p-2.5 rounded-md border flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]",
                      isLab
                        ? "bg-marigold/10 border-marigold/30 text-[#FFD9A6]"
                        : isMath
                        ? "bg-orchid/10 border-orchid/30 text-[#D3CBFF]"
                        : "bg-jade/10 border-jade/30 text-[#9CF0D8]"
                    )}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold block">
                        {match.code}
                      </span>
                      <span className="text-[0.72rem] opacity-90 block leading-tight truncate">
                        {match.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[0.68rem] opacity-75 font-mono mt-1">
                      <span>{match.room}</span>
                      <span>Sec {match.section}</span>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
