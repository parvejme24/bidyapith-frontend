"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/site/glass-card";
import { NAV, isNavActive } from "@/lib/site";
import { buttonClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface SiteHeaderMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  hasToken: boolean;
  avatarUrl: string;
  userName: string;
  userEmail: string;
  dashboardHref: string;
  pathname: string;
  onLogout: () => void;
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SiteHeaderMobileDrawer({
  open,
  onClose,
  hasToken,
  avatarUrl,
  userName,
  userEmail,
  dashboardHref,
  pathname,
  onLogout,
}: SiteHeaderMobileDrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] grid place-items-start justify-center bg-[rgba(6,9,28,0.72)] p-[1.1rem] backdrop-blur-[14px] transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <GlassCard
        className={cn(
          shellClass,
          "w-full p-[1.1rem] transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.3,1)]",
          open ? "translate-y-0" : "-translate-y-3.5"
        )}
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-display text-lg">Menu</span>
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/5"
            aria-label="Close menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {/* User badge on mobile if logged in */}
        {hasToken && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/8 mb-3">
            <img
              src={avatarUrl}
              alt={userName}
              className="size-10 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">{userName}</p>
              <p className="text-xs text-ink-faint truncate">{userEmail}</p>
            </div>
            <Link
              href={dashboardHref}
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-jade text-ink-dark text-xs font-semibold shrink-0"
            >
              Dashboard
            </Link>
          </div>
        )}

        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "block rounded-xl px-4 py-[0.85rem] font-semibold text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink",
              isNavActive(item.href, pathname) && "bg-jade/15 text-jade border border-jade/25 font-bold shadow-sm"
            )}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/contact"
          onClick={onClose}
          className="block rounded-xl px-4 py-[0.85rem] font-semibold text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink"
        >
          Contact
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {hasToken ? (
            <>
              <Link
                href={dashboardHref}
                onClick={onClose}
                className={buttonClass({ variant: "primary" })}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={buttonClass({ variant: "ghost" })}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className={buttonClass({ variant: "ghost" })}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className={buttonClass({ variant: "primary" })}
              >
                Apply now
              </Link>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
