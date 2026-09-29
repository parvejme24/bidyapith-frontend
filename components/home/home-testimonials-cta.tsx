"use client";

import Link from "next/link";
import { AdmissionCountdown } from "@/components/site/admission-countdown";
import { Chip } from "@/components/site/chip";
import { GlassCard } from "@/components/site/glass-card";
import { Reveal } from "@/components/site/motion";
import { initials } from "@/lib/format";
import {
  avatarClass,
  buttonClass,
  displayClass,
  leadClass,
  sectionClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { Voice } from "@/lib/types";

interface HomeTestimonialsCtaProps {
  voices?: Voice[];
  admissionCloses?: string;
}

export function HomeTestimonialsCta({
  voices,
  admissionCloses,
}: HomeTestimonialsCtaProps) {
  return (
    <>
      {/* Student Voices Section */}
      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <h2 className={cn(displayClass.d2, "mb-9")}>Students, a year or two out</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {voices?.map((voice) => (
              <Reveal key={voice.name}>
                <figure className="m-0 h-full">
                  <GlassCard lift className="p-7 h-full">
                    <blockquote className="font-display text-[1.12rem] leading-relaxed">
                      “{voice.quote}”
                    </blockquote>
                    <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-white/8">
                      <span className={cn(avatarClass({ tone: voice.av }), "size-11 text-sm")}>
                        {initials(voice.name)}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{voice.name}</span>
                        <span className="block text-xs text-ink-faint mt-0.5">{voice.meta}</span>
                      </span>
                    </figcaption>
                  </GlassCard>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final Admission Call To Action */}
      <section className={sectionClass}>
        <div className={shellClass}>
          <Reveal>
            <GlassCard strong className="p-8 md:p-12 text-center">
              <Chip tone="gold" className="mb-5">
                Fall 2026 intake
              </Chip>
              <h2 className={cn(displayClass.d2, "max-w-2xl mx-auto")}>
                Applications close on 15 October
              </h2>
              <p className={cn(leadClass, "mx-auto mt-4 text-center")}>
                The application takes about twenty minutes. You can save it and come back — nothing
                is submitted until you pay the fee.
              </p>
              <AdmissionCountdown closesAt={admissionCloses} className="justify-center mt-8" />
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Link href="/register" className={buttonClass({ variant: "primary" })}>
                  Create your applicant account
                </Link>
                <Link href="/admissions#fees" className={buttonClass({ variant: "ghost" })}>
                  Fees and scholarships
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}
