import type { Database } from "../supabase/generated";

/**
 * Type definitions for game details page
 * Extends base database types with additional fields from repository methods
 */

// Base achievement type from database
type AchievementRow = Database["public"]["Tables"]["achievements"]["Row"];

// Achievement with player unlock status (from GameAchievementsRepository)
export interface AchievementWithStatus extends AchievementRow {
  isUnlocked: boolean;
  unlocked_at: string | null;
}

// Player type from database
type PlayerRow = Database["public"]["Tables"]["players"]["Row"];

// Leaderboard entity with player information (from GameLeaderboardsRepository)
// Only includes fields selected in the query
export interface LeaderboardEntityWithPlayer {
  id: string;
  rank: number | null;
  score: number | null;
  achieved_at: string | null;
  players: Pick<PlayerRow, "id" | "username" | "level" | "country">;
}

// Leaderboard type from database
type LeaderboardRow = Database["public"]["Tables"]["leaderboards"]["Row"];

// Leaderboard with entities and player information (from GameLeaderboardsRepository)
export interface LeaderboardWithEntities extends Pick<LeaderboardRow, "id" | "type" | "created_at"> {
  leaderboard_entities: LeaderboardEntityWithPlayer[];
}
