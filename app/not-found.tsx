import Link from "next/link";
import { BrandLogo } from "@/components/site/brand-logo";
import { Rise } from "@/components/site/motion";
import {
  buttonClass,
  displayClass,
  leadClass,
  numClass,
  sectionClass,
  shellClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main id="main">
      <section className={sectionClass}>
        <div className={cn(shellClass, "max-w-2xl text-center")}>
          <Rise delay={1}>
            <BrandLogo variant="mark" className="justify-center" imgClassName="size-14" />
          </Rise>
          <Rise delay={2}>
            <p className={cn("font-display text-jade text-lg mt-5", numClass)}>404</p>
          </Rise>
          <Rise delay={3}>
            <h1 className={cn(displayClass.d1, "mt-4")}>This page isn&apos;t on the campus map</h1>
          </Rise>
          <Rise delay={4}>
            <p className={cn(leadClass, "mx-auto mt-5 text-center")}>
              The link may be old, or the notice behind it has expired. The pages below cover almost
              everything people come here looking for.
            </p>
          </Rise>
          <Rise delay={5}>
            <div className="flex flex-wrap justify-center gap-3 mt-9">
              <Link href="/" className={buttonClass({ variant: "primary" })}>
                Back to the home page
              </Link>
              <Link href="/programs" className={buttonClass({ variant: "ghost" })}>
                Programmes
              </Link>
              <Link href="/admissions" className={buttonClass({ variant: "ghost" })}>
                Admissions
              </Link>
              <Link href="/notices" className={buttonClass({ variant: "ghost" })}>
                Notices
              </Link>
            </div>
          </Rise>
        </div>
      </section>
    </main>
  );
}
