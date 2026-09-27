import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  tone?: "up" | "down" | "gold" | "orchid" | "";
  className?: string;
}

export function StatTile({ label, value, detail, tone = "", className }: StatTileProps) {
  return (
    <GlassCard className={cn("p-5 flex flex-col justify-between gap-1.5", className)}>
      <span className="text-[0.78rem] uppercase tracking-wider text-ink-faint font-semibold">
        {label}
      </span>
      <div className="font-display text-[1.85rem] font-semibold leading-none text-ink">
        {value}
      </div>
      {detail && (
        <div
          className={cn(
            "text-[0.78rem] flex items-center gap-1.5 mt-0.5",
            tone === "up" && "text-[#7CE9CB]",
            tone === "down" && "text-[#FFC2D1]",
            tone === "gold" && "text-[#FFD9A6]",
            tone === "orchid" && "text-[#D3CBFF]",
            !tone && "text-ink-muted"
          )}
        >
          {tone === "up" && <span className="font-bold">↑</span>}
          {tone === "down" && <span className="font-bold">↓</span>}
          <span>{detail}</span>
        </div>
      )}
    </GlassCard>
  );
}
