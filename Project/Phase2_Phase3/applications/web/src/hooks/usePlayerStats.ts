import { useQuery } from "@tanstack/react-query";
import { PlayerStatsRepository } from "../lib/repositories/player-stats";
import type { PlayerStats } from "../lib/repositories/player-stats";

export function usePlayerStats(playerId: string) {
  return useQuery<PlayerStats>({
    queryKey: ['playerStats', playerId],
    queryFn: () => PlayerStatsRepository.getPlayerStats(playerId),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
