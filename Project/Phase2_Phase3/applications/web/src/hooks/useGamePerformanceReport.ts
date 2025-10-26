/**
 * Custom hook for Game Performance Report
 * Uses TanStack Query v5 for data fetching and caching
 */

import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { HybridQueryService } from '../lib/services/HybridQueryService';
import type {
  GamePerformanceReport,
  GamePerformanceFilters,
  GamePerformanceSortField,
  SortDirection
} from '../lib/types/hybrid-data';

/**
 * Hook for fetching game performance report data
 */
export function useGamePerformanceReport(
  filters?: GamePerformanceFilters,
  options?: Omit<UseQueryOptions<GamePerformanceReport[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['gamePerformanceReport', filters],
    queryFn: () => HybridQueryService.getGamePerformanceReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v4)
    ...options
  });
}

/**
 * Hook with client-side sorting
 */
export function useGamePerformanceReportSorted(
  filters?: GamePerformanceFilters,
  sortField?: GamePerformanceSortField,
  sortDirection: SortDirection = 'desc'
) {
  const query = useGamePerformanceReport(filters);

  const sortedData = query.data ? sortReportData(query.data, sortField, sortDirection) : undefined;

  return {
    ...query,
    data: sortedData
  };
}

/**
 * Helper function to sort report data
 */
function sortReportData(
  data: GamePerformanceReport[],
  sortField?: GamePerformanceSortField,
  sortDirection: SortDirection = 'desc'
): GamePerformanceReport[] {
  if (!sortField) return data;

  return [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle undefined/null values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    // Handle arrays (like tags)
    if (Array.isArray(aValue)) aValue = aValue.length;
    if (Array.isArray(bValue)) bValue = bValue.length;

    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Hook for report statistics
 */
export function useGamePerformanceStats(filters?: GamePerformanceFilters) {
  const { data } = useGamePerformanceReport(filters);

  if (!data || data.length === 0) {
    return {
      totalGames: 0,
      totalRevenue: 0,
      avgRating: 0,
      totalPlayers: 0,
      totalPlaytime: 0
    };
  }

  const stats = {
    totalGames: data.length,
    totalRevenue: data.reduce((sum, game) => sum + game.total_revenue, 0),
    avgRating: data.reduce((sum, game) => sum + (game.average_rating || 0), 0) / data.filter(g => g.average_rating).length,
    totalPlayers: data.reduce((sum, game) => sum + game.unique_players, 0),
    totalPlaytime: data.reduce((sum, game) => sum + game.total_playtime_hours, 0)
  };

  return stats;
}
