import type { Metadata } from "next";
import { Suspense } from "react";
import { FacultyPage } from "@/components/faculty/faculty-page";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Faculty — Bidyapith University",
  description:
    "Meet the 312 faculty members of Bidyapith University: research areas, office hours and the courses they teach this year.",
};

export default function Page() {
  return (
    <Suspense fallback={<main id="main" className={cn(shellClass, sectionClass, "min-h-[40vh]")} />}>
      <FacultyPage />
    </Suspense>
  );
}
