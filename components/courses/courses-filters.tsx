"use client";

import { GlassCard } from "@/components/site/glass-card";
import { SelectInput } from "@/components/site/select-input";
import type { Department } from "@/lib/types";
import { controlClass, fieldClass, fieldLabelClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const SORTS = ["code", "title", "credits", "seats"] as const;
export type SortKey = (typeof SORTS)[number];

interface CoursesFiltersProps {
  searchDraft: string;
  onSearchChange: (val: string) => void;
  dept: string;
  onDeptChange: (val: string) => void;
  sem: string;
  onSemChange: (val: string) => void;
  sort: SortKey;
  onSortChange: (val: string) => void;
  departments: Department[];
  totalFiltered: number;
  isLoading: boolean;
}

export function CoursesFilters({
  searchDraft,
  onSearchChange,
  dept,
  onDeptChange,
  sem,
  onSemChange,
  sort,
  onSortChange,
  departments,
  totalFiltered,
  isLoading,
}: CoursesFiltersProps) {
  return (
    <GlassCard className="p-4 sm:p-5 md:p-6 mb-4">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 md:items-end">
        <label className={cn(fieldClass, "mb-0 lg:col-span-1")}>
          <span className={fieldLabelClass}>Search</span>
          <input
            className={controlClass}
            type="search"
            placeholder="Code, title or instructor"
            autoComplete="off"
            value={searchDraft}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className={cn(fieldClass, "mb-0")}>
          <span className={fieldLabelClass}>Department</span>
          <SelectInput
            value={dept}
            onChange={(event) => onDeptChange(event.target.value)}
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
            onChange={(event) => onSemChange(event.target.value)}
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
            onChange={(event) => onSortChange(event.target.value)}
          >
            <option value="code">Course code</option>
            <option value="title">Title A–Z</option>
            <option value="credits">Most credits</option>
            <option value="seats">Most seats left</option>
          </SelectInput>
        </label>
      </div>
      <p className="text-sm text-ink-faint mt-5 pt-5 border-t border-white/8">
        {isLoading
          ? "Loading courses…"
          : `${totalFiltered} course${totalFiltered === 1 ? "" : "s"}`}
      </p>
    </GlassCard>
  );
}
