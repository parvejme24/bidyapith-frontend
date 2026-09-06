import type { Metadata } from "next";
import { Suspense } from "react";
import { CoursesPage } from "@/components/courses/courses-page";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Course catalogue — Bidyapith University",
  description:
    "Search 486 courses at Bidyapith University by department, semester and credit load, with prerequisites, instructors and live seat counts.",
};

export default function Page() {
  return (
    <Suspense fallback={<main id="main" className={cn(shellClass, sectionClass, "min-h-[40vh]")} />}>
      <CoursesPage />
    </Suspense>
  );
}
