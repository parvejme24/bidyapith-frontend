"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Grid,
  Layers,
  LayoutList,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { SectionModal } from "@/components/dashboard/admin/section-modal";
import { DataTable, type ColumnDef } from "@/components/dashboard/data-table";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Meter } from "@/components/dashboard/meter";
import { StatusPill } from "@/components/dashboard/status-pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/app-context";
import type { AdminSection } from "@/lib/app-types";
import { buttonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { CourseStats } from "@/components/dashboard/admin/courses/course-stats";
import { CourseCardGrid } from "@/components/dashboard/admin/courses/course-card-grid";

export default function AdminCoursesPage() {
  const { adminSections, addAdminSection, updateAdminSection, retireAdminSection, term } = useApp();

  // Layout View Switcher: "table" vs "cards"
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

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
  const fillPct = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const handleSaveSection = (sec: AdminSection) => {
    if (modalState.section) {
      updateAdminSection(modalState.section.code, modalState.section.section, sec);
    } else {
      addAdminSection(sec);
    }
  };

  const handleRetire = (code: string, sec: string) => {
    retireAdminSection(code, sec);
    toast.success(`Section ${code} (${sec}) retired`);
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
      label: "Section",
      render: (r) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/5 text-ink font-bold border border-white/10">
          {r.section}
        </span>
      ),
    },
    {
      key: "instructor",
      label: "Faculty",
      sortable: true,
      render: (r) => <span className="text-xs font-medium text-ink">{r.instructor}</span>,
    },
    {
      key: "room",
      label: "Room",
      render: (r) => <span className="font-mono text-xs text-ink-faint">{r.room}</span>,
    },
    {
      key: "enrolled",
      label: "Seat Fill",
      sortable: true,
      render: (r) => (
        <div className="min-w-[130px] space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-ink">
              {r.enrolled} / {r.capacity}
            </span>
            <span className="text-ink-faint text-[0.68rem]">
              {Math.round((r.enrolled / r.capacity) * 100)}%
            </span>
          </div>
          <Meter value={r.enrolled} max={r.capacity} className="h-1.5" />
        </div>
      ),
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
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonClass({ variant: "ghost", size: "sm" }),
              "h-7 px-2 text-xs rounded-md inline-flex items-center gap-1 cursor-pointer"
            )}
          >
            <span>Manage</span>
            <MoreHorizontal className="size-3.5 text-ink-faint" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-lg border border-white/15 bg-night-900/98 p-1.5 shadow-2xl backdrop-blur-2xl text-ink z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <DropdownMenuItem
              onClick={() => setModalState({ open: true, section: r })}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-ink-muted hover:bg-white/[0.08] hover:text-ink font-medium"
            >
              <Layers className="size-3.5 text-jade" />
              <span>Edit Section Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              onClick={() => handleRetire(r.code, r.section)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs cursor-pointer text-rose hover:bg-rose/15 font-medium"
            >
              <Trash2 className="size-3.5" />
              <span>Retire Section</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout
      requiredRole="admin"
      title="Courses & Sections"
      subtitle={`Academic scheduling & section allocation ledger · ${term}`}
      actions={
        <div className="flex items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-white/10 bg-white/[0.04]">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
              title="Table View"
            >
              <LayoutList className="size-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                viewMode === "cards"
                  ? "bg-jade text-night-900 font-bold shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
              title="Card Grid View"
            >
              <Grid className="size-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setModalState({ open: true, section: null })}
            className={cn(buttonClass({ variant: "primary", size: "sm" }), "text-xs flex items-center gap-1.5 cursor-pointer shadow-sm")}
          >
            <Plus className="size-3.5" />
            <span>Add Section</span>
          </button>
        </div>
      }
    >
      {/* 4 Metric Tiles */}
      <CourseStats
        totalSections={adminSections.length}
        totalCapacity={totalCapacity}
        totalEnrolled={totalEnrolled}
        fullCount={fullCount}
        fillPct={fillPct}
        termName={term?.name}
      />

      {/* Main Content Area: Table vs Cards */}
      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={adminSections}
          searchKeys={["code", "title", "instructor", "room"]}
          searchPlaceholder="Search courses, instructors, rooms..."
          pageSize={10}
          filters={[
            {
              id: "status",
              label: "All Statuses",
              options: [
                { value: "open", label: "Open" },
                { value: "full", label: "Full" },
                { value: "retired", label: "Retired" },
              ],
              match: (r, v) => r.status === v,
            },
          ]}
        />
      ) : (
        <CourseCardGrid
          sections={adminSections}
          search={search}
          setSearch={setSearch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onEditSection={(sec) => setModalState({ open: true, section: sec })}
          onRetireSection={handleRetire}
        />
      )}

      {/* Section Create / Edit Modal */}
      <SectionModal
        isOpen={modalState.open}
        section={modalState.section}
        onClose={() => setModalState({ open: false, section: null })}
        onSave={handleSaveSection}
        onRetire={handleRetire}
      />
    </DashboardLayout>
  );
}
