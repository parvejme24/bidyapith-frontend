"use client";

import React from "react";

interface BarPoint {
  label: string;
  value: number;
}

interface CollectionsBarChartProps {
  data: BarPoint[];
  color?: string;
  unit?: string;
  height?: number;
}

export function CollectionsBarChart({
  data,
  color = "#FFB454",
  unit = " cr",
  height = 200,
}: CollectionsBarChartProps) {
  if (!data || data.length === 0) return null;

  const W = 480;
  const H = height;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 28;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const barWidth = (plotW / data.length) * 0.52;
  const step = plotW / data.length;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        aria-label="Bar chart"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 0.5, 1].map((pct, idx) => {
          const y = padT + plotH * pct;
          const val = max - pct * max;
          return (
            <g key={idx}>
              <line
                x1={padL}
                y1={y}
                x2={W - padR}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="3 3"
              />
              <text
                x={padL - 8}
                y={y + 3}
                textAnchor="end"
                fill="#7C87AE"
                fontSize="10"
              >
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / max) * plotH;
          const x = padL + i * step + (step - barWidth) / 2;
          const y = padT + plotH - barHeight;

          return (
            <g key={i} className="group cursor-pointer">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="6"
                fill="url(#barGradient)"
                className="transition-all duration-300 hover:opacity-80"
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fill="#EEF1FB"
                fontSize="10"
                fontWeight="600"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {d.value}
                {unit}
              </text>
              <text
                x={x + barWidth / 2}
                y={H - 8}
                textAnchor="middle"
                fill="#7C87AE"
                fontSize="11"
                fontWeight="500"
              >
                {d.label}
              </text>
              <title>{`${d.label}: ${d.value}${unit}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
