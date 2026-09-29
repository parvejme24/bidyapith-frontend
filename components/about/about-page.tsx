"use client";

import {
  EnrolmentDonut,
  RegistrationAreaChart,
} from "@/components/home/campus-charts";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { AboutHero } from "@/components/about/about-hero";
import { AboutMilestones } from "@/components/about/about-milestones";
import { AboutLeadership } from "@/components/about/about-leadership";
import { AboutDepartmentsTable } from "@/components/about/about-departments-table";
import { AboutCampusFacts } from "@/components/about/about-campus-facts";
import {
  useDepartments,
  useEnrolment,
  useLeadership,
  useMilestones,
  useRegistrations,
  useStats,
} from "@/hooks/use-data";
import { displayClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function AboutPage() {
  const registrations = useRegistrations();
  const enrolment = useEnrolment();
  const milestones = useMilestones();
  const leadership = useLeadership();
  const departments = useDepartments();
  const stats = useStats();

  const students = (stats.data?.[0]?.value ?? 9240).toLocaleString();

  return (
    <main id="main">
      {/* 1. Hero & Mission Values */}
      <AboutHero />

      {/* 2. Academic Registrations & Student Enrolment Distribution */}
      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.4fr_1fr]")}>
          <Reveal>
            <GlassCard className="p-7 h-full">
              <h2 className={cn(displayClass.d3, "mb-1")}>Registrations handled each semester</h2>
              <p className="text-sm text-ink-muted mb-5">
                In thousands — the load the academic system carries
              </p>
              {registrations.data ? (
                <RegistrationAreaChart data={registrations.data} color="#2ED3A7" />
              ) : (
                <div className="h-[250px] animate-pulse rounded-2xl bg-white/5" />
              )}
            </GlassCard>
          </Reveal>

          <Reveal delay={90}>
            <GlassCard className="p-7 h-full">
              <h2 className={cn(displayClass.d3, "mb-1")}>Students by school</h2>
              <p className="text-sm text-ink-muted mb-5">Fall 2026</p>
              {enrolment.data ? (
                <>
                  <div className="max-w-[220px] mx-auto">
                    <EnrolmentDonut
                      data={enrolment.data}
                      centerValue={students}
                      centerLabel="students"
                    />
                  </div>
                  <ul className="mt-5 divide-y divide-white/5">
                    {enrolment.data.map((slice) => (
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
          </Reveal>
        </div>
      </section>

      {/* 3. Historical Milestones & Timeline */}
      <AboutMilestones milestones={milestones.data} />

      {/* 4. University Leadership Team */}
      <AboutLeadership leadership={leadership.data} />

      {/* 5. Academic Departments Table */}
      <AboutDepartmentsTable departments={departments.data} />

      {/* 6. Campus Facts & Visit Call to Action */}
      <AboutCampusFacts />
    </main>
  );
}
