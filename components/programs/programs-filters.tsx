"use client";

import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { SelectInput } from "@/components/site/select-input";
import { controlClass, fieldClass, fieldLabelClass, sectionTightClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const LEVELS = ["All levels", "Undergraduate", "Graduate"] as const;

interface ProgramsFiltersProps {
  searchDraft: string;
  onSearchChange: (val: string) => void;
  level: string;
  onLevelChange: (val: string) => void;
  school: string;
  onSchoolChange: (val: string) => void;
  schools: string[];
  isLoading: boolean;
  filteredCount: number;
}

export function ProgramsFilters({
  searchDraft,
  onSearchChange,
  level,
  onLevelChange,
  school,
  onSchoolChange,
  schools,
  isLoading,
  filteredCount,
}: ProgramsFiltersProps) {
  return (
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
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </label>
            <label className={cn(fieldClass, "mb-0 md:w-56")}>
              <span className={fieldLabelClass}>Level</span>
              <SelectInput
                value={level}
                onChange={(event) => onLevelChange(event.target.value)}
              >
                {LEVELS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {schools.map((item) => (
              <button
                key={item}
                type="button"
                className="cursor-pointer"
                onClick={() => onSchoolChange(item)}
              >
                <Chip tone={item === school ? "jade" : "default"}>{item}</Chip>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 mt-5 pt-5 border-t border-white/8">
            <p className="text-sm text-ink-faint">
              {isLoading
                ? "Loading programmes…"
                : `${filteredCount} programme${filteredCount === 1 ? "" : "s"}`}
            </p>
            <p className="text-sm text-ink-faint">Seat counts refresh each night</p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
