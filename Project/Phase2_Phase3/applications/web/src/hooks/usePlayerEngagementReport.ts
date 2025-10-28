/**
 * Custom hook for Player Engagement Report
 * Uses TanStack Query v5 for data fetching and caching
 */

import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { HybridQueryService } from "../lib/services/HybridQueryService";
import type {
  PlayerEngagementReport,
  PlayerEngagementFilters,
  PlayerEngagementSortField,
  SortDirection,
} from "../lib/types/hybrid-data";

/**
 * Hook for fetching player engagement report data
 */
export function usePlayerEngagementReport(
  filters?: PlayerEngagementFilters,
  options?: Omit<
    UseQueryOptions<PlayerEngagementReport[]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: ["playerEngagementReport", filters],
    queryFn: () => HybridQueryService.getPlayerEngagementReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Hook with client-side sorting
 */
export function usePlayerEngagementReportSorted(
  filters?: PlayerEngagementFilters,
  sortField?: PlayerEngagementSortField,
  sortDirection: SortDirection = "desc"
) {
  const query = usePlayerEngagementReport(filters);

  const sortedData = query.data
    ? sortReportData(query.data, sortField, sortDirection)
    : undefined;

  return {
    ...query,
    data: sortedData,
  };
}

/**
 * Helper function to sort report data
 */
function sortReportData(
  data: PlayerEngagementReport[],
  sortField?: PlayerEngagementSortField,
  sortDirection: SortDirection = "desc"
): PlayerEngagementReport[] {
  if (!sortField) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle undefined/null values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    // Compare values
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Hook for engagement statistics
 */
export function usePlayerEngagementStats(filters?: PlayerEngagementFilters) {
  const { data } = usePlayerEngagementReport(filters);

  if (!data || data.length === 0) {
    return {
      totalPlayers: 0,
      avgLevel: 0,
      avgPlaytime: 0,
      avgRetention: 0,
      avgAchievements: 0,
      privacyDistribution: {
        public: 0,
        friends: 0,
        private: 0,
        unknown: 0,
      },
      themeDistribution: {
        light: 0,
        dark: 0,
        auto: 0,
        unknown: 0,
      },
    };
  }

  // Privacy distribution
  const privacyDist = {
    public: data.filter((p) => p.privacy === "public").length,
    friends: data.filter((p) => p.privacy === "friends").length,
    private: data.filter((p) => p.privacy === "private").length,
    unknown: data.filter((p) => !p.privacy).length,
  };

  // Theme distribution
  const themeDist = {
    light: data.filter((p) => p.theme === "light").length,
    dark: data.filter((p) => p.theme === "dark").length,
    auto: data.filter((p) => p.theme === "auto").length,
    unknown: data.filter((p) => !p.theme).length,
  };

  const stats = {
    totalPlayers: data.length,
    avgLevel: data.reduce((sum, p) => sum + p.level, 0) / data.length,
    avgPlaytime:
      data.reduce((sum, p) => sum + p.total_playtime_hours, 0) / data.length,
    avgRetention:
      data.reduce((sum, p) => sum + p.retention_score, 0) / data.length,
    avgAchievements:
      data.reduce((sum, p) => sum + p.achievements_unlocked, 0) / data.length,
    privacyDistribution: privacyDist,
    themeDistribution: themeDist,
  };

  return stats;
}

/**
 * Hook for active players (high retention)
 */
export function useActivePlayers(minRetentionScore: number = 70) {
  const { data, ...rest } = usePlayerEngagementReport();

  const activePlayers = data?.filter(
    (p) => p.retention_score >= minRetentionScore
  );

  return {
    data: activePlayers,
    ...rest,
  };
}

/**
 * Hook for at-risk players (low retention)
 */
export function useAtRiskPlayers(maxRetentionScore: number = 30) {
  const { data, ...rest } = usePlayerEngagementReport();

  const atRiskPlayers = data?.filter(
    (p) => p.retention_score <= maxRetentionScore
  );

  return {
    data: atRiskPlayers,
    ...rest,
  };
}
