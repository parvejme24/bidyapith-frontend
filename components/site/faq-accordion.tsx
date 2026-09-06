"use client";

import { useState } from "react";
import type { Faq } from "@/lib/types";
import { cn } from "@/lib/utils";

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function FaqAccordion({ faqs, className }: { faqs: Faq[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className={className}>
      {faqs.map((faq, index) => {
        const open = openIndex === index;
        return (
          <div key={faq.q} className="border-b border-white/[0.08] last:border-0">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-[1.15rem] pl-1 text-left text-base font-semibold text-ink"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              {faq.q}
              <span className={cn("shrink-0 text-jade transition-transform duration-300", open && "rotate-45")}>
                <PlusIcon />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-[1.15rem] text-[0.94rem] text-ink-muted">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
