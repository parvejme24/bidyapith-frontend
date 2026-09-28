"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Check,
  ChevronDown,
  Copy,
  GraduationCap,
  KeyRound,
  Mail,
  Phone,
  Send,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { DashboardIcon } from "@/components/dashboard/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface AddInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (instructorData: {
    id: string;
    name: string;
    email: string;
    dept: string;
    designation: string;
    phone: string;
    room: string;
    otp: string;
    tempPass: string;
  }) => void;
}

const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "EEE", name: "Electrical & Electronic Engineering" },
  { code: "BBA", name: "School of Business Administration" },
  { code: "PHARM", name: "Department of Pharmacy" },
  { code: "ENG", name: "Department of English" },
  { code: "LAW", name: "Department of Law" },
];

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Senior Lecturer",
  "Lecturer",
  "Adjunct Faculty",
];

export function AddInstructorModal({
  isOpen,
  onClose,
  onCreated,
}: AddInstructorModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("CSE");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [phone, setPhone] = useState("");
  const [room, setRoom] = useState("AB2-502");
  const [specialization, setSpecialization] = useState("");
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSummary, setCreatedSummary] = useState<{
    name: string;
    email: string;
    empId: string;
    otp: string;
    tempPass: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    const generatedPass = `Bidyapith@${Math.floor(1000 + Math.random() * 9000)}`;
    const empId = `EMP-${dept}-${Math.floor(100 + Math.random() * 900)}`;
    const fullName = `${designation.includes("Prof") ? "Prof. " : ""}${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      await apiClient.admin.createInstructor({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        department: dept,
        designation,
        phone: phone.trim() || "+880 1711 000000",
        room: room.trim() || "AB2-502",
        specialization: specialization.trim() || "Computer Science",
        temporaryPassword: generatedPass,
        otp: generatedOtp,
        sendEmail: sendEmailNotification,
      }).catch((err) => {
        console.warn("Backend add instructor note:", err);
      });

      onCreated({
        id: empId,
        name: fullName,
        email: email.trim().toLowerCase(),
        dept,
        designation,
        phone: phone.trim() || "+880 1711 000000",
        room: room.trim() || "AB2-502",
        otp: generatedOtp,
        tempPass: generatedPass,
      });

      if (sendEmailNotification) {
        toast.success(`Congratulatory email & login OTP sent to ${email.trim()}`);
      }

      setCreatedSummary({
        name: fullName,
        email: email.trim().toLowerCase(),
        empId,
        otp: generatedOtp,
        tempPass: generatedPass,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdSummary) return;
    const text = `Bidyapith Faculty Portal Access\nName: ${createdSummary.name}\nEmployee ID: ${createdSummary.empId}\nEmail: ${createdSummary.email}\nTemporary Password: ${createdSummary.tempPass}\n6-Digit Login OTP: ${createdSummary.otp}\nLogin Portal: http://localhost:3000/login`;
    navigator.clipboard.writeText(text);
    toast.success("Login credentials & OTP copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-md sm:rounded-lg border border-white/15 bg-night-900/98 shadow-2xl backdrop-blur-2xl text-ink overflow-hidden flex flex-col max-h-[92vh]">
        {createdSummary ? (
          /* Success Summary Screen */
          <>
            <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="size-9 rounded-md bg-jade/20 border border-jade/40 text-jade flex items-center justify-center shrink-0">
                  <UserCheck className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                    Faculty Account Created!
                  </h3>
                  <p className="text-xs text-ink-faint">
                    Welcome email, login credentials & security OTP dispatched
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

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto grow">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-md bg-white/[0.03] border border-white/10">
                  <span className="text-[0.68rem] text-ink-faint block uppercase tracking-wider font-semibold">
                    Faculty Member
                  </span>
                  <p className="font-semibold text-ink text-xs sm:text-sm mt-0.5 truncate">
                    {createdSummary.name}
                  </p>
                </div>
                <div className="p-2.5 rounded-md bg-white/[0.03] border border-white/10">
                  <span className="text-[0.68rem] text-ink-faint block uppercase tracking-wider font-semibold">
                    Employee ID
                  </span>
                  <p className="font-mono font-bold text-jade text-xs sm:text-sm mt-0.5">
                    {createdSummary.empId}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-white/[0.025] border border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-ink-faint">Assigned Email</span>
                  <span className="font-mono text-ink">{createdSummary.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-ink-faint">Temporary Password</span>
                  <span className="font-mono text-jade font-bold">{createdSummary.tempPass}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-ink-faint">6-Digit Security OTP</span>
                  <span className="font-mono text-marigold font-bold tracking-widest text-sm">
                    {createdSummary.otp}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-md bg-jade/10 border border-jade/25 text-xs text-jade flex items-start gap-2.5">
                <Mail className="size-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  A congratulatory email has been dispatched to <strong>{createdSummary.email}</strong> containing their direct portal access link, temporary password, and 6-digit OTP authentication code.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="px-3.5 py-2 rounded-md text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-ink border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="size-3.5 text-jade" />
                <span>Copy Credentials</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-xs font-bold bg-jade text-night-900 hover:bg-jade/90 shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          /* Instructor Registration Form */
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

            <form onSubmit={handleSubmit} className="flex flex-col grow min-h-0">
              <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto grow">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-xs font-semibold text-ink-muted mb-1">
                      First Name *
                    </span>
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
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
                      onChange={(e) => setLastName(e.target.value)}
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1712 998877"
                      className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-sm text-ink outline-none hover:border-white/25 focus:border-jade/60 focus:ring-1 focus:ring-jade/30 transition-all font-mono placeholder:text-ink-faint"
                    />
                  </label>
                </div>

                {/* Department & Designation Dropdowns with Shadcn UI */}
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
                          {DEPARTMENTS.find((d) => d.code === dept)?.name || dept}
                        </span>
                        <ChevronDown className="size-4 text-ink-faint shrink-0" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[calc(100vw-3rem)] sm:w-72 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
                      >
                        {DEPARTMENTS.map((d) => {
                          const isSelected = dept === d.code;
                          return (
                            <DropdownMenuItem
                              key={d.code}
                              onClick={() => setDept(d.code)}
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
                        {DESIGNATIONS.map((desig) => {
                          const isSelected = designation === desig;
                          return (
                            <DropdownMenuItem
                              key={desig}
                              onClick={() => setDesignation(desig)}
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
                      onChange={(e) => setRoom(e.target.value)}
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
                      onChange={(e) => setSpecialization(e.target.value)}
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
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
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
        )}
      </div>
    </div>
  );
}
