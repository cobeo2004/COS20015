import { useQuery } from "@tanstack/react-query";
import { GamesRepository } from "../lib/repositories";

export const useGames = () => {
  return useQuery({
    queryKey: ["games"],
    queryFn: GamesRepository.getAllGames,
  });
};
