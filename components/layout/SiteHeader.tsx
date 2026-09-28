"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { GlassCard } from "@/components/site/glass-card";
import {
  getStoredToken,
  getStoredUser,
  removeStoredToken,
} from "@/lib/api-client";
import { NAV, isNavActive } from "@/lib/site";
import { buttonClass, navLinkClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { ChevronDown, GraduationCap, LayoutDashboard, LogOut, Settings, ShieldCheck, User } from "lucide-react";

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

interface LoggedInUser {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN" | string;
  avatar?: string;
  avatarUrl?: string;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [hasToken, setHasToken] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check login state on mount, route change & auth changes
  useEffect(() => {
    function syncAuth() {
      const token = getStoredToken();
      let user = getStoredUser<LoggedInUser>();

      if (typeof window !== "undefined") {
        try {
          const overrides = JSON.parse(localStorage.getItem("bidyapith_user_overrides") || "{}");
          const roleKey = (user?.role || "student").toLowerCase();
          if (overrides[roleKey]) {
            user = { ...(user || {}), ...overrides[roleKey] };
          }
        } catch {}
      }

      setHasToken(Boolean(token));
      setCurrentUser(user);
    }

    syncAuth();
    window.addEventListener("bidyapith-auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("bidyapith-auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      if (event.key === "Escape") {
        setOpen(false);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const isDashboard =
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile");

  if (isDashboard) return null;

  const userRole = (currentUser?.role || "STUDENT").toLowerCase();
  const dashboardHref =
    userRole === "admin"
      ? "/admin?role=admin"
      : userRole === "instructor"
      ? "/instructor?role=instructor"
      : "/student?role=student";

  const profileHref = `/profile?role=${userRole}`;
  const userName =
    currentUser?.name ||
    (currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
      : userRole === "admin"
      ? "Parvej Admin"
      : userRole === "instructor"
      ? "Dr. Farhana Islam"
      : "Nusrat Jahan");
  const userEmail = currentUser?.email || "student001@bidyapith.edu";

  const rawAvatar = currentUser?.avatar || currentUser?.avatarUrl;
  const avatarUrl =
    rawAvatar && (rawAvatar.startsWith("http") || rawAvatar.startsWith("data:") || rawAvatar.startsWith("blob:") || rawAvatar.startsWith("/"))
      ? rawAvatar
      : userRole === "admin"
      ? "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
      : userRole === "instructor"
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

  const handleLogout = () => {
    removeStoredToken();
    setHasToken(false);
    setCurrentUser(null);
    setUserDropdownOpen(false);
    router.push("/login");
  };

  return (
    <>
      <div className={cn("sticky top-0 z-[60] pt-[0.9rem] transition-[padding] duration-300", stuck && "pt-[0.45rem]")}>
        <div className={shellClass}>
          <nav
            className={cn(
              "relative flex items-center gap-4 rounded-2xl sm:rounded-full border border-white/13 bg-white/[0.055] p-[0.6rem] pl-[1.15rem] shadow-[0_24px_60px_-24px_rgba(4,8,30,0.85)] backdrop-blur-[20px] backdrop-saturate-150 transition-[background,box-shadow] duration-300",
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
              {hasToken ? (
                /* User Avatar with Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen((prev) => !prev)}
                    className={cn(
                      "relative size-9 rounded-full p-0.5 border transition-all cursor-pointer overflow-hidden",
                      userDropdownOpen
                        ? "border-jade ring-2 ring-jade/30 scale-105"
                        : "border-white/20 hover:border-jade/60 hover:scale-105"
                    )}
                    aria-label="Open user menu"
                    aria-expanded={userDropdownOpen}
                  >
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="size-full rounded-full object-cover"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl sm:rounded-2xl border border-white/15 bg-night-900/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-1.5">
                        <img
                          src={avatarUrl}
                          alt={userName}
                          className="size-10 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink truncate">{userName}</p>
                          <p className="text-[0.72rem] text-ink-faint truncate">{userEmail}</p>
                          <span className="inline-block text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-jade/15 text-jade mt-1">
                            {userRole.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1">
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-jade/10 hover:text-jade transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="size-4 text-jade" />
                          <span>Open Dashboard</span>
                        </Link>

                        <Link
                          href={profileHref}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-ink hover:bg-white/[0.07] transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="size-4 text-ink-muted" />
                          <span>My Profile</span>
                        </Link>
                      </div>

                      {/* Divider & Sign Out */}
                      <div className="my-1.5 border-t border-white/10 pt-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose hover:bg-rose/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="size-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated View: Sign In & Apply Buttons */
                <>
                  <Link href="/login" className={cn(buttonClass({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
                    Sign in
                  </Link>
                  <Link href="/register" className={cn(buttonClass({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}>
                    Apply now
                  </Link>
                </>
              )}

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

      {/* Mobile Drawer Menu */}
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
              className={cn(
                "block rounded-xl px-4 py-[0.85rem] font-semibold text-ink-muted transition-colors hover:bg-white/[0.07] hover:text-ink",
                isNavActive(item.href, pathname) && "bg-jade/15 text-jade border border-jade/25 font-bold shadow-sm",
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
            {hasToken ? (
              <>
                <Link href={dashboardHref} className={buttonClass({ variant: "primary" })}>
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={buttonClass({ variant: "ghost" })}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={buttonClass({ variant: "ghost" })}>
                  Sign in
                </Link>
                <Link href="/register" className={buttonClass({ variant: "primary" })}>
                  Apply now
                </Link>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
