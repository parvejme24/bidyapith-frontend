"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppTopbar } from "@/components/dashboard/app-topbar";
import { ForbiddenView } from "@/components/dashboard/forbidden-view";
import { getStoredToken } from "@/lib/api-client";
import { useApp } from "@/lib/app-context";
import type { Role } from "@/lib/app-types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  crumb?: string;
  requiredRole?: Role;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  crumb,
  requiredRole,
  actions,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { role } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Secure Dashboard Access: Ensure user is logged in
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Prevent flash of protected dashboard if not authenticated
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center p-6 text-ink">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-7 text-jade animate-spin" />
          <p className="text-xs text-ink-muted font-medium">Securing university session...</p>
        </div>
      </div>
    );
  }

  const isForbidden = requiredRole && requiredRole !== role;

  return (
    <div className="min-h-screen bg-night-900 text-ink antialiased flex">
      {/* Sidebar */}
      <AppSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[268px]">
        <AppTopbar
          title={title}
          crumb={crumb}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {isForbidden ? (
            <ForbiddenView requiredRole={requiredRole} />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* View Header */}
              <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-ink-muted mt-1.5">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </div>

              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
