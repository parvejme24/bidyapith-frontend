import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/components/auth/forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot password — Bidyapith University",
  description:
    "Request a password reset link for your Bidyapith University student or staff account.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}
