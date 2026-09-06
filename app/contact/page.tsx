import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact — Bidyapith University",
  description:
    "Reach the admission office, registrar, accounts and student affairs at Bidyapith University, Purbachal, Dhaka.",
};

export default function Page() {
  return <ContactPage />;
}
