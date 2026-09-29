"use client";

import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import {
  buttonClass,
  displayClass,
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
import type { Department } from "@/lib/types";

interface AboutDepartmentsTableProps {
  departments?: Department[];
}

export function AboutDepartmentsTable({ departments }: AboutDepartmentsTableProps) {
  return (
    <section className={sectionClass}>
      <div className={shellClass}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
            <h2 className={displayClass.d2}>Departments</h2>
            <Link href="/programs" className={buttonClass({ variant: "ghost", size: "sm" })}>
              See their programmes
            </Link>
          </div>
        </Reveal>
        <Reveal>
          <GlassCard className="p-2 sm:p-4">
            <div className={tableScrollClass}>
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Department</th>
                    <th className={thClass}>School</th>
                    <th className={thClass}>Head</th>
                    <th className={cn(thClass, "text-center")}>Programmes</th>
                    <th className={cn(thClass, "text-center")}>Courses</th>
                    <th className={cn(thClass, "text-center")}>Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {(departments ?? []).map((dept) => (
                    <tr key={dept.id} className={trClass}>
                      <td className={cn(tdClass, "font-semibold")}>{dept.name}</td>
                      <td className={cn(tdClass, "text-ink-muted")}>{dept.school}</td>
                      <td className={cn(tdClass, "text-ink-muted whitespace-nowrap")}>{dept.head}</td>
                      <td className={cn(tdClass, numClass, "text-center")}>{dept.programs}</td>
                      <td className={cn(tdClass, numClass, "text-center")}>{dept.courses}</td>
                      <td className={cn(tdClass, numClass, "text-center")}>{dept.faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
