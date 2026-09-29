"use client";

import { Chip } from "@/components/site/chip";
import { sectionTightClass, shellClass } from "@/lib/styles";

interface NoticesTypeTabsProps {
  types: string[];
  active: string;
  onSelect: (type: string) => void;
}

export function NoticesTypeTabs({ types, active, onSelect }: NoticesTypeTabsProps) {
  return (
    <section className={sectionTightClass}>
      <div className={shellClass}>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className="cursor-pointer"
              onClick={() => onSelect(type)}
            >
              <Chip tone={type === active ? "jade" : "default"}>{type}</Chip>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
