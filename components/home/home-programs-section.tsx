"use client";

import Link from "next/link";
import { ProgramCard } from "@/components/site/program-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Program } from "@/lib/types";

interface HomeProgramsSectionProps {
  programs?: Program[];
}

export function HomeProgramsSection({ programs }: HomeProgramsSectionProps) {
  return (
    <section className={sectionClass}>
      <div className={shellClass}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
            <div className="max-w-xl">
              <h2 className={displayClass.d2}>Programmes people actually finish</h2>
              <p className={cn(leadClass, "mt-4")}>
                Thirty-four degrees across six schools, each with a required project, internship
                or thesis before you graduate.
              </p>
            </div>
            <Link href="/programs" className={buttonClass({ variant: "ghost" })}>
              See all programmes
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs?.slice(0, 6).map((program) => (
            <ProgramCard key={program.code} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}
