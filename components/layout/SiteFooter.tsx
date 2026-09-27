"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/site/brand-logo";
import { GlassCard } from "@/components/site/glass-card";
import { SITE } from "@/lib/site";
import { ruleClass, sectionTightClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2.2 2A17 17 0 013 6.2 2 2 0 015 4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const phoneHref = SITE.phone.replace(/\s/g, "");

  const isDashboard =
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile");

  if (isDashboard) return null;

  return (
    <footer className={cn(sectionTightClass, "mt-8")}>
      <div className={shellClass}>
        <GlassCard className="p-7 md:p-10">
          <div className="grid gap-9 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <Link href="/" className="mb-4 inline-flex" aria-label="Bidyapith University home">
                <BrandLogo variant="horizontal" imgClassName="h-11 w-auto" decorative />
              </Link>
              <p className="max-w-[34ch] text-sm text-ink-muted">
                One campus, one system. Admission, registration, results and fees for{" "}
                {SITE.students.toLocaleString()} students in a single place.
              </p>
              <p className="mt-4 text-lg text-ink-faint">{SITE.name}</p>
            </div>

            <div>
              <h4 className="mb-3 font-sans text-sm font-bold">Study</h4>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li>
                  <Link href="/programs" className="hover:text-ink">
                    Programs
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-ink">
                    Course catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/admissions" className="hover:text-ink">
                    Admissions
                  </Link>
                </li>
                <li>
                  <Link href="/admissions#fees" className="hover:text-ink">
                    Fees & scholarships
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-sans text-sm font-bold">University</h4>
              <ul className="space-y-2 text-sm text-ink-muted">
                <li>
                  <Link href="/about" className="hover:text-ink">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/faculty" className="hover:text-ink">
                    Faculty
                  </Link>
                </li>
                <li>
                  <Link href="/notices" className="hover:text-ink">
                    Notices & events
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-ink">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 font-sans text-sm font-bold">Reach us</h4>
              <ul className="space-y-3 text-sm text-ink-muted">
                <li className="flex gap-2.5">
                  <span className="mt-0.5 text-jade">
                    <PinIcon />
                  </span>
                  <span>{SITE.address}</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-jade">
                    <PhoneIcon />
                  </span>
                  <a href={`tel:${phoneHref}`} className="hover:text-ink">
                    {SITE.phone}
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-jade">
                    <MailIcon />
                  </span>
                  <a href={`mailto:${SITE.email}`} className="hover:text-ink">
                    {SITE.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className={cn(ruleClass, "my-7")} />

          <div className="flex flex-col items-center justify-between gap-3 text-xs text-ink-faint sm:flex-row">
            <p>
              © {year} {SITE.name}. Established {SITE.founded}.
            </p>
            <p className="flex items-center gap-2">
              <span className="size-[7px] rounded-full bg-jade shadow-[0_0_0_0_rgba(46,211,167,0.7)] animate-[live-ping_2.2s_ease-out_infinite]" />{" "}
              Student portal status: all services running
            </p>
          </div>
        </GlassCard>
      </div>
    </footer>
  );
}
