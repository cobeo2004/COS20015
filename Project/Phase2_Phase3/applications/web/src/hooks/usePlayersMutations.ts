import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlayersRepository } from "../lib/repositories";
import type { Database } from "../lib/supabase/generated";

/**
 * Hook for creating a new player
 */
export const useCreatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerData: Database["public"]["Tables"]["players"]["Insert"]) =>
      PlayersRepository.createPlayer(playerData),
    onSuccess: () => {
      // Invalidate and refetch players queries
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
    onError: (error) => {
      console.error("Failed to create player:", error);
    },
  });
};

/**
 * Hook for updating an existing player
 */
export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, playerData }: {
      id: string;
      playerData: Database["public"]["Tables"]["players"]["Update"]
    }) => PlayersRepository.updatePlayer(id, playerData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch players queries
      queryClient.invalidateQueries({ queryKey: ["players"] });
      // Invalidate specific player query if it exists
      queryClient.invalidateQueries({ queryKey: ["players", variables.id] });
    },
    onError: (error) => {
      console.error("Failed to update player:", error);
    },
  });
};

/**
 * Hook for deleting a player
 */
export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PlayersRepository.deletePlayer(id),
    onSuccess: () => {
      // Invalidate and refetch players queries
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
    onError: (error) => {
      console.error("Failed to delete player:", error);
    },
  });
};