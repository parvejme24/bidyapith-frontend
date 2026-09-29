import React from "react";
import { cn } from "@/lib/utils";
import type { SearchCategory, SearchItem } from "./types";

interface SearchResultItemProps {
  item: SearchItem;
  onSelect: (href: string) => void;
}

function getCategoryBadgeClass(category: SearchCategory): string {
  switch (category) {
    case "Navigation":
      return "bg-white/5 text-ink-faint border border-white/10";
    case "Course":
    case "Study":
      return "bg-jade/15 text-jade border border-jade/20";
    case "Teaching":
    case "Section":
      return "bg-orchid/15 text-orchid border border-orchid/20";
    case "Student":
    case "User":
      return "bg-sky-500/15 text-sky-400 border border-sky-500/20";
    case "Attendance":
      return "bg-marigold/15 text-marigold border border-marigold/20";
    case "Finance":
      return "bg-rose/15 text-rose border border-rose/20";
    case "Notice":
    case "Advising":
      return "bg-amber-400/15 text-amber-400 border border-amber-400/20";
    case "Audit":
      return "bg-purple-400/15 text-purple-400 border border-purple-400/20";
    default:
      return "bg-white/5 text-ink-faint border border-white/10";
  }
}

export function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.href)}
      className="w-full text-left flex items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-white/[0.08] hover:border-jade/30 border border-transparent transition-all group cursor-pointer"
    >
      <div className="size-8 sm:size-9 rounded-md bg-white/5 flex items-center justify-center shrink-0 border border-white/8 group-hover:bg-jade/15 group-hover:border-jade/30 transition-colors mt-0.5">
        {item.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-xs font-semibold text-ink group-hover:text-jade transition-colors truncate">
            {item.title}
          </p>
          <span
            className={cn(
              "text-[0.62rem] font-semibold px-2 py-0.5 rounded-full shrink-0",
              getCategoryBadgeClass(item.category)
            )}
          >
            {item.category}
          </span>
        </div>
        <p className="text-[0.7rem] text-ink-muted line-clamp-2 sm:line-clamp-1 mt-0.5 leading-snug">
          {item.subtitle}
        </p>
      </div>
    </button>
  );
}
