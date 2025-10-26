/**
 * Custom hook for Developer Success Report
 * Uses TanStack Query v5 for data fetching and caching
 */

import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { HybridQueryService } from '../lib/services/HybridQueryService';
import type {
  DeveloperSuccessReport,
  DeveloperSuccessFilters,
  DeveloperSuccessSortField,
  SortDirection
} from '../lib/types/hybrid-data';

/**
 * Hook for fetching developer success report data
 */
export function useDeveloperSuccessReport(
  filters?: DeveloperSuccessFilters,
  options?: Omit<UseQueryOptions<DeveloperSuccessReport[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['developerSuccessReport', filters],
    queryFn: () => HybridQueryService.getDeveloperSuccessReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options
  });
}

/**
 * Hook with client-side sorting
 */
export function useDeveloperSuccessReportSorted(
  filters?: DeveloperSuccessFilters,
  sortField?: DeveloperSuccessSortField,
  sortDirection: SortDirection = 'desc'
) {
  const query = useDeveloperSuccessReport(filters);

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
  data: DeveloperSuccessReport[],
  sortField?: DeveloperSuccessSortField,
  sortDirection: SortDirection = 'desc'
): DeveloperSuccessReport[] {
  if (!sortField) return data;

  return [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle undefined/null values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    // Handle arrays (like specialties)
    if (Array.isArray(aValue)) aValue = aValue.length;
    if (Array.isArray(bValue)) bValue = bValue.length;

    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Hook for developer statistics
 */
export function useDeveloperSuccessStats(filters?: DeveloperSuccessFilters) {
  const { data } = useDeveloperSuccessReport(filters);

  if (!data || data.length === 0) {
    return {
      totalDevelopers: 0,
      totalGames: 0,
      totalRevenue: 0,
      avgGamesPerDeveloper: 0,
      avgRevenuePerDeveloper: 0,
      avgGameRating: 0,
      companySizeDistribution: {
        indie: 0,
        small: 0,
        medium: 0,
        large: 0,
        enterprise: 0,
        unknown: 0
      }
    };
  }

  // Company size distribution
  const sizeMap: Record<string, keyof typeof sizeDistribution> = {
    'Indie (1-10)': 'indie',
    'Small (11-50)': 'small',
    'Medium (51-200)': 'medium',
    'Large (200-500)': 'large',
    'Enterprise (500+)': 'enterprise'
  };

  const sizeDistribution = {
    indie: 0,
    small: 0,
    medium: 0,
    large: 0,
    enterprise: 0,
    unknown: 0
  };

  data.forEach(dev => {
    if (dev.company_size && dev.company_size in sizeMap) {
      const key = sizeMap[dev.company_size];
      sizeDistribution[key]++;
    } else {
      sizeDistribution.unknown++;
    }
  });

  const totalGames = data.reduce((sum, d) => sum + d.total_games, 0);
  const totalRevenue = data.reduce((sum, d) => sum + d.total_revenue, 0);
  const devsWithRatings = data.filter(d => d.avg_game_rating > 0);
  const avgRating = devsWithRatings.length > 0
    ? devsWithRatings.reduce((sum, d) => sum + d.avg_game_rating, 0) / devsWithRatings.length
    : 0;

  const stats = {
    totalDevelopers: data.length,
    totalGames,
    totalRevenue,
    avgGamesPerDeveloper: totalGames / data.length,
    avgRevenuePerDeveloper: totalRevenue / data.length,
    avgGameRating: avgRating,
    companySizeDistribution: sizeDistribution
  };

  return stats;
}

/**
 * Hook for top performing developers
 */
export function useTopDevelopers(limit: number = 10, sortBy: 'revenue' | 'games' | 'rating' = 'revenue') {
  const { data, ...rest } = useDeveloperSuccessReport();

  let topDevelopers = data ? [...data] : [];

  // Sort based on criteria
  if (sortBy === 'revenue') {
    topDevelopers = topDevelopers.sort((a, b) => b.total_revenue - a.total_revenue);
  } else if (sortBy === 'games') {
    topDevelopers = topDevelopers.sort((a, b) => b.total_games - a.total_games);
  } else if (sortBy === 'rating') {
    topDevelopers = topDevelopers.sort((a, b) => b.avg_game_rating - a.avg_game_rating);
  }

  // Limit results
  topDevelopers = topDevelopers.slice(0, limit);

  return {
    data: topDevelopers,
    ...rest
  };
}
