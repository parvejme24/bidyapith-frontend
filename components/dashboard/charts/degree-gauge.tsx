"use client";

import React from "react";

interface DegreeGaugeProps {
  percentage: number;
  label?: string;
  color?: string;
  size?: number;
}

export function DegreeGauge({
  percentage,
  label = "COMPLETE",
  color = "#9B8CFF",
  size = 180,
}: DegreeGaugeProps) {
  const pct = Math.min(100, Math.max(0, percentage));
  const R = 60;
  const C = Math.PI * R; // semi-circle circumference
  const strokeDash = (pct / 100) * C;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size * 0.65}
        viewBox="0 0 160 100"
        className="overflow-visible"
        aria-label={`Degree progress: ${pct}%`}
      >
        {/* Track */}
        <path
          d="M 20 85 A 60 60 0 0 1 140 85"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Active Arc */}
        <path
          d="M 20 85 A 60 60 0 0 1 140 85"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${C}`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Center Text */}
        <text
          x="80"
          y="72"
          textAnchor="middle"
          fill="#EEF1FB"
          fontSize="26"
          fontFamily="Fraunces, serif"
          fontWeight="600"
        >
          {pct}%
        </text>
        <text
          x="80"
          y="88"
          textAnchor="middle"
          fill="#7C87AE"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
