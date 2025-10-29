/**
 * Type definitions for hybrid data management system
 * Combines structured (PostgreSQL), semi-structured (JSONB), and unstructured (images) data
 */

// ============================================
// Semi-Structured Data Types (JSONB Metadata)
// ============================================

/**
 * Developer metadata stored in JSONB column
 * Contains flexible company information
 */
export interface DeveloperMetadata {
  company_size?: string; // e.g., 'Medium (50-500 employees)', 'Large (500+ employees)'
  founded_year?: number;
  headquarters?: string; // e.g., 'Rockville, MD, USA'
  specialties?: string[]; // e.g., ['RPG', 'Open-world', 'Fantasy']
  awards?: string[]; // e.g., ['Game of the Year 2011', 'Best RPG 2015']
  social_links?: {
    website?: string;
    twitter?: string;
    discord?: string;
  };
  employee_count?: number;
  annual_revenue?: number;
}

/**
 * Game metadata stored in JSONB column
 * Contains ratings, reviews, and flexible game information
 */
export interface GameMetadata {
  average_rating?: number; // 0-5 stars
  total_reviews?: number;
  tags?: string[]; // e.g., ['simulation', 'realistic', 'competitive', 'online']
  screenshots?: string[]; // Array of screenshot URLs
  reviews_summary?: {
    positive_percentage: number;
    negative_percentage: number;
  };
  system_requirements?: {
    min_ram_gb?: number;
    min_storage_gb?: number;
    recommended_gpu?: string;
    platforms?: string[]; // ['Windows', 'Mac', 'Linux']
  };
  content_rating?: 'E' | 'E10+' | 'T' | 'M' | 'AO'; // ESRB ratings
  languages?: string[];
  dlc_count?: number;
  dlc_available?: boolean;
  early_access?: boolean;
  peak_concurrent_players?: number;
  last_updated?: string; // ISO date string
}

/**
 * Player profile settings stored in JSONB column
 * Contains user preferences and privacy settings
 */
export interface PlayerSettings {
  privacy?: 'public' | 'friends' | 'private';
  theme?: 'light' | 'dark' | 'auto';
  notifications?: {
    email?: boolean;
    push?: boolean;
    achievements?: boolean;
    friend_requests?: boolean;
  };
  display_preferences?: {
    show_online_status?: boolean;
    show_achievements?: boolean;
    show_playtime?: boolean;
  };
  language?: string;
  timezone?: string;
}

// ============================================
// Report Data Structures
// ============================================

/**
 * Report 1: Game Performance Analytics
 * Combines games + sessions + purchases + developers
 */
export interface GamePerformanceReport {
  game_id: string;
  game_title: string;
  genre: string;
  developer_name: string;
  // Structured data (from tables)
  release_date: string;
  price: number;
  total_sessions: number;
  unique_players: number;
  // Semi-structured data (from JSONB)
  average_rating?: number;
  total_reviews?: number;
  tags?: string[];
  company_size?: string;
  specialties?: string[];
  // Unstructured data (image URLs)
  cover_image_url?: string;
  logo_url?: string;
  // Calculated metrics
  total_revenue: number;
  total_playtime_hours: number;
  avg_session_duration: number;
  revenue_per_player: number;
}

/**
 * Report 2: Player Engagement Analysis
 * Combines players + sessions + achievements + player_profiles
 */
export interface PlayerEngagementReport {
  player_id: string;
  username: string;
  email: string;
  // Structured data (from tables)
  country: string;
  level: number;
  total_score: number;
  account_created: string;
  // Semi-structured data (from JSONB)
  privacy?: string;
  theme?: string;
  notifications_enabled?: boolean;
  // Unstructured data (image URLs)
  avatar_url?: string;
  // Calculated metrics
  total_sessions: number;
  total_playtime_hours: number;
  avg_session_duration: number;
  achievements_unlocked: number;
  achievement_completion_rate: number;
  days_since_last_session: number;
  retention_score: number;
}

/**
 * Report 3: Developer Success Dashboard
 * Combines developers + games + purchases + sessions
 */
export interface DeveloperSuccessReport {
  developer_id: string;
  developer_name: string;
  email?: string;
  // Structured data (from tables)
  total_games: number;
  earliest_release_date?: string;
  latest_release_date?: string;
  // Semi-structured data (from JSONB)
  company_size?: string;
  founded_year?: number;
  headquarters?: string;
  specialties?: string[];
  awards_count?: number;
  // Unstructured data (image URLs)
  logo_url?: string;
  // Calculated metrics
  total_revenue: number;
  total_players: number;
  avg_game_rating: number;
  total_playtime_hours: number;
  revenue_per_game: number;
  active_players_last_30_days: number;
}

// ============================================
// Filter Types for Reports
// ============================================

export interface GamePerformanceFilters {
  dateFrom?: string;
  dateTo?: string;
  genre?: string;
  developerId?: string;
  minRating?: number;
  tags?: string[];
  minRevenue?: number;
}

export interface PlayerEngagementFilters {
  country?: string;
  minLevel?: number;
  maxLevel?: number;
  dateFrom?: string;
  dateTo?: string;
  privacySetting?: string;
  theme?: string;
  minAchievements?: number;
}

export interface DeveloperSuccessFilters {
  dateFrom?: string;
  dateTo?: string;
  minRevenue?: number;
  companySize?: string;
  minFoundedYear?: number;
  specialty?: string;
}

// ============================================
// Sort Types for Reports
// ============================================

export type GamePerformanceSortField =
  | 'game_title'
  | 'total_revenue'
  | 'total_playtime_hours'
  | 'unique_players'
  | 'average_rating'
  | 'release_date';

export type PlayerEngagementSortField =
  | 'username'
  | 'level'
  | 'total_playtime_hours'
  | 'achievements_unlocked'
  | 'retention_score'
  | 'days_since_last_session';

export type DeveloperSuccessSortField =
  | 'developer_name'
  | 'total_revenue'
  | 'total_games'
  | 'avg_game_rating'
  | 'total_players';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T extends string> {
  field: T;
  direction: SortDirection;
}

// ============================================
// Type Guards for JSONB Validation
// ============================================

/**
 * Type guard to check if value is valid DeveloperMetadata
 */
export function isDeveloperMetadata(value: unknown): value is DeveloperMetadata {
  if (!value || typeof value !== 'object') return false;
  const meta = value as DeveloperMetadata;

  // Optional validation - if fields exist, they should be correct type
  if (meta.company_size && typeof meta.company_size !== 'string') return false;
  if (meta.founded_year && typeof meta.founded_year !== 'number') return false;
  if (meta.headquarters && typeof meta.headquarters !== 'string') return false;
  if (meta.specialties && !Array.isArray(meta.specialties)) return false;
  if (meta.awards && !Array.isArray(meta.awards)) return false;

  return true;
}

/**
 * Type guard to check if value is valid GameMetadata
 */
export function isGameMetadata(value: unknown): value is GameMetadata {
  if (!value || typeof value !== 'object') return false;
  const meta = value as GameMetadata;

  if (meta.average_rating !== undefined && (typeof meta.average_rating !== 'number' || meta.average_rating < 0 || meta.average_rating > 5)) {
    return false;
  }
  if (meta.total_reviews !== undefined && typeof meta.total_reviews !== 'number') return false;
  if (meta.tags && !Array.isArray(meta.tags)) return false;
  if (meta.screenshots && !Array.isArray(meta.screenshots)) return false;
  if (meta.early_access !== undefined && typeof meta.early_access !== 'boolean') return false;
  if (meta.dlc_available !== undefined && typeof meta.dlc_available !== 'boolean') return false;
  if (meta.peak_concurrent_players !== undefined && typeof meta.peak_concurrent_players !== 'number') return false;

  return true;
}

/**
 * Type guard to check if value is valid PlayerSettings
 */
export function isPlayerSettings(value: unknown): value is PlayerSettings {
  if (!value || typeof value !== 'object') return false;
  const settings = value as PlayerSettings;

  if (settings.privacy && !['public', 'friends', 'private'].includes(settings.privacy)) {
    return false;
  }
  if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
    return false;
  }

  return true;
}

// ============================================
// Export Data Types (for CSV/PDF)
// ============================================

export interface ExportConfig {
  filename: string;
  includeTimestamp?: boolean;
  format?: 'csv' | 'pdf';
}

export interface CSVExportOptions extends ExportConfig {
  delimiter?: string;
  headers?: string[];
}

export interface PDFExportOptions extends ExportConfig {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  includeCharts?: boolean;
}
