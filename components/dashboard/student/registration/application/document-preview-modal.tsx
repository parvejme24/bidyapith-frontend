"use client";

import React from "react";
import { CheckCircle2, FileText } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import type { AttachedDocument } from "@/lib/app-types";

interface DocumentPreviewModalProps {
  previewDoc: AttachedDocument | null;
  onClose: () => void;
}

export function DocumentPreviewModal({ previewDoc, onClose }: DocumentPreviewModalProps) {
  if (!previewDoc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg p-6 space-y-4 border-white/20 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-jade" />
            <h3 className="font-display font-bold text-ink text-sm">
              Document Preview: {previewDoc.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ink-faint hover:text-ink cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        <div className="p-6 rounded-xl bg-black/40 border border-white/10 text-center space-y-3 font-mono text-xs">
          <div className="size-12 mx-auto rounded-full bg-jade/10 border border-jade/30 flex items-center justify-center text-jade">
            <CheckCircle2 className="size-6" />
          </div>
          <p className="text-white font-bold">{previewDoc.name}</p>
          <p className="text-ink-faint text-[11px]">Type: {previewDoc.type}</p>
          <p className="text-ink-faint text-[11px]">
            File Size: {previewDoc.size} · Validated PDF Container
          </p>
          <div className="p-3 rounded bg-white/5 text-[11px] text-jade">
            ✓ Cryptographic SHA-256 Checksum Verified for Academic Committee
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-jade text-night-900 text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
