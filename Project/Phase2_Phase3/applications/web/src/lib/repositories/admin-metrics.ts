import { supabase } from "../supabase";

export interface AdminMetrics {
  totalPlayers: number;
  activeGames: number;
  totalRevenue: number;
  engagementRate: number;
}

export interface RecentActivity {
  id: string;
  type: "game" | "achievement" | "purchase" | "player";
  action: string;
  details: string;
  time: string;
  timestamp: Date;
}

export class AdminMetricsRepository {
  /**
   * Get admin dashboard metrics
   */
  static async getMetrics(): Promise<AdminMetrics> {
    // Fetch total players
    const { count: totalPlayers } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true });

    // Fetch active games (games with at least one session in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: activeSessions } = await supabase
      .from("sessions")
      .select("game_id")
      .gte("start_time", thirtyDaysAgo.toISOString());

    const activeGameIds = new Set(activeSessions?.map((s) => s.game_id) || []);
    const activeGames = activeGameIds.size;

    // Fetch total revenue from purchases
    const { data: purchases } = await supabase
      .from("purchases")
      .select("amount");

    const totalRevenue =
      purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Calculate engagement rate (players with sessions in last 7 days / total players)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentSessions } = await supabase
      .from("sessions")
      .select("player_id")
      .gte("start_time", sevenDaysAgo.toISOString());

    const activePlayers = new Set(recentSessions?.map((s) => s.player_id) || [])
      .size;
    const engagementRate = totalPlayers
      ? (activePlayers / totalPlayers) * 100
      : 0;

    return {
      totalPlayers: totalPlayers || 0,
      activeGames,
      totalRevenue,
      engagementRate,
    };
  }

  /**
   * Get recent platform activity
   */
  static async getRecentActivity(): Promise<RecentActivity[]> {
    const activities: RecentActivity[] = [];

    // Recent games (last 2)
    const { data: recentGames } = await supabase
      .from("games")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    recentGames?.forEach((game) => {
      activities.push({
        id: `game-${game.id}`,
        type: "game",
        action: "New game published",
        details: game.title,
        time: this.formatRelativeTime(
          game.created_at ?? new Date().toISOString()
        ),
        timestamp: new Date(game.created_at ?? new Date().toISOString()),
      });
    });

    // Recent achievements unlocked
    const { data: recentAchievements } = await supabase
      .from("player_achievements")
      .select(
        `
        id,
        unlocked_at,
        players (username),
        achievements (name)
      `
      )
      .order("unlocked_at", { ascending: false })
      .limit(3);

    recentAchievements?.forEach((pa) => {
      activities.push({
        id: `achievement-${pa.id}`,
        type: "achievement",
        action: "Achievement unlocked",
        details: `${pa.players?.username || "Player"} - ${
          pa.achievements?.name || "Achievement"
        }`,
        time: this.formatRelativeTime(
          pa.unlocked_at || new Date().toISOString()
        ),
        timestamp: new Date(pa.unlocked_at || new Date()),
      });
    });

    // Recent purchases
    const { data: recentPurchases } = await supabase
      .from("purchases")
      .select("id, amount, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    recentPurchases?.forEach((purchase) => {
      activities.push({
        id: `purchase-${purchase.id}`,
        type: "purchase",
        action: "Purchase completed",
        details: `$${(purchase.amount || 0).toFixed(2)}`,
        time: this.formatRelativeTime(
          purchase.created_at || new Date().toISOString()
        ),
        timestamp: new Date(purchase.created_at || new Date()),
      });
    });

    // Recent players joined
    const { data: recentPlayers } = await supabase
      .from("players")
      .select("id, username, created_at")
      .order("created_at", { ascending: false })
      .limit(2);

    recentPlayers?.forEach((player) => {
      activities.push({
        id: `player-${player.id}`,
        type: "player",
        action: "New player joined",
        details: player.username,
        time: this.formatRelativeTime(
          player.created_at || new Date().toISOString()
        ),
        timestamp: new Date(player.created_at || new Date()),
      });
    });

    // Sort by most recent and limit to 6 activities
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6);
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
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  }
}
