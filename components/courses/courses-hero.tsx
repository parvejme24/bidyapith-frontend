"use client";

import { useMemo } from "react";
import { IntakeBarChart } from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import type { Department } from "@/lib/types";
import { displayClass, leadClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const ORCHID = "#9B8CFF";

interface CoursesHeroProps {
  departments: Department[];
}

export function CoursesHero({ departments }: CoursesHeroProps) {
  const chartData = useMemo(
    () =>
      departments.slice(0, 6).map((department) => ({
        label: department.id.toUpperCase(),
        value: department.courses,
      })),
    [departments],
  );

  return (
    <section className="pt-12 pb-6 md:pt-16">
      <div className={cn(shellClass, "grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end")}>
        <div className="max-w-2xl">
          <Rise delay={1}>
            <Chip tone="orchid">Fall 2026 and Spring 2027</Chip>
          </Rise>
          <Rise delay={2}>
            <h1 className={cn(displayClass.d1, "mt-5")}>The whole catalogue, open to everyone</h1>
          </Rise>
          <Rise delay={3}>
            <p className={cn(leadClass, "mt-5")}>
              Prerequisites, credit hours, who teaches it and how many seats remain. Students
              register from the portal; anyone can read the catalogue here first.
            </p>
          </Rise>
        </div>

        <Rise delay={4}>
          <GlassCard className="p-6">
            <h2 className="text-sm font-bold mb-1">Courses on offer by department</h2>
            <p className="text-xs text-ink-faint mb-4">Total credit hours scheduled this year</p>
            {chartData.length ? (
              <IntakeBarChart data={chartData} color={ORCHID} />
            ) : (
              <div className="h-[250px] animate-pulse rounded-2xl bg-white/5" />
            )}
          </GlassCard>
        </Rise>
      </div>
    </section>
  );
}
