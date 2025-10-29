import { useQuery } from "@tanstack/react-query";
import { DevelopersRepository } from "../lib/repositories";

export const useDevelopers = () => {
  return useQuery({
    queryKey: ["developers"],
    queryFn: () => DevelopersRepository.getAllDevelopers(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};