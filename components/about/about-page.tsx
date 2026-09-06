"use client";

import Link from "next/link";
import {
  EnrolmentDonut,
  RegistrationAreaChart,
} from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal, Rise } from "@/components/site/motion";
import {
  useDepartments,
  useEnrolment,
  useLeadership,
  useMilestones,
  useRegistrations,
  useStats,
} from "@/hooks/use-data";
import { initials } from "@/lib/format";
import {
  avatarClass,
  bnClass,
  buttonClass,
  displayClass,
  leadClass,
  measureClass,
  numClass,
  sectionClass,
  sectionTightClass,
  shellClass,
  tableClass,
  tableScrollClass,
  tdClass,
  thClass,
  trClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const MISSION = [
  {
    title: "What we're for",
    text: "Give students in Bangladesh a degree that holds up abroad, taught by people doing real research, at a price families can plan for.",
  },
  {
    title: "How we teach",
    text: "Small sections, graded coursework rather than one final exam, and a required project, internship or thesis in every programme.",
  },
  {
    title: "What we publish",
    text: "Fees, seat counts, pass rates and placement figures, updated from the same database the registrar uses. No separate marketing numbers.",
  },
] as const;

const CAMPUS_FACTS = [
  { label: "Campus", value: "22 acres", numeric: false },
  { label: "Library seats", value: "640", numeric: true },
  { label: "Laboratories", value: "38", numeric: true },
  { label: "Student clubs", value: "27", numeric: true },
] as const;

export function AboutPage() {
  const registrations = useRegistrations();
  const enrolment = useEnrolment();
  const milestones = useMilestones();
  const leadership = useLeadership();
  const departments = useDepartments();
  const stats = useStats();

  const students = (stats.data?.[0]?.value ?? 9240).toLocaleString();
  const milestoneList = milestones.data ?? [];
  const lastMilestone = milestoneList.length - 1;

  return (
    <main id="main">
      <section className="pt-12 pb-6 md:pt-16">
        <div className={cn(shellClass, "max-w-3xl")}>
          <Rise delay={1}>
            <Chip className={cn(bnClass, "text-base")}>বিদ্যাপীঠ · seat of learning</Chip>
          </Rise>
          <Rise delay={2}>
            <h1 className={cn(displayClass.d1, "mt-5")}>Twenty-eight years, one idea</h1>
          </Rise>
          <Rise delay={3}>
            <p className={cn(leadClass, "mt-5")}>
              Bidyapith opened in 1998 with 240 students in a rented building. The idea has not
              changed: teach well, keep the administration out of the way, and publish what we do.
            </p>
          </Rise>
        </div>
      </section>

      <section className={sectionTightClass}>
        <div className={cn(shellClass, "grid gap-4 md:grid-cols-3")}>
          {MISSION.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <GlassCard className="p-7 h-full">
                <h2 className={displayClass.d3}>{item.title}</h2>
                <p className="text-sm text-ink-muted mt-3">{item.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

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

      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[0.75fr_1.25fr]")}>
          <Reveal>
            <h2 className={displayClass.d2}>How we got here</h2>
            <p className={cn(leadClass, "mt-4")}>Five moments that changed how the university works.</p>
          </Reveal>
          <Reveal delay={90}>
            <ol>
              {milestoneList.map((item, index) => (
                <li
                  key={item.year}
                  className="relative pl-8 pb-9 last:pb-0"
                >
                  <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-jade" />
                  {index !== lastMilestone ? (
                    <span className="absolute left-[5px] top-5 bottom-0 w-px bg-white/15" />
                  ) : null}
                  <span className={cn("font-display text-jade", numClass)}>{item.year}</span>
                  <h3 className="font-display text-[1.15rem] mt-1">{item.title}</h3>
                  <p className={cn("text-sm text-ink-muted mt-2", measureClass)}>{item.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <h2 className={cn(displayClass.d2, "mb-9")}>Who runs the university</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(leadership.data ?? []).map((leader, index) => (
              <Reveal key={leader.name} delay={index * 60}>
                <GlassCard lift className="p-6 text-center h-full">
                  <span
                    className={cn(
                      avatarClass({ tone: leader.av }),
                      "size-16 text-xl mx-auto mb-4",
                    )}
                  >
                    {initials(leader.name)}
                  </span>
                  <h3 className="font-display text-[1.05rem] leading-snug">{leader.name}</h3>
                  <p className="text-xs text-jade mt-1.5">{leader.role}</p>
                  <p className="text-sm text-ink-muted mt-3">{leader.note}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
              <h2 className={displayClass.d2}>Departments</h2>
              <Link href="/programs" className={buttonClass({ variant: "ghost", size: "sm" })}>
                See their programmes
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <GlassCard className="p-2 sm:p-4">
              <div className={tableScrollClass}>
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>Department</th>
                      <th className={thClass}>School</th>
                      <th className={thClass}>Head</th>
                      <th className={cn(thClass, "text-center")}>Programmes</th>
                      <th className={cn(thClass, "text-center")}>Courses</th>
                      <th className={cn(thClass, "text-center")}>Faculty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(departments.data ?? []).map((dept) => (
                      <tr key={dept.id} className={trClass}>
                        <td className={cn(tdClass, "font-semibold")}>{dept.name}</td>
                        <td className={cn(tdClass, "text-ink-muted")}>{dept.school}</td>
                        <td className={cn(tdClass, "text-ink-muted whitespace-nowrap")}>{dept.head}</td>
                        <td className={cn(tdClass, numClass, "text-center")}>{dept.programs}</td>
                        <td className={cn(tdClass, numClass, "text-center")}>{dept.courses}</td>
                        <td className={cn(tdClass, numClass, "text-center")}>{dept.faculty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <section className={cn(sectionClass, "pt-0")}>
        <div className={shellClass}>
          <Reveal>
            <GlassCard
              strong
              className="p-8 md:p-12 grid gap-8 md:grid-cols-[1.2fr_1fr] items-center"
            >
              <div>
                <h2 className={displayClass.d2}>Come and look around</h2>
                <p className={cn(leadClass, "mt-4")}>
                  Campus tours run every Thursday at 11 AM. Bring a friend or a parent — no booking
                  needed, just come to the main gate.
                </p>
                <div className="flex flex-wrap gap-3 mt-7">
                  <Link href="/contact" className={buttonClass({ variant: "primary" })}>
                    Plan a visit
                  </Link>
                  <Link href="/admissions" className={buttonClass({ variant: "ghost" })}>
                    Admission details
                  </Link>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                {CAMPUS_FACTS.map((fact) => (
                  <GlassCard key={fact.label} quiet className="p-4">
                    <dt className="text-xs text-ink-faint">{fact.label}</dt>
                    <dd className={cn("font-display text-xl mt-1", fact.numeric && numClass)}>
                      {fact.value}
                    </dd>
                  </GlassCard>
                ))}
              </dl>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
