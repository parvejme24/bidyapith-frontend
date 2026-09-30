"use client";

import { CountUp } from "@/components/site/count-up";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { sectionTightClass, shellClass } from "@/lib/styles";

interface HomeStatsStripProps {
  stats?: { label: string; value: number; suffix?: string }[];
}

export function HomeStatsStrip({ stats }: HomeStatsStripProps) {
  return (
    <section className={sectionTightClass}>
      <div className={shellClass}>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats?.map((stat, index) => (
            <li key={stat.label}>
              <Reveal delay={index * 60}>
                <GlassCard className="p-3.5 sm:p-5">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-2xl sm:text-3xl"
                  />
                  <p className="text-[0.7rem] sm:text-xs text-ink-faint mt-1.5">{stat.label}</p>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
