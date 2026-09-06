"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import { usePrograms } from "@/hooks/use-data";
import {
  BD_PHONE,
  normalizePhone,
  PASSWORD_LABELS,
  PASSWORD_TONES,
  passwordScore,
  toastTone,
} from "@/lib/form";
import {
  avatarClass,
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldErrorClass,
  fieldInvalidControlClass,
  fieldLabelClass,
  leadClass,
  meterFillClass,
  meterTrackClass,
  ruleClass,
  sectionClass,
  selectClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: 1,
    title: "Verify your email",
    blurb: "A code arrives within a minute.",
    tone: 1 as const,
  },
  {
    n: 2,
    title: "Fill in your academic history",
    blurb: "SSC and HSC results, with scanned transcripts.",
    tone: 2 as const,
  },
  {
    n: 3,
    title: "Pay ৳1,000 and submit",
    blurb: "bKash or card. Your slot is held once payment clears.",
    tone: 3 as const,
  },
] as const;

const registerSchema = z
  .object({
    name: z.string().trim().min(3),
    email: z.string().trim().email(),
    phone: z
      .string()
      .trim()
      .refine((value) => BD_PHONE.test(normalizePhone(value))),
    year: z.string().trim().min(1),
    program: z.string().trim().min(1),
    password: z.string().min(8),
    confirm: z.string().min(1),
    terms: z.boolean().refine((value) => value === true),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { data: programs = [] } = usePrograms();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      year: "",
      program: "",
      password: "",
      confirm: "",
      terms: false,
    },
  });

  const password = watch("password") ?? "";
  const score = passwordScore(password);
  const meterTone = password.length ? PASSWORD_TONES[score] : "";
  const meterLabel = password.length ? PASSWORD_LABELS[score] : "";

  function onValid(values: RegisterValues) {
    toast.success(`Account created for ${values.email}. Check your inbox to verify.`, {
      style: toastTone.jade,
    });
    reset({
      name: "",
      email: "",
      phone: "",
      year: "",
      program: "",
      password: "",
      confirm: "",
      terms: false,
    });
  }

  function onInvalid() {
    toast.error("Check the highlighted fields and try again.", {
      style: toastTone.rose,
    });
  }

  return (
    <main id="main">
      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 items-start")}>
          <div className="lg:sticky lg:top-28">
            <Rise delay={1}>
              <Chip tone="jade" live>
                Fall 2026 intake
              </Chip>
            </Rise>
            <Rise delay={2}>
              <h1 className={cn(displayClass.d1, "mt-5")}>Create your account</h1>
            </Rise>
            <Rise delay={3}>
              <p className={cn(leadClass, "mt-5")}>
                This is the account you will use for the whole admission cycle, and for the student
                portal afterwards if you join us.
              </p>
            </Rise>

            <Rise delay={4}>
              <ol className="mt-9 space-y-4">
                {STEPS.map((step) => (
                  <li key={step.n}>
                    <GlassCard quiet className="p-4 flex gap-4">
                      <span className={cn(avatarClass({ tone: step.tone }), "size-9 text-sm shrink-0")}>
                        {step.n}
                      </span>
                      <span>
                        <span className="block font-semibold text-sm">{step.title}</span>
                        <span className="block text-xs text-ink-faint mt-1">{step.blurb}</span>
                      </span>
                    </GlassCard>
                  </li>
                ))}
              </ol>
            </Rise>
          </div>

          <Rise delay={3}>
            <GlassCard strong className="p-7 md:p-9">
              <button
                type="button"
                className={cn(buttonClass({ variant: "ghost" }), "w-full mb-5")}
                onClick={() =>
                  toast("Google sign-up is wired to the OAuth route in the API.", {
                    style: toastTone.gold,
                  })
                }
              >
                <GoogleIcon /> Sign up with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <hr className={cn(ruleClass, "flex-1")} />
                <span className="text-xs text-ink-faint">or use your email</span>
                <hr className={cn(ruleClass, "flex-1")} />
              </div>

              <form noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>Full name</span>
                    <input
                      className={cn(controlClass, errors.name && fieldInvalidControlClass)}
                      placeholder="As on your HSC certificate"
                      autoComplete="name"
                      {...register("name")}
                    />
                    <span className={cn(fieldErrorClass, errors.name && "block")}>
                      Enter your full name, at least three characters.
                    </span>
                  </label>

                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>Email address</span>
                    <input
                      className={cn(controlClass, errors.email && fieldInvalidControlClass)}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register("email")}
                    />
                    <span className={cn(fieldErrorClass, errors.email && "block")}>
                      That email doesn&apos;t look right — check for a typo.
                    </span>
                  </label>

                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>Mobile number</span>
                    <input
                      className={cn(controlClass, errors.phone && fieldInvalidControlClass)}
                      placeholder="01712345678"
                      autoComplete="tel"
                      {...register("phone")}
                    />
                    <span className={cn(fieldErrorClass, errors.phone && "block")}>
                      Use a Bangladeshi mobile number, like 01712345678.
                    </span>
                  </label>

                  <label className={fieldClass}>
                    <span className={fieldLabelClass}>HSC passing year</span>
                    <select
                      className={cn(selectClass, errors.year && fieldInvalidControlClass)}
                      {...register("year")}
                    >
                      <option value="">Select a year</option>
                      <option>2026</option>
                      <option>2025</option>
                      <option>2024</option>
                      <option>2023</option>
                      <option>Earlier</option>
                    </select>
                    <span className={cn(fieldErrorClass, errors.year && "block")}>
                      Choose the year you passed HSC or an equivalent.
                    </span>
                  </label>
                </div>

                <label className={fieldClass}>
                  <span className={fieldLabelClass}>First programme choice</span>
                  <select
                    className={cn(selectClass, errors.program && fieldInvalidControlClass)}
                    {...register("program")}
                  >
                    <option value="">Choose a programme</option>
                    {programs.map((program) => (
                      <option key={program.code} value={program.name}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                  <span className={cn(fieldErrorClass, errors.program && "block")}>
                    Pick a programme — you can add two more later.
                  </span>
                </label>

                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Password</span>
                  <input
                    className={cn(controlClass, errors.password && fieldInvalidControlClass)}
                    type="password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    {...register("password")}
                  />
                  <span className={cn(fieldErrorClass, errors.password && "block")}>
                    Use at least 8 characters.
                  </span>
                </label>

                <div className="flex items-center gap-3 -mt-1 mb-4">
                  <div className={cn(meterTrackClass, "flex-1")}>
                    <span
                      className={meterFillClass({
                        tone:
                          meterTone === "hot" ? "hot" : meterTone === "warn" ? "warn" : "default",
                      })}
                      style={{ width: `${(score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-faint w-24 text-right">{meterLabel}</span>
                </div>

                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Confirm password</span>
                  <input
                    className={cn(controlClass, errors.confirm && fieldInvalidControlClass)}
                    type="password"
                    placeholder="Type it again"
                    autoComplete="new-password"
                    {...register("confirm")}
                  />
                  <span className={cn(fieldErrorClass, errors.confirm && "block")}>
                    The two passwords don&apos;t match.
                  </span>
                </label>

                <label className={fieldClass}>
                  <span className={cn(fieldLabelClass, "sr-only")}>Terms</span>
                  <span className="flex items-start gap-3 text-sm text-ink-muted">
                    <input
                      type="checkbox"
                      className="accent-jade w-4 h-4 mt-1"
                      {...register("terms")}
                    />
                    I confirm the information I provide is accurate, and I accept the admission
                    rules.
                  </span>
                  <span className={cn(fieldErrorClass, errors.terms && "block")}>
                    You&apos;ll need to accept this before applying.
                  </span>
                </label>

                <button type="submit" className={cn(buttonClass({ variant: "primary" }), "w-full")}>
                  Create account
                </button>

                <p className="text-sm text-ink-muted mt-6 text-center">
                  Already applied?{" "}
                  <Link href="/login" className="text-jade font-semibold">
                    Sign in instead
                  </Link>
                </p>
              </form>
            </GlassCard>
          </Rise>
        </div>
      </section>
    </main>
  );
}
