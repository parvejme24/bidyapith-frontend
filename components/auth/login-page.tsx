"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { GoogleIcon } from "@/components/auth/google-icon";
import { PasswordInput } from "@/components/auth/password-input";
import { BrandLogo } from "@/components/site/brand-logo";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import { toastTone } from "@/lib/form";
import {
  buttonClass,
  controlClass,
  displayClass,
  fieldClass,
  fieldErrorClass,
  fieldInvalidControlClass,
  fieldLabelClass,
  leadClass,
  ruleClass,
  sectionClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    title: "Student",
    blurb: "Registration, attendance, results, fees",
  },
  {
    title: "Instructor",
    blurb: "Sections, attendance, marks entry",
  },
  {
    title: "Administrator",
    blurb: "Semesters, users, audit logs",
  },
] as const;

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
  remember: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onValid() {
    toast.success("Signing you in to the student portal…", {
      style: toastTone.jade,
    });
    window.setTimeout(() => {
      toast("Demo build — connect this form to POST /api/v1/auth/login.", {
        style: toastTone.gold,
      });
    }, 1400);
  }

  function onInvalid() {
    toast.error("Check the highlighted fields and try again.", {
      style: toastTone.rose,
    });
  }

  return (
    <main id="main">
      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16 items-center")}>
          <div className="max-w-xl">
            <Rise delay={1}>
              <Chip tone="jade">Student and staff portal</Chip>
            </Rise>
            <Rise delay={2}>
              <h1 className={cn(displayClass.d1, "mt-5")}>Welcome back</h1>
            </Rise>
            <Rise delay={3}>
              <p className={cn(leadClass, "mt-5")}>
                One account across the whole university. What you see after signing in depends on
                your role — students register for courses, instructors post grades, administrators
                manage everything else.
              </p>
            </Rise>

            <Rise delay={4}>
              <ul className="grid sm:grid-cols-3 gap-3 mt-9">
                {ROLES.map((role) => (
                  <li key={role.title}>
                    <GlassCard quiet className="p-4">
                      <p className="font-display text-lg">{role.title}</p>
                      <p className="text-xs text-ink-faint mt-1.5">{role.blurb}</p>
                    </GlassCard>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>

          <Rise delay={3}>
            <GlassCard strong className="p-7 md:p-9">
              <BrandLogo variant="mark" className="mb-5" imgClassName="size-11" />
              <h2 className={cn(displayClass.d3, "mb-1")}>Sign in</h2>
              <p className="text-sm text-ink-muted mb-7">Use your university email address.</p>

              <button
                type="button"
                className={cn(buttonClass({ variant: "ghost" }), "w-full mb-5")}
                onClick={() =>
                  toast("Google sign-in is wired to the OAuth route in the API.", {
                    style: toastTone.gold,
                  })
                }
              >
                <GoogleIcon /> Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-5">
                <hr className={cn(ruleClass, "flex-1")} />
                <span className="text-xs text-ink-faint">or</span>
                <hr className={cn(ruleClass, "flex-1")} />
              </div>

              <form noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Email address</span>
                  <input
                    className={cn(controlClass, errors.email && fieldInvalidControlClass)}
                    type="email"
                    placeholder="you@bidyapith.edu.bd"
                    autoComplete="email"
                    {...register("email")}
                  />
                  <span className={cn(fieldErrorClass, errors.email && "block")}>
                    Enter the email you registered with.
                  </span>
                </label>

                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Password</span>
                  <PasswordInput
                    invalid={Boolean(errors.password)}
                    placeholder="At least 8 characters"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  <span className={cn(fieldErrorClass, errors.password && "block")}>
                    Passwords are at least 8 characters.
                  </span>
                </label>

                <div className="flex items-center justify-between gap-4 mb-6 text-sm">
                  <label className="flex items-center gap-2 text-ink-muted">
                    <input
                      type="checkbox"
                      className="accent-jade w-4 h-4"
                      {...register("remember")}
                    />{" "}
                    Keep me signed in
                  </label>
                  <Link href="/forgot-password" className="text-jade font-semibold">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className={cn(buttonClass({ variant: "primary" }), "w-full")}>
                  Sign in
                </button>
              </form>

              <p className="text-sm text-ink-muted mt-6 text-center">
                New applicant?{" "}
                <Link href="/register" className="text-jade font-semibold">
                  Create an account
                </Link>
              </p>
            </GlassCard>
          </Rise>
        </div>
      </section>
    </main>
  );
}
