"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { GlassCard } from "@/components/site/glass-card";
import { NAV, isNavActive } from "@/lib/site";
import { buttonClass, navLinkClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className={cn("sticky top-0 z-[60] pt-[0.9rem] transition-[padding] duration-300", stuck && "pt-[0.45rem]")}>
        <div className={shellClass}>
          <nav
            className={cn(
              "relative flex items-center gap-4 rounded-full border border-white/13 bg-white/[0.055] p-[0.6rem] pl-[1.15rem] shadow-[0_24px_60px_-24px_rgba(4,8,30,0.85)] backdrop-blur-[20px] backdrop-saturate-150 transition-[background,box-shadow] duration-300",
              stuck && "bg-[rgba(12,16,46,0.72)] shadow-[0_18px_44px_-22px_rgba(0,0,0,0.95)]",
            )}
            aria-label="Primary"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-[inherit] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] opacity-55"
            />
            <Link href="/" className="flex shrink-0 items-center" aria-label="Bidyapith University home">
              <BrandLogo variant="horizontal" priority imgClassName="h-9 w-auto sm:h-10" decorative />
            </Link>

            <div className="ml-auto hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass({ active: isNavActive(item.href, pathname) })}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-2">
              <Link href="/login" className={cn(buttonClass({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
                Sign in
              </Link>
              <Link href="/register" className={cn(buttonClass({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}>
                Apply now
              </Link>
              <button
                type="button"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5 text-ink lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </button>
            </div>
          </nav>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[80] grid place-items-start justify-center bg-[rgba(6,9,28,0.72)] p-[1.1rem] backdrop-blur-[14px] transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <GlassCard
          className={cn(
            shellClass,
            "w-full p-[1.1rem] transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.3,1)]",
            open ? "translate-y-0" : "-translate-y-3.5",
          )}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-display text-lg">Menu</span>
            <button
              type="button"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-4 py-[0.85rem] font-semibold text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink",
                isNavActive(item.href, pathname) && "bg-white/[0.07] text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="block rounded-xl px-4 py-[0.85rem] font-semibold text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink"
          >
            Contact
          </Link>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/login" className={buttonClass({ variant: "ghost" })}>
              Sign in
            </Link>
            <Link href="/register" className={buttonClass({ variant: "primary" })}>
              Apply now
            </Link>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
