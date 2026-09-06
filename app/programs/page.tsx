import type { Metadata } from "next";
import { Suspense } from "react";
import { ProgramsPage } from "@/components/programs/programs-page";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Programmes — Bidyapith University",
  description:
    "Thirty-four undergraduate and graduate programmes across Engineering, Business, Science, Arts, Law and Health Sciences at Bidyapith University.",
};

export default function Page() {
  return (
    <Suspense fallback={<main id="main" className={cn(shellClass, sectionClass, "min-h-[40vh]")} />}>
      <ProgramsPage />
    </Suspense>
  );
}
