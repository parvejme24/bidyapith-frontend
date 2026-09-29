"use client";

import { PageHero } from "@/components/site/page-hero";

export function ProgramsHero() {
  return (
    <section className="pt-12 pb-6 md:pt-16">
      <PageHero
        chip="Fall 2026 intake"
        title="Pick the degree, not the brochure"
        lead="Every programme lists its credit load, its cost per semester and how many seats are actually left. Open a card to see what you will study year by year."
      />
    </section>
  );
}
