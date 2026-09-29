"use client";

import { GlassCard } from "@/components/site/glass-card";
import { SelectInput } from "@/components/site/select-input";
import type { Department } from "@/lib/types";
import { controlClass, fieldClass, fieldLabelClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface FacultyFiltersProps {
  searchDraft: string;
  onSearchChange: (val: string) => void;
  dept: string;
  onDeptChange: (val: string) => void;
  departments: Department[];
  totalCount: number;
  filteredCount: number;
  isLoading: boolean;
}

export function FacultyFilters({
  searchDraft,
  onSearchChange,
  dept,
  onDeptChange,
  departments,
  totalCount,
  filteredCount,
  isLoading,
}: FacultyFiltersProps) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <label className={cn(fieldClass, "mb-0 md:w-72")}>
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
      </div>
      <p className="text-sm text-ink-faint mt-5 pt-5 border-t border-white/8">
        {isLoading
          ? "Loading profiles…"
          : `${filteredCount} of ${totalCount} profiles`}
      </p>
    </GlassCard>
  );
}
