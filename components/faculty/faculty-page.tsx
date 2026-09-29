"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { FacultyCta } from "@/components/faculty/faculty-cta";
import { FacultyFilters } from "@/components/faculty/faculty-filters";
import { FacultyGrid } from "@/components/faculty/faculty-grid";
import { FacultyHero } from "@/components/faculty/faculty-hero";
import { useDepartments, useFaculty } from "@/hooks/use-data";
import type { FacultyMember } from "@/lib/types";
import { sectionClass, shellClass } from "@/lib/styles";

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
      <FacultyHero departments={departments} />

      <section className={sectionClass}>
        <div className={shellClass}>
          <FacultyFilters
            searchDraft={searchDraft}
            onSearchChange={(value) => {
              setSearchDraft(value);
              updateParams({ q: value });
            }}
            dept={dept}
            onDeptChange={(nextDept) => updateParams({ dept: nextDept })}
            departments={departments}
            totalCount={faculty.length}
            filteredCount={filtered.length}
            isLoading={isLoading}
          />

          <FacultyGrid
            faculty={filtered}
            isLoading={isLoading}
            filterKey={`${dept}-${deferredQ}`}
          />
        </div>
      </section>

      <FacultyCta />
    </main>
  );
}
