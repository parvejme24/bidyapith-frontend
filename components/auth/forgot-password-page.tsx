"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
  sectionClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const forgotSchema = z.object({
  email: z.string().trim().email(),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  function onValid(values: ForgotValues) {
    setSentTo(values.email);
    toast.success("Reset link sent if that email is on file.", {
      style: toastTone.jade,
    });
  }

  function onInvalid() {
    toast.error("Enter a valid university email address.", {
      style: toastTone.rose,
    });
  }

  return (
    <main id="main">
      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16 items-center")}>
          <div className="max-w-xl">
            <Rise delay={1}>
              <Chip tone="jade">Account recovery</Chip>
            </Rise>
            <Rise delay={2}>
              <h1 className={cn(displayClass.d1, "mt-5")}>Forgot your password?</h1>
            </Rise>
            <Rise delay={3}>
              <p className={cn(leadClass, "mt-5")}>
                Enter the email on your Bidyapith account. We&apos;ll send a link so you can choose a
                new password — the link expires after one hour.
              </p>
            </Rise>
          </div>

          <Rise delay={3}>
            <GlassCard strong className="p-5 sm:p-7 md:p-9">
              <BrandLogo variant="mark" className="mb-5" imgClassName="size-11" />
              <h2 className={cn(displayClass.d3, "mb-1")}>Reset password</h2>
              <p className="text-sm text-ink-muted mb-7">
                We&apos;ll email you a secure link to set a new password.
              </p>

              {sentTo ? (
                <div className="space-y-6">
                  <GlassCard quiet className="p-5">
                    <p className="text-sm text-ink-muted">
                      If an account exists for{" "}
                      <span className="font-semibold text-ink">{sentTo}</span>, a reset link is on
                      its way. Check your inbox and spam folder.
                    </p>
                  </GlassCard>
                  <Link
                    href={`/reset-password?email=${encodeURIComponent(sentTo)}`}
                    className={cn(buttonClass({ variant: "primary" }), "w-full")}
                  >
                    Continue to set a new password
                  </Link>
                  <button
                    type="button"
                    className={cn(buttonClass({ variant: "ghost" }), "w-full")}
                    onClick={() => {
                      setSentTo(null);
                      toast("You can request another link with a different email.", {
                        style: toastTone.gold,
                      });
                    }}
                  >
                    Use a different email
                  </button>
                  <p className="text-sm text-ink-muted text-center">
                    Remembered it?{" "}
                    <Link href="/login" className="text-jade font-semibold">
                      Back to sign in
                    </Link>
                  </p>
                </div>
              ) : (
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

                  <button type="submit" className={cn(buttonClass({ variant: "primary" }), "w-full mt-2")}>
                    Send reset link
                  </button>

                  <p className="text-sm text-ink-muted mt-6 text-center">
                    Remembered it?{" "}
                    <Link href="/login" className="text-jade font-semibold">
                      Back to sign in
                    </Link>
                  </p>
                </form>
              )}
            </GlassCard>
          </Rise>
        </div>
      </section>
    </main>
  );
}
