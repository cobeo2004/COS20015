import { supabase } from "../supabase";
import type { Database } from "../supabase/generated";
import type { GameMetadata } from "../types/hybrid-data";
import { isGameMetadata } from "../types/hybrid-data";

type GameRow = Database["public"]["Tables"]["games"]["Row"];
type GameGenre = Database["public"]["Enums"]["game_genres"];

/**
 * Repository for games table with JSONB metadata support
 * Handles structured data (title, price, genre) and semi-structured data (metadata JSONB)
 */
export class GamesRepository {
  /**
   * Get all games
   */
  static async getAllGames() {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch games: ${error.message}`);
    }
    return data;
  }

  /**
   * Get game by ID
   */
  static async getGameById(id: string) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch game: ${error.message}`);
    }
    return data;
  }

  /**
   * Get single game with developer information
   * JOIN game with developers table
   */
  static async getGameWithDeveloper(id: string) {
    const { data, error } = await supabase
      .from("games")
      .select(`
        *,
        developers (
          id,
          name,
          email,
          logo_url,
          metadata
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch game with developer: ${error.message}`);
    }
    return data;
  }

  /**
   * Get games with metadata parsed
   * Returns typed metadata for easier access
   */
  static async getGamesWithMetadata(): Promise<Array<GameRow & { parsedMetadata: GameMetadata | null }>> {
    const games = await this.getAllGames();

    return games.map(game => ({
      ...game,
      parsedMetadata: this.parseMetadata(game.metadata)
    }));
  }

  /**
   * Get games with developer information
   * JOIN games with developers table
   */
  static async getGamesWithDevelopers() {
    const { data, error } = await supabase
      .from("games")
      .select(`
        *,
        developers (
          id,
          name,
          email,
          logo_url,
          metadata
        )
      `)
      .order("title", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch games with developers: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter games by minimum rating (from JSONB metadata)
   * Example: filterByMinRating(4.0)
   */
  static async filterByMinRating(minRating: number) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .gte("metadata->>average_rating", minRating.toString());

    if (error) {
      throw new Error(`Failed to filter by rating: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter games by tags (from JSONB metadata array)
   * Uses JSONB array containment operator
   * Example: filterByTags(['multiplayer', 'co-op'])
   */
  static async filterByTags(tags: string[]) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .contains("metadata", { tags });

    if (error) {
      throw new Error(`Failed to filter by tags: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter games by single tag (from JSONB metadata)
   */
  static async filterBySingleTag(tag: string) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .contains("metadata", { tags: [tag] });

    if (error) {
      throw new Error(`Failed to filter by tag: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter games by genre (structured data)
   */
  static async filterByGenre(genre: GameGenre) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("genre", genre);

    if (error) {
      throw new Error(`Failed to filter by genre: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter games by developer ID
   */
  static async filterByDeveloper(developerId: string) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("developer_id", developerId);

    if (error) {
      throw new Error(`Failed to filter by developer: ${error.message}`);
    }
    return data;
  }

  /**
   * Get games with cover images
   * Focuses on unstructured data (image URLs)
   */
  static async getGamesWithCoverImages() {
    const { data, error } = await supabase
      .from("games")
      .select("id, title, cover_image_url, metadata")
      .not("cover_image_url", "is", null);

    if (error) {
      throw new Error(`Failed to fetch games with cover images: ${error.message}`);
    }
    return data;
  }

  /**
   * Search games by price range
   */
  static async filterByPriceRange(minPrice?: number, maxPrice?: number) {
    let query = supabase.from("games").select("*");

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to filter by price range: ${error.message}`);
    }
    return data;
  }

  /**
   * Get games ordered by rating (from JSONB metadata)
   */
  static async getGamesByRating(ascending: boolean = false) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("metadata->>average_rating", { ascending, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to order by rating: ${error.message}`);
    }
    return data;
  }

  /**
   * Get games ordered by review count (from JSONB metadata)
   */
  static async getGamesByReviewCount(ascending: boolean = false) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("metadata->>total_reviews", { ascending, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to order by review count: ${error.message}`);
    }
    return data;
  }

  /**
   * Get recent games (by release date)
   */
  static async getRecentGames(limit: number = 10) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("release_date", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent games: ${error.message}`);
    }
    return data;
  }

  /**
   * Parse metadata JSONB into typed GameMetadata
   * Validates and returns typed metadata or null
   */
  private static parseMetadata(metadata: unknown): GameMetadata | null {
    if (!metadata) return null;

    // Validate using type guard
    if (isGameMetadata(metadata)) {
      return metadata as GameMetadata;
    }

    // If validation fails, return null
    console.warn("Invalid game metadata format:", metadata);
    return null;
  }

  /**
   * Extract specific metadata field
   * Helper method for JSONB field access
   */
  static extractMetadataField<K extends keyof GameMetadata>(
    metadata: unknown,
    field: K
  ): GameMetadata[K] | undefined {
    const parsed = this.parseMetadata(metadata);
    return parsed?.[field];
  }

  /**
   * Complex filter combining structured and JSONB data
   */
  static async advancedFilter(filters: {
    genre?: GameGenre;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    tags?: string[];
    developerId?: string;
  }) {
    let query = supabase.from("games").select("*");

    if (filters.genre) {
      query = query.eq("genre", filters.genre);
    }
    if (filters.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters.minRating !== undefined) {
      query = query.gte("metadata->>average_rating", filters.minRating.toString());
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.contains("metadata", { tags: filters.tags });
    }
    if (filters.developerId) {
      query = query.eq("developer_id", filters.developerId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to apply advanced filters: ${error.message}`);
    }
    return data;
  }

  /**
   * Get all games by a specific developer
   * @param developerId - The ID of the developer
   */
  static async getGamesByDeveloper(developerId: string) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("developer_id", developerId)
      .order("release_date", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch games by developer: ${error.message}`);
    }
    return data;
  }

  /**
   * Search games by title, genre, or other text fields
   * @param searchTerm - The search term to filter by
   */
  static async searchGames(searchTerm: string) {
    if (!searchTerm.trim()) {
      return this.getAllGames();
    }

    // Search only by title to avoid enum casting issues with PostgREST
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .ilike("title", `%${searchTerm}%`)
      .order("title", { ascending: true });

    if (error) {
      throw new Error(`Failed to search games: ${error.message}`);
    }
    return data;
  }

  // ========== CRUD OPERATIONS ==========

  /**
   * Create a new game
   */
  static async createGame(gameData: Database["public"]["Tables"]["games"]["Insert"]) {
    const { data, error } = await supabase
      .from("games")
      .insert(gameData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create game: ${error.message}`);
    }
    return data;
  }

  /**
   * Update an existing game
   */
  static async updateGame(
    id: string,
    gameData: Database["public"]["Tables"]["games"]["Update"]
  ) {
    const { data, error } = await supabase
      .from("games")
      .update(gameData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update game: ${error.message}`);
    }
    return data;
  }

  /**
   * Delete a game
   */
  static async deleteGame(id: string) {
    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete game: ${error.message}`);
    }
    return true;
  }
}
