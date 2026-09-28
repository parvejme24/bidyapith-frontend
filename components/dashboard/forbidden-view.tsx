"use client";

import React from "react";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/icons";
import { StatusPill } from "@/components/dashboard/status-pill";
import { GlassCard } from "@/components/site/glass-card";
import { useApp } from "@/lib/app-context";
import { ROLE_LABELS } from "@/lib/app-data";
import type { Role } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

interface ForbiddenViewProps {
  requiredRole: Role;
}

export function ForbiddenView({ requiredRole }: ForbiddenViewProps) {
  const { role, setRole } = useApp();

  const roleHomeMap: Record<Role, string> = {
    student: "/student",
    instructor: "/instructor",
    admin: "/admin",
  };

  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <GlassCard className="max-w-xl p-8 md:p-12 border-rose/30">
        <StatusPill tone="bad" className="mb-4">
          Role check failed
        </StatusPill>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-ink">
          This page belongs to the {ROLE_LABELS[requiredRole]} role
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-6">
          Your token carries <span className="font-mono text-jade font-semibold">role: &ldquo;{role}&rdquo;</span>. The route middleware allows <span className="font-mono text-jade font-semibold">[&ldquo;{requiredRole}&rdquo;]</span> only, so the API would answer 403 before any handler runs.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`${roleHomeMap[role]}?role=${role}`}
            className={cn(buttonClass({ variant: "ghost", size: "sm" }))}
          >
            Back to my dashboard
          </Link>
          <button
            onClick={() => setRole(requiredRole)}
            className={cn(buttonClass({ variant: "primary", size: "sm" }))}
          >
            Switch to {ROLE_LABELS[requiredRole]}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
