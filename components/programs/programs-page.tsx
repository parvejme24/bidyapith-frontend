"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Chip } from "@/components/site/chip";
import { EmptyState } from "@/components/site/empty-state";
import { GlassCard } from "@/components/site/glass-card";
import { PageHero } from "@/components/site/page-hero";
import { ProgramCard } from "@/components/site/program-card";
import { Reveal } from "@/components/site/motion";
import { usePrograms } from "@/hooks/use-data";
import type { Program } from "@/lib/types";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldLabelClass,
  leadClass,
  numClass,
  sectionClass,
  sectionTightClass,
  selectClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const LEVELS = ["All levels", "Undergraduate", "Graduate"] as const;

function paramValue(value: string | null, fallback: string) {
  return value && value.trim() ? value : fallback;
}

function filterPrograms(
  programs: Program[],
  school: string,
  level: string,
  q: string,
) {
  const query = q.trim().toLowerCase();
  return programs.filter((program) => {
    const schoolOk = school === "All" || program.school === school;
    const levelOk = level === "All levels" || program.level === level;
    const haystack = `${program.name}${program.code}${program.about}`.toLowerCase();
    const queryOk = !query || haystack.includes(query);
    return schoolOk && levelOk && queryOk;
  });
}

export function ProgramsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [, startTransition] = useTransition();
  const { data: programs = [], isLoading } = usePrograms();

  const school = paramValue(searchParams.get("school"), "All");
  const level = paramValue(searchParams.get("level"), "All levels");
  const q = searchParams.get("q") ?? "";
  const deferredQ = useDeferredValue(q);
  const [searchDraft, setSearchDraft] = useState(q);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const schools = useMemo(
    () => ["All", ...Array.from(new Set(programs.map((program) => program.school)))],
    [programs],
  );

  const filtered = useMemo(
    () => filterPrograms(programs, school, level, deferredQ),
    [programs, school, level, deferredQ],
  );

  function updateParams(next: { school?: string; level?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextSchool = next.school ?? school;
    const nextLevel = next.level ?? level;
    const nextQ = next.q ?? q;

    if (!nextSchool || nextSchool === "All") params.delete("school");
    else params.set("school", nextSchool);

    if (!nextLevel || nextLevel === "All levels") params.delete("level");
    else params.set("level", nextLevel);

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
        <PageHero
          chip="Fall 2026 intake"
          title="Pick the degree, not the brochure"
          lead="Every programme lists its credit load, its cost per semester and how many seats are actually left. Open a card to see what you will study year by year."
        />
      </section>

      <section className={sectionTightClass}>
        <div className={shellClass}>
          <GlassCard className="p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className={cn(fieldClass, "mb-0")}>
                <span className={fieldLabelClass}>Search programmes</span>
                <input
                  className={controlClass}
                  type="search"
                  placeholder='Try “computer”, “finance” or “law”'
                  autoComplete="off"
                  value={searchDraft}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchDraft(value);
                    updateParams({ q: value });
                  }}
                />
              </label>
              <label className={cn(fieldClass, "mb-0 md:w-56")}>
                <span className={fieldLabelClass}>Level</span>
                <select
                  className={selectClass}
                  value={level}
                  onChange={(event) => updateParams({ level: event.target.value })}
                >
                  {LEVELS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {schools.map((item) => (
                <button key={item} type="button" onClick={() => updateParams({ school: item })}>
                  <Chip tone={item === school ? "jade" : "default"}>{item}</Chip>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4 mt-5 pt-5 border-t border-white/8">
              <p className="text-sm text-ink-faint">
                {isLoading
                  ? "Loading programmes…"
                  : `${filtered.length} programme${filtered.length === 1 ? "" : "s"}`}
              </p>
              <p className="text-sm text-ink-faint">Seat counts refresh each night</p>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className={cn(sectionClass, "pt-4")}>
        <div className={shellClass}>
          <AnimatePresence mode="popLayout">
            {filtered.length ? (
              <motion.div
                key={`${school}-${level}-${deferredQ}`}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.3, 1] }}
              >
                {filtered.map((program, index) => (
                  <motion.div
                    key={program.code}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.4 }}
                  >
                    <ProgramCard program={program} reveal={false} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState className="md:col-span-2 lg:col-span-3" />
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className={cn(sectionClass, "pt-0")}>
        <div className={shellClass}>
          <Reveal>
            <GlassCard strong className="p-8 md:p-11 grid gap-8 md:grid-cols-[1.3fr_1fr] items-center">
              <div>
                <h2 className={displayClass.d2}>Not sure which one fits?</h2>
                <p className={cn(leadClass, "mt-4")}>
                  Come to the open day on 20 September, or send us your results and we will tell you
                  which programmes you qualify for. No application fee to ask.
                </p>
                <div className="flex flex-wrap gap-3 mt-7">
                  <Link href="/contact" className={buttonClass({ variant: "primary" })}>
                    Ask an admission officer
                  </Link>
                  <Link href="/courses" className={buttonClass({ variant: "ghost" })}>
                    Browse the course catalogue
                  </Link>
                </div>
              </div>
              <ul className="space-y-4">
                <li>
                  <GlassCard quiet className="p-4">
                    <p className="text-xs text-ink-faint">Average class size</p>
                    <p className={cn("font-display text-2xl", numClass)}>32 students</p>
                  </GlassCard>
                </li>
                <li>
                  <GlassCard quiet className="p-4">
                    <p className="text-xs text-ink-faint">Students per faculty member</p>
                    <p className={cn("font-display text-2xl", numClass)}>30 : 1</p>
                  </GlassCard>
                </li>
                <li>
                  <GlassCard quiet className="p-4">
                    <p className="text-xs text-ink-faint">Programmes with a required internship</p>
                    <p className={cn("font-display text-2xl", numClass)}>21 of 34</p>
                  </GlassCard>
                </li>
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
