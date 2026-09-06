import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { formatNoticeDate, noticeTone } from "@/lib/format";
import { measureClass, numClass } from "@/lib/styles";
import type { Notice } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NoticeRow({ notice }: { notice: Notice }) {
  return (
    <Reveal>
      <GlassCard lift className="p-5">
        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
          <Chip tone={noticeTone(notice.type)}>{notice.type}</Chip>
          {notice.pinned ? (
            <Chip tone="jade">
              <span className="size-[7px] rounded-full bg-jade" /> Pinned
            </Chip>
          ) : null}
          <span className={cn(numClass, "text-xs text-ink-faint ml-auto")}>{formatNoticeDate(notice.date)}</span>
        </div>
        <h3 className="font-display text-[1.1rem] leading-snug">{notice.title}</h3>
        <p className={cn("text-sm text-ink-muted mt-2", measureClass)}>{notice.body}</p>
      </GlassCard>
    </Reveal>
  );
}
