"use client";

import Link from "next/link";
import { FacultyCard } from "@/components/site/faculty-card";
import { Reveal } from "@/components/site/motion";
import { buttonClass, displayClass, leadClass, sectionClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import type { FacultyMember } from "@/lib/types";

interface HomeFacultySectionProps {
  faculty?: FacultyMember[];
}

export function HomeFacultySection({ faculty }: HomeFacultySectionProps) {
  return (
    <section className={sectionClass}>
      <div className={shellClass}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
            <div className="max-w-xl">
              <h2 className={displayClass.d2}>Taught by people who publish</h2>
              <p className={cn(leadClass, "mt-4")}>
                Three hundred and twelve faculty members, most of them with office hours you can
                book from the portal.
              </p>
            </div>
            <Link href="/faculty" className={buttonClass({ variant: "ghost" })}>
              Meet the faculty
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {faculty?.slice(0, 4).map((member, index) => (
            <FacultyCard key={member.email} faculty={member} index={index} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
