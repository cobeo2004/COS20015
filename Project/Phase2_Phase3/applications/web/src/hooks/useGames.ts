import { useQuery } from "@tanstack/react-query";
import { GamesRepository } from "../lib/repositories";

export interface GameFilters {
  searchTerm?: string;
  genre?: "RPG" | "FPS" | "Strategy" | "Puzzle" | "Sports";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
  developerId?: string;
  sortBy?: "title" | "price" | "average_rating" | "release_date";
  sortOrder?: "asc" | "desc";
}

export const useGames = (filters?: GameFilters) => {
  return useQuery({
    queryKey: ["games", filters],
    queryFn: () => {
      // If no filters provided, get all games
      if (!filters || Object.keys(filters).length === 0) {
        return GamesRepository.getAllGames();
      }

      // If only search term is provided, use search method
      if (filters.searchTerm && Object.keys(filters).length === 1) {
        return GamesRepository.searchGames(filters.searchTerm);
      }

      // If search term is provided with other filters, use search and then apply other filters
      if (filters.searchTerm) {
        return GamesRepository.searchGames(filters.searchTerm).then(
          (searchResults) => {
            return searchResults;
          }
        );
      }

      // Map our filter interface to the repository's filter interface
      const repoFilters = {
        genre: filters.genre,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        tags: filters.tags,
        developerId: filters.developerId,
      };

      // Otherwise use advanced filters
      return GamesRepository.advancedFilter(repoFilters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for debounced search functionality
export const useGamesSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["games", "search", searchTerm],
    queryFn: () => {
      if (!searchTerm.trim()) {
        return GamesRepository.getAllGames();
      }
      return GamesRepository.searchGames(searchTerm);
    },
    enabled: true, // Always enabled
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
