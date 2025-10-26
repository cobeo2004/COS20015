import { supabase } from "../supabase";
import type { Database } from "../supabase/generated";
import type { PlayerSettings } from "../types/hybrid-data";
import { isPlayerSettings } from "../types/hybrid-data";

type PlayerProfileRow = Database["public"]["Tables"]["player_profiles"]["Row"];

/**
 * Repository for player_profiles table with JSONB settings support
 * Handles structured data (bio, avatar_url) and semi-structured data (settings JSONB)
 */
export class PlayerProfilesRepository {
  /**
   * Get all player profiles
   */
  static async getAllProfiles() {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("*");

    if (error) {
      throw new Error(`Failed to fetch player profiles: ${error.message}`);
    }
    return data;
  }

  /**
   * Get player profile by player ID
   */
  static async getProfileByPlayerId(playerId: string) {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("*")
      .eq("player_id", playerId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch player profile: ${error.message}`);
    }
    return data;
  }

  /**
   * Get profiles with player information (JOIN)
   */
  static async getProfilesWithPlayers() {
    const { data, error } = await supabase
      .from("player_profiles")
      .select(`
        *,
        players (
          id,
          username,
          email,
          country,
          level,
          total_score,
          created_at
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch profiles with players: ${error.message}`);
    }
    return data;
  }

  /**
   * Get profiles with parsed settings metadata
   * Returns typed settings for easier access
   */
  static async getProfilesWithSettings(): Promise<Array<PlayerProfileRow & { parsedSettings: PlayerSettings | null }>> {
    const profiles = await this.getAllProfiles();

    return profiles.map(profile => ({
      ...profile,
      parsedSettings: this.parseSettings(profile.settings)
    }));
  }

  /**
   * Filter profiles by privacy setting (from JSONB settings)
   * Example: filterByPrivacy('public')
   */
  static async filterByPrivacy(privacy: PlayerSettings['privacy']) {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("*")
      .contains("settings", { privacy });

    if (error) {
      throw new Error(`Failed to filter by privacy: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter profiles by theme (from JSONB settings)
   * Example: filterByTheme('dark')
   */
  static async filterByTheme(theme: PlayerSettings['theme']) {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("*")
      .contains("settings", { theme });

    if (error) {
      throw new Error(`Failed to filter by theme: ${error.message}`);
    }
    return data;
  }

  /**
   * Filter profiles by notification preferences (from JSONB settings)
   * Example: filterByEmailNotifications(true)
   */
  static async filterByEmailNotifications(enabled: boolean) {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("*")
      .contains("settings", { notifications: { email: enabled } });

    if (error) {
      throw new Error(`Failed to filter by email notifications: ${error.message}`);
    }
    return data;
  }

  /**
   * Get profiles with avatars
   * Focuses on unstructured data (image URLs)
   */
  static async getProfilesWithAvatars() {
    const { data, error } = await supabase
      .from("player_profiles")
      .select("id, player_id, avatar_url, settings")
      .not("avatar_url", "is", null);

    if (error) {
      throw new Error(`Failed to fetch profiles with avatars: ${error.message}`);
    }
    return data;
  }

  /**
   * Get public profiles only (from JSONB settings)
   */
  static async getPublicProfiles() {
    return this.filterByPrivacy('public');
  }

  /**
   * Get profiles with complete player data and parsed settings
   * Combines structured data (players table) and semi-structured data (JSONB)
   */
  static async getCompleteProfiles() {
    const profiles = await this.getProfilesWithPlayers();

    return profiles.map(profile => ({
      ...profile,
      parsedSettings: this.parseSettings(profile.settings)
    }));
  }

  /**
   * Filter profiles by multiple settings criteria
   */
  static async advancedFilter(filters: {
    privacy?: PlayerSettings['privacy'];
    theme?: PlayerSettings['theme'];
    emailNotifications?: boolean;
    hasAvatar?: boolean;
  }) {
    let query = supabase.from("player_profiles").select("*");

    if (filters.privacy) {
      query = query.contains("settings", { privacy: filters.privacy });
    }
    if (filters.theme) {
      query = query.contains("settings", { theme: filters.theme });
    }
    if (filters.emailNotifications !== undefined) {
      query = query.contains("settings", { notifications: { email: filters.emailNotifications } });
    }
    if (filters.hasAvatar !== undefined) {
      if (filters.hasAvatar) {
        query = query.not("avatar_url", "is", null);
      } else {
        query = query.is("avatar_url", null);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to apply advanced filters: ${error.message}`);
    }
    return data;
  }

  /**
   * Parse settings JSONB into typed PlayerSettings
   * Validates and returns typed settings or null
   */
  private static parseSettings(settings: unknown): PlayerSettings | null {
    if (!settings) return null;

    // Validate using type guard
    if (isPlayerSettings(settings)) {
      return settings as PlayerSettings;
    }

    // If validation fails, return null
    console.warn("Invalid player settings format:", settings);
    return null;
  }

  /**
   * Extract specific settings field
   * Helper method for JSONB field access
   */
  static extractSettingsField<K extends keyof PlayerSettings>(
    settings: unknown,
    field: K
  ): PlayerSettings[K] | undefined {
    const parsed = this.parseSettings(settings);
    return parsed?.[field];
  }

  /**
   * Get profiles grouped by privacy setting
   * Useful for analytics
   */
  static async getProfilesByPrivacyStats() {
    const profiles = await this.getProfilesWithSettings();

    const stats = {
      public: 0,
      friends: 0,
      private: 0,
      unknown: 0
    };

    profiles.forEach(profile => {
      const privacy = profile.parsedSettings?.privacy;
      if (privacy === 'public') stats.public++;
      else if (privacy === 'friends') stats.friends++;
      else if (privacy === 'private') stats.private++;
      else stats.unknown++;
    });

    return stats;
  }

  /**
   * Get profiles grouped by theme preference
   */
  static async getProfilesByThemeStats() {
    const profiles = await this.getProfilesWithSettings();

    const stats = {
      light: 0,
      dark: 0,
      auto: 0,
      unknown: 0
    };

    profiles.forEach(profile => {
      const theme = profile.parsedSettings?.theme;
      if (theme === 'light') stats.light++;
      else if (theme === 'dark') stats.dark++;
      else if (theme === 'auto') stats.auto++;
      else stats.unknown++;
    });

    return stats;
  }
}
