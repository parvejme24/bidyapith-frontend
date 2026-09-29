"use client";

import React from "react";
import { Check, ChevronDown, Mail, Send, UserPlus } from "lucide-react";
import { DashboardIcon } from "@/components/dashboard/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { INSTRUCTOR_DEPARTMENTS, INSTRUCTOR_DESIGNATIONS } from "./instructor-constants";

interface InstructorRegistrationFormProps {
  firstName: string;
  onFirstNameChange: (v: string) => void;
  lastName: string;
  onLastNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  dept: string;
  onDeptChange: (v: string) => void;
  designation: string;
  onDesignationChange: (v: string) => void;
  room: string;
  onRoomChange: (v: string) => void;
  specialization: string;
  onSpecializationChange: (v: string) => void;
  sendEmailNotification: boolean;
  onSendEmailNotificationChange: (v: boolean) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function InstructorRegistrationForm({
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  dept,
  onDeptChange,
  designation,
  onDesignationChange,
  room,
  onRoomChange,
  specialization,
  onSpecializationChange,
  sendEmailNotification,
  onSendEmailNotificationChange,
  isSubmitting,
  onSubmit,
  onClose,
}: InstructorRegistrationFormProps) {
  return (
    <>
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="size-9 rounded-md bg-jade/15 border border-jade/30 text-jade flex items-center justify-center shrink-0">
            <UserPlus className="size-4" />
          </span>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
              Add New Faculty Instructor
            </h3>
            <p className="text-xs text-ink-faint mt-0.5">
              Onboard new faculty member and send login credentials with OTP
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

      <form onSubmit={onSubmit} className="flex flex-col grow min-h-0">
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto grow">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                First Name *
              </span>
              <input
                required
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
                placeholder="e.g. Farhana"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-sans placeholder:text-ink-faint"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Last Name *
              </span>
              <input
                required
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
                placeholder="e.g. Islam"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-sans placeholder:text-ink-faint"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Institutional Email *
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="farhana.islam@bidyapith.edu"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Contact Phone
              </span>
              <input
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="+880 1712 998877"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
              />
            </label>
          </div>

          {/* Department & Designation Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Academic Department
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="w-full flex items-center justify-between gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:bg-white/[0.07] hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold text-ink truncate">
                    {INSTRUCTOR_DEPARTMENTS.find((d) => d.code === dept)?.name || dept}
                  </span>
                  <ChevronDown className="size-4 text-ink-faint shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[calc(100vw-3rem)] sm:w-72 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {INSTRUCTOR_DEPARTMENTS.map((d) => {
                    const isSelected = dept === d.code;
                    return (
                      <DropdownMenuItem
                        key={d.code}
                        onClick={() => onDeptChange(d.code)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer font-medium transition-colors",
                          isSelected
                            ? "bg-jade/15 text-jade font-semibold"
                            : "text-ink-muted hover:bg-white/[0.08] hover:text-ink"
                        )}
                      >
                        <span>{d.name} ({d.code})</span>
                        {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Academic Designation
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="w-full flex items-center justify-between gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:bg-white/[0.07] hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-colors cursor-pointer text-left"
                >
                  <span className="font-semibold text-ink truncate">{designation}</span>
                  <ChevronDown className="size-4 text-ink-faint shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  {INSTRUCTOR_DESIGNATIONS.map((desig) => {
                    const isSelected = designation === desig;
                    return (
                      <DropdownMenuItem
                        key={desig}
                        onClick={() => onDesignationChange(desig)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md text-xs cursor-pointer font-medium transition-colors",
                          isSelected
                            ? "bg-jade/15 text-jade font-semibold"
                            : "text-ink-muted hover:bg-white/[0.08] hover:text-ink"
                        )}
                      >
                        <span>{desig}</span>
                        {isSelected && <Check className="size-3.5 text-jade shrink-0" />}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Office / Faculty Room
              </span>
              <input
                value={room}
                onChange={(e) => onRoomChange(e.target.value)}
                placeholder="AB2-502"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
              />
            </label>

            <label className="block">
              <span className="block text-xs font-semibold text-ink-muted mb-1">
                Specialization / Research
              </span>
              <input
                value={specialization}
                onChange={(e) => onSpecializationChange(e.target.value)}
                placeholder="AI & Machine Learning"
                className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-sans placeholder:text-ink-faint"
              />
            </label>
          </div>

          {/* Congratulatory Email & OTP Toggle */}
          <div className="p-3 rounded-md bg-white/[0.025] border border-white/10 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="sendEmailNotification"
              checked={sendEmailNotification}
              onChange={(e) => onSendEmailNotificationChange(e.target.checked)}
              className="mt-0.5 rounded accent-jade cursor-pointer"
            />
            <label htmlFor="sendEmailNotification" className="text-xs cursor-pointer">
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <Mail className="size-3.5 text-jade" />
                <span>Send Congratulatory Email, Login Credentials & OTP</span>
              </span>
              <span className="text-[0.68rem] text-ink-faint block mt-0.5 leading-relaxed">
                Automatically dispatches onboarding congratulations email with temporary password and 6-digit security OTP to the instructor's email address.
              </span>
            </label>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-md text-xs font-semibold text-ink-muted hover:text-ink hover:bg-white/[0.06] border border-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="size-3.5" />
            <span>{isSubmitting ? "Creating & Sending..." : "Create & Send Credentials"}</span>
          </button>
        </div>
      </form>
    </>
  );
}
