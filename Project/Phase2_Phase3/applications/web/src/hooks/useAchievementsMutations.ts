import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AchievementsRepository } from "../lib/repositories";
import type { Database } from "../lib/supabase/generated";

/**
 * Hook for creating a new achievement
 */
export const useCreateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (achievementData: Database["public"]["Tables"]["achievements"]["Insert"]) =>
      AchievementsRepository.createAchievement(achievementData),
    onSuccess: () => {
      // Invalidate and refetch achievements queries
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
    onError: (error) => {
      console.error("Failed to create achievement:", error);
    },
  });
};

/**
 * Hook for updating an existing achievement
 */
export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, achievementData }: {
      id: string;
      achievementData: Database["public"]["Tables"]["achievements"]["Update"]
    }) => AchievementsRepository.updateAchievement(id, achievementData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch achievements queries
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      // Invalidate specific achievement query if it exists
      queryClient.invalidateQueries({ queryKey: ["achievements", variables.id] });
    },
    onError: (error) => {
      console.error("Failed to update achievement:", error);
    },
  });
};

/**
 * Hook for deleting an achievement
 */
export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AchievementsRepository.deleteAchievement(id),
    onSuccess: () => {
      // Invalidate and refetch achievements queries
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
    onError: (error) => {
      console.error("Failed to delete achievement:", error);
    },
  });
};