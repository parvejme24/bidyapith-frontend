"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CoursesFilters, type SortKey, SORTS } from "@/components/courses/courses-filters";
import { CoursesHero } from "@/components/courses/courses-hero";
import { CoursesInfoCards } from "@/components/courses/courses-info-cards";
import { CoursesTable } from "@/components/courses/courses-table";
import { useCourses, useDepartments } from "@/hooks/use-data";
import type { Course } from "@/lib/types";
import { sectionClass, shellClass } from "@/lib/styles";

const PER_PAGE = 8;

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
      <CoursesHero departments={departments} />

      <section className={sectionClass} id="catalogue" ref={catalogueRef}>
        <div className={shellClass}>
          <CoursesFilters
            searchDraft={searchDraft}
            onSearchChange={(value) => {
              setSearchDraft(value);
              updateParams({ q: value, page: 1 });
            }}
            dept={dept}
            onDeptChange={(nextDept) => updateParams({ dept: nextDept, page: 1 })}
            sem={sem}
            onSemChange={(nextSem) => updateParams({ sem: nextSem, page: 1 })}
            sort={sort}
            onSortChange={(nextSort) => updateParams({ sort: nextSort })}
            departments={departments}
            totalFiltered={filtered.length}
            isLoading={coursesLoading}
          />

          <CoursesTable
            courses={slice}
            isLoading={coursesLoading}
            pages={pages}
            safePage={safePage}
            onPageChange={goToPage}
          />
        </div>
      </section>

      <CoursesInfoCards />
    </main>
  );
}
