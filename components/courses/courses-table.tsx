"use client";

import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { CourseRowSkeleton } from "@/components/site/skeletons";
import { deptName } from "@/lib/api";
import type { Course } from "@/lib/types";
import {
  buttonClass,
  numClass,
  tableClass,
  tableScrollClass,
  tdClass,
  thClass,
  trClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

function seatsLeft(course: Course) {
  return course.seats - course.taken;
}

function seatChipTone(left: number) {
  if (left === 0) return "rose" as const;
  if (left <= 8) return "gold" as const;
  return "jade" as const;
}

interface CoursesTableProps {
  courses: Course[];
  isLoading: boolean;
  pages: number;
  safePage: number;
  onPageChange: (page: number) => void;
}

export function CoursesTable({
  courses,
  isLoading,
  pages,
  safePage,
  onPageChange,
}: CoursesTableProps) {
  return (
    <>
      <GlassCard className="p-2 sm:p-4">
        <div className={tableScrollClass}>
          <table className={cn(tableClass, "min-w-[680px]")}>
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
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <CourseRowSkeleton key={i} />
                ))
              ) : courses.length ? (
                courses.map((course) => {
                  const left = seatsLeft(course);
                  return (
                    <tr key={course.code} className={trClass}>
                      <td className={cn(tdClass, numClass, "font-semibold whitespace-nowrap")}>
                        {course.code}
                      </td>
                      <td className={tdClass}>
                        <span className="block font-semibold">{course.title}</span>
                        <span className="block text-xs text-ink-faint mt-0.5">
                          {deptName(course.dept)}
                        </span>
                      </td>
                      <td className={cn(tdClass, numClass, "text-center")}>{course.credits}</td>
                      <td className={cn(tdClass, "whitespace-nowrap")}>{course.semester}</td>
                      <td className={cn(tdClass, numClass, "whitespace-nowrap text-ink-muted")}>
                        {course.prereq}
                      </td>
                      <td className={cn(tdClass, "whitespace-nowrap text-ink-muted")}>
                        {course.instructor}
                      </td>
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
            onClick={() => onPageChange(safePage - 1)}
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
                onClick={() => onPageChange(pageNumber)}
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
            onClick={() => onPageChange(safePage + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}
