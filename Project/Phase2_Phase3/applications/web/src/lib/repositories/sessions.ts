import { supabase } from "../supabase";

export class SessionsRepository {
  static async getSessionsByPlayerId(playerId: string) {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        games (
          id,
          title,
          genre
        )
      `)
      .eq("player_id", playerId)
      .order("start_time", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async getRecentSessions(limit = 10) {
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        players (
          id,
          username
        ),
        games (
          id,
          title
        )
      `)
      .order("start_time", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
