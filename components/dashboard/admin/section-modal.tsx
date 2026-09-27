"use client";

import React, { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { DB } from "@/lib/data";
import type { AdminSection } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
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
      code: code.trim(),
      title: title.trim() || "Untitled Course",
      section: sec.trim() || "A",
      instructor,
      room: room.trim() || "TBA",
      enrolled: section ? section.enrolled : 0,
      capacity: Number(capacity) || 40,
      status: section ? section.status : "open",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <GlassCard className="w-full max-w-lg p-6 md:p-8 shadow-2xl border-white/20">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">
              {section ? `Edit ${section.code} Sec ${section.section}` : "Create New Course Section"}
            </h3>
            <p className="text-xs text-ink-faint mt-0.5">
              Configure course allocation, room, and section capacity
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink"
            aria-label="Close modal"
          >
            <DashboardIcon name="close" className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-6">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                Course Code
              </span>
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CSE-3105"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                Section
              </span>
              <input
                required
                value={sec}
                onChange={(e) => setSec(e.target.value)}
                placeholder="A"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade font-mono"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Course Title
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Database Systems"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade"
            />
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Assigned Instructor
            </span>
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade cursor-pointer"
            >
              {DB.faculty.map((f) => (
                <option key={f.name} value={f.name} className="bg-night-800">
                  {f.name} ({f.role})
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                Room / Lab
              </span>
              <input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="AB2-401"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade font-mono"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1.5">
                Seat Capacity
              </span>
              <input
                type="number"
                min="10"
                max="100"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm text-ink outline-none focus:border-jade font-mono"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/8">
            {section && onRetire ? (
              <button
                type="button"
                onClick={() => {
                  onRetire(section.code, section.section);
                  onClose();
                }}
                className="text-xs text-rose hover:underline"
              >
                Retire section
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
              >
                {section ? "Save Changes" : "Create Section"}
              </button>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
