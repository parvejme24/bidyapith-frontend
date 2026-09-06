"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EnrolmentDonut } from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { CountUp } from "@/components/site/count-up";
import { EmptyState } from "@/components/site/empty-state";
import { FacultyCard } from "@/components/site/faculty-card";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal, Rise } from "@/components/site/motion";
import { SelectInput } from "@/components/site/select-input";
import { useDepartments, useFaculty } from "@/hooks/use-data";
import type { EnrolmentSlice, FacultyMember } from "@/lib/types";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldLabelClass,
  leadClass,
  numClass,
  sectionClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const DONUT_COLORS = ["#2ED3A7", "#9B8CFF", "#FFB454", "#6FD8FF", "#FF7E9D", "#C6BCFF"];

function paramValue(value: string | null, fallback: string) {
  return value && value.trim() ? value : fallback;
}

function filterFaculty(faculty: FacultyMember[], dept: string, q: string) {
  const query = q.trim().toLowerCase();
  return faculty.filter((member) => {
    const deptOk = dept === "all" || member.dept === dept;
    const haystack = `${member.name}${member.field}${member.role}`.toLowerCase();
    const queryOk = !query || haystack.includes(query);
    return deptOk && queryOk;
  });
}

export function FacultyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [, startTransition] = useTransition();

  const { data: faculty = [], isLoading } = useFaculty();
  const { data: departments = [] } = useDepartments();

  const dept = paramValue(searchParams.get("dept"), "all");
  const q = searchParams.get("q") ?? "";
  const deferredQ = useDeferredValue(q);
  const [searchDraft, setSearchDraft] = useState(q);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const donutData = useMemo<EnrolmentSlice[]>(
    () =>
      departments.slice(0, 6).map((department, index) => ({
        label: department.name.split(" ")[0],
        value: department.faculty,
        color: DONUT_COLORS[index] ?? DONUT_COLORS[0],
      })),
    [departments],
  );

  const filtered = useMemo(
    () => filterFaculty(faculty, dept, deferredQ),
    [faculty, dept, deferredQ],
  );

  function updateParams(next: { dept?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDept = next.dept ?? dept;
    const nextQ = next.q ?? q;

    if (!nextDept || nextDept === "all") params.delete("dept");
    else params.set("dept", nextDept);

    if (!nextQ.trim()) params.delete("q");
    else params.set("q", nextQ);

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <main id="main">
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
              <div className="flex flex-wrap gap-6 mt-8">
                <div>
                  <CountUp value={187} className="font-display text-3xl" />
                  <p className="text-xs text-ink-faint mt-1">Hold a doctorate</p>
                </div>
                <div>
                  <CountUp value={218} className="font-display text-3xl" />
                  <p className="text-xs text-ink-faint mt-1">Papers published in 2025</p>
                </div>
                <div>
                  <CountUp value={30} className="font-display text-3xl" />
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

      <section className={sectionClass}>
        <div className={shellClass}>
          <GlassCard className="p-5 md:p-6 mb-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className={cn(fieldClass, "mb-0")}>
                <span className={fieldLabelClass}>Search by name or research area</span>
                <input
                  className={controlClass}
                  type="search"
                  placeholder='Try “quantum”, “finance”, “Rahman”'
                  autoComplete="off"
                  value={searchDraft}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchDraft(value);
                    updateParams({ q: value });
                  }}
                />
              </label>
              <label className={cn(fieldClass, "mb-0 md:w-72")}>
                <span className={fieldLabelClass}>Department</span>
                <SelectInput
                  value={dept}
                  onChange={(event) => updateParams({ dept: event.target.value })}
                >
                  <option value="all">All departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </SelectInput>
              </label>
            </div>
            <p className="text-sm text-ink-faint mt-5 pt-5 border-t border-white/8">
              {isLoading
                ? "Loading profiles…"
                : `${filtered.length} of ${faculty.length} profiles`}
            </p>
          </GlassCard>

          <AnimatePresence mode="popLayout">
            {filtered.length ? (
              <motion.div
                key={`${dept}-${deferredQ}`}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
              >
                {filtered.map((member, index) => (
                  <motion.div
                    key={`${member.name}-${member.dept}-${member.email}`}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.4 }}
                  >
                    <FacultyCard faculty={member} index={index} reveal={false} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                className="sm:col-span-2 lg:col-span-3"
                title="No one by that name"
                description='Search by surname or research area — “finance”, “quantum”, “law”.'
              />
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className={cn(sectionClass, "pt-0")}>
        <div className={shellClass}>
          <Reveal>
            <GlassCard strong className="p-8 md:p-11 text-center">
              <h2 className={cn(displayClass.d2, "max-w-xl mx-auto")}>Teaching and research posts open</h2>
              <p className={cn(leadClass, "mx-auto mt-4 text-center")}>
                We hire twice a year across all six schools. Send a CV, a short research statement
                and two references to the registrar&apos;s office.
              </p>
              <Link href="/contact" className={cn(buttonClass({ variant: "primary" }), "mt-7")}>
                See open positions
              </Link>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
