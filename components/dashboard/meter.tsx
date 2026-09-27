import React from "react";
import { cn } from "@/lib/utils";

interface MeterProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  tone?: "auto" | "jade" | "warn" | "hot";
}

export function Meter({ value, max = 100, className, tone = "auto" }: MeterProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let resolvedTone = tone;
  if (tone === "auto") {
    if (percentage >= 90) resolvedTone = "hot";
    else if (percentage >= 75) resolvedTone = "warn";
    else resolvedTone = "jade";
  }

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10 p-[1px]",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          resolvedTone === "hot" && "bg-gradient-to-r from-[#FFB454] to-[#FF7E9D]",
          resolvedTone === "warn" && "bg-gradient-to-r from-[#7CE9CB] to-[#FFB454]",
          resolvedTone === "jade" && "bg-gradient-to-r from-[#7CE9CB] to-[#2ED3A7]"
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
