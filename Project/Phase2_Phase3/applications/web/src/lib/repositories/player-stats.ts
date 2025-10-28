import { supabase } from "../supabase";

export interface PlayerStats {
  performance: {
    totalScore: number;
    gamesPlayed: number;
    achievementsUnlocked: number;
    achievementsTotal: number;
    achievementCompletionRate: number;
  };
  time: {
    totalPlaytimeHours: number;
    avgSessionDuration: number;
    thisWeekHours: number;
    thisMonthHours: number;
  };
  sessions: Array<{
    id: string;
    gameTitle: string;
    startTime: string;
    endTime: string | null;
    durationHours: number;
  }>;
}

export class PlayerStatsRepository {
  /**
   * Get detailed player statistics
   */
  static async getPlayerStats(playerId: string): Promise<PlayerStats> {
    // Fetch player basic data
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("total_score, level")
      .eq("id", playerId)
      .single();

    if (playerError)
      throw new Error(`Failed to fetch player: ${playerError.message}`);

    // Fetch all sessions for this player
    const { data: sessions } = await supabase
      .from("sessions")
      .select(
        `
        id,
        game_id,
        start_time,
        end_time,
        games (title)
      `
      )
      .eq("player_id", playerId)
      .order("start_time", { ascending: false });

    // Calculate time statistics
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let totalPlaytimeMs = 0;
    let thisWeekMs = 0;
    let thisMonthMs = 0;
    const sessionsWithDuration: Array<{
      id: string;
      gameTitle: string;
      startTime: string;
      endTime: string | null;
      durationHours: number;
    }> = [];

    sessions?.forEach((session) => {
      if (session.start_time && session.end_time) {
        const start = new Date(session.start_time);
        const end = new Date(session.end_time);
        const durationMs = end.getTime() - start.getTime();

        totalPlaytimeMs += durationMs;

        if (start >= oneWeekAgo) {
          thisWeekMs += durationMs;
        }
        if (start >= oneMonthAgo) {
          thisMonthMs += durationMs;
        }

        sessionsWithDuration.push({
          id: session.id,
          gameTitle: session.games?.title || "Unknown Game",
          startTime: session.start_time,
          endTime: session.end_time,
          durationHours: durationMs / 1000 / 3600,
        });
      }
    });

    const totalPlaytimeHours = totalPlaytimeMs / 1000 / 3600;
    const avgSessionDuration =
      sessions && sessions.length > 0
        ? totalPlaytimeHours / sessions.length
        : 0;
    const thisWeekHours = thisWeekMs / 1000 / 3600;
    const thisMonthHours = thisMonthMs / 1000 / 3600;

    // Fetch achievements
    const { count: achievementsUnlocked } = await supabase
      .from("player_achievements")
      .select("*", { count: "exact", head: true })
      .eq("player_id", playerId);

    const { count: achievementsTotal } = await supabase
      .from("achievements")
      .select("*", { count: "exact", head: true });

    const achievementCompletionRate =
      achievementsTotal && achievementsTotal > 0
        ? ((achievementsUnlocked || 0) / achievementsTotal) * 100
        : 0;

    // Calculate unique games played
    const uniqueGames = new Set(sessions?.map((s) => s.game_id) || []).size;

    return {
      performance: {
        totalScore: player?.total_score || 0,
        gamesPlayed: uniqueGames,
        achievementsUnlocked: achievementsUnlocked || 0,
        achievementsTotal: achievementsTotal || 0,
        achievementCompletionRate,
      },
      time: {
        totalPlaytimeHours,
        avgSessionDuration,
        thisWeekHours,
        thisMonthHours,
      },
      sessions: sessionsWithDuration.slice(0, 20), // Limit to last 20 sessions
    };
  }
}
