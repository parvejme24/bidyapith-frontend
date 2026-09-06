import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { formatNoticeDate } from "@/lib/format";
import { numClass } from "@/lib/styles";
import type { Notice } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NoticeTicker({ notices }: { notices: Notice[] }) {
  const items = notices.slice(0, 6);
  const loop = [...items, ...items];

  return (
    <GlassCard className="flex items-center gap-5 px-5 py-3.5">
      <Chip tone="gold" className="shrink-0">
        Notice board
      </Chip>
      <div className="flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <div className="flex w-max gap-10 animate-[slide_34s_linear_infinite] hover:[animation-play-state:paused]">
          {loop.map((notice, index) => (
            <span
              key={`${notice.id}-${index}`}
              className="flex items-center gap-2.5 whitespace-nowrap text-sm text-ink-muted"
            >
              <span className="size-[7px] rounded-full bg-jade" />
              {notice.title}
              <span className={cn(numClass, "text-ink-faint")}>· {formatNoticeDate(notice.date)}</span>
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
