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
    role: "student" as const,
    title: "Student",
    email: "rafiul.karim@student.bidyapith.edu.bd",
    blurb: "Registration, attendance, results, fees",
    href: "/student?role=student",
  },
  {
    role: "instructor" as const,
    title: "Instructor",
    email: "ayesha.rahman@bidyapith.edu.bd",
    blurb: "Sections, attendance, marks entry",
    href: "/instructor?role=instructor",
  },
  {
    role: "admin" as const,
    title: "Administrator",
    email: "registrar@bidyapith.edu.bd",
    blurb: "Semesters, users, audit logs",
    href: "/admin?role=admin",
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
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onValid(data: LoginValues) {
    toast.success("Signed in successfully! Opening dashboard…", {
      style: toastTone.jade,
    });
    const email = data.email.toLowerCase();
    let target = "/student?role=student";
    if (email.includes("registrar") || email.includes("admin")) {
      target = "/admin?role=admin";
    } else if (email.includes("ayesha") || email.includes("instructor") || email.includes("faculty")) {
      target = "/instructor?role=instructor";
    }
    window.location.href = target;
  }

  function onInvalid() {
    toast.error("Check the highlighted fields and try again.", {
      style: toastTone.rose,
    });
  }

  function fillDemo(email: string, targetHref: string) {
    setValue("email", email);
    setValue("password", "Password123!");
    toast.success("Demo credentials filled! Redirecting…", {
      style: toastTone.jade,
    });
    setTimeout(() => {
      window.location.href = targetHref;
    }, 600);
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
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint mt-8 mb-3">
                1-Tap Demo Sign-in
              </p>
              <ul className="grid sm:grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <li key={r.title}>
                    <button
                      type="button"
                      onClick={() => fillDemo(r.email, r.href)}
                      className="w-full text-left cursor-pointer group"
                    >
                      <GlassCard quiet className="p-4 transition-all group-hover:border-jade/50 group-hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                          <p className="font-display text-lg group-hover:text-jade transition-colors">
                            {r.title}
                          </p>
                          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-jade/10 text-jade">
                            Try →
                          </span>
                        </div>
                        <p className="text-xs text-ink-faint mt-1.5">{r.blurb}</p>
                      </GlassCard>
                    </button>
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
