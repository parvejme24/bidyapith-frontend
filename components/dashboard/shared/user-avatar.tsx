"use client";

import React from "react";
import { getInitials } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  imgClassName?: string;
  tone?: "gold" | "orchid" | "jade" | string;
  colorScheme?: "gold" | "orchid" | "jade" | string;
}

const SIZE_CLASSES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 sm:size-20 md:size-24 text-xl md:text-3xl",
};

export function UserAvatar({
  name,
  avatar,
  size = "sm",
  className,
  imgClassName,
  tone,
  colorScheme,
}: UserAvatarProps) {
  const isImage =
    avatar &&
    (avatar.startsWith("http") ||
      avatar.startsWith("data:") ||
      avatar.startsWith("blob:") ||
      avatar.startsWith("/"));

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.sm;

  if (isImage) {
    return (
      <img
        src={avatar}
        alt={name}
        className={cn(
          sizeClass,
          "rounded-full object-cover shrink-0 shadow-sm ring-1 ring-white/10",
          imgClassName,
          className
        )}
      />
    );
  }

  const resolvedTone =
    tone ||
    colorScheme ||
    (avatar === "gold"
      ? "gold"
      : avatar === "orchid"
      ? "orchid"
      : "jade");

  return (
    <span
      className={cn(
        sizeClass,
        "rounded-full flex items-center justify-center font-display font-bold shrink-0 shadow-sm select-none",
        resolvedTone === "gold"
          ? "bg-gradient-to-br from-[#FFD9A6] to-[#FFB454] text-[#33230A]"
          : resolvedTone === "orchid"
          ? "bg-gradient-to-br from-[#D3CBFF] to-[#9B8CFF] text-[#171141]"
          : "bg-gradient-to-br from-[#7CE9CB] to-[#2ED3A7] text-[#052620]",
        className
      )}
    >
      {getInitials(name || "User")}
    </span>
  );
}
