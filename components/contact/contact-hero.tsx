"use client";

import { PageHero } from "@/components/site/page-hero";

export function ContactHero() {
  return (
    <section className="pt-12 pb-6 md:pt-16">
      <PageHero
        chip="Sunday to Thursday, 9 AM – 5 PM"
        title="Ask us anything before you apply"
        lead="Admission questions, fee clarifications, transcript requests — send them to the right desk and you will hear back within one working day."
      />
    </section>
  );
}
