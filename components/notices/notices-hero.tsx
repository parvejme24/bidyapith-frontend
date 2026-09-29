"use client";

import { PageHero } from "@/components/site/page-hero";

export function NoticesHero() {
  return (
    <section className="pt-12 pb-6 md:pt-16">
      <PageHero
        chip="Updated 8 September 2026"
        chipTone="gold"
        title="Notices, in the order they matter"
        lead="Everything the registrar publishes lands here first, and on the portal at the same moment. Pinned notices stay at the top until they expire."
      />
    </section>
  );
}
