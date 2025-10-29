import { supabase } from "../supabase";
import type { Database } from "../supabase/generated";

export interface PlayerFilters {
  searchTerm?: string;
  country?: "AU" | "US" | "UK" | "JP" | "VN";
  minLevel?: number;
  maxLevel?: number;
  minScore?: number;
  maxScore?: number;
  sortBy?: "username" | "level" | "total_score" | "country";
  sortOrder?: "asc" | "desc";
}

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

  static async searchPlayers(searchTerm: string) {
    const { data, error } = await supabase
      .from("players")
      .select("*, player_profiles (*)")
      .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order("total_score", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async filterByCountry(country: "AU" | "US" | "UK" | "JP" | "VN") {
    const { data, error } = await supabase
      .from("players")
      .select("*, player_profiles (*)")
      .eq("country", country)
      .order("total_score", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async filterByLevelRange(minLevel?: number, maxLevel?: number) {
    let query = supabase
      .from("players")
      .select("*, player_profiles (*)");

    if (minLevel !== undefined) {
      query = query.gte("level", minLevel);
    }
    if (maxLevel !== undefined) {
      query = query.lte("level", maxLevel);
    }

    const { data, error } = await query.order("total_score", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async filterByScoreRange(minScore?: number, maxScore?: number) {
    let query = supabase
      .from("players")
      .select("*, player_profiles (*)");

    if (minScore !== undefined) {
      query = query.gte("total_score", minScore);
    }
    if (maxScore !== undefined) {
      query = query.lte("total_score", maxScore);
    }

    const { data, error } = await query.order("total_score", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async sortByUsername(ascending: boolean = true) {
    const { data, error } = await supabase
      .from("players")
      .select("*, player_profiles (*)")
      .order("username", { ascending });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async sortByLevel(ascending: boolean = false) {
    const { data, error } = await supabase
      .from("players")
      .select("*, player_profiles (*)")
      .order("level", { ascending });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  static async advancedPlayerFilters(filters: PlayerFilters) {
    let query = supabase
      .from("players")
      .select("*, player_profiles (*)");

    // Search functionality
    if (filters.searchTerm) {
      query = query.or(`username.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`);
    }

    // Country filter
    if (filters.country) {
      query = query.eq("country", filters.country);
    }

    // Level range filters
    if (filters.minLevel !== undefined) {
      query = query.gte("level", filters.minLevel);
    }
    if (filters.maxLevel !== undefined) {
      query = query.lte("level", filters.maxLevel);
    }

    // Score range filters
    if (filters.minScore !== undefined) {
      query = query.gte("total_score", filters.minScore);
    }
    if (filters.maxScore !== undefined) {
      query = query.lte("total_score", filters.maxScore);
    }

    // Default sorting
    const sortBy = filters.sortBy || "total_score";
    const sortOrder = filters.sortOrder || "desc";

    const { data, error } = await query.order(sortBy, { ascending: sortOrder === "asc" });

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

  // ========== CRUD OPERATIONS ==========

  /**
   * Create a new player
   */
  static async createPlayer(playerData: Database["public"]["Tables"]["players"]["Insert"]) {
    const { data, error } = await supabase
      .from("players")
      .insert(playerData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create player: ${error.message}`);
    }
    return data;
  }

  /**
   * Update an existing player
   */
  static async updatePlayer(
    id: string,
    playerData: Database["public"]["Tables"]["players"]["Update"]
  ) {
    const { data, error } = await supabase
      .from("players")
      .update(playerData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update player: ${error.message}`);
    }
    return data;
  }

  /**
   * Delete a player
   */
  static async deletePlayer(id: string) {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete player: ${error.message}`);
    }
    return true;
  }
}
