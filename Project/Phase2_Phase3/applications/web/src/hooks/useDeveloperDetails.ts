import { useQuery } from "@tanstack/react-query";
import { DevelopersRepository } from "../lib/repositories/developers";
import { GamesRepository } from "../lib/repositories/games";

/**
 * Hook to fetch a single developer with metadata
 * @param developerId - The ID of the developer to fetch
 */
export const useDeveloperDetails = (developerId: string) => {
  return useQuery({
    queryKey: ["developer", developerId],
    queryFn: () => DevelopersRepository.getDeveloperById(developerId),
    enabled: !!developerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch all games by a specific developer
 * @param developerId - The ID of the developer
 */
export const useDeveloperGames = (developerId: string) => {
  return useQuery({
    queryKey: ["developerGames", developerId],
    queryFn: () => GamesRepository.getGamesByDeveloper(developerId),
    enabled: !!developerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
