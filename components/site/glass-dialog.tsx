"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { glassClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

type GlassDialogContentProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function GlassDialogContent({
  title,
  description,
  className,
  children,
}: GlassDialogContentProps) {
  return (
    <DialogContent
      showCloseButton={false}
      overlayClassName="fixed inset-0 z-50 bg-[rgba(6,9,28,0.75)] supports-backdrop-filter:backdrop-blur-[12px]"
      className={cn(
        glassClass({ tone: "strong" }),
        "fixed top-1/2 left-1/2 z-50 w-[min(640px,calc(100%-2.5rem))] max-h-[min(86vh,860px)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-transparent p-7 text-ink ring-0 sm:max-w-[640px]",
        className,
      )}
    >
      <DialogTitle className="sr-only">{title}</DialogTitle>
      {description ? <DialogDescription className="sr-only">{description}</DialogDescription> : null}
      {children}
    </DialogContent>
  );
}

export function DialogRoundClose() {
  return (
    <DialogClose
      className="grid place-items-center w-9 h-9 rounded-full border border-white/15 bg-white/5 shrink-0 cursor-pointer"
      aria-label="Close"
    >
      <CloseIcon />
    </DialogClose>
  );
}

export function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}
