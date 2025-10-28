import { useQuery } from "@tanstack/react-query";
import { PlayerDashboardRepository } from "../lib/repositories/player-dashboard";
import type { PlayerDashboardData } from "../lib/repositories/player-dashboard";

export function usePlayerDashboard(playerId: string) {
  return useQuery<PlayerDashboardData>({
    queryKey: ['playerDashboard', playerId],
    queryFn: () => PlayerDashboardRepository.getPlayerDashboard(playerId),
    enabled: !!playerId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
