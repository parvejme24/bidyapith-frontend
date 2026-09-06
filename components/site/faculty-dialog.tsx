import { DialogRoundClose, GlassDialogContent, MailIcon } from "@/components/site/glass-dialog";
import { GlassCard } from "@/components/site/glass-card";
import { deptName } from "@/lib/api";
import { DB } from "@/lib/data";
import { avatarTone, initials } from "@/lib/format";
import { avatarClass, buttonClass, displayClass, numClass } from "@/lib/styles";
import type { FacultyMember } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FacultyDialog({
  faculty,
  index = 0,
}: {
  faculty: FacultyMember;
  index?: number;
}) {
  const teaches = DB.courses.filter((course) => course.instructor === faculty.name);
  const tone = avatarTone(index);

  return (
    <GlassDialogContent title={faculty.name} description={faculty.bio}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <span className={cn(avatarClass({ tone }), "size-16 text-xl")}>{initials(faculty.name)}</span>
          <div>
            <h3 className={displayClass.d3}>{faculty.name}</h3>
            <p className="text-sm text-ink-faint mt-1">
              {faculty.role} · {deptName(faculty.dept)}
            </p>
          </div>
        </div>
        <DialogRoundClose />
      </div>

      <p className="text-ink-muted">{faculty.bio}</p>

      <div className="grid grid-cols-3 gap-3 my-6">
        {[
          ["At Bidyapith since", faculty.since],
          ["Publications", faculty.papers],
          ["Courses this year", teaches.length || "—"],
        ].map(([label, value]) => (
          <GlassCard key={String(label)} quiet className="p-3.5">
            <p className="text-[0.68rem] text-ink-faint">{label}</p>
            <p className={cn("font-display text-lg mt-0.5", numClass)}>{value}</p>
          </GlassCard>
        ))}
      </div>

      {teaches.length ? (
        <>
          <h4 className="font-sans font-bold text-sm mb-3">Teaching now</h4>
          <ul className="space-y-2 mb-6">
            {teaches.map((course) => (
              <li
                key={course.code}
                className="flex items-center justify-between gap-3 text-sm py-2 border-b border-white/6"
              >
                <span>{course.title}</span>
                <span className={cn(numClass, "text-ink-faint")}>{course.code}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <GlassCard quiet className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          <p className="text-ink-faint text-xs">Office hours</p>
          <p className="mt-0.5">{faculty.office}</p>
        </div>
        <a href={`mailto:${faculty.email}`} className={buttonClass({ variant: "ghost", size: "sm" })}>
          <MailIcon /> Email
        </a>
      </GlassCard>
    </GlassDialogContent>
  );
}
