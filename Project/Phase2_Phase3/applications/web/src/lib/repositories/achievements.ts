import { supabase } from "../supabase";

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
}
