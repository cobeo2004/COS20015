import { useQuery } from "@tanstack/react-query";
import { AchievementsRepository } from "../lib/repositories";

export const useAchievements = () => {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: () => AchievementsRepository.getAllAchievements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};