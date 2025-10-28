import { useQuery } from "@tanstack/react-query";
import { PlayersRepository } from "../lib/repositories/players";

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: () => PlayersRepository.getAllPlayers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
