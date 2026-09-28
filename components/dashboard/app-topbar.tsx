"use client";

import React from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { NotificationDrawer } from "@/components/dashboard/topbar/notification-drawer";
import { SearchPortal } from "@/components/dashboard/topbar/search-portal";
import { UserMenu } from "@/components/dashboard/topbar/user-menu";
import { useApp } from "@/lib/app-context";
import { ROLE_LABELS } from "@/lib/app-data";

interface AppTopbarProps {
  title: string;
  crumb?: string;
  onOpenMobileMenu: () => void;
}

export function AppTopbar({ title, crumb, onOpenMobileMenu }: AppTopbarProps) {
  const { role } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-3.5 bg-[rgba(11,16,48,0.85)] border-b border-white/8 backdrop-blur-[20px] backdrop-saturate-150">
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink transition-colors cursor-pointer"
        aria-label="Open sidebar menu"
      >
        <DashboardIcon name="menu" className="size-5" />
      </button>

      {/* Breadcrumbs */}
      <div className="text-xs md:text-sm text-ink-faint flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
        <span>{crumb || ROLE_LABELS[role]}</span>
        <span>/</span>
        <b className="text-ink font-semibold">{title}</b>
      </div>

      {/* Right Tools: Search Portal, Notifications, and User Profile Menu */}
      <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
        <SearchPortal />
        <NotificationDrawer />
        <UserMenu />
      </div>
    </header>
  );
}
