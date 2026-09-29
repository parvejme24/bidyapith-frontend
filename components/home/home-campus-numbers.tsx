"use client";

import {
  EmploymentGauge,
  EnrolmentDonut,
  IntakeBarChart,
  RegistrationAreaChart,
} from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { SeatMeter } from "@/components/site/seat-meter";
import { displayClass, leadClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { ChartPoint, EnrolmentSlice, SeatFill } from "@/lib/types";

interface HomeCampusNumbersProps {
  students: number;
  employment: number;
  intakeData?: ChartPoint[];
  enrolmentData?: EnrolmentSlice[];
  registrationsData?: ChartPoint[];
  seatsData?: SeatFill[];
}

export function HomeCampusNumbers({
  students,
  employment,
  intakeData,
  enrolmentData,
  registrationsData,
  seatsData,
}: HomeCampusNumbersProps) {
  return (
    <section className={sectionClass} id="glance">
      <div className={shellClass}>
        <Reveal>
          <div className="max-w-2xl mb-10">
            <h2 className={displayClass.d2}>The campus, in numbers that update themselves</h2>
            <p className={cn(leadClass, "mt-4")}>
              Every figure below is read straight from the university database — enrolment,
              intake, registrations and placement. Nothing here is typed in by hand.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <GlassCard className="flex h-full flex-col p-6">
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className={displayClass.d3}>New students admitted each year</h3>
                  <p className="mt-1 text-sm text-ink-muted">Across all six schools, 2019 to 2026</p>
                </div>
                <Chip tone="jade">+9.7% year on year</Chip>
              </header>
              <div className="mt-auto">
                {intakeData ? (
                  <IntakeBarChart data={intakeData} />
                ) : (
                  <div className="animate-pulse rounded-2xl bg-white/5 h-[250px]" />
                )}
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={90}>
            <GlassCard className="p-6 h-full">
              <h3 className={cn(displayClass.d3, "mb-1")}>Where students study</h3>
              <p className="text-sm text-ink-muted mb-4">Enrolment by school, Fall 2026</p>
              {enrolmentData ? (
                <>
                  <EnrolmentDonut
                    data={enrolmentData}
                    centerValue={students.toLocaleString()}
                    centerLabel="students"
                  />
                  <ul className="mt-5 divide-y divide-white/5">
                    {enrolmentData.map((slice) => (
                      <li key={slice.label} className="flex items-center justify-between gap-3 py-1.5">
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
                <div className="animate-pulse rounded-2xl bg-white/5 h-64" />
              )}
            </GlassCard>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <GlassCard className="flex h-full flex-col p-6">
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className={displayClass.d3}>Course registrations per semester</h3>
                  <p className="mt-1 text-sm text-ink-muted">In thousands, processed through the portal</p>
                </div>
                <Chip tone="orchid">12.4k this term</Chip>
              </header>
              <div className="mt-auto flex min-h-[280px] w-full flex-1 flex-col justify-end sm:min-h-[300px]">
                {registrationsData ? (
                  <RegistrationAreaChart
                    data={registrationsData}
                    className="h-full min-h-[280px] sm:min-h-[300px]"
                  />
                ) : (
                  <div className="animate-pulse rounded-2xl bg-white/5 h-full min-h-[280px] sm:min-h-[300px]" />
                )}
              </div>
            </GlassCard>
          </Reveal>

          <div className="grid gap-4">
            <Reveal delay={90}>
              <GlassCard className="p-6">
                <h3 className={cn(displayClass.d3, "mb-1")}>Graduates in work</h3>
                <p className="text-sm text-ink-muted mb-2">Within six months, class of 2025</p>
                <EmploymentGauge percent={employment} label="class of 2025" />
              </GlassCard>
            </Reveal>
            <Reveal delay={140}>
              <GlassCard className="p-6">
                <h3 className={cn(displayClass.d3, "mb-4")}>Seats taken, Fall 2026</h3>
                <ul className="space-y-4">
                  {seatsData?.map((seat) => (
                    <li key={seat.label}>
                      <SeatMeter filled={seat.filled} total={seat.total} label={seat.label} />
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
