"use client";

import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { NoticeRow } from "@/components/site/notice-row";
import { formatEventDay, formatEventMonth } from "@/lib/format";
import { buttonClass, displayClass, numClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { CampusEvent, Notice } from "@/lib/types";

interface HomeNoticesEventsProps {
  notices?: Notice[];
  events?: CampusEvent[];
}

export function HomeNoticesEvents({ notices, events }: HomeNoticesEventsProps) {
  return (
    <section className={sectionClass}>
      <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.5fr_1fr]")}>
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className={displayClass.d2}>Latest notices</h2>
            <Link href="/notices" className={buttonClass({ variant: "ghost", size: "sm" })}>
              All notices
            </Link>
          </div>
          <div className="space-y-3">
            {notices?.slice(0, 4).map((notice) => (
              <NoticeRow key={notice.id} notice={notice} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className={cn(displayClass.d2, "mb-6")}>What&apos;s coming up</h2>
          <GlassCard className="p-6">
            <ul className="space-y-5">
              {events?.map((event) => (
                <li key={event.title} className="flex gap-4">
                  <GlassCard
                    quiet
                    className="grid place-items-center w-14 h-14 rounded-2xl shrink-0 leading-none"
                  >
                    <span className={cn("font-display text-xl", numClass)}>
                      {formatEventDay(event.date)}
                    </span>
                    <span className="text-[0.6rem] text-ink-faint mt-0.5">
                      {formatEventMonth(event.date)}
                    </span>
                  </GlassCard>
                  <span className="min-w-0">
                    <span className="block font-semibold text-sm">{event.title}</span>
                    <span className="block text-xs text-ink-faint mt-1">
                      {event.time} · {event.place}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
