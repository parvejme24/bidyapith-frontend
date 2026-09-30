"use client";

import { useMemo } from "react";
import { EnrolmentDonut } from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { CountUp } from "@/components/site/count-up";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import type { Department, EnrolmentSlice } from "@/lib/types";
import { displayClass, leadClass, numClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const DONUT_COLORS = ["#2ED3A7", "#9B8CFF", "#FFB454", "#6FD8FF", "#FF7E9D", "#C6BCFF"];

interface FacultyHeroProps {
  departments: Department[];
}

export function FacultyHero({ departments }: FacultyHeroProps) {
  const donutData = useMemo<EnrolmentSlice[]>(
    () =>
      departments.slice(0, 6).map((department, index) => ({
        label: department.name.split(" ")[0],
        value: department.faculty,
        color: DONUT_COLORS[index] ?? DONUT_COLORS[0],
      })),
    [departments],
  );

  return (
    <section className="pt-12 pb-6 md:pt-16">
      <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center")}>
        <div className="max-w-2xl">
          <Rise delay={1}>
            <Chip tone="jade">312 faculty members</Chip>
          </Rise>
          <Rise delay={2}>
            <h1 className={cn(displayClass.d1, "mt-5")}>The people who will actually teach you</h1>
          </Rise>
          <Rise delay={3}>
            <p className={cn(leadClass, "mt-5")}>
              Heads of department, professors and lecturers, with the hours they keep their doors
              open. Book an office hour from the student portal once you enrol.
            </p>
          </Rise>
          <Rise delay={4}>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div>
                <CountUp value={187} className="font-display text-2xl sm:text-3xl" />
                <p className="text-xs text-ink-faint mt-1">Hold a doctorate</p>
              </div>
              <div>
                <CountUp value={218} className="font-display text-2xl sm:text-3xl" />
                <p className="text-xs text-ink-faint mt-1">Papers published in 2025</p>
              </div>
              <div>
                <CountUp value={30} className="font-display text-2xl sm:text-3xl" />
                <p className="text-xs text-ink-faint mt-1">Students per faculty</p>
              </div>
            </div>
          </Rise>
        </div>

        <Rise delay={4}>
          <GlassCard className="p-6">
            <h2 className="text-sm font-bold mb-1">Faculty by department</h2>
            <p className="text-xs text-ink-faint mb-4">Six largest departments</p>
            {donutData.length ? (
              <>
                <div className="max-w-[230px] mx-auto">
                  <EnrolmentDonut
                    data={donutData}
                    centerValue="179"
                    centerLabel="in these six"
                  />
                </div>
                <ul className="mt-5 divide-y divide-white/5">
                  {donutData.map((slice) => (
                    <li
                      key={slice.label}
                      className="flex items-center justify-between gap-3 py-1.5"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: slice.color }}
                        />
                        <span className="text-sm text-ink-muted truncate">{slice.label}</span>
                      </span>
                      <span className={cn(numClass, "text-sm font-semibold")}>
                        {slice.value.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
            )}
          </GlassCard>
        </Rise>
      </div>
    </section>
  );
}
