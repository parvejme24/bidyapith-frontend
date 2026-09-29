"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { InstructorSection } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface GradeSubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSection: InstructorSection;
  onConfirm: () => void;
}

export function GradeSubmitConfirmDialog({
  open,
  onOpenChange,
  currentSection,
  onConfirm,
}: GradeSubmitConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border border-white/20 bg-night-900/98 p-6 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-2xl max-w-md">
        <AlertDialogHeader>
          <div className="size-12 rounded-full bg-jade/15 text-jade flex items-center justify-center mb-3">
            <AlertTriangle className="size-6 text-jade" />
          </div>
          <AlertDialogTitle className="font-display text-lg font-bold text-ink">
            Submit Grade Sheet to Registrar?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-ink-muted leading-relaxed mt-2">
            Are you sure you want to finalize and submit the grade sheet for{" "}
            <b className="text-ink font-semibold">
              {currentSection?.code} (Section {currentSection?.section})
            </b>
            ?
            <br />
            <br />
            Once submitted, all calculated letter grades will be officially recorded and published to student portals.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-5 flex gap-2 justify-end">
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs cursor-pointer")}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs cursor-pointer shadow-md")}
          >
            Confirm & Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
