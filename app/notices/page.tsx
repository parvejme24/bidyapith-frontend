import type { Metadata } from "next";
import { NoticesPage } from "@/components/notices/notices-page";

export const metadata: Metadata = {
  title: "Notices & events — Bidyapith University",
  description:
    "Official notices from Bidyapith University: registration, examinations, results, payments and campus events.",
};

export default function Page() {
  return <NoticesPage />;
}
