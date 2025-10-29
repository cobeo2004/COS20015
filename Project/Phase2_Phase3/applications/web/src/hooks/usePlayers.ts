import { useQuery } from "@tanstack/react-query";
import { PlayersRepository, type PlayerFilters } from "../lib/repositories/players";

export function usePlayers(filters?: PlayerFilters) {
  return useQuery({
    queryKey: ['players', filters],
    queryFn: () => {
      // If no filters provided, get all players
      if (!filters || Object.keys(filters).length === 0) {
        return PlayersRepository.getAllPlayers();
      }

      // If only search term is provided, use search method
      if (filters.searchTerm && Object.keys(filters).length === 1) {
        return PlayersRepository.searchPlayers(filters.searchTerm);
      }

      // Otherwise use advanced filters
      return PlayersRepository.advancedPlayerFilters(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for debounced search functionality
export function usePlayersSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['players', 'search', searchTerm],
    queryFn: () => {
      if (!searchTerm.trim()) {
        return PlayersRepository.getAllPlayers();
      }
      return PlayersRepository.searchPlayers(searchTerm);
    },
    enabled: true, // Always enabled, will return all players if searchTerm is empty
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
