import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordPage } from "@/components/auth/reset-password-page";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reset password — Bidyapith University",
  description: "Choose a new password for your Bidyapith University account.",
};

export default function Page() {
  return (
    <Suspense
      fallback={<main id="main" className={cn(shellClass, sectionClass, "min-h-[40vh]")} />}
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
