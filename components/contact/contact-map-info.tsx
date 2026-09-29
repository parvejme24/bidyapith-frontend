"use client";

import { FaqAccordion } from "@/components/site/faq-accordion";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { SITE } from "@/lib/site";
import { displayClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const phoneHref = `tel:${SITE.phone.replace(/\s/g, "")}`;

interface ContactMapInfoProps {
  faqs: { q: string; a: string }[];
}

export function ContactMapInfo({ faqs }: ContactMapInfoProps) {
  return (
    <div className="grid gap-4">
      <Reveal delay={80}>
        <GlassCard className="p-7">
          <h2 className={cn(displayClass.d3, "mb-5")}>Find the campus</h2>

          <svg
            viewBox="0 0 400 240"
            className="w-full rounded-2xl border border-white/10"
            role="img"
            aria-label="Illustrated campus location map"
          >
            <rect width="400" height="240" fill="#0E1436" />
            <path
              d="M0 150 Q120 130 200 160 T400 140"
              stroke="rgba(46,211,167,.25)"
              strokeWidth="16"
              fill="none"
            />
            <path
              d="M60 0 L120 240"
              stroke="rgba(255,255,255,.07)"
              strokeWidth="14"
              fill="none"
            />
            <path
              d="M300 0 L250 240"
              stroke="rgba(255,255,255,.07)"
              strokeWidth="14"
              fill="none"
            />
            <path
              d="M0 70 L400 92"
              stroke="rgba(255,255,255,.07)"
              strokeWidth="10"
              fill="none"
            />
            <rect
              x="150"
              y="86"
              width="98"
              height="62"
              rx="10"
              fill="rgba(46,211,167,.16)"
              stroke="#2ED3A7"
            />
            <circle cx="199" cy="117" r="6" fill="#2ED3A7" />
            <text
              x="199"
              y="167"
              textAnchor="middle"
              fill="#EEF1FB"
              fontSize="12"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="700"
            >
              Bidyapith Campus
            </text>
            <text
              x="199"
              y="184"
              textAnchor="middle"
              fill="#7C87AE"
              fontSize="10.5"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              Purbachal Sector 9, Dhaka 1229
            </text>
            <text
              x="330"
              y="150"
              fill="#7C87AE"
              fontSize="10"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              300 ft road
            </text>
          </svg>

          <ul className="space-y-3 mt-5 text-sm">
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Main gate</span>
              <span>Purbachal Sector 9</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">From Kuril</span>
              <span>25 minutes by car</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Shuttle</span>
              <span>Uttara, Badda, Rampura</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink-faint">Phone</span>
              <a href={phoneHref} className="text-jade">
                {SITE.phone}
              </a>
            </li>
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal delay={140}>
        <GlassCard className="p-7">
          <h2 className={cn(displayClass.d3, "mb-3")}>Quick answers</h2>
          <FaqAccordion faqs={faqs.slice(0, 4)} />
        </GlassCard>
      </Reveal>
    </div>
  );
}
