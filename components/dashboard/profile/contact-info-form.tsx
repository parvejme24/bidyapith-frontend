"use client";

import React from "react";
import { GlassCard } from "@/components/site/glass-card";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { UserCheck } from "lucide-react";

interface ContactInfoFormProps {
  phone: string;
  setPhone: (val: string) => void;
  altEmail: string;
  setAltEmail: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  isDirty: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function ContactInfoForm({
  phone,
  setPhone,
  altEmail,
  setAltEmail,
  address,
  setAddress,
  isDirty,
  onSave,
}: ContactInfoFormProps) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-display text-lg font-semibold text-ink flex items-center gap-2.5">
          <UserCheck className="size-5 text-jade shrink-0" />
          <span>Edit Contact Details</span>
        </h3>
        {isDirty && (
          <span className="text-[0.68rem] font-mono px-2 py-0.5 rounded-md bg-marigold/15 text-marigold border border-marigold/30">
            Unsaved Changes
          </span>
        )}
      </div>
      <form onSubmit={onSave} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Mobile Number
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1712 000000"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-jade font-mono"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-ink-muted mb-1.5">
              Alternate Personal Email
            </span>
            <input
              type="email"
              value={altEmail}
              onChange={(e) => setAltEmail(e.target.value)}
              placeholder="personal@gmail.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-jade"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-xs font-semibold text-ink-muted mb-1.5">
            Present Residential Address
          </span>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="House, road, area, city"
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-jade resize-none"
          />
        </label>

        <button
          type="submit"
          disabled={!isDirty}
          className={cn(
            buttonClass({ variant: "primary", size: "sm" }),
            "transition-all duration-200 shadow-sm cursor-pointer",
            !isDirty && "opacity-40 cursor-not-allowed hover:bg-jade pointer-events-none"
          )}
        >
          Save Profile Changes
        </button>
      </form>
    </GlassCard>
  );
}
