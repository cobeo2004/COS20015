import { useQuery } from "@tanstack/react-query";
import { PlayersRepository } from "../lib/repositories/players";

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  score: number;
  level: number;
  country: string;
  isCurrentUser: boolean;
}

async function fetchLeaderboard(currentPlayerId?: string): Promise<LeaderboardEntry[]> {
  const players = await PlayersRepository.getAllPlayers();

  if (!players) return [];

  // Map players to leaderboard entries with ranks
  const leaderboard: LeaderboardEntry[] = players.map((player, index) => ({
    rank: index + 1,
    id: player.id,
    username: player.username,
    score: player.total_score || 0,
    level: player.level || 0,
    country: player.country || 'Unknown',
    isCurrentUser: currentPlayerId ? player.id === currentPlayerId : false
  }));

  return leaderboard;
}

export function useLeaderboard(currentPlayerId?: string) {
  return useQuery({
    queryKey: ['leaderboard', currentPlayerId],
    queryFn: () => fetchLeaderboard(currentPlayerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
