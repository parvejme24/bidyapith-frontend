import type { Metadata } from "next";
import { AdmissionsPage } from "@/components/admissions/admissions-page";

export const metadata: Metadata = {
  title: "Admissions — Bidyapith University",
  description:
    "How to apply to Bidyapith University: eligibility, five-step process, key dates, fee structure, scholarships and payment through bKash or card.",
};

export default function Page() {
  return <AdmissionsPage />;
}
