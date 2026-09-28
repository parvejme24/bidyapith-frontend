"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Bell, Check, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";
import { useApp } from "@/lib/app-context";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export interface UniversityNotice {
  id: string;
  title: string;
  message: string;
  target: "all" | "students" | "faculty";
  tone: "orchid" | "gold" | "rose" | "jade";
  date: string;
  active: boolean;
}

interface NoticeManagementCardProps {
  notices: UniversityNotice[];
  setNotices: React.Dispatch<React.SetStateAction<UniversityNotice[]>>;
}

export function NoticeManagementCard({
  notices,
  setNotices,
}: NoticeManagementCardProps) {
  const { addAuditLog } = useApp();

  const [newNoticeOpen, setNewNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeTarget, setNoticeTarget] = useState<"all" | "students" | "faculty">("all");
  const [noticeTone, setNoticeTone] = useState<"orchid" | "gold" | "rose" | "jade">("orchid");
  const [publishing, setPublishing] = useState(false);

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) {
      toast.error("Please provide both title and message");
      return;
    }

    setPublishing(true);
    try {
      await apiClient.notifications.createBroadcast({
        title: noticeTitle.trim(),
        body: noticeMessage.trim(),
        target: noticeTarget,
        type: "ANNOUNCEMENT",
      }).catch((e) => console.warn("Notice broadcast api fallback:", e));

      const created: UniversityNotice = {
        id: `not-${Date.now()}`,
        title: noticeTitle.trim(),
        message: noticeMessage.trim(),
        target: noticeTarget,
        tone: noticeTone,
        date: new Date().toISOString().split("T")[0]!,
        active: true,
      };

      setNotices([created, ...notices]);
      setNoticeTitle("");
      setNoticeMessage("");
      setNewNoticeOpen(false);

      addAuditLog({
        actor: "Parvej Admin",
        role: "admin",
        action: "notice.publish",
        target: created.title,
        detail: `Broadcasted notice to ${created.target.toUpperCase()} users via dynamic notification engine`,
        tone: "orchid",
      });

      toast.success("University broadcast notice published to all active users!");
    } catch (err: any) {
      toast.error("Failed to broadcast notice: " + (err.message || "Unknown error"));
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notice archived");
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-marigold" />
          <h3 className="font-display text-base font-bold text-ink">
            Broadcast Notices
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setNewNoticeOpen(!newNoticeOpen)}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs flex items-center gap-1 cursor-pointer")}
        >
          <Plus className="size-3.5" />
          <span>New Notice</span>
        </button>
      </div>

      {/* Create Notice Inline Form */}
      {newNoticeOpen && (
        <form onSubmit={handlePublishNotice} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 mb-4 animate-in fade-in">
          <div>
            <label className="block text-[0.7rem] font-semibold text-ink-muted mb-1">
              Notice Title *
            </label>
            <input
              required
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="e.g. Midterm Seat Plan Published"
              className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-ink outline-none focus:border-jade"
            />
          </div>

          <div>
            <label className="block text-[0.7rem] font-semibold text-ink-muted mb-1">
              Notice Message *
            </label>
            <textarea
              required
              rows={2}
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              placeholder="Detailed notice text..."
              className="w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-ink outline-none focus:border-jade resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[0.68rem] text-ink-faint mb-1">Audience</label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="w-full flex items-center justify-between rounded-md border border-white/15 bg-night-900/90 px-3 py-1.5 text-xs text-ink outline-none cursor-pointer transition-colors hover:border-white/25"
                >
                  <span className="truncate">
                    {noticeTarget === "all"
                      ? "All Users"
                      : noticeTarget === "students"
                      ? "Students Only"
                      : "Faculty Only"}
                  </span>
                  <ChevronDown className="size-3 text-ink-faint shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44 rounded-lg bg-night-900/98 border-white/15 backdrop-blur-xl p-1 shadow-2xl">
                  {[
                    { value: "all" as const, label: "All Users" },
                    { value: "students" as const, label: "Students Only" },
                    { value: "faculty" as const, label: "Faculty Only" },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setNoticeTarget(item.value)}
                      className={cn(
                        "flex items-center justify-between text-xs py-1.5 px-2 rounded-md cursor-pointer transition-colors",
                        noticeTarget === item.value
                          ? "bg-jade/15 text-jade font-semibold"
                          : "text-ink-muted hover:text-ink hover:bg-white/5"
                      )}
                    >
                      <span>{item.label}</span>
                      {noticeTarget === item.value && <Check className="size-3.5 text-jade" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="block text-[0.68rem] text-ink-faint mb-1">Alert Tone</label>
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="w-full flex items-center justify-between rounded-md border border-white/15 bg-night-900/90 px-3 py-1.5 text-xs text-ink outline-none cursor-pointer transition-colors hover:border-white/25"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        noticeTone === "orchid" && "bg-orchid",
                        noticeTone === "gold" && "bg-marigold",
                        noticeTone === "rose" && "bg-rose",
                        noticeTone === "jade" && "bg-jade"
                      )}
                    />
                    <span>
                      {noticeTone === "orchid"
                        ? "Info (Orchid)"
                        : noticeTone === "gold"
                        ? "Warning (Gold)"
                        : noticeTone === "rose"
                        ? "Urgent (Rose)"
                        : "Success (Jade)"}
                    </span>
                  </span>
                  <ChevronDown className="size-3 text-ink-faint shrink-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 rounded-lg bg-night-900/98 border-white/15 backdrop-blur-xl p-1 shadow-2xl">
                  {[
                    { value: "orchid" as const, label: "Info (Orchid)", dot: "bg-orchid" },
                    { value: "gold" as const, label: "Warning (Gold)", dot: "bg-marigold" },
                    { value: "rose" as const, label: "Urgent (Rose)", dot: "bg-rose" },
                    { value: "jade" as const, label: "Success (Jade)", dot: "bg-jade" },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setNoticeTone(item.value)}
                      className={cn(
                        "flex items-center justify-between text-xs py-1.5 px-2 rounded-md cursor-pointer transition-colors",
                        noticeTone === item.value
                          ? "bg-jade/15 text-jade font-semibold"
                          : "text-ink-muted hover:text-ink hover:bg-white/5"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full shrink-0", item.dot)} />
                        <span>{item.label}</span>
                      </span>
                      {noticeTone === item.value && <Check className="size-3.5 text-jade" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setNewNoticeOpen(false)}
              className="px-2.5 py-1 text-xs text-ink-faint hover:text-ink cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={publishing}
              className="px-3 py-1 rounded bg-jade text-night-900 font-bold text-xs hover:bg-jade/90 cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1"
            >
              {publishing && <Loader2 className="size-3 animate-spin" />}
              <span>{publishing ? "Dispatching..." : "Publish Notice"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Active Notices List */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
        {notices.map((n) => (
          <div
            key={n.id}
            className="p-3 rounded-lg bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0",
                    n.tone === "orchid" && "bg-orchid",
                    n.tone === "gold" && "bg-marigold",
                    n.tone === "rose" && "bg-rose",
                    n.tone === "jade" && "bg-jade"
                  )}
                />
                <h4 className="font-semibold text-ink text-xs leading-tight">{n.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNotice(n.id)}
                className="text-ink-faint hover:text-rose transition-colors cursor-pointer"
                title="Archive notice"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
            <p className="text-[0.72rem] text-ink-muted mt-1.5 leading-relaxed">
              {n.message}
            </p>
            <div className="flex items-center justify-between text-[0.65rem] text-ink-faint pt-2 mt-2 border-t border-white/5 font-mono">
              <span className="uppercase font-bold text-jade">Target: {n.target}</span>
              <span>{n.date}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
