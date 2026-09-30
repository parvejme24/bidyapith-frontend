"use client";

import { useEffect, useState } from "react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { meterTone } from "@/lib/format";
import { meterFillClass, meterTrackClass, numClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type SeatMeterProps = {
  filled: number;
  total: number;
  label?: string;
  caption?: string;
  extra?: string;
  className?: string;
};

export function SeatMeter({ filled, total, label, caption, extra, className }: SeatMeterProps) {
  const percent = total === 0 ? 0 : Math.round((filled / total) * 100);
  const tone = meterTone(percent);
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.4 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setWidth(percent);
      return;
    }

    const timer = window.setTimeout(() => setWidth(percent), 120);
    return () => window.clearTimeout(timer);
  }, [inView, percent]);

  return (
    <div className={className}>
      {(label || caption) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-baseline gap-2 min-w-0 truncate">
            {label ? <span className="truncate text-xs sm:text-sm text-ink-muted">{label}</span> : null}
            {caption ? <span className="truncate text-[0.7rem] sm:text-xs text-ink-faint hidden xs:inline">{caption}</span> : null}
          </div>
          <span className={cn(numClass, "shrink-0 text-xs text-ink-faint ml-auto")}>
            {extra ?? `${filled}/${total}`}
          </span>
        </div>
      )}
      <div ref={ref} className={meterTrackClass}>
        <span
          className={meterFillClass({
            tone: tone === "warn" ? "warn" : tone === "hot" ? "hot" : "default",
          })}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
