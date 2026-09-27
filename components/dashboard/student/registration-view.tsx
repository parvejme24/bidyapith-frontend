"use client";

import React, { useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { Meter } from "@/components/dashboard/meter";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { formatShortDate } from "@/lib/app-data";
import { DB } from "@/lib/data";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function RegistrationView() {
  const { student, term, cart, addToCart, confirmRegistration } = useApp();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const enrolledCodes = new Set(student.enrolled.map((c) => c.code));
  const passedCodes = new Set(student.passed);

  const totalCartCredits = cart.reduce((sum, c) => sum + (c.credits || 3), 0);
  const isOverLimit = totalCartCredits > 15;

  const handleOpenConfirm = () => {
    if (cart.length === 0 || isOverLimit) return;
    setConfirmModalOpen(true);
  };

  const handleFinalConfirm = () => {
    confirmRegistration();
    setConfirmModalOpen(false);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
        {/* Left: Available Courses List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Offered Sections ({DB.courses.length} courses)
            </span>
            <span className="text-xs text-jade font-mono">
              Fall 2026 Registration Open
            </span>
          </div>

          <div className="grid gap-3">
            {DB.courses.map((c) => {
              const isEnrolled = enrolledCodes.has(c.code);
              const isFull = c.taken >= c.seats;
              const hasPrereq = !c.prereq || passedCodes.has(c.prereq);
              const isPicked = cart.some((x) => x.code === c.code);
              const isLocked = isEnrolled || (isFull && !isPicked) || !hasPrereq;

              const percentFilled = Math.round((c.taken / c.seats) * 100);

              return (
                <GlassCard
                  key={c.code}
                  className={cn(
                    "p-4 md:p-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    isLocked && "opacity-60",
                    isPicked && "border-jade/60 bg-jade/[0.08]"
                  )}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-jade">
                        {c.code}
                      </span>
                      {isEnrolled && (
                        <StatusPill tone="info">Already enrolled</StatusPill>
                      )}
                      {isFull && !isEnrolled && (
                        <StatusPill tone="bad">Section full</StatusPill>
                      )}
                      {!hasPrereq && (
                        <StatusPill tone="warn">Needs {c.prereq}</StatusPill>
                      )}
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-semibold text-ink leading-tight">
                      {c.title}
                    </h3>

                    <p className="text-xs text-ink-faint">
                      {c.instructor} · {c.credits} credits · {c.taken}/{c.seats} seats
                    </p>

                    <div className="pt-1.5 max-w-[200px]">
                      <Meter value={c.taken} max={c.seats} className="h-1.5" />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLocked && !isPicked}
                    onClick={() =>
                      addToCart({
                        code: c.code,
                        title: c.title,
                        section: "A",
                        credits: c.credits,
                        instructor: c.instructor,
                        room: "AB2-401",
                        slots: ["Sun 09:00", "Tue 09:00"],
                        attendance: 100,
                        marks: 0,
                      })
                    }
                    className={cn(
                      buttonClass({
                        variant: isPicked ? "ghost" : "primary",
                        size: "sm",
                      }),
                      "shrink-0 text-xs",
                      isPicked && "border-jade text-jade hover:bg-jade/10"
                    )}
                  >
                    {isPicked ? "Remove" : "Add Course"}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Right: Registration Cart & Credit Counter */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <GlassCard className="p-6 border-white/20 bg-white/[0.08]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="font-display text-lg font-semibold text-ink">
                Your Selection
              </h3>
              <span className="text-xs font-mono text-ink-faint">
                Max 15 cr / term
              </span>
            </div>

            {cart.length > 0 ? (
              <div className="divide-y divide-white/8">
                {cart.map((c) => (
                  <div key={c.code} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-jade font-bold block">{c.code}</span>
                      <span className="text-ink-muted truncate max-w-[170px] block">
                        {c.title}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-ink">{c.credits} cr</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-ink-faint text-xs">
                <p className="font-semibold text-ink mb-0.5">Nothing selected</p>
                <p>Pick a course from the offered list to register.</p>
              </div>
            )}

            {/* Total Credits & Meter */}
            <div className="pt-4 mt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted font-semibold">Total Credits</span>
                <span
                  className={cn(
                    "font-display text-2xl font-bold font-mono",
                    isOverLimit ? "text-rose" : "text-ink"
                  )}
                >
                  {totalCartCredits}
                  <span className="text-xs font-normal text-ink-faint"> / 15</span>
                </span>
              </div>

              <Meter
                value={totalCartCredits}
                max={15}
                className="h-2"
                tone={isOverLimit ? "hot" : totalCartCredits > 12 ? "warn" : "jade"}
              />

              {isOverLimit && (
                <p className="text-[0.7rem] text-rose font-medium">
                  ⚠️ Limit exceeded! Maximum 15 credits allowed per semester.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={cart.length === 0 || isOverLimit}
              onClick={handleOpenConfirm}
              className={cn(buttonClass({ variant: "primary" }), "w-full mt-5 text-sm")}
            >
              Submit Registration
            </button>

            <p className="text-[0.68rem] text-ink-faint leading-relaxed mt-3">
              Atomic transaction: Seats are reserved and the registration invoice is generated synchronously.
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <GlassCard className="w-full max-w-lg p-6 md:p-8 shadow-2xl border-white/20">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">
                  Confirm Course Registration
                </h3>
                <p className="text-xs text-ink-faint mt-0.5">
                  {cart.length} courses, {totalCartCredits} credits for {term.name}
                </p>
              </div>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="size-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-faint hover:text-ink"
                aria-label="Close modal"
              >
                <DashboardIcon name="close" className="size-4" />
              </button>
            </div>

            <div className="my-5 divide-y divide-white/8 max-h-56 overflow-y-auto">
              {cart.map((c) => (
                <div key={c.code} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-jade font-bold">{c.code}</span>
                    <span className="text-ink-muted ml-2">{c.title}</span>
                  </div>
                  <span className="font-mono text-ink font-semibold">{c.credits} cr</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-ink-muted space-y-1 mb-6">
              <p className="font-semibold text-ink">Registration Fee Notice</p>
              <p>A course registration fee of ৳3,000 will be added to your invoice ledger.</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className={cn(buttonClass({ variant: "ghost", size: "sm" }))}
              >
                Go back
              </button>
              <button
                onClick={handleFinalConfirm}
                className={cn(buttonClass({ variant: "primary", size: "sm" }))}
              >
                Confirm and Register
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
