import Link from "next/link";
import { Chip } from "@/components/site/chip";
import { CheckIcon, DialogRoundClose, GlassDialogContent } from "@/components/site/glass-dialog";
import { GlassCard } from "@/components/site/glass-card";
import { deptName } from "@/lib/api";
import { formatTaka } from "@/lib/format";
import { buttonClass, displayClass, numClass } from "@/lib/styles";
import type { Program } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProgramDialog({ program }: { program: Program }) {
  const left = program.seats - program.filled;
  const stats = [
    ["Credits", program.credits],
    ["Duration", `${program.years} yrs`],
    ["Seats left", left],
    ["Per semester", formatTaka(program.tuition)],
  ] as const;

  return (
    <GlassDialogContent title={program.name} description={program.about}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <Chip className="mb-3">
            {program.school} · {program.level}
          </Chip>
          <h3 className={displayClass.d3}>{program.name}</h3>
          <p className={cn("text-sm text-ink-faint mt-1", numClass)}>
            {program.code} · {deptName(program.dept)}
          </p>
        </div>
        <DialogRoundClose />
      </div>

      <p className="text-ink-muted">{program.about}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-4 sm:my-6">
        {stats.map(([label, value]) => (
          <GlassCard key={label} quiet className="p-3 sm:p-3.5">
            <p className="text-[0.68rem] text-ink-faint">{label}</p>
            <p className={cn("font-display text-base sm:text-lg mt-0.5", numClass)}>{value}</p>
          </GlassCard>
        ))}
      </div>

      <h4 className="font-sans font-bold text-sm mb-3">What you&apos;ll study</h4>
      <ul className="grid sm:grid-cols-2 gap-2.5 mb-6">
        {program.highlights.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
            <span className="text-jade mt-0.5">
              <CheckIcon />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        <Link href="/register" className={cn(buttonClass({ variant: "primary" }), "w-full sm:w-auto text-center justify-center")}>
          Apply to this programme
        </Link>
        <Link href={`/courses?dept=${program.dept}`} className={cn(buttonClass({ variant: "ghost" }), "w-full sm:w-auto text-center justify-center")}>
          See its courses
        </Link>
      </div>
    </GlassDialogContent>
  );
}
