"use client";

import { useState } from "react";
import { FacultyDialog } from "@/components/site/faculty-dialog";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { Dialog } from "@/components/ui/dialog";
import { deptName } from "@/lib/api";
import { avatarTone, initials } from "@/lib/format";
import { avatarClass, buttonClass } from "@/lib/styles";
import type { FacultyMember } from "@/lib/types";
import { cn } from "@/lib/utils";

type FacultyCardProps = {
  faculty: FacultyMember;
  index?: number;
  compact?: boolean;
  reveal?: boolean;
};

export function FacultyCard({
  faculty,
  index = 0,
  compact = false,
  reveal = true,
}: FacultyCardProps) {
  const [open, setOpen] = useState(false);
  const tone = avatarTone(index);

  const card = (
    <GlassCard
      lift
      role="button"
      tabIndex={0}
      aria-label={`Profile for ${faculty.name}`}
      className="p-6 h-full cursor-pointer"
      onClick={() => setOpen(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(true);
        }
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        {faculty.avatar ? (
          <img
            src={faculty.avatar}
            alt={faculty.name}
            className="size-14 rounded-full object-cover shrink-0 ring-1 ring-white/10 shadow-md"
          />
        ) : (
          <span className={cn(avatarClass({ tone }), "size-14 text-lg")}>{initials(faculty.name)}</span>
        )}
        <div className="min-w-0">
          <h3 className="font-display text-[1.05rem] leading-tight truncate">{faculty.name}</h3>
          <p className="text-xs text-ink-faint mt-1">{faculty.role}</p>
        </div>
      </div>
      <p className="text-sm text-ink-muted">{faculty.field}</p>
      {compact ? null : (
        <dl className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-white/8 text-xs">
          <div>
            <dt className="text-ink-faint">Department</dt>
            <dd className="mt-0.5">{deptName(faculty.dept)}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Office hours</dt>
            <dd className="mt-0.5">{faculty.office}</dd>
          </div>
        </dl>
      )}
      <span className={cn(buttonClass({ variant: "ghost", size: "sm" }), "mt-5 w-full")}>Profile</span>
    </GlassCard>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {reveal ? <Reveal>{card}</Reveal> : card}
      <FacultyDialog faculty={faculty} index={index} />
    </Dialog>
  );
}
