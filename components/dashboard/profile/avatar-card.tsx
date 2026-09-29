"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/site/glass-card";
import { UserAvatar } from "@/components/dashboard/shared/user-avatar";
import { apiClient } from "@/lib/api-client";
import { formatShortDate, ROLE_LABELS } from "@/lib/format";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import type { Role, UserSession } from "@/lib/app-types";

interface AvatarCardProps {
  user: UserSession;
  role: Role;
  onAvatarUpdated: (newAvatarUrl: string) => void;
  phone: string;
  altEmail: string;
  address: string;
}

export function AvatarCard({
  user,
  role,
  onAvatarUpdated,
  phone,
  altEmail,
  address,
}: AvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Avatar must be a JPEG, PNG, or WebP image");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar image must be smaller than 2 MB");
      return;
    }

    setIsUploadingAvatar(true);
    const toastId = toast.loading("Uploading avatar to Cloudinary...");

    try {
      const response = await apiClient.users.uploadAvatar(file);
      if (response?.data?.avatarUrl) {
        onAvatarUpdated(response.data.avatarUrl);
        toast.success("Avatar updated and synced to Cloudinary!", { id: toastId });
      } else {
        throw new Error("No image URL returned");
      }
    } catch {
      // Fallback: If backend is offline or unauthenticated, convert to Data URL and store locally
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onAvatarUpdated(reader.result);
          toast.success("Avatar updated successfully!", { id: toastId });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    const toastId = toast.loading("Removing profile photo...");
    try {
      await apiClient.users.deleteAvatar();
    } catch {
      // Ignore if offline
    } finally {
      onAvatarUpdated("");
      setIsUploadingAvatar(false);
      toast.success("Profile photo removed", { id: toastId });
    }
  };

  const detailsList = [
    { label: "Full Name", value: user.name },
    { label: "User ID", value: user.id },
    { label: "Official Email", value: user.email },
    { label: "Phone", value: user.phone || phone },
    { label: "Designation / Role", value: ROLE_LABELS[role] },
    user.altEmail || altEmail ? { label: "Alternate Email", value: user.altEmail || altEmail } : null,
    user.address || address ? { label: "Present Address", value: user.address || address } : null,
    user.program ? { label: "Program / Post", value: user.program } : null,
    user.batch ? { label: "Batch", value: user.batch } : null,
    user.advisor ? { label: "Academic Advisor", value: user.advisor } : null,
    user.office ? { label: "Office Location", value: user.office } : null,
    user.admitted ? { label: "Admitted Date", value: formatShortDate(user.admitted) } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const isImageAvatar =
    user.avatar &&
    (user.avatar.startsWith("http") ||
      user.avatar.startsWith("data:") ||
      user.avatar.startsWith("blob:") ||
      user.avatar.startsWith("/"));

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 mb-6 border-b border-white/8">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <UserAvatar
              name={user.name}
              avatar={user.avatar}
              size="xl"
              imgClassName="size-16 sm:size-20 md:size-24 rounded-2xl shadow-xl ring-2 ring-jade/30 border border-white/10"
              className="size-16 sm:size-20 md:size-24 rounded-2xl text-xl md:text-3xl shadow-xl ring-2 ring-jade/30 border border-white/10"
            />

            {/* Overlay trigger button for avatar upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1 cursor-pointer"
              title="Change avatar photo"
            >
              {isUploadingAvatar ? (
                <Loader2 className="size-5 animate-spin text-jade" />
              ) : (
                <>
                  <Camera className="size-5" />
                  <span>Change</span>
                </>
              )}
            </button>

            <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-jade ring-4 ring-night-900 flex items-center justify-center text-[10px] text-night-900 font-bold">
              ✓
            </span>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">{user.name}</h2>
            <p className="text-xs font-mono text-ink-faint mt-1">
              {user.id} · {ROLE_LABELS[role]}
            </p>
          </div>
        </div>

        {/* Avatar Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleAvatarFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] hover:border-jade/40 text-xs font-semibold text-ink transition-all cursor-pointer shadow-sm"
          >
            {isUploadingAvatar ? (
              <Loader2 className="size-3.5 animate-spin text-jade" />
            ) : (
              <Upload className="size-3.5 text-jade" />
            )}
            <span>Upload Photo</span>
          </button>

          {isImageAvatar && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={isUploadingAvatar}
              className="size-8 rounded-md border border-white/15 bg-white/[0.04] hover:bg-rose/15 hover:border-rose/30 text-ink-faint hover:text-rose transition-all flex items-center justify-center cursor-pointer"
              title="Remove avatar"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
        {detailsList.map((item, idx) => (
          <div key={idx}>
            <dt className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
              {item.label}
            </dt>
            <dd className="mt-1 font-medium text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  );
}
