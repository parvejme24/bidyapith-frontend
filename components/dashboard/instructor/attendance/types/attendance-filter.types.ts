export type DailyStatusFilter = "all" | "P" | "L" | "A" | "unmarked" | "atRisk";
export type MonthlyStatusFilter = "all" | "good" | "atRisk";
export type SortOption = "id_asc" | "id_desc" | "name_asc" | "att_desc" | "att_asc";

export interface DailyStatusCounts {
  total: number;
  present: number;
  late: number;
  absent: number;
  unmarked: number;
  atRisk: number;
}

export interface AttendanceFilterBarProps {
  viewMode: "daily" | "monthly";
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Batch
  batches: string[];
  batchCounts: Record<string, number>;
  selectedBatch: string;
  onSelectBatch: (batch: string) => void;
  // Daily Status Filter
  dailyStatusFilter: DailyStatusFilter;
  onSelectDailyStatusFilter: (filter: DailyStatusFilter) => void;
  dailyStatusCounts?: DailyStatusCounts;
  // Monthly Status Filter
  monthlyStatusFilter: MonthlyStatusFilter;
  onSelectMonthlyStatusFilter: (filter: MonthlyStatusFilter) => void;
  // Sorting
  sortBy: SortOption;
  onSelectSortBy: (sort: SortOption) => void;
  // Counts & Quick Actions
  totalStudents: number;
  filteredCount: number;
  onClearFilters: () => void;
  onMarkFilteredPresent?: () => void;
  isHoliday?: boolean;
}
