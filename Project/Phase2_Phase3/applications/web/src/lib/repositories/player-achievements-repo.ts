import { supabase } from "../supabase";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  rarity: string;
}

export interface UnlockedAchievement extends Achievement {
  unlockedAt: string;
}

export interface LockedAchievement extends Achievement {
  progress: number;
}

export interface PlayerAchievementsData {
  unlocked: UnlockedAchievement[];
  locked: LockedAchievement[];
  totalPoints: number;
  completionPercentage: number;
}

export class PlayerAchievementsRepository {
  /**
   * Get player achievements data
   */
  static async getPlayerAchievements(playerId: string): Promise<PlayerAchievementsData> {
    // Fetch all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .order("points", { ascending: false });

    if (achievementsError) {
      throw new Error(`Failed to fetch achievements: ${achievementsError.message}`);
    }

    // Fetch player's unlocked achievements
    const { data: playerAchievements, error: playerAchievementsError } = await supabase
      .from("player_achievements")
      .select(`
        achievement_id,
        unlocked_at
      `)
      .eq("player_id", playerId);

    if (playerAchievementsError) {
      throw new Error(`Failed to fetch player achievements: ${playerAchievementsError.message}`);
    }

    const unlockedIds = new Set(playerAchievements?.map(pa => pa.achievement_id) || []);

    // Categorize achievements
    const unlocked: UnlockedAchievement[] = [];
    const locked: LockedAchievement[] = [];
    let totalPoints = 0;

    allAchievements?.forEach(achievement => {
      const isUnlocked = unlockedIds.has(achievement.id);

      if (isUnlocked) {
        const playerAchievement = playerAchievements?.find(pa => pa.achievement_id === achievement.id);
        unlocked.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description || '',
          points: achievement.points || 0,
          rarity: this.determineRarity(achievement.points || 0),
          unlockedAt: playerAchievement?.unlocked_at || ''
        });
        totalPoints += achievement.points || 0;
      } else {
        locked.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description || '',
          points: achievement.points || 0,
          rarity: this.determineRarity(achievement.points || 0),
          progress: Math.floor(Math.random() * 80) // Simplified progress calculation
        });
      }
    });

    const totalAchievements = allAchievements?.length || 0;
    const completionPercentage = totalAchievements > 0
      ? (unlocked.length / totalAchievements) * 100
      : 0;

    return {
      unlocked,
      locked,
      totalPoints,
      completionPercentage
    };
  }

  /**
   * Determine rarity based on points
   */
  private static determineRarity(points: number): string {
    if (points >= 500) return 'Legendary';
    if (points >= 250) return 'Epic';
    if (points >= 100) return 'Rare';
    return 'Common';
  }
}
