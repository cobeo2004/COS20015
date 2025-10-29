import { supabase } from "../supabase";

/**
 * Repository for game-specific leaderboards
 * Handles fetching leaderboard data for a specific game
 */
export class GameLeaderboardsRepository {
  /**
   * Get leaderboard for a specific game
   * Returns leaderboard entries with player information, ordered by rank
   */
  static async getGameLeaderboard(gameId: string) {
    const { data, error } = await supabase
      .from("leaderboards")
      .select(
        `
        id,
        type,
        created_at,
        leaderboard_entities (
          id,
          rank,
          score,
          achieved_at,
          players (
            id,
            username,
            level,
            country
          )
        )
      `
      )
      .eq("game_id", gameId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no leaderboard exists, return null instead of throwing
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch game leaderboard: ${error.message}`);
    }

    // Sort leaderboard entries by rank
    if (data?.leaderboard_entities) {
      data.leaderboard_entities.sort((a, b) => (a?.rank || 0) - (b?.rank || 0));
    }

    return data;
  }

  /**
   * Get top N players for a specific game
   * Simplified method that returns just the top players
   */
  static async getTopPlayers(gameId: string, limit: number = 10) {
    const leaderboard = await this.getGameLeaderboard(gameId);

    if (!leaderboard || !leaderboard.leaderboard_entities) {
      return [];
    }

    return leaderboard.leaderboard_entities.slice(0, limit).map((entry) => ({
      rank: entry.rank,
      score: entry.score,
      achieved_at: entry.achieved_at,
      player: entry.players,
    }));
  }

  /**
   * Get player's rank in a specific game leaderboard
   */
  static async getPlayerRank(gameId: string, playerId: string) {
    const leaderboard = await this.getGameLeaderboard(gameId);

    if (!leaderboard || !leaderboard.leaderboard_entities) {
      return null;
    }

    const entry = leaderboard.leaderboard_entities.find(
      (e) => e.players?.id === playerId
    );

    if (!entry) {
      return null;
    }

    return {
      rank: entry.rank,
      score: entry.score,
      achieved_at: entry.achieved_at,
      totalPlayers: leaderboard.leaderboard_entities.length,
    };
  }

  /**
   * Get leaderboard statistics for a game
   */
  static async getLeaderboardStats(gameId: string) {
    const leaderboard = await this.getGameLeaderboard(gameId);

    if (!leaderboard || !leaderboard.leaderboard_entities) {
      return {
        totalPlayers: 0,
        highestScore: 0,
        averageScore: 0,
      };
    }

    const scores = leaderboard.leaderboard_entities.map((e) => Number(e.score));
    const totalPlayers = scores.length;
    const highestScore = totalPlayers > 0 ? Math.max(...scores) : 0;
    const averageScore =
      totalPlayers > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / totalPlayers
          )
        : 0;

    return {
      totalPlayers,
      highestScore,
      averageScore,
    };
  }
}
