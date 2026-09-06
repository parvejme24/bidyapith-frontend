import type { Metadata } from "next";
import { RegisterPage } from "@/components/auth/register-page";

export const metadata: Metadata = {
  title: "Create your applicant account — Bidyapith University",
  description:
    "Create a Bidyapith University applicant account to apply for Fall 2026 admission to up to three programmes.",
};

export default function Page() {
  return <RegisterPage />;
}
