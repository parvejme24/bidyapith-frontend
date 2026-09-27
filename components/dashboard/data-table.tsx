"use client";

import React, { useMemo, useState } from "react";
import { DashboardIcon } from "@/components/dashboard/icons";
import { GlassCard } from "@/components/site/glass-card";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  render: (row: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableFilter<T> {
  id: string;
  label: string;
  options: FilterOption[];
  match: (row: T, value: string) => boolean;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: TableFilter<T>[];
  pageSize?: number;
  initialSortKey?: string;
  initialSortDir?: "asc" | "desc";
  actions?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKeys = [],
  searchPlaceholder = "Search...",
  filters = [],
  pageSize = 8,
  initialSortKey,
  initialSortDir = "asc",
  actions,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    filters.forEach((f) => {
      init[f.id] = "all";
    });
    return init;
  });

  const [sortKey, setSortKey] = useState<string | null>(initialSortKey || null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialSortDir);
  const [page, setPage] = useState(1);

  // Filter & Search & Sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (search.trim() && searchKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }

    // Custom Filters
    filters.forEach((f) => {
      const selected = filterValues[f.id];
      if (selected && selected !== "all") {
        result = result.filter((row) => f.match(row, selected));
      }
    });

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const x = a[sortKey];
        const y = b[sortKey];
        let cmp = 0;
        if (typeof x === "number" && typeof y === "number") {
          cmp = x - y;
        } else {
          cmp = String(x ?? "").localeCompare(String(y ?? ""));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, searchKeys, filters, filterValues, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleFilterChange = (id: string, val: string) => {
    setFilterValues((prev) => ({ ...prev, [id]: val }));
    setPage(1);
  };

  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/8">
        <div className="flex flex-wrap items-center gap-3 grow">
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-muted focus-within:border-jade/50 focus-within:bg-white/[0.08] min-w-[220px] grow sm:grow-0">
            <DashboardIcon name="search" className="size-4 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
            />
          </label>

          {filters.map((f) => (
            <select
              key={f.id}
              value={filterValues[f.id] || "all"}
              onChange={(e) => handleFilterChange(f.id, e.target.value)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-ink-muted outline-none hover:bg-white/[0.08] focus:border-jade/50 cursor-pointer"
            >
              <option value="all" className="bg-night-800 text-ink">
                {f.label}
              </option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-night-800 text-ink">
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    "px-4 py-3 text-[0.72rem] font-bold uppercase tracking-wider text-ink-faint whitespace-nowrap select-none",
                    col.sortable && "cursor-pointer hover:text-ink transition-colors",
                    col.headerClassName
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="opacity-40 text-xs">
                        {sortKey === col.key ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-white/[0.035]">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3.5 align-middle", col.className)}>
                      {col.render(row, idx)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-ink-faint">
                  <p className="font-display text-lg text-ink mb-1">Nothing matches</p>
                  <p className="text-xs text-ink-muted">Try a different search or filter option.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-white/8 text-xs text-ink-faint">
        <div>
          {processedData.length > 0 ? (
            <span>
              {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length}
            </span>
          ) : (
            <span>0 of 0</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="size-8 rounded-lg border border-white/10 bg-white/[0.04] text-ink-muted flex items-center justify-center hover:text-ink hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, i, arr) => (
              <React.Fragment key={p}>
                {i > 0 && p - arr[i - 1] > 1 && (
                  <span className="px-1 text-ink-faint">…</span>
                )}
                <button
                  onClick={() => setPage(p)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center",
                    currentPage === p
                      ? "bg-jade text-[#052620] font-bold shadow-sm"
                      : "border border-white/10 bg-white/[0.04] text-ink-muted hover:text-ink hover:border-white/20"
                  )}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="size-8 rounded-lg border border-white/10 bg-white/[0.04] text-ink-muted flex items-center justify-center hover:text-ink hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
