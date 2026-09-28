"use client";

import React, { useState } from "react";
import { BookOpen, Check, ChevronDown, Layers, Trash2 } from "lucide-react";
import { DashboardIcon } from "@/components/dashboard/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DB } from "@/lib/data";
import type { AdminSection } from "@/lib/app-types";
import { cn } from "@/lib/utils";

interface SectionModalProps {
  section: AdminSection | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sec: AdminSection) => void;
  onRetire?: (code: string, sec: string) => void;
}

export function SectionModal({
  section,
  isOpen,
  onClose,
  onSave,
  onRetire,
}: SectionModalProps) {
  const [code, setCode] = useState(section?.code || "");
  const [title, setTitle] = useState(section?.title || "");
  const [sec, setSec] = useState(section?.section || "A");
  const [instructor, setInstructor] = useState(section?.instructor || (DB.faculty[0]?.name || ""));
  const [room, setRoom] = useState(section?.room || "AB2-401");
  const [capacity, setCapacity] = useState(section?.capacity || 45);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSave({
      code: code.trim().toUpperCase(),
      title: title.trim() || "Untitled Course",
      section: sec.trim().toUpperCase() || "A",
      instructor,
      room: room.trim() || "TBA",
      enrolled: section ? section.enrolled : 0,
      capacity: Number(capacity) || 40,
      status: section ? section.status : "open",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-md sm:rounded-lg border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="size-9 rounded-md bg-jade/15 border border-jade/30 text-jade flex items-center justify-center shrink-0">
              <Layers className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                {section ? `Edit ${section.code} Sec ${section.section}` : "Create Course Section"}
              </h3>
              <p className="text-xs text-ink-faint mt-0.5">
                Configure course allocation, instructor assignment, and capacity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <DashboardIcon name="close" className="size-3.5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col grow min-h-0">
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto grow">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">
                  Course Code *
                </span>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CSE-3105"
                  className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">
                  Section *
                </span>
                <input
                  required
                  value={sec}
                  onChange={(e) => setSec(e.target.value)}
                  placeholder="e.g. A"
                  className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Course Title *
              </span>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Database Management Systems"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-sans placeholder:text-ink-faint"
              />
            </label>

            {/* Assigned Faculty Selector */}
            <div>
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Assigned Faculty Member
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="w-full flex items-center justify-between gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:bg-white/[0.07] hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold text-ink truncate">
                    {instructor || "Select faculty member"}
                  </span>
                  <ChevronDown className="size-4 text-ink-faint shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[calc(100vw-3rem)] sm:w-[440px] max-h-60 overflow-y-auto rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {DB.faculty.map((f) => {
                    const isSelected = instructor === f.name;
                    return (
                      <DropdownMenuItem
                        key={f.name}
                        onClick={() => setInstructor(f.name)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer font-medium transition-colors",
                          isSelected
                            ? "bg-jade/15 text-jade font-semibold"
                            : "text-ink-muted hover:bg-white/[0.08] hover:text-ink"
                        )}
                      >
                        <div>
                          <p className="font-semibold text-ink">{f.name}</p>
                          <p className="text-[0.68rem] text-ink-faint">{f.role}</p>
                        </div>
                        {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">
                  Room / Lab
                </span>
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="AB2-401"
                  className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-semibold text-ink-muted mb-1">
                  Seat Capacity
                </span>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
                />
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
            {section && onRetire ? (
              <button
                type="button"
                onClick={() => {
                  onRetire(section.code, section.section);
                  onClose();
                }}
                className="text-xs text-rose hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Retire section</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-md text-xs font-semibold text-ink-muted hover:text-ink hover:bg-white/[0.06] border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                {section ? "Save Changes" : "Create Section"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
