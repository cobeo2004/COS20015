import { useQuery } from "@tanstack/react-query";
import { PlayerAchievementsRepository, type AchievementFilters } from "../lib/repositories/player-achievements-repo";
import type { PlayerAchievementsData } from "../lib/repositories/player-achievements-repo";

export function usePlayerAchievements(playerId: string, filters?: AchievementFilters) {
  return useQuery<PlayerAchievementsData>({
    queryKey: ['playerAchievements', playerId, filters],
    queryFn: () => PlayerAchievementsRepository.getPlayerAchievements(playerId, filters),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
