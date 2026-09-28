"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerFieldProps {
  label?: string;
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerField({
  label,
  value,
  onChange,
  className,
  placeholder = "DD/MM/YYYY",
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;
  const displayDate = value
    ? (() => {
        const parts = value.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return value;
      })()
    : placeholder;

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-xs font-semibold text-ink-muted">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          disabled={disabled}
          className="w-full flex items-center justify-between rounded-md border border-white/15 bg-white/[0.04] hover:bg-white/[0.07] px-3.5 py-2 text-xs text-ink outline-none focus:border-jade font-mono transition-all cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon className="size-3.5 text-jade shrink-0" />
            <span className="font-mono font-medium text-ink">{displayDate}</span>
          </span>
          <ChevronDown className="size-3 text-ink-faint shrink-0 ml-1" />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border border-white/15 bg-night-900/98 backdrop-blur-xl shadow-2xl rounded-lg"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                onChange(`${year}-${month}-${day}`);
              }
              setOpen(false);
            }}
            defaultMonth={selectedDate || new Date(2026, 8, 1)}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
