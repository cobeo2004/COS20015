import { supabase } from "../supabase";

/**
 * Repository for game-specific achievements
 * Handles fetching achievements for a specific game with player unlock status
 */
export class GameAchievementsRepository {
  /**
   * Get all achievements for a specific game
   */
  static async getGameAchievements(gameId: string) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("game_id", gameId)
      .order("points", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch game achievements: ${error.message}`);
    }
    return data;
  }

  /**
   * Get achievements for a specific game with unlock status for a player
   * Returns all achievements with isUnlocked flag and unlocked_at timestamp
   */
  static async getGameAchievementsWithPlayerStatus(gameId: string, playerId: string) {
    // First, get all achievements for the game
    const { data: achievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .eq("game_id", gameId)
      .order("points", { ascending: false });

    if (achievementsError) {
      throw new Error(`Failed to fetch game achievements: ${achievementsError.message}`);
    }

    // Then, get player's unlocked achievements
    const { data: playerAchievements, error: playerError } = await supabase
      .from("player_achievements")
      .select("achievement_id, unlocked_at")
      .eq("player_id", playerId);

    if (playerError) {
      throw new Error(`Failed to fetch player achievements: ${playerError.message}`);
    }

    // Create a map of unlocked achievements
    const unlockedMap = new Map(
      playerAchievements?.map((pa) => [pa.achievement_id, pa.unlocked_at]) || []
    );

    // Combine data
    return achievements.map((achievement) => ({
      ...achievement,
      isUnlocked: unlockedMap.has(achievement.id),
      unlocked_at: unlockedMap.get(achievement.id) || null,
    }));
  }

  /**
   * Get achievement statistics for a game
   * Returns total count and unlock percentage
   */
  static async getGameAchievementStats(gameId: string, playerId: string) {
    const achievements = await this.getGameAchievementsWithPlayerStatus(gameId, playerId);

    const totalAchievements = achievements.length;
    const unlockedAchievements = achievements.filter((a) => a.isUnlocked).length;
    const unlockedPercentage = totalAchievements > 0
      ? Math.round((unlockedAchievements / totalAchievements) * 100)
      : 0;

    return {
      total: totalAchievements,
      unlocked: unlockedAchievements,
      locked: totalAchievements - unlockedAchievements,
      percentage: unlockedPercentage,
    };
  }
}
