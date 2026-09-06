"use client";

import { differenceInSeconds, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { DB } from "@/lib/data";
import { numClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type Units = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function split(closesAt: Date): Units | null {
  const total = differenceInSeconds(closesAt, new Date());
  if (total <= 0) return null;

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function UnitBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-3 sm:px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 min-w-[68px]">
      <div className={cn("font-display text-2xl sm:text-3xl leading-none", numClass)}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[0.62rem] tracking-[0.14em] text-ink-faint mt-1">{label}</div>
    </div>
  );
}

type AdmissionCountdownProps = {
  closesAt?: string;
  className?: string;
};

export function AdmissionCountdown({
  closesAt = DB.meta.admissionCloses,
  className,
}: AdmissionCountdownProps) {
  const target = useMemo(() => parseISO(closesAt), [closesAt]);
  const [units, setUnits] = useState<Units | null>(() => split(target));

  useEffect(() => {
    const tick = () => setUnits(split(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!units) {
    return <p className={`text-ink-muted ${className ?? ""}`}>Applications for this cycle are closed.</p>;
  }

  return (
    <div className={`flex flex-wrap gap-2.5 ${className ?? ""}`}>
      <UnitBox value={units.days} label="DAYS" />
      <UnitBox value={units.hours} label="HRS" />
      <UnitBox value={units.minutes} label="MIN" />
      <UnitBox value={units.seconds} label="SEC" />
    </div>
  );
}
