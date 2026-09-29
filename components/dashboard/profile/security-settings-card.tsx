import React, { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/site/glass-card";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Laptop, Loader2, ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api-client/auth";

export function SecuritySettingsCard() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      toast.error("Please fill in current and new password");
      return;
    }
    if (newPw.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Password updated successfully");
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to update password. Check your current password.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security / Password */}
      <GlassCard className="p-6 md:p-7">
        <h3 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2.5">
          <ShieldCheck className="size-5 text-jade shrink-0" />
          <span>Security & Password</span>
        </h3>
        <form onSubmit={handleUpdatePassword} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 pr-10 text-sm text-ink outline-none focus:border-jade"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label={showCurrentPw ? "Hide password" : "Show password"}
              >
                {showCurrentPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 pr-10 text-sm text-ink outline-none focus:border-jade"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label={showNewPw ? "Hide password" : "Show password"}
              >
                {showNewPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPw ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 pr-10 text-sm text-ink outline-none focus:border-jade"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                aria-label={showConfirmPw ? "Hide password" : "Show password"}
              >
                {showConfirmPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "w-full mt-2 cursor-pointer hover:border-jade/40 flex items-center justify-center gap-2"
            )}
          >
            {loading && <Loader2 className="size-4 animate-spin text-jade" />}
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      </GlassCard>

      {/* Active Sessions */}
      <GlassCard className="p-6 md:p-7">
        <h3 className="font-display text-lg font-semibold text-ink mb-4 flex items-center gap-2.5">
          <Laptop className="size-5 text-jade shrink-0" />
          <span>Active Sessions</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex gap-3 pb-3 border-b border-white/8">
            <span className="size-2 rounded-full bg-jade mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">macOS / Chrome · Dhaka, BD</p>
              <p className="text-ink-faint mt-0.5">Current device · Active now</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="size-2 rounded-full bg-orchid mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-ink">Android Mobile App · Dhaka, BD</p>
              <p className="text-ink-faint mt-0.5">Last active 2 days ago</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toast.success("All other active sessions have been signed out")}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "w-full mt-5 text-xs text-ink-muted cursor-pointer")}
        >
          Sign out all other sessions
        </button>
      </GlassCard>
    </div>
  );
}
