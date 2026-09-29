"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import type { SearchItem } from "./search/types";
import {
  getAdminSearchCatalog,
  getInstructorSearchCatalog,
  getSearchPlaceholder,
  getStudentSearchCatalog,
} from "./search/search-catalog";
import { SearchResultItem } from "./search/search-result-item";

export function SearchPortal() {
  const router = useRouter();
  const {
    role,
    searchQuery,
    setSearchQuery,
    student,
    instructorSections,
    adminSections,
    adminPayments,
  } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInputMobileRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputMobileRef.current?.focus();
        setSearchFocused(true);
      } else if (e.key === "Escape") {
        setSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Role-tailored dynamic search catalog
  const allSearchItems: SearchItem[] = useMemo(() => {
    switch (role) {
      case "student":
        return getStudentSearchCatalog(student?.enrolled || []);
      case "instructor":
        return getInstructorSearchCatalog(instructorSections || []);
      case "admin":
        return getAdminSearchCatalog(adminSections || [], adminPayments || []);
      default:
        return [];
    }
  }, [role, student?.enrolled, instructorSections, adminSections, adminPayments]);

  const searchPlaceholder = useMemo(() => getSearchPlaceholder(role), [role]);

  // Filtered search results
  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allSearchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allSearchItems]);

  const handleSelectResult = (href: string) => {
    setSearchFocused(false);
    setSearchQuery("");
    router.push(href);
  };

  const displayedItems = searchQuery ? filteredResults : allSearchItems.slice(0, 8);

  const headingLabel = searchQuery
    ? `Results for "${searchQuery}"`
    : role === "student"
    ? "Student Quick Access"
    : role === "instructor"
    ? "Faculty Directory & Routine"
    : "Admin Directory & Ledger";

  return (
    <div className="relative" ref={searchContainerRef}>
      {/* Desktop / Tablet Search Input */}
      <div
        className={cn(
          "hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-muted transition-all min-w-[180px] md:min-w-[220px] lg:min-w-[260px]",
          searchFocused && "border-jade/50 bg-white/[0.08] ring-2 ring-jade/20"
        )}
      >
        <Search className="size-3.5 text-ink-faint shrink-0" />
        <input
          ref={searchInputRef}
          value={searchQuery}
          onFocus={() => setSearchFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-xs text-ink placeholder:text-ink-faint outline-none"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="size-4 text-ink-faint hover:text-ink flex items-center justify-center cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[0.62rem] font-mono text-ink-faint bg-white/5 border border-white/10 rounded">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Mobile Search Trigger Button (< sm) */}
      <button
        type="button"
        onClick={() => {
          setSearchFocused(true);
          setTimeout(() => searchInputMobileRef.current?.focus(), 50);
        }}
        className="sm:hidden size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Search portal"
      >
        <Search className="size-4" />
      </button>

      {/* Live Search Results Dropdown */}
      {searchFocused && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:left-auto sm:top-full sm:mt-2.5 sm:w-[480px] md:w-[540px] max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="rounded-xl border border-white/20 bg-night-900/98 backdrop-blur-2xl p-2.5 sm:p-3.5 shadow-2xl max-h-[85vh] sm:max-h-[500px] flex flex-col">
            {/* Mobile Search Input Bar */}
            <div className="sm:hidden flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-ink mb-2">
              <Search className="size-4 text-jade shrink-0" />
              <input
                ref={searchInputMobileRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="size-6 text-ink-faint hover:text-ink flex items-center justify-center cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchFocused(false)}
                className="text-xs font-semibold text-jade hover:underline pl-1 cursor-pointer"
              >
                Done
              </button>
            </div>

            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-white/10 text-xs shrink-0">
              <span className="font-semibold text-ink-faint uppercase tracking-wider text-[0.68rem] truncate mr-2">
                {headingLabel}
              </span>
              <span className="text-[0.65rem] text-ink-faint font-mono shrink-0">
                {filteredResults.length > 0 ? `${filteredResults.length} matches` : "Live index"}
              </span>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto space-y-1 pr-1 flex-1 overscroll-contain">
              {displayedItems.map((item) => (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelectResult}
                />
              ))}

              {searchQuery && filteredResults.length === 0 && (
                <div className="py-8 text-center text-xs text-ink-muted">
                  <Search className="size-6 text-ink-faint mx-auto mb-2 opacity-50" />
                  <p>No matching portal records found for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-ink-faint text-[0.7rem] mt-1">
                    Try searching for course codes (CSE-2201), student IDs, or section titles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
