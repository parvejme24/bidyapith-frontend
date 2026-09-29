"use client";

import Link from "next/link";
import { ApplicationSparkline } from "@/components/home/campus-charts";
import { Chip } from "@/components/site/chip";
import { CountUp } from "@/components/site/count-up";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import { SeatMeter } from "@/components/site/seat-meter";
import {
  buttonClass,
  displayClass,
  gradJadeClass,
  leadClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const SPARKLINE = [42, 51, 47, 63, 58, 74, 69, 88, 96, 91, 118, 132, 156, 187];

interface HomeHeroProps {
  semester: string;
  founded: number;
  seatsData?: { label: string; filled: number; total: number }[];
  seatsLoading?: boolean;
}

export function HomeHero({
  semester,
  founded,
  seatsData,
  seatsLoading,
}: HomeHeroProps) {
  return (
    <section className="pt-10 pb-8 md:pt-16 md:pb-12">
      <div
        className={cn(
          shellClass,
          "grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-center"
        )}
      >
        <div>
          <Rise delay={1}>
            <Chip tone="jade" live>
              Applications open for {semester}
            </Chip>
          </Rise>
          <Rise delay={2}>
            <h1 className={cn(displayClass.d1, "mt-6")}>
              Apply once.
              <br />
              <span className={gradJadeClass}>Then get on with learning.</span>
            </h1>
          </Rise>
          <Rise delay={3}>
            <p className={cn(leadClass, "mt-6")}>
              Bidyapith runs admission, course registration, attendance, results and fees on one
              system. Nine thousand students spend their time on coursework instead of queues
              outside the administration building.
            </p>
          </Rise>
          <Rise delay={4}>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/register" className={buttonClass({ variant: "primary" })}>
                Start your application
              </Link>
              <Link href="/programs" className={buttonClass({ variant: "ghost" })}>
                Explore 34 programmes
              </Link>
            </div>
          </Rise>
          <Rise delay={5}>
            <dl className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
              <div>
                <dt className="text-xs text-ink-faint mb-1">Established</dt>
                <dd className="font-display text-xl">{founded}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint mb-1">Schools</dt>
                <dd className="font-display text-xl">Six</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint mb-1">Campus</dt>
                <dd className="font-display text-xl">Purbachal</dd>
              </div>
            </dl>
          </Rise>
        </div>

        <Rise delay={3}>
          <GlassCard strong className="p-5 sm:p-7" aria-label="Live campus figures">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-ink-faint">Current term</p>
                <p className="font-display text-xl">{semester}</p>
              </div>
              <Chip tone="jade" live>
                Live
              </Chip>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GlassCard quiet className="p-4">
                <p className="text-xs text-ink-faint mb-1">Seats still open</p>
                <CountUp value={412} className="font-display text-2xl" />
              </GlassCard>
              <GlassCard quiet className="p-4">
                <p className="text-xs text-ink-faint mb-1">Applications today</p>
                <CountUp value={187} className="font-display text-2xl" />
              </GlassCard>
            </div>

            <GlassCard quiet className="p-4 mt-3">
              <div className="flex items-end justify-between gap-4 mb-2">
                <div>
                  <p className="text-xs text-ink-faint">Applications, last 14 days</p>
                  <p className="font-display text-lg">Up 34% on last cycle</p>
                </div>
                <ApplicationSparkline values={SPARKLINE} />
              </div>
            </GlassCard>

            <p className="text-xs text-ink-faint mt-5 mb-2.5">Seats filling fastest</p>
            <ul className="space-y-3">
              {seatsData?.slice(0, 3).map((seat) => (
                <li key={seat.label}>
                  <SeatMeter filled={seat.filled} total={seat.total} label={seat.label} />
                </li>
              ))}
              {seatsLoading ? (
                <div className="animate-pulse rounded-2xl bg-white/5 h-24" />
              ) : null}
            </ul>

            <Link
              href="/admissions"
              className={cn(buttonClass({ variant: "ghost", size: "sm" }), "w-full mt-5")}
            >
              See the admission timeline
            </Link>
          </GlassCard>
        </Rise>
      </div>
    </section>
  );
}
