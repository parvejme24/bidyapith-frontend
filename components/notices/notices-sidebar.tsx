"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import type { CampusEvent } from "@/lib/types";
import { formatEventDay, formatEventMonth } from "@/lib/format";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldLabelClass,
  numClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

interface NoticesSidebarProps {
  events: CampusEvent[];
}

export function NoticesSidebar({ events }: NoticesSidebarProps) {
  const [email, setEmail] = useState("");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success("Subscribed. Check your inbox to confirm.");
    setEmail("");
  }

  return (
    <aside className="grid gap-4">
      <Reveal>
        <GlassCard className="p-5 sm:p-6">
          <h2 className={cn(displayClass.d3, "mb-5")}>Upcoming events</h2>
          <ul className="space-y-4 sm:space-y-5">
            {events.map((item) => (
              <li key={`${item.title}-${item.date}`} className="flex gap-3 sm:gap-4">
                <GlassCard
                  quiet
                  className="grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl shrink-0 leading-none"
                >
                  <span className={cn("font-display text-lg sm:text-xl", numClass)}>{formatEventDay(item.date)}</span>
                  <span className="text-[0.55rem] sm:text-[0.6rem] text-ink-faint mt-0.5">
                    {formatEventMonth(item.date)}
                  </span>
                </GlassCard>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-sm leading-snug">{item.title}</span>
                  <span className="block text-xs text-ink-faint mt-1 truncate">
                    {item.time} · {item.place}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal delay={90}>
        <GlassCard className="p-5 sm:p-6">
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
  );
}
