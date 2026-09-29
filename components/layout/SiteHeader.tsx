"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import {
  getStoredToken,
  getStoredUser,
  removeStoredToken,
} from "@/lib/api-client";
import { NAV, isNavActive } from "@/lib/site";
import { buttonClass, navLinkClass, shellClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { SiteHeaderUserDropdown } from "./site-header-user-dropdown";
import { SiteHeaderMobileDrawer } from "./site-header-mobile-drawer";

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
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

  const userRole = (currentUser?.role || "student").toLowerCase();
  const dashboardHref =
    userRole === "admin"
      ? "/admin"
      : userRole === "instructor"
      ? "/instructor"
      : "/student";

  const profileHref =
    userRole === "admin"
      ? "/admin"
      : userRole === "instructor"
      ? "/instructor/profile"
      : "/student/profile";

  const userName =
    currentUser?.name ||
    (currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
      : userRole === "admin"
      ? "Super Administrator"
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

  const isDashboard =
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile");

  if (isDashboard) return null;

  return (
    <>
      <div className={cn("sticky top-0 z-[60] pt-[0.9rem] transition-[padding] duration-300", stuck && "pt-[0.45rem]")}>
        <div className={shellClass}>
          <nav
            className={cn(
              "relative flex items-center gap-4 rounded-2xl sm:rounded-full border border-white/13 bg-white/[0.055] p-[0.6rem] pl-[1.15rem] shadow-[0_24px_60px_-24px_rgba(4,8,30,0.85)] backdrop-blur-[20px] backdrop-saturate-150 transition-[background,box-shadow] duration-300",
              stuck && "bg-[rgba(12,16,46,0.72)] shadow-[0_18px_44px_-22px_rgba(0,0,0,0.95)]"
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
                <SiteHeaderUserDropdown
                  isOpen={userDropdownOpen}
                  onToggle={() => setUserDropdownOpen((prev) => !prev)}
                  onClose={() => setUserDropdownOpen(false)}
                  avatarUrl={avatarUrl}
                  userName={userName}
                  userEmail={userEmail}
                  userRole={userRole}
                  dashboardHref={dashboardHref}
                  profileHref={profileHref}
                  onLogout={handleLogout}
                  dropdownRef={dropdownRef}
                />
              ) : (
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
      <SiteHeaderMobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        hasToken={hasToken}
        avatarUrl={avatarUrl}
        userName={userName}
        userEmail={userEmail}
        dashboardHref={dashboardHref}
        pathname={pathname}
        onLogout={handleLogout}
      />
    </>
  );
}
