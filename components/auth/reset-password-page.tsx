"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordInput } from "@/components/auth/password-input";
import { BrandLogo } from "@/components/site/brand-logo";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Rise } from "@/components/site/motion";
import {
  PASSWORD_LABELS,
  PASSWORD_TONES,
  passwordScore,
  toastTone,
} from "@/lib/form";
import {
  buttonClass,
  displayClass,
  fieldClass,
  fieldErrorClass,
  fieldLabelClass,
  leadClass,
  meterFillClass,
  meterTrackClass,
  sectionClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

const resetSchema = z
  .object({
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords must match",
    path: ["confirm"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const password = watch("password") ?? "";
  const score = passwordScore(password);
  const meterTone = password.length ? PASSWORD_TONES[score] : "";
  const meterLabel = password.length ? PASSWORD_LABELS[score] : "";

  function onValid() {
    toast.success("Your password has been updated.", {
      style: toastTone.jade,
    });
    window.setTimeout(() => {
      router.push("/login");
    }, 1000);
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
              <Chip tone="jade">Choose a new password</Chip>
            </Rise>
            <Rise delay={2}>
              <h1 className={cn(displayClass.d1, "mt-5")}>Set a new password</h1>
            </Rise>
            <Rise delay={3}>
              <p className={cn(leadClass, "mt-5")}>
                Pick something you haven&apos;t used here before. After you save it, you&apos;ll sign
                in with the new password on every portal device.
              </p>
            </Rise>
          </div>

          <Rise delay={3}>
            <GlassCard strong className="p-5 sm:p-7 md:p-9">
              <BrandLogo variant="mark" className="mb-5" imgClassName="size-11" />
              <h2 className={cn(displayClass.d3, "mb-1")}>New password</h2>
              <p className="text-sm text-ink-muted mb-7">
                {email ? (
                  <>
                    Resetting the account for{" "}
                    <span className="font-semibold text-ink">{email}</span>.
                  </>
                ) : (
                  "Use the link from your email, or continue here for this demo."
                )}
                {token ? (
                  <span className="block mt-1 text-xs text-ink-faint">Token received.</span>
                ) : null}
              </p>

              <form noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>New password</span>
                  <PasswordInput
                    invalid={Boolean(errors.password)}
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
                  <span className="text-xs text-ink-faint w-20 sm:w-24 text-right truncate">{meterLabel}</span>
                </div>

                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Confirm new password</span>
                  <PasswordInput
                    invalid={Boolean(errors.confirm)}
                    placeholder="Type it again"
                    autoComplete="new-password"
                    {...register("confirm")}
                  />
                  <span className={cn(fieldErrorClass, errors.confirm && "block")}>
                    The two passwords don&apos;t match.
                  </span>
                </label>

                <button type="submit" className={cn(buttonClass({ variant: "primary" }), "w-full mt-2")}>
                  Save new password
                </button>
              </form>

              <p className="text-sm text-ink-muted mt-6 text-center">
                <Link href="/forgot-password" className="text-jade font-semibold">
                  Request another link
                </Link>
                {" · "}
                <Link href="/login" className="text-jade font-semibold">
                  Sign in
                </Link>
              </p>
            </GlassCard>
          </Rise>
        </div>
      </section>
    </main>
  );
}
