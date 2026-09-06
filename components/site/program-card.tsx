"use client";

import { useState } from "react";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { ProgramDialog } from "@/components/site/program-dialog";
import { SeatMeter } from "@/components/site/seat-meter";
import { Dialog } from "@/components/ui/dialog";
import { formatTaka, programTagTone } from "@/lib/format";
import { buttonClass, numClass } from "@/lib/styles";
import type { Program } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProgramCardProps = {
  program: Program;
  reveal?: boolean;
};

export function ProgramCard({ program, reveal = true }: ProgramCardProps) {
  const [open, setOpen] = useState(false);
  const percent = Math.round((program.filled / program.seats) * 100);
  const left = program.seats - program.filled;

  const card = (
    <GlassCard
      lift
      role="button"
      tabIndex={0}
      aria-label={`Course outline for ${program.name}`}
      className="p-6 flex flex-col h-full cursor-pointer"
      onClick={() => setOpen(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(true);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <Chip>{program.school}</Chip>
        {program.tag ? <Chip tone={programTagTone(program.tag)}>{program.tag}</Chip> : null}
      </div>

      <h3 className="font-display text-[1.22rem] leading-snug">{program.name}</h3>
      <p className="text-sm text-ink-muted mt-2.5 flex-1">{program.about}</p>

      <dl className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/8">
        <div>
          <dt className="text-[0.68rem] text-ink-faint">Credits</dt>
          <dd className={cn("font-display text-lg", numClass)}>{program.credits}</dd>
        </div>
        <div>
          <dt className="text-[0.68rem] text-ink-faint">Years</dt>
          <dd className={cn("font-display text-lg", numClass)}>{program.years}</dd>
        </div>
        <div>
          <dt className="text-[0.68rem] text-ink-faint">Per semester</dt>
          <dd className={cn("font-display text-lg", numClass)}>{formatTaka(program.tuition)}</dd>
        </div>
      </dl>

      <div className="mt-5">
        <SeatMeter
          filled={program.filled}
          total={program.seats}
          caption={left > 0 ? `${left} seats left of ${program.seats}` : "Waiting list only"}
          extra={`${percent}%`}
        />
      </div>

      <span className={cn(buttonClass({ variant: "ghost", size: "sm" }), "mt-5 w-full")}>
        Course outline
      </span>
    </GlassCard>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {reveal ? <Reveal>{card}</Reveal> : card}
      <ProgramDialog program={program} />
    </Dialog>
  );
}
