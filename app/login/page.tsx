import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/login-page";

export const metadata: Metadata = {
  title: "Sign in — Bidyapith University",
  description:
    "Sign in to the Bidyapith University portal as a student, instructor or administrator.",
};

export default function Page() {
  return <LoginPage />;
}
