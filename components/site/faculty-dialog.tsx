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
      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-5">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {faculty.avatar ? (
            <img
              src={faculty.avatar}
              alt={faculty.name}
              className="size-14 sm:size-16 rounded-full object-cover shrink-0 ring-1 ring-white/10 shadow-md"
            />
          ) : (
            <span className={cn(avatarClass({ tone }), "size-14 sm:size-16 text-lg sm:text-xl")}>{initials(faculty.name)}</span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className={cn(displayClass.d3, "truncate")}>{faculty.name}</h3>
            <p className="text-xs sm:text-sm text-ink-faint mt-1 truncate">
              {faculty.role} · {deptName(faculty.dept)}
            </p>
          </div>
        </div>
        <DialogRoundClose />
      </div>

      <p className="text-sm sm:text-base text-ink-muted leading-relaxed">{faculty.bio}</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4 sm:my-6">
        {[
          ["Since", faculty.since],
          ["Publications", faculty.papers],
          ["Courses", teaches.length || "—"],
        ].map(([label, value]) => (
          <GlassCard key={String(label)} quiet className="p-2.5 sm:p-3.5 text-center">
            <p className="text-[0.62rem] sm:text-[0.68rem] text-ink-faint truncate">{label}</p>
            <p className={cn("font-display text-base sm:text-lg mt-0.5", numClass)}>{value}</p>
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
