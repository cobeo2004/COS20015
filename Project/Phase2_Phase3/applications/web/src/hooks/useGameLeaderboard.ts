import { useQuery } from "@tanstack/react-query";
import { GameLeaderboardsRepository } from "../lib/repositories/game-leaderboards";
import type { LeaderboardWithEntities } from "../lib/types/game-details";

/**
 * Hook to fetch leaderboard for a specific game
 * @param gameId - The ID of the game
 */
export const useGameLeaderboard = (gameId: string) => {
  return useQuery<LeaderboardWithEntities | null>({
    queryKey: ["gameLeaderboard", gameId],
    queryFn: () => GameLeaderboardsRepository.getGameLeaderboard(gameId),
    enabled: !!gameId,
    staleTime: 2 * 60 * 1000, // 2 minutes (leaderboards change more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch top players for a specific game
 * @param gameId - The ID of the game
 * @param limit - Number of top players to fetch
 */
export const useGameTopPlayers = (gameId: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["gameTopPlayers", gameId, limit],
    queryFn: () => GameLeaderboardsRepository.getTopPlayers(gameId, limit),
    enabled: !!gameId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch player's rank in a specific game
 * @param gameId - The ID of the game
 * @param playerId - The ID of the player
 */
export const usePlayerGameRank = (gameId: string, playerId: string) => {
  return useQuery({
    queryKey: ["playerGameRank", gameId, playerId],
    queryFn: () => GameLeaderboardsRepository.getPlayerRank(gameId, playerId),
    enabled: !!gameId && !!playerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch leaderboard statistics for a game
 * @param gameId - The ID of the game
 */
export const useGameLeaderboardStats = (gameId: string) => {
  return useQuery({
    queryKey: ["gameLeaderboardStats", gameId],
    queryFn: () => GameLeaderboardsRepository.getLeaderboardStats(gameId),
    enabled: !!gameId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
