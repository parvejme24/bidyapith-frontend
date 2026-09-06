"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint, EnrolmentSlice } from "@/lib/types";
import { numClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const AXIS = { fill: "#7C87AE", fontSize: 11, fontWeight: 600 };
const GRID = "rgba(255,255,255,0.09)";
const JADE = "#2ED3A7";
const ORCHID = "#9B8CFF";
const MARIGOLD = "#FFB454";

function NightTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-[#131A44]/95 px-3 py-2 text-xs text-ink shadow-xl">
      <p className="text-ink-faint mb-0.5">{label}</p>
      <p className={cn("font-semibold", numClass)}>
        {Number(payload[0].value).toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

export function ApplicationSparkline({
  values,
}: {
  values: number[];
}) {
  const data = values.map((value, index) => ({ index, value }));

  return (
    <div className="h-9 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={JADE}
            strokeWidth={2.2}
            isAnimationActive
            dot={(props) => {
              const { cx, cy, index } = props;
              if (index !== data.length - 1) return <g key={index} />;
              return <circle key={index} cx={cx} cy={cy} r={3} fill={JADE} />;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IntakeBarChart({
  data,
  color = JADE,
  unit = "",
}: {
  data: ChartPoint[];
  color?: string;
  unit?: string;
}) {
  const gradId = useId().replace(/:/g, "");

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.28} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis
            tick={AXIS}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => Number(value).toLocaleString()}
            width={42}
          />
          <Tooltip content={<NightTooltip suffix={unit} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" fill={`url(#${gradId})`} radius={[7, 7, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EnrolmentDonut({
  data,
  centerValue,
  centerLabel,
}: {
  data: EnrolmentSlice[];
  centerValue: string;
  centerLabel: string;
}) {
  return (
    <div className="relative mx-auto max-w-[240px] aspect-square">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="68%"
            outerRadius="88%"
            stroke="rgba(11,16,48,0.55)"
            strokeWidth={2}
          >
            {data.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0];
              return (
                <div className="rounded-xl border border-white/15 bg-[#131A44]/95 px-3 py-2 text-xs text-ink shadow-xl">
                  <p className="text-ink-faint mb-0.5">{item.name}</p>
                  <p className={cn("font-semibold", numClass)}>{Number(item.value).toLocaleString()}</p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-[1.7rem] leading-none">{centerValue}</p>
          <p className="text-[0.66rem] font-semibold text-ink-faint mt-1">{centerLabel}</p>
        </div>
      </div>
    </div>
  );
}

export function RegistrationAreaChart({
  data,
  color = ORCHID,
  className,
}: {
  data: ChartPoint[];
  color?: string;
  className?: string;
}) {
  const gradId = useId().replace(/:/g, "");

  return (
    <div className={cn("relative h-[280px] w-full min-h-[280px] sm:h-[300px]", className)}>
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.42} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis
              dataKey="label"
              tick={AXIS}
              axisLine={false}
              tickLine={false}
              interval={0}
              minTickGap={8}
            />
            <YAxis
              tick={AXIS}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${Number(value).toFixed(1)}k`}
              width={42}
            />
            <Tooltip content={<NightTooltip suffix="k" />} cursor={{ stroke: "rgba(255,255,255,0.12)" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#${gradId})`}
              dot={{ r: 4.5, fill: "#0B1030", stroke: color, strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function EmploymentGauge({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  const data = [
    { name: "employed", value: percent },
    { name: "rest", value: Math.max(0, 100 - percent) },
  ];

  return (
    <div className="relative mx-auto max-w-[190px] aspect-square">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={225}
            endAngle={-45}
            innerRadius="70%"
            outerRadius="88%"
            stroke="none"
          >
            <Cell fill={MARIGOLD} />
            <Cell fill="rgba(255,255,255,0.08)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-[1.85rem] leading-none">{percent}%</p>
          <p className="text-[0.62rem] font-semibold text-ink-faint mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}
