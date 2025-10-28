import { supabase } from "../supabase";

export class PlayersRepository {
  static async getAllPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select("*, player_profiles (*)")
      .order("total_score", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getPlayerById(playerId: string) {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getPlayerWithProfile(playerId: string) {
    const { data, error } = await supabase
      .from("players")
      .select(
        `
        *,
        player_profiles (*)
      `
      )
      .eq("id", playerId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
