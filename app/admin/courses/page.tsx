"use client";

import React, { useState } from "react";
import { SectionModal } from "@/components/dashboard/admin/section-modal";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardIcon } from "@/components/dashboard/icons";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Meter } from "@/components/dashboard/meter";
import { StatTile } from "@/components/dashboard/stat-tile";
import { StatusPill } from "@/components/dashboard/status-pill";
import { useApp } from "@/lib/app-context";
import type { AdminSection } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export default function AdminCoursesPage() {
  const { adminSections, addAdminSection, updateAdminSection, retireAdminSection, term } = useApp();
  const [modalState, setModalState] = useState<{
    open: boolean;
    section: AdminSection | null;
  }>({
    open: false,
    section: null,
  });

  const totalCapacity = adminSections.reduce((s, x) => s + x.capacity, 0);
  const totalEnrolled = adminSections.reduce((s, x) => s + x.enrolled, 0);
  const fullCount = adminSections.filter((s) => s.status === "full").length;
  const retiredCount = adminSections.filter((s) => s.status === "retired").length;
  const fillPct = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const handleSaveSection = (sec: AdminSection) => {
    if (modalState.section) {
      updateAdminSection(modalState.section.code, modalState.section.section, sec);
    } else {
      addAdminSection(sec);
    }
  };

  const columns: ColumnDef<AdminSection>[] = [
    {
      key: "code",
      label: "Course",
      sortable: true,
      render: (r) => (
        <div>
          <span className="font-mono text-xs font-bold text-jade block">{r.code}</span>
          <span className="text-xs text-ink-faint mt-0.5 block truncate max-w-[200px]">
            {r.title}
          </span>
        </div>
      ),
    },
    {
      key: "section",
      label: "Sec",
      render: (r) => <span className="font-mono text-xs text-ink">{r.section}</span>,
    },
    {
      key: "instructor",
      label: "Instructor",
      sortable: true,
      render: (r) => <span className="text-xs text-ink">{r.instructor}</span>,
    },
    {
      key: "room",
      label: "Room",
      render: (r) => <span className="font-mono text-xs text-ink-faint">{r.room}</span>,
    },
    {
      key: "enrolled",
      label: "Seats",
      sortable: true,
      render: (r) => {
        const pct = r.capacity > 0 ? Math.round((r.enrolled / r.capacity) * 100) : 0;
        return (
          <div className="flex items-center gap-3 min-w-[140px]">
            <Meter value={r.enrolled} max={r.capacity} className="h-1.5 grow" />
            <span className="font-mono text-xs text-ink">
              {r.enrolled}/{r.capacity}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <StatusPill tone={r.status === "open" ? "ok" : r.status === "full" ? "warn" : "mute"}>
          {r.status}
        </StatusPill>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (r) => (
        <button
          onClick={() => setModalState({ open: true, section: r })}
          className={cn(buttonClass({ variant: "ghost", size: "sm" }), "text-xs")}
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Courses & Sections"
      subtitle={`${adminSections.length} sections in ${term.name}`}
      requiredRole="admin"
      crumb="Admin / Operations"
      actions={
        <button
          onClick={() => setModalState({ open: true, section: null })}
          className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs")}
        >
          <DashboardIcon name="plus" className="size-3.5" />
          <span>New section</span>
        </button>
      }
    >
      {/* 4 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Sections"
          value={adminSections.length}
          detail="Fall 2026 term"
        />
        <StatTile
          label="Full Sections"
          value={fullCount}
          detail="At maximum capacity"
          tone={fullCount > 0 ? "down" : "up"}
        />
        <StatTile
          label="Seats Filled"
          value={`${fillPct}%`}
          detail="Across all active sections"
        />
        <StatTile
          label="Retired Sections"
          value={retiredCount}
          detail="Soft-deleted, queryable"
        />
      </div>

      {/* Sections Table */}
      <DataTable
        columns={columns}
        data={adminSections}
        searchKeys={["code", "title", "instructor", "room"]}
        searchPlaceholder="Search code, title or instructor..."
        pageSize={8}
        initialSortKey="code"
        filters={[
          {
            id: "status",
            label: "All statuses",
            options: [
              { value: "open", label: "Open" },
              { value: "full", label: "Full" },
              { value: "retired", label: "Retired" },
            ],
            match: (r, v) => r.status === v,
          },
        ]}
      />

      {/* Section Create/Edit Modal */}
      {modalState.open && (
        <SectionModal
          section={modalState.section}
          isOpen={modalState.open}
          onClose={() => setModalState({ open: false, section: null })}
          onSave={handleSaveSection}
          onRetire={retireAdminSection}
        />
      )}
    </DashboardLayout>
  );
}
