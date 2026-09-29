"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { ProgramsCta } from "@/components/programs/programs-cta";
import { ProgramsFilters } from "@/components/programs/programs-filters";
import { ProgramsGrid } from "@/components/programs/programs-grid";
import { ProgramsHero } from "@/components/programs/programs-hero";
import { usePrograms } from "@/hooks/use-data";
import type { Program } from "@/lib/types";

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
      <ProgramsHero />

      <ProgramsFilters
        searchDraft={searchDraft}
        onSearchChange={(value) => {
          setSearchDraft(value);
          updateParams({ q: value });
        }}
        level={level}
        onLevelChange={(nextLevel) => updateParams({ level: nextLevel })}
        school={school}
        onSchoolChange={(nextSchool) => updateParams({ school: nextSchool })}
        schools={schools}
        isLoading={isLoading}
        filteredCount={filtered.length}
      />

      <ProgramsGrid
        programs={filtered}
        isLoading={isLoading}
        filterKey={`${school}-${level}-${deferredQ}`}
      />

      <ProgramsCta />
    </main>
  );
}
