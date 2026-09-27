import React from "react";
import { cn } from "@/lib/utils";

export type PillTone = "ok" | "warn" | "bad" | "info" | "mute";

interface StatusPillProps {
  children: React.ReactNode;
  tone?: PillTone;
  className?: string;
}

export function StatusPill({ children, tone = "mute", className }: StatusPillProps) {
  const toneMap: Record<PillTone, string> = {
    ok: "bg-[rgba(46,211,167,0.14)] border-[rgba(46,211,167,0.34)] text-[#9CF0D8]",
    warn: "bg-[rgba(255,180,84,0.14)] border-[rgba(255,180,84,0.34)] text-[#FFD9A6]",
    bad: "bg-[rgba(255,126,157,0.14)] border-[rgba(255,126,157,0.34)] text-[#FFC2D1]",
    info: "bg-[rgba(155,140,255,0.14)] border-[rgba(155,140,255,0.34)] text-[#D3CBFF]",
    mute: "bg-white/[0.06] border-white/14 text-ink-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.75rem] font-bold tracking-[0.01em] border whitespace-nowrap",
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
