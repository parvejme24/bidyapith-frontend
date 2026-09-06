"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Chip } from "@/components/site/chip";
import { EmptyState } from "@/components/site/empty-state";
import { GlassCard } from "@/components/site/glass-card";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/motion";
import { NoticeRow } from "@/components/site/notice-row";
import { useEvents, useNotices } from "@/hooks/use-data";
import { formatEventDay, formatEventMonth } from "@/lib/format";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldLabelClass,
  sectionClass,
  sectionTightClass,
  shellClass,
  numClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function NoticesPage() {
  const notices = useNotices();
  const events = useEvents();
  const [active, setActive] = useState("All");
  const [email, setEmail] = useState("");

  const types = useMemo(
    () => ["All", ...Array.from(new Set((notices.data ?? []).map((notice) => notice.type)))],
    [notices.data],
  );

  const filtered = useMemo(() => {
    const list = notices.data ?? [];
    return list
      .filter((notice) => active === "All" || notice.type === active)
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) ||
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }, [notices.data, active]);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast("Subscribed. Check your inbox to confirm.");
    setEmail("");
  }

  return (
    <main id="main">
      <section className="pt-12 pb-6 md:pt-16">
        <PageHero
          chip="Updated 8 September 2026"
          chipTone="gold"
          title="Notices, in the order they matter"
          lead="Everything the registrar publishes lands here first, and on the portal at the same moment. Pinned notices stay at the top until they expire."
        />
      </section>

      <section className={sectionTightClass}>
        <div className={shellClass}>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                className="cursor-pointer"
                onClick={() => setActive(type)}
              >
                <Chip tone={type === active ? "jade" : "default"}>{type}</Chip>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={cn(sectionClass, "pt-4")}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.6fr_1fr] items-start")}>
          <div className="space-y-3">
            {notices.isLoading ? (
              <GlassCard className="p-10 animate-pulse min-h-40" />
            ) : filtered.length ? (
              filtered.map((notice) => <NoticeRow key={notice.id} notice={notice} />)
            ) : (
              <EmptyState
                title={`Nothing filed under ${active}`}
                description="Check back after the next academic council meeting."
              />
            )}
          </div>

          <aside className="grid gap-4">
            <Reveal>
              <GlassCard className="p-6">
                <h2 className={cn(displayClass.d3, "mb-5")}>Upcoming events</h2>
                <ul className="space-y-5">
                  {(events.data ?? []).map((item) => (
                    <li key={`${item.title}-${item.date}`} className="flex gap-4">
                      <GlassCard
                        quiet
                        className="grid place-items-center w-14 h-14 rounded-2xl shrink-0 leading-none"
                      >
                        <span className={cn("font-display text-xl", numClass)}>{formatEventDay(item.date)}</span>
                        <span className="text-[0.6rem] text-ink-faint mt-0.5">
                          {formatEventMonth(item.date)}
                        </span>
                      </GlassCard>
                      <span className="min-w-0">
                        <span className="block font-semibold text-sm">{item.title}</span>
                        <span className="block text-xs text-ink-faint mt-1">
                          {item.time} · {item.place}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>

            <Reveal delay={90}>
              <GlassCard className="p-6">
                <h2 className={cn(displayClass.d3, "mb-3")}>Get notices by email</h2>
                <p className="text-sm text-ink-muted mb-4">
                  One message a week, only when something is actually published.
                </p>
                <form onSubmit={handleSubscribe}>
                  <label className={fieldClass}>
                    <span className={cn(fieldLabelClass, "sr-only")}>Email address</span>
                    <input
                      className={controlClass}
                      type="email"
                      placeholder="you@example.com"
                      aria-label="Email address"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>
                  <button type="submit" className={cn(buttonClass({ variant: "primary" }), "w-full")}>
                    Subscribe
                  </button>
                </form>
              </GlassCard>
            </Reveal>

            <Reveal delay={150}>
              <GlassCard quiet className="p-6">
                <h2 className="text-sm font-bold mb-2">Something look wrong?</h2>
                <p className="text-sm text-ink-muted">
                  Notices are published by the registrar&apos;s office. If a date here disagrees
                  with your portal, the portal is correct — tell us and we will fix the notice.
                </p>
              </GlassCard>
            </Reveal>
          </aside>
        </div>
      </section>
    </main>
  );
}
