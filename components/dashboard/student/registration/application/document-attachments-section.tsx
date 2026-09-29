"use client";

import React, { useState } from "react";
import { Paperclip, Upload, FileText, Trash2, Eye, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/site/glass-card";
import { toast } from "sonner";
import type { AttachedDocument } from "@/lib/app-types";

interface DocumentAttachmentsSectionProps {
  attachedDocs: AttachedDocument[];
  onAddDoc: (doc: AttachedDocument) => void;
  onRemoveDoc: (id: string) => void;
  onPreviewDoc: (doc: AttachedDocument) => void;
}

export function DocumentAttachmentsSection({
  attachedDocs,
  onAddDoc,
  onRemoveDoc,
  onPreviewDoc,
}: DocumentAttachmentsSectionProps) {
  const [selectedDocType, setSelectedDocType] = useState<string>("Academic Transcript");
  const [customFileName, setCustomFileName] = useState<string>("");

  const handleAddSampleDoc = (docType: string) => {
    const filename = customFileName.trim()
      ? customFileName.endsWith(".pdf")
        ? customFileName
        : `${customFileName}.pdf`
      : `${docType.replace(/\s+/g, "_")}_Record_${Math.floor(100 + Math.random() * 900)}.pdf`;

    const newDoc: AttachedDocument = {
      id: `doc-${Date.now()}`,
      name: filename,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      type: docType,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    onAddDoc(newDoc);
    setCustomFileName("");
    toast.success(`Attached "${newDoc.name}" (${newDoc.type})`);
  };

  return (
    <GlassCard className="p-6 md:p-7 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-marigold" />
          <h2 className="font-display text-base font-bold text-ink">
            3. Attach Academic Documents for Admin Verification
          </h2>
        </div>
        <span className="text-xs font-mono text-ink-faint">
          {attachedDocs.length} Attached
        </span>
      </div>

      <p className="text-xs text-ink-muted leading-relaxed">
        Please attach your latest <b>academic transcript</b>, prerequisite marksheets, or departmental recommendation letters. The <b>Admin Admission & Course Reviewer</b> will inspect these documents before granting approval.
      </p>

      {/* Quick Uploader Bar */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/20 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-ink-faint font-medium mb-1">Document Type</label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-ink text-xs focus:outline-none focus:border-jade/50"
            >
              <option value="Academic Transcript" className="bg-[#111927]">Academic Transcript (Official/Unofficial)</option>
              <option value="Prerequisite Marksheet" className="bg-[#111927]">Prerequisite Grade Marksheet</option>
              <option value="Recommendation Letter" className="bg-[#111927]">Faculty Recommendation Letter</option>
              <option value="Student ID / NID Scan" className="bg-[#111927]">Student ID / NID Card Scan</option>
              <option value="Special Waiver Request" className="bg-[#111927]">Departmental Exemption / Waiver</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-ink-faint font-medium mb-1">Custom Filename (Optional)</label>
            <input
              type="text"
              placeholder="e.g. My_Official_Transcript.pdf"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-ink text-xs placeholder:text-ink-faint focus:outline-none focus:border-jade/50"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => handleAddSampleDoc(selectedDocType)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer border border-white/15"
            >
              <Upload className="size-3.5 text-jade" />
              <span>Attach Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attached Files List */}
      <div className="space-y-2">
        <h4 className="text-[11px] uppercase font-mono tracking-wider text-ink-faint">
          Attached Document Portfolio ({attachedDocs.length})
        </h4>

        {attachedDocs.length === 0 ? (
          <div className="p-4 rounded-xl bg-rose/5 border border-rose/20 text-center text-xs text-rose flex items-center justify-center gap-2">
            <AlertCircle className="size-4" />
            <span>No academic documents attached. You must attach at least one transcript for admin verification.</span>
          </div>
        ) : (
          <div className="divide-y divide-white/8 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            {attachedDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-lg bg-jade/10 border border-jade/20 flex items-center justify-center text-jade shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink truncate">{doc.name}</p>
                    <p className="text-[11px] text-ink-faint font-mono">
                      {doc.type} · {doc.size} · Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onPreviewDoc(doc)}
                    className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-white/10 transition-colors cursor-pointer"
                    title="Preview Document"
                  >
                    <Eye className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveDoc(doc.id)}
                    className="p-1.5 rounded-lg text-rose hover:bg-rose/10 transition-colors cursor-pointer"
                    title="Remove Attachment"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
