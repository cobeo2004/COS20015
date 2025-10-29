/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Hybrid Query Service
 * Combines structured (PostgreSQL tables), semi-structured (JSONB), and unstructured (image URLs) data
 * Provides complex queries for reporting and analytics
 */

import { supabase } from "../supabase";
import type {
  GamePerformanceReport,
  PlayerEngagementReport,
  DeveloperSuccessReport,
  GamePerformanceFilters,
  PlayerEngagementFilters,
  DeveloperSuccessFilters,
  DeveloperMetadata,
  GameMetadata,
  PlayerSettings,
} from "../types/hybrid-data";

export class HybridQueryService {
  /**
   * Report 1: Game Performance Analytics
   * Combines: games + sessions + purchases + developers
   * Includes: structured data (tables), JSONB metadata, image URLs
   */
  static async getGamePerformanceReport(
    filters?: GamePerformanceFilters
  ): Promise<GamePerformanceReport[]> {
    try {
      // Build the base query with JOINs
      let query = supabase.from("games").select(`
          id,
          title,
          genre,
          release_date,
          price,
          cover_image_url,
          metadata,
          developers (
            id,
            name,
            logo_url,
            metadata
          ),
          sessions (
            id,
            player_id,
            start_time,
            end_time
          ),
          purchases (
            id,
            amount
          )
        `);

      // Apply filters
      if (filters?.genre) {
        query = query.eq("genre", filters.genre as any); // Type assertion needed for Supabase enum
      }
      if (filters?.developerId) {
        query = query.eq("developer_id", filters.developerId);
      }
      if (filters?.dateFrom) {
        query = query.gte("release_date", filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte("release_date", filters.dateTo);
      }
      if (filters?.minRating) {
        query = query.gte(
          "metadata->>average_rating",
          filters.minRating.toString()
        );
      }
      if (filters?.minRevenue) {
        // Note: This filter needs to be applied post-query since it's a calculated field
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Failed to fetch game performance report: ${error.message}`
        );
      }

      if (!data) return [];

      // Transform and calculate metrics
      const report: GamePerformanceReport[] = data.map((game: any) => {
        const gameMetadata = game.metadata as GameMetadata | null;
        const developerMetadata = game.developers
          ?.metadata as DeveloperMetadata | null;

        // Calculate metrics from related tables
        const sessions = game.sessions || [];
        const purchases = game.purchases || [];

        const totalSessions = sessions.length;
        const uniquePlayers = new Set(sessions.map((s: any) => s.player_id))
          .size;

        // Calculate duration from start_time and end_time
        const totalPlaytimeHours =
          sessions.reduce((sum: number, s: any) => {
            if (s.start_time && s.end_time) {
              const start = new Date(s.start_time).getTime();
              const end = new Date(s.end_time).getTime();
              const durationMs = end - start;
              return sum + durationMs / 1000; // Convert to seconds
            }
            return sum;
          }, 0) / 3600;

        const totalRevenue = purchases.reduce(
          (sum: number, p: any) => sum + (p.amount || 0),
          0
        );
        const avgSessionDuration =
          totalSessions > 0 ? totalPlaytimeHours / totalSessions : 0;
        const revenuePerPlayer =
          uniquePlayers > 0 ? totalRevenue / uniquePlayers : 0;

        return {
          game_id: game.id,
          game_title: game.title,
          genre: game.genre || "",
          developer_name: game.developers?.name || "Unknown",
          // Structured data
          release_date: game.release_date || "",
          price: game.price || 0,
          total_sessions: totalSessions,
          unique_players: uniquePlayers,
          // Semi-structured data (JSONB)
          average_rating: gameMetadata?.average_rating,
          total_reviews: gameMetadata?.total_reviews,
          tags: gameMetadata?.tags,
          company_size: developerMetadata?.company_size,
          specialties: developerMetadata?.specialties,
          // Unstructured data (images)
          cover_image_url: game.cover_image_url,
          logo_url: game.developers?.logo_url,
          // Calculated metrics
          total_revenue: totalRevenue,
          total_playtime_hours: totalPlaytimeHours,
          avg_session_duration: avgSessionDuration,
          revenue_per_player: revenuePerPlayer,
        };
      });

      // Apply post-query filters
      let filteredReport = report;
      if (filters?.minRevenue) {
        filteredReport = filteredReport.filter(
          (r) => r.total_revenue >= (filters.minRevenue || 0)
        );
      }
      if (filters?.tags && filters.tags.length > 0) {
        filteredReport = filteredReport.filter((r) =>
          r.tags?.some((tag) => filters.tags?.includes(tag))
        );
      }

      return filteredReport;
    } catch (error) {
      console.error("Error in getGamePerformanceReport:", error);
      throw error;
    }
  }

  /**
   * Report 2: Player Engagement Analysis
   * Combines: players + sessions + achievements + player_profiles
   * Includes: structured data, JSONB settings, image URLs
   */
  static async getPlayerEngagementReport(
    filters?: PlayerEngagementFilters
  ): Promise<PlayerEngagementReport[]> {
    try {
      // Build the base query with JOINs
      let query = supabase.from("players").select(`
          id,
          username,
          email,
          country,
          level,
          total_score,
          created_at,
          player_profiles (
            avatar_url,
            settings
          ),
          sessions (
            id,
            start_time,
            end_time
          ),
          player_achievements (
            id,
            unlocked_at
          )
        `);

      // Apply filters
      if (filters?.country) {
        query = query.eq("country", filters.country as any); // Type assertion needed for Supabase enum
      }
      if (filters?.minLevel) {
        query = query.gte("level", filters.minLevel);
      }
      if (filters?.maxLevel) {
        query = query.lte("level", filters.maxLevel);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Failed to fetch player engagement report: ${error.message}`
        );
      }

      if (!data) return [];

      // Transform and calculate metrics
      const report: PlayerEngagementReport[] = data.map((player: any) => {
        const playerSettings = player.player_profiles
          ?.settings as PlayerSettings | null;

        // Calculate metrics
        const sessions = player.sessions || [];
        const achievements = player.player_achievements || [];

        const totalSessions = sessions.length;

        // Calculate duration from start_time and end_time
        const totalPlaytimeHours =
          sessions.reduce((sum: number, s: any) => {
            if (s.start_time && s.end_time) {
              const start = new Date(s.start_time).getTime();
              const end = new Date(s.end_time).getTime();
              const durationMs = end - start;
              return sum + durationMs / 1000; // Convert to seconds
            }
            return sum;
          }, 0) / 3600;

        const avgSessionDuration =
          totalSessions > 0 ? totalPlaytimeHours / totalSessions : 0;
        const achievementsUnlocked = achievements.length;

        // Calculate days since last session
        let daysSinceLastSession = 999;
        if (sessions.length > 0) {
          const lastSession = sessions.reduce((latest: any, s: any) => {
            const sessionDate = new Date(s.end_time || 0);
            const latestDate = new Date(latest?.end_time || 0);
            return sessionDate > latestDate ? s : latest;
          }, null);

          if (lastSession?.end_time) {
            const daysDiff = Math.floor(
              (Date.now() - new Date(lastSession.end_time).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            daysSinceLastSession = daysDiff;
          }
        }

        // Simple retention score (0-100)
        const retentionScore = Math.max(0, 100 - daysSinceLastSession);

        // Achievement completion rate (assuming 100 total achievements)
        const achievementCompletionRate = (achievementsUnlocked / 100) * 100;

        return {
          player_id: player.id,
          username: player.username,
          email: player.email,
          // Structured data
          country: player.country || "",
          level: player.level || 0,
          total_score: player.total_score || 0,
          account_created: player.created_at || "",
          // Semi-structured data (JSONB)
          privacy: playerSettings?.privacy,
          theme: playerSettings?.theme,
          notifications_enabled: playerSettings?.notifications?.email,
          // Unstructured data (images)
          avatar_url: player.player_profiles?.avatar_url,
          // Calculated metrics
          total_sessions: totalSessions,
          total_playtime_hours: totalPlaytimeHours,
          avg_session_duration: avgSessionDuration,
          achievements_unlocked: achievementsUnlocked,
          achievement_completion_rate: achievementCompletionRate,
          days_since_last_session: daysSinceLastSession,
          retention_score: retentionScore,
        };
      });

      // Apply post-query filters
      let filteredReport = report;
      if (filters?.privacySetting) {
        filteredReport = filteredReport.filter(
          (r) => r.privacy === filters.privacySetting
        );
      }
      if (filters?.theme) {
        filteredReport = filteredReport.filter(
          (r) => r.theme === filters.theme
        );
      }
      if (filters?.minAchievements) {
        filteredReport = filteredReport.filter(
          (r) => r.achievements_unlocked >= (filters.minAchievements || 0)
        );
      }

      return filteredReport;
    } catch (error) {
      console.error("Error in getPlayerEngagementReport:", error);
      throw error;
    }
  }

  /**
   * Report 3: Developer Success Dashboard
   * Combines: developers + games + purchases + sessions
   * Includes: structured data, JSONB metadata, image URLs
   */
  static async getDeveloperSuccessReport(
    filters?: DeveloperSuccessFilters
  ): Promise<DeveloperSuccessReport[]> {
    try {
      // Build the base query with JOINs
      const query = supabase.from("developers").select(`
          id,
          name,
          email,
          logo_url,
          metadata,
          games (
            id,
            title,
            release_date,
            metadata,
            purchases (
              id,
              amount
            ),
            sessions (
              id,
              player_id,
              start_time,
              end_time
            )
          )
        `);

      const { data, error } = await query;

      if (error) {
        throw new Error(
          `Failed to fetch developer success report: ${error.message}`
        );
      }

      if (!data) return [];

      // Transform and calculate metrics
      const report: DeveloperSuccessReport[] = data.map((developer: any) => {
        const devMetadata = developer.metadata as DeveloperMetadata | null;
        const games = developer.games || [];

        // Calculate metrics across all games
        const totalGames = games.length;
        let totalRevenue = 0;
        const totalPlayers = new Set<string>();
        let totalPlaytimeHours = 0;
        let totalRatings = 0;
        let ratingCount = 0;

        games.forEach((game: any) => {
          const gameMetadata = game.metadata as GameMetadata | null;

          // Revenue
          const purchases = game.purchases || [];
          totalRevenue += purchases.reduce(
            (sum: number, p: any) => sum + (p.amount || 0),
            0
          );

          // Players and playtime
          const sessions = game.sessions || [];
          sessions.forEach((s: any) => {
            totalPlayers.add(s.player_id);
            if (s.start_time && s.end_time) {
              const start = new Date(s.start_time).getTime();
              const end = new Date(s.end_time).getTime();
              const durationMs = end - start;
              totalPlaytimeHours += durationMs / 1000 / 3600; // Convert to hours
            }
          });

          // Ratings
          if (gameMetadata?.average_rating) {
            totalRatings += gameMetadata.average_rating;
            ratingCount++;
          }
        });

        const avgGameRating = ratingCount > 0 ? totalRatings / ratingCount : 0;
        const revenuePerGame = totalGames > 0 ? totalRevenue / totalGames : 0;

        // Get release dates
        const releaseDates = games
          .map((g: any) => g.release_date)
          .filter((d: any) => d)
          .sort();
        const earliestRelease = releaseDates[0] || undefined;
        const latestRelease =
          releaseDates[releaseDates.length - 1] || undefined;

        return {
          developer_id: developer.id,
          developer_name: developer.name,
          email: developer.email,
          // Structured data
          total_games: totalGames,
          earliest_release_date: earliestRelease,
          latest_release_date: latestRelease,
          // Semi-structured data (JSONB)
          company_size: devMetadata?.company_size,
          founded_year: devMetadata?.founded_year,
          headquarters: devMetadata?.headquarters,
          specialties: devMetadata?.specialties,
          awards_count: devMetadata?.awards?.length,
          // Unstructured data (images)
          logo_url: developer.logo_url,
          // Calculated metrics
          total_revenue: totalRevenue,
          total_players: totalPlayers.size,
          avg_game_rating: avgGameRating,
          total_playtime_hours: totalPlaytimeHours,
          revenue_per_game: revenuePerGame,
          active_players_last_30_days: totalPlayers.size, // Simplified - would need session dates for accuracy
        };
      });

      // Apply filters
      let filteredReport = report;
      if (filters?.minRevenue) {
        filteredReport = filteredReport.filter(
          (r) => r.total_revenue >= (filters.minRevenue || 0)
        );
      }
      if (filters?.companySize) {
        filteredReport = filteredReport.filter(
          (r) => r.company_size === filters.companySize
        );
      }
      if (filters?.minFoundedYear) {
        filteredReport = filteredReport.filter(
          (r) =>
            r.founded_year && r.founded_year >= (filters.minFoundedYear || 0)
        );
      }
      if (filters?.specialty) {
        filteredReport = filteredReport.filter((r) =>
          r.specialties?.includes(filters.specialty || "")
        );
      }

      return filteredReport;
    } catch (error) {
      console.error("Error in getDeveloperSuccessReport:", error);
      throw error;
    }
  }

  /**
   * Helper: Extract JSONB field from query result
   */
  static extractJsonbField<T>(jsonb: unknown, path: string): T | undefined {
    if (!jsonb || typeof jsonb !== "object") return undefined;

    const keys = path.split(".");
    let current: any = jsonb;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current as T;
  }

  /**
   * Helper: Check if JSONB array contains value
   */
  static jsonbArrayContains(jsonbArray: unknown, value: string): boolean {
    if (!Array.isArray(jsonbArray)) return false;
    return jsonbArray.includes(value);
  }
}
