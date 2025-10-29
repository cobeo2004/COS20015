import { supabase } from "../supabase";
import type { Database } from "../supabase/generated";

export class AchievementsRepository {
  static async getAllAchievements() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("points", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getPlayerAchievements(playerId: string) {
    const { data, error } = await supabase
      .from("player_achievements")
      .select(`
        *,
        achievements (*)
      `)
      .eq("player_id", playerId)
      .order("unlocked_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getUnlockedAchievements(playerId: string) {
    const { data, error } = await supabase
      .from("player_achievements")
      .select(`
        achievements (*)
      `)
      .eq("player_id", playerId);

    if (error) {
      throw new Error(error.message);
    }
    return data.map(item => item.achievements);
  }

  // ========== CRUD OPERATIONS ==========

  /**
   * Create a new achievement
   */
  static async createAchievement(achievementData: Database["public"]["Tables"]["achievements"]["Insert"]) {
    const { data, error } = await supabase
      .from("achievements")
      .insert(achievementData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create achievement: ${error.message}`);
    }
    return data;
  }

  /**
   * Update an existing achievement
   */
  static async updateAchievement(
    id: string,
    achievementData: Database["public"]["Tables"]["achievements"]["Update"]
  ) {
    const { data, error } = await supabase
      .from("achievements")
      .update(achievementData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update achievement: ${error.message}`);
    }
    return data;
  }

  /**
   * Delete an achievement
   */
  static async deleteAchievement(id: string) {
    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete achievement: ${error.message}`);
    }
    return true;
  }

  /**
   * Get achievements by game ID
   */
  static async getAchievementsByGame(gameId: string) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("game_id", gameId)
      .order("points", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch achievements for game: ${error.message}`);
    }
    return data;
  }

  /**
   * Get achievement with game information
   */
  static async getAchievementWithGame(id: string) {
    const { data, error } = await supabase
      .from("achievements")
      .select(`
        *,
        games (
          id,
          title,
          genre,
          developers (
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch achievement with game: ${error.message}`);
    }
    return data;
  }

  /**
   * Get all achievements with game information
   */
  static async getAchievementsWithGames() {
    const { data, error } = await supabase
      .from("achievements")
      .select(`
        *,
        games (
          id,
          title,
          genre,
          developers (
            id,
            name
          )
        )
      `)
      .order("points", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch achievements with games: ${error.message}`);
    }
    return data;
  }
}
