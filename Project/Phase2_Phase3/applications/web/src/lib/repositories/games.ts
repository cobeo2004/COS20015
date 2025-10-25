import { supabase } from "../supabase";

export class GamesRepository {
  static async getAllGames() {
    const { data, error } = await supabase.from("games").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
