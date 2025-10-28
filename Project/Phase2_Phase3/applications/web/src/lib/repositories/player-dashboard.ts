import { supabase } from "../supabase";

export interface PlayerDashboardData {
  player: {
    id: string;
    username: string;
    email: string;
    country: string;
    level: number;
    total_score: number;
    avatar_url: string | null;
  };
  stats: {
    gamesPlayed: number;
    totalPlaytimeHours: number;
    totalSessions: number;
    achievementsUnlocked: number;
  };
  recentAchievements: Array<{
    id: string;
    name: string;
    description: string;
    unlocked: string;
  }>;
  recentGames: Array<{
    id: string;
    title: string;
    lastPlayed: string;
    playtimeHours: number;
  }>;
}

export class PlayerDashboardRepository {
  /**
   * Get complete player dashboard data
   */
  static async getPlayerDashboard(
    playerId: string
  ): Promise<PlayerDashboardData> {
    // Fetch player data with profile
    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select(
        `
        *,
        player_profiles (avatar_url, settings)
      `
      )
      .eq("id", playerId)
      .single();

    if (playerError)
      throw new Error(`Failed to fetch player: ${playerError.message}`);
    if (!playerData) throw new Error("Player not found");

    // Fetch sessions for this player
    const { data: sessions } = await supabase
      .from("sessions")
      .select(
        `
        id,
        game_id,
        start_time,
        end_time,
        games (id, title)
      `
      )
      .eq("player_id", playerId)
      .order("start_time", { ascending: false });

    // Calculate stats
    const uniqueGames = new Set(sessions?.map((s) => s.game_id) || []).size;
    const totalSessions = sessions?.length || 0;

    // Calculate total playtime
    const totalPlaytimeHours =
      sessions?.reduce((sum, session) => {
        if (session.start_time && session.end_time) {
          const start = new Date(session.start_time).getTime();
          const end = new Date(session.end_time).getTime();
          const durationMs = end - start;
          return sum + durationMs / 1000 / 3600; // Convert to hours
        }
        return sum;
      }, 0) || 0;

    // Fetch achievements unlocked
    const { data: playerAchievements } = await supabase
      .from("player_achievements")
      .select(
        `
        id,
        unlocked_at,
        achievements (
          id,
          name,
          description,
          points
        )
      `
      )
      .eq("player_id", playerId)
      .order("unlocked_at", { ascending: false })
      .limit(3);

    const recentAchievements =
      playerAchievements?.map((pa) => ({
        id: pa.achievements?.id || pa.id,
        name: pa.achievements?.name || "Achievement",
        description: pa.achievements?.description || "",
        unlocked: pa.unlocked_at
          ? this.formatRelativeTime(pa.unlocked_at)
          : "Unknown",
      })) || [];

    const totalAchievements = playerAchievements?.length || 0;

    // Get recent games from sessions
    const recentGamesMap = new Map<
      string,
      { title: string; lastPlayed: Date; totalDuration: number }
    >();

    sessions?.forEach((session) => {
      const gameId = session.game_id;
      const gameTitle = session.games?.title || "Unknown Game";
      const lastPlayed = new Date(
        (session.end_time as string) || (session.start_time as string)
      );

      if (session.start_time && session.end_time) {
        const start = new Date(session.start_time).getTime();
        const end = new Date(session.end_time).getTime();
        const durationMs = end - start;

        const existing = recentGamesMap.get(gameId);
        if (!existing || lastPlayed > existing.lastPlayed) {
          recentGamesMap.set(gameId, {
            title: gameTitle,
            lastPlayed,
            totalDuration: (existing?.totalDuration || 0) + durationMs,
          });
        } else {
          recentGamesMap.set(gameId, {
            ...existing,
            totalDuration: existing.totalDuration + durationMs,
          });
        }
      }
    });

    const recentGames = Array.from(recentGamesMap.entries())
      .map(([id, game]) => ({
        id,
        title: game.title,
        lastPlayed: this.formatRelativeTime(game.lastPlayed.toISOString()),
        playtimeHours: game.totalDuration / 1000 / 3600,
      }))
      .sort(() => {
        // Sort by most recently played (this is simplified)
        return 0;
      })
      .slice(0, 3);

    return {
      player: {
        id: playerData.id,
        username: playerData.username,
        email: playerData.email,
        country: playerData.country || "Unknown",
        level: playerData.level || 0,
        total_score: playerData.total_score || 0,
        avatar_url: playerData.player_profiles?.avatar_url || null,
      },
      stats: {
        gamesPlayed: uniqueGames,
        totalPlaytimeHours,
        totalSessions,
        achievementsUnlocked: totalAchievements,
      },
      recentAchievements,
      recentGames,
    };
  }

  /**
   * Format relative time string
   */
  private static formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 14) {
      return "1 week ago";
    } else {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    }
  }
}
