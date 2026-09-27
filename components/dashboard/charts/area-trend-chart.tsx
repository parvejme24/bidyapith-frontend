"use client";

import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface AreaTrendChartProps {
  data: DataPoint[];
  color?: string;
  unit?: string;
  height?: number;
}

export function AreaTrendChart({
  data,
  color = "#2ED3A7",
  unit = "",
  height = 200,
}: AreaTrendChartProps) {
  if (!data || data.length === 0) return null;

  const W = 500;
  const H = height;
  const padL = 40;
  const padR = 20;
  const padT = 20;
  const padB = 30;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const padMin = Math.max(0, minVal - range * 0.1);
  const padMax = maxVal + range * 0.15;
  const yRange = padMax - padMin || 1;

  const points = data.map((d, i) => {
    const x = padL + (i / (data.length - 1)) * plotW;
    const y = padT + plotH - ((d.value - padMin) / yRange) * plotH;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + plotH} L ${points[0].x} ${padT + plotH} Z`;

  const gradId = `areaGrad-${color.replace("#", "")}`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        aria-label="Area trend chart"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 0.5, 1].map((pct, idx) => {
          const y = padT + plotH * pct;
          const val = padMax - pct * yRange;
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
                fontFamily="inherit"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(val < 10 ? 2 : 0)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Stroke Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points and labels */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#0B1030"
              stroke={color}
              strokeWidth="2.5"
              className="transition-transform group-hover:scale-150"
            />
            <text
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              fill="#7C87AE"
              fontSize="11"
              fontFamily="inherit"
              fontWeight="500"
            >
              {p.label}
            </text>
            {/* Tooltip on hover */}
            <title>{`${p.label}: ${p.value}${unit}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
