"use client";

import { ContactDesks } from "@/components/contact/contact-desks";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMapInfo } from "@/components/contact/contact-map-info";
import { useFaqs } from "@/hooks/use-data";
import { sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ContactPage() {
  const { data: faqs = [] } = useFaqs();

  return (
    <main id="main">
      <ContactHero />
      <ContactDesks />

      <section className={sectionClass}>
        <div className={cn(shellClass, "grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start")}>
          <ContactForm />
          <ContactMapInfo faqs={faqs} />
        </div>
      </section>
    </main>
  );
}
