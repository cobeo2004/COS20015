import { useQuery } from "@tanstack/react-query";
import { GamesRepository } from "../lib/repositories";

/**
 * Hook to fetch a single game with developer information
 * @param gameId - The ID of the game to fetch
 */
export const useGameDetails = (gameId: string) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => GamesRepository.getGameWithDeveloper(gameId),
    enabled: !!gameId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
