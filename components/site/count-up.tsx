"use client";

import { useEffect, useState } from "react";
import { useInViewOnce } from "@/hooks/use-in-view";
import { numClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

const DURATION = 1400;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type CountUpProps = {
  value: number;
  suffix?: string;
  className?: string;
};

export function CountUp({ value, suffix = "", className }: CountUpProps) {
  const { ref, inView } = useInViewOnce<HTMLParagraphElement>({ threshold: 0.5 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion()) {
      setDisplay(value.toLocaleString() + suffix);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased).toLocaleString() + suffix);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, suffix, value]);

  return (
    <p ref={ref} className={cn(numClass, className)}>
      {display}
    </p>
  );
}
