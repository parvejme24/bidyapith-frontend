import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About — Bidyapith University",
  description:
    "Bidyapith University in Purbachal, Dhaka: founded 1998, six schools, ten departments, 9,240 students and one connected academic system.",
};

export default function Page() {
  return <AboutPage />;
}
