"use client";

import { useEffect, useMemo, useState } from "react";
import type { RosterStudent } from "@/lib/app-types";
import type { AttendanceStats } from "./attendance-types";
import type {
  DailyStatusFilter,
  MonthlyStatusFilter,
  SortOption,
} from "./attendance-filter-bar";

interface UseAttendanceFilterProps {
  currentRoster: RosterStudent[];
  viewMode: "daily" | "monthly";
  dailyAttendance: Record<string, "P" | "L" | "A">;
  studentStatsMap: Record<string, AttendanceStats>;
}

export function useAttendanceFilter({
  currentRoster,
  viewMode,
  dailyAttendance,
  studentStatsMap,
}: UseAttendanceFilterProps) {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dailyStatusFilter, setDailyStatusFilter] = useState<DailyStatusFilter>("all");
  const [monthlyStatusFilter, setMonthlyStatusFilter] = useState<MonthlyStatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("id_asc");

  // Available batches in current section
  const availableBatches = useMemo(() => {
    const set = new Set<string>();
    currentRoster.forEach((student) => {
      const batch = student.batch || student.id.split("-")[0];
      if (batch && /^\d{4}$/.test(batch)) {
        set.add(batch);
      }
    });
    return Array.from(set).sort();
  }, [currentRoster]);

  // Keep selectedBatch synced to the first available batch of the assigned section
  useEffect(() => {
    if (availableBatches.length > 0 && (!selectedBatch || !availableBatches.includes(selectedBatch))) {
      setSelectedBatch(availableBatches[0]);
    }
  }, [availableBatches, selectedBatch]);

  // Batch counts map
  const batchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    currentRoster.forEach((student) => {
      const batch = student.batch || student.id.split("-")[0];
      if (batch) {
        counts[batch] = (counts[batch] || 0) + 1;
      }
    });
    return counts;
  }, [currentRoster]);

  // Daily status counts for dropdown badges
  const dailyStatusCounts = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let atRisk = 0;
    currentRoster.forEach((st) => {
      const mark = dailyAttendance[st.id];
      if (mark === "P") present++;
      else if (mark === "L") late++;
      else if (mark === "A") absent++;
      const stats = studentStatsMap[st.id];
      const rate = stats ? stats.ratePct : st.att;
      if (rate < 75) atRisk++;
    });
    const unmarked = currentRoster.length - (present + late + absent);
    return {
      total: currentRoster.length,
      present,
      late,
      absent,
      unmarked,
      atRisk,
    };
  }, [currentRoster, dailyAttendance, studentStatsMap]);

  // Filtered & Sorted student roster (strictly scoped to teacher's assigned batch)
  const filteredRoster = useMemo(() => {
    const activeBatch = selectedBatch || availableBatches[0] || "";
    let list = currentRoster.filter((st) => {
      // 1. Batch filter: strictly show teacher's selected assigned batch
      if (activeBatch) {
        const studentBatch = st.batch || st.id.split("-")[0];
        if (studentBatch !== activeBatch) return false;
      }

      // 2. Search query (name or student ID)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = st.name.toLowerCase().includes(query);
        const matchesId = st.id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      // 3. Status filter
      if (viewMode === "daily") {
        const mark = dailyAttendance[st.id];
        const stats = studentStatsMap[st.id];
        const rate = stats ? stats.ratePct : st.att;

        if (dailyStatusFilter === "P" && mark !== "P") return false;
        if (dailyStatusFilter === "L" && mark !== "L") return false;
        if (dailyStatusFilter === "A" && mark !== "A") return false;
        if (dailyStatusFilter === "unmarked" && mark !== undefined) return false;
        if (dailyStatusFilter === "atRisk" && rate >= 75) return false;
      } else {
        const stats = studentStatsMap[st.id];
        const rate = stats ? stats.ratePct : st.att;
        if (monthlyStatusFilter === "good" && rate < 75) return false;
        if (monthlyStatusFilter === "atRisk" && rate >= 75) return false;
      }

      return true;
    });

    // 4. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "id_asc") return a.id.localeCompare(b.id);
      if (sortBy === "id_desc") return b.id.localeCompare(a.id);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "att_desc") {
        const rateA = studentStatsMap[a.id]?.ratePct ?? a.att;
        const rateB = studentStatsMap[b.id]?.ratePct ?? b.att;
        return rateB - rateA;
      }
      if (sortBy === "att_asc") {
        const rateA = studentStatsMap[a.id]?.ratePct ?? a.att;
        const rateB = studentStatsMap[b.id]?.ratePct ?? b.att;
        return rateA - rateB;
      }
      return 0;
    });

    return list;
  }, [
    currentRoster,
    selectedBatch,
    availableBatches,
    searchQuery,
    viewMode,
    dailyStatusFilter,
    dailyAttendance,
    studentStatsMap,
    monthlyStatusFilter,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setDailyStatusFilter("all");
    setMonthlyStatusFilter("all");
    setSortBy("id_asc");
  };

  return {
    selectedBatch,
    setSelectedBatch,
    searchQuery,
    setSearchQuery,
    dailyStatusFilter,
    setDailyStatusFilter,
    monthlyStatusFilter,
    setMonthlyStatusFilter,
    sortBy,
    setSortBy,
    availableBatches,
    batchCounts,
    dailyStatusCounts,
    filteredRoster,
    handleClearFilters,
  };
}
