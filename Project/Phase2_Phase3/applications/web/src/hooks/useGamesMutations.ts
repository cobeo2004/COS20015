import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GamesRepository } from "../lib/repositories";
import type { Database } from "../lib/supabase/generated";

/**
 * Hook for creating a new game
 */
export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameData: Database["public"]["Tables"]["games"]["Insert"]) =>
      GamesRepository.createGame(gameData),
    onSuccess: () => {
      // Invalidate and refetch games queries
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (error) => {
      console.error("Failed to create game:", error);
    },
  });
};

/**
 * Hook for updating an existing game
 */
export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, gameData }: {
      id: string;
      gameData: Database["public"]["Tables"]["games"]["Update"]
    }) => GamesRepository.updateGame(id, gameData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch games queries
      queryClient.invalidateQueries({ queryKey: ["games"] });
      // Invalidate specific game query if it exists
      queryClient.invalidateQueries({ queryKey: ["games", variables.id] });
    },
    onError: (error) => {
      console.error("Failed to update game:", error);
    },
  });
};

/**
 * Hook for deleting a game
 */
export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => GamesRepository.deleteGame(id),
    onSuccess: () => {
      // Invalidate and refetch games queries
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (error) => {
      console.error("Failed to delete game:", error);
    },
  });
};