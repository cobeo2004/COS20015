import { useQuery } from "@tanstack/react-query";
import { GameAchievementsRepository } from "../lib/repositories/game-achievements";
import type { AchievementWithStatus } from "../lib/types/game-details";

/**
 * Hook to fetch achievements for a specific game with player unlock status
 * When playerId is provided, returns achievements with unlock status
 * @param gameId - The ID of the game
 * @param playerId - The ID of the player (required)
 */
export const useGameAchievements = (gameId: string, playerId?: string) => {
  return useQuery<AchievementWithStatus[]>({
    queryKey: ["gameAchievements", gameId, playerId],
    queryFn: () => {
      if (playerId) {
        return GameAchievementsRepository.getGameAchievementsWithPlayerStatus(gameId, playerId);
      }
      // If no playerId, still return the achievements but without unlock status
      // We'll transform them to match the expected type
      return GameAchievementsRepository.getGameAchievements(gameId).then(achievements =>
        achievements.map(achievement => ({
          ...achievement,
          isUnlocked: false,
          unlocked_at: null,
        }))
      );
    },
    enabled: !!gameId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch achievement statistics for a game
 * @param gameId - The ID of the game
 * @param playerId - The ID of the player
 */
export const useGameAchievementStats = (gameId: string, playerId: string) => {
  return useQuery({
    queryKey: ["gameAchievementStats", gameId, playerId],
    queryFn: () => GameAchievementsRepository.getGameAchievementStats(gameId, playerId),
    enabled: !!gameId && !!playerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
