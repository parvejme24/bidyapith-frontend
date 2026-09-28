"use client";

import React, { useEffect, useRef } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";

export function NotificationDrawer() {
  const {
    notifications,
    unreadCount,
    isNotificationsLiveSynced,
    notificationOpen,
    setNotificationOpen,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const notificationRef = useRef<HTMLDivElement>(null);

  // Click outside listener to dismiss
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setNotificationOpen]);

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        className={cn(
          "relative size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/10 transition-colors cursor-pointer",
          notificationOpen && "border-jade/50 bg-white/10 text-ink"
        )}
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-marigold text-night-900 text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        ) : (
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-jade shadow-[0_0_0_2px_rgba(11,16,48,0.9)]" />
        )}
      </button>

      {/* Notification Drawer Popover */}
      {notificationOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:left-auto sm:top-full sm:mt-2.5 sm:w-96 max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="rounded-xl border border-white/20 bg-night-800/98 backdrop-blur-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-sm text-ink">
                  Notifications & Alerts
                </h3>
                {isNotificationsLiveSynced && (
                  <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold px-1.5 py-0.5 rounded-full bg-jade/15 text-jade border border-jade/30">
                    <span className="size-1.5 rounded-full bg-jade animate-pulse" />
                    Live DB
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead()}
                    className="text-[0.7rem] text-jade hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="size-3" />
                    <span>Mark all read</span>
                  </button>
                )}
                <span className="text-[0.68rem] text-ink-faint font-mono">
                  {notifications.length} alerts
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {notifications.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => item.id && markNotificationRead(item.id)}
                  className={cn(
                    "flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer group",
                    item.read
                      ? "bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:bg-white/[0.04]"
                      : "bg-white/[0.05] border-white/10 hover:border-jade/30"
                  )}
                >
                  <span
                    className={cn(
                      "size-2 rounded-full mt-1.5 shrink-0",
                      item.tone === "gold" && "bg-marigold",
                      item.tone === "rose" && "bg-rose",
                      item.tone === "orchid" && "bg-orchid",
                      !item.tone && "bg-jade"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink group-hover:text-jade transition-colors leading-tight text-xs">
                        {item.t}
                      </p>
                      {item.time && (
                        <span className="text-[0.65rem] font-mono text-ink-faint shrink-0">
                          {item.time}
                        </span>
                      )}
                    </div>
                    <p className="text-ink-muted mt-1 leading-relaxed text-[0.74rem]">
                      {item.m}
                    </p>
                    {item.link && (
                      <span className="inline-block text-[0.68rem] text-jade font-semibold mt-1 hover:underline">
                        View details →
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="py-6 text-center text-xs text-ink-muted">
                  <Check className="size-6 text-jade mx-auto mb-1.5 opacity-60" />
                  <p>You&apos;re all caught up!</p>
                  <p className="text-[0.7rem] text-ink-faint mt-0.5">No new notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
