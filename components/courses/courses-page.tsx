"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { IntakeBarChart } from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal, Rise } from "@/components/site/motion";
import { SelectInput } from "@/components/site/select-input";
import { useCourses, useDepartments } from "@/hooks/use-data";
import { deptName } from "@/lib/api";
import type { Course } from "@/lib/types";
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
  tableClass,
  tableScrollClass,
  tdClass,
  thClass,
  trClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const PER_PAGE = 8;
const ORCHID = "#9B8CFF";
const SORTS = ["code", "title", "credits", "seats"] as const;
type SortKey = (typeof SORTS)[number];

function paramValue(value: string | null, fallback: string) {
  return value && value.trim() ? value : fallback;
}

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}

function parseSort(value: string | null): SortKey {
  return SORTS.includes(value as SortKey) ? (value as SortKey) : "code";
}

function seatsLeft(course: Course) {
  return course.seats - course.taken;
}

function filterAndSortCourses(
  courses: Course[],
  dept: string,
  sem: string,
  q: string,
  sort: SortKey,
) {
  const query = q.trim().toLowerCase();
  const list = courses.filter((course) => {
    const deptOk = dept === "all" || course.dept === dept;
    const semOk = sem === "all" || course.semester === sem;
    const haystack = `${course.code}${course.title}${course.instructor}`.toLowerCase();
    const queryOk = !query || haystack.includes(query);
    return deptOk && semOk && queryOk;
  });

  const compare: Record<SortKey, (a: Course, b: Course) => number> = {
    code: (a, b) => a.code.localeCompare(b.code),
    title: (a, b) => a.title.localeCompare(b.title),
    credits: (a, b) => b.credits - a.credits,
    seats: (a, b) => seatsLeft(b) - seatsLeft(a),
  };

  return list.sort(compare[sort]);
}

function seatChipTone(left: number) {
  if (left === 0) return "rose" as const;
  if (left <= 8) return "gold" as const;
  return "jade" as const;
}

export function CoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const catalogueRef = useRef<HTMLElement>(null);

  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: departments = [] } = useDepartments();

  const dept = paramValue(searchParams.get("dept"), "all");
  const sem = paramValue(searchParams.get("sem"), "all");
  const q = searchParams.get("q") ?? "";
  const sort = parseSort(searchParams.get("sort"));
  const page = parsePage(searchParams.get("page"));
  const deferredQ = useDeferredValue(q);
  const [searchDraft, setSearchDraft] = useState(q);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const chartData = useMemo(
    () =>
      departments.slice(0, 6).map((department) => ({
        label: department.id.toUpperCase(),
        value: department.courses,
      })),
    [departments],
  );

  const filtered = useMemo(
    () => filterAndSortCourses(courses, dept, sem, deferredQ, sort),
    [courses, dept, sem, deferredQ, sort],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function updateParams(next: {
    dept?: string;
    sem?: string;
    q?: string;
    sort?: string;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDept = next.dept ?? dept;
    const nextSem = next.sem ?? sem;
    const nextQ = next.q ?? q;
    const nextSort = next.sort ?? sort;
    const nextPage = next.page ?? page;

    if (!nextDept || nextDept === "all") params.delete("dept");
    else params.set("dept", nextDept);

    if (!nextSem || nextSem === "all") params.delete("sem");
    else params.set("sem", nextSem);

    if (!nextQ.trim()) params.delete("q");
    else params.set("q", nextQ);

    if (!nextSort || nextSort === "code") params.delete("sort");
    else params.set("sort", nextSort);

    if (!nextPage || nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > pages) return;
    updateParams({ page: nextPage });
    catalogueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="main">
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

      <section className={sectionClass} id="catalogue" ref={catalogueRef}>
        <div className={shellClass}>
          <GlassCard className="p-5 md:p-6 mb-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:items-end">
              <label className={cn(fieldClass, "mb-0 lg:col-span-1")}>
                <span className={fieldLabelClass}>Search</span>
                <input
                  className={controlClass}
                  type="search"
                  placeholder="Code, title or instructor"
                  autoComplete="off"
                  value={searchDraft}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchDraft(value);
                    updateParams({ q: value, page: 1 });
                  }}
                />
              </label>
              <label className={cn(fieldClass, "mb-0")}>
                <span className={fieldLabelClass}>Department</span>
                <SelectInput
                  value={dept}
                  onChange={(event) => updateParams({ dept: event.target.value, page: 1 })}
                >
                  <option value="all">All departments</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </SelectInput>
              </label>
              <label className={cn(fieldClass, "mb-0")}>
                <span className={fieldLabelClass}>Semester</span>
                <SelectInput
                  value={sem}
                  onChange={(event) => updateParams({ sem: event.target.value, page: 1 })}
                >
                  <option value="all">Both semesters</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                </SelectInput>
              </label>
              <label className={cn(fieldClass, "mb-0")}>
                <span className={fieldLabelClass}>Sort by</span>
                <SelectInput
                  value={sort}
                  onChange={(event) => updateParams({ sort: event.target.value })}
                >
                  <option value="code">Course code</option>
                  <option value="title">Title A–Z</option>
                  <option value="credits">Most credits</option>
                  <option value="seats">Most seats left</option>
                </SelectInput>
              </label>
            </div>
            <p className="text-sm text-ink-faint mt-5 pt-5 border-t border-white/8">
              {coursesLoading
                ? "Loading courses…"
                : `${filtered.length} course${filtered.length === 1 ? "" : "s"}`}
            </p>
          </GlassCard>

          <GlassCard className="p-2 sm:p-4">
            <div className={tableScrollClass}>
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Code</th>
                    <th className={thClass}>Course</th>
                    <th className={cn(thClass, "text-center")}>Cr.</th>
                    <th className={thClass}>Semester</th>
                    <th className={thClass}>Prerequisite</th>
                    <th className={thClass}>Instructor</th>
                    <th className={thClass}>Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.length ? (
                    slice.map((course) => {
                      const left = seatsLeft(course);
                      return (
                        <tr key={course.code} className={trClass}>
                          <td className={cn(tdClass, numClass, "font-semibold whitespace-nowrap")}>{course.code}</td>
                          <td className={tdClass}>
                            <span className="block font-semibold">{course.title}</span>
                            <span className="block text-xs text-ink-faint mt-0.5">
                              {deptName(course.dept)}
                            </span>
                          </td>
                          <td className={cn(tdClass, numClass, "text-center")}>{course.credits}</td>
                          <td className={cn(tdClass, "whitespace-nowrap")}>{course.semester}</td>
                          <td className={cn(tdClass, numClass, "whitespace-nowrap text-ink-muted")}>{course.prereq}</td>
                          <td className={cn(tdClass, "whitespace-nowrap text-ink-muted")}>{course.instructor}</td>
                          <td className={tdClass}>
                            <Chip tone={seatChipTone(left)} className="whitespace-nowrap">
                              {left === 0 ? "Full" : `${left} left`}
                            </Chip>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className={cn(tdClass, "text-center py-12")}>
                        <span className="block font-display text-lg mb-1">
                          No courses match those filters
                        </span>
                        <span className="block text-sm text-ink-muted">
                          Try a different department, or clear the search box.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {pages > 1 ? (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                type="button"
                className={buttonClass({ variant: "ghost", size: "sm" })}
                disabled={safePage === 1}
                style={safePage === 1 ? { opacity: 0.4 } : undefined}
                onClick={() => goToPage(safePage - 1)}
              >
                Previous
              </button>
              {Array.from({ length: pages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    className={cn(
                      buttonClass({
                        variant: pageNumber === safePage ? "primary" : "ghost",
                        size: "sm",
                      }),
                      numClass,
                    )}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                className={buttonClass({ variant: "ghost", size: "sm" })}
                disabled={safePage === pages}
                style={safePage === pages ? { opacity: 0.4 } : undefined}
                onClick={() => goToPage(safePage + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className={cn(sectionClass, "pt-0")}>
        <div className={cn(shellClass, "grid gap-4 md:grid-cols-3")}>
          <Reveal>
            <GlassCard className="p-6 h-full">
              <h3 className={displayClass.d3}>Registration windows</h3>
              <p className="text-sm text-ink-muted mt-3">
                Add and drop stays open for the first two weeks of each semester. After that,
                withdrawal shows on your transcript as a W.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={80}>
            <GlassCard className="p-6 h-full">
              <h3 className={displayClass.d3}>Prerequisites</h3>
              <p className="text-sm text-ink-muted mt-3">
                The portal blocks a registration if the prerequisite is unfinished. Your advisor can
                waive one per semester with a written reason.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={160}>
            <GlassCard className="p-6 h-full">
              <h3 className={displayClass.d3}>Credit load</h3>
              <p className="text-sm text-ink-muted mt-3">
                Twelve to eighteen credits per semester. Anything above eighteen needs a CGPA of
                3.50 and the department head&apos;s approval.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
