import { useQuery } from "@tanstack/react-query";
import { PlayerAchievementsRepository } from "../lib/repositories/player-achievements-repo";
import type { PlayerAchievementsData } from "../lib/repositories/player-achievements-repo";

export function usePlayerAchievements(playerId: string) {
  return useQuery<PlayerAchievementsData>({
    queryKey: ['playerAchievements', playerId],
    queryFn: () => PlayerAchievementsRepository.getPlayerAchievements(playerId),
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
