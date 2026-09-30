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
    <div className="grid size-[3.85rem] xs:size-[4.5rem] sm:size-[5.25rem] shrink-0 place-content-center rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 text-center">
      <div className={cn("font-display text-xl xs:text-2xl sm:text-3xl leading-none", numClass)}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[0.55rem] sm:text-[0.62rem] tracking-[0.14em] text-ink-faint">{label}</div>
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
    <div className={`flex flex-wrap gap-2 sm:gap-2.5 ${className ?? ""}`}>
      <UnitBox value={units.days} label="DAYS" />
      <UnitBox value={units.hours} label="HRS" />
      <UnitBox value={units.minutes} label="MIN" />
      <UnitBox value={units.seconds} label="SEC" />
    </div>
  );
}
