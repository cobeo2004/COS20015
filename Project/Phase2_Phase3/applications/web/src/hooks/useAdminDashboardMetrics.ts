import { useQuery } from "@tanstack/react-query";
import { AdminMetricsRepository } from "../lib/repositories/admin-metrics";
import type { AdminMetrics, RecentActivity } from "../lib/repositories/admin-metrics";

export function useAdminDashboardMetrics() {
  return useQuery<AdminMetrics>({
    queryKey: ['adminDashboardMetrics'],
    queryFn: () => AdminMetricsRepository.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRecentActivity() {
  return useQuery<RecentActivity[]>({
    queryKey: ['recentActivity'],
    queryFn: () => AdminMetricsRepository.getRecentActivity(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
