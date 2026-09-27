"use client";

import React from "react";

interface DonutItem {
  label: string;
  value: number;
  color: string;
}

interface DistributionDonutProps {
  data: DonutItem[];
  centerValue?: string;
  centerLabel?: string;
  legend?: boolean;
}

export function DistributionDonut({
  data,
  centerValue,
  centerLabel,
  legend = true,
}: DistributionDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 70;
  const C = 2 * Math.PI * R;

  let acc = 0;
  const segments = data.map((d) => {
    const len = (d.value / total) * C;
    const offset = -90 + (acc / total) * 360;
    acc += d.value;
    return {
      ...d,
      len,
      offset,
      pct: Math.round((d.value / total) * 100),
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="20"
          />

          {/* Slices */}
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={`${seg.len} ${C - seg.len}`}
              transform={`rotate(${seg.offset + 90} 100 100)`}
              className="transition-all duration-700 ease-out"
            >
              <title>{`${seg.label}: ${seg.value.toLocaleString()} (${seg.pct}%)`}</title>
            </circle>
          ))}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="font-display text-2xl font-bold leading-none text-ink">
            {centerValue || total.toLocaleString()}
          </span>
          {centerLabel && (
            <span className="text-[0.7rem] uppercase tracking-wider text-ink-faint mt-1 font-semibold">
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      {legend && (
        <ul className="w-full mt-4 space-y-1.5 text-xs divide-y divide-white/5">
          {data.map((d, idx) => (
            <li key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-ink-muted">{d.label}</span>
              </span>
              <span className="font-semibold text-ink num">
                {d.value.toLocaleString()} ({Math.round((d.value / total) * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
