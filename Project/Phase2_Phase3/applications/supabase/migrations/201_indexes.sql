-- indexes.sql
-- Index creation for query optimization
-- Author: Xuan Tuan Minh Nguyen
-- Players table indexes
CREATE INDEX IF NOT EXISTS idx_players_username ON "public"."players"(username);
CREATE INDEX IF NOT EXISTS idx_players_email ON "public"."players"(email);
CREATE INDEX IF NOT EXISTS idx_players_country ON "public"."players"(country);
CREATE INDEX IF NOT EXISTS idx_players_level ON "public"."players"(level);
CREATE INDEX IF NOT EXISTS idx_players_total_score ON "public"."players"(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON "public"."players"(created_at);
-- Player Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_player_profiles_player_id ON "public"."player_profiles"(player_id);
-- Games table indexes
CREATE INDEX IF NOT EXISTS idx_games_developer_id ON "public"."games"(developer_id);
CREATE INDEX IF NOT EXISTS idx_games_genre ON "public"."games"(genre);
CREATE INDEX IF NOT EXISTS idx_games_release_date ON "public"."games"(release_date);
CREATE INDEX IF NOT EXISTS idx_games_price ON "public"."games"(price);
CREATE INDEX IF NOT EXISTS idx_games_title ON "public"."games"(title);
-- Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_sessions_player_id ON "public"."sessions"(player_id);
CREATE INDEX IF NOT EXISTS idx_sessions_game_id ON "public"."sessions"(game_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON "public"."sessions"(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_end_time ON "public"."sessions"(end_time);
CREATE INDEX IF NOT EXISTS idx_sessions_score ON "public"."sessions"(score DESC);
-- Composite index for player-game session queries
CREATE INDEX IF NOT EXISTS idx_sessions_player_game ON "public"."sessions"(player_id, game_id);
-- Composite index for time range queries
CREATE INDEX IF NOT EXISTS idx_sessions_game_start_time ON "public"."sessions"(game_id, start_time);
-- Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_achievements_game_id ON "public"."achievements"(game_id);
CREATE INDEX IF NOT EXISTS idx_achievements_points ON "public"."achievements"(points DESC);
-- Player Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_id ON "public"."player_achievements"(player_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_achievement_id ON "public"."player_achievements"(achievement_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_unlocked_at ON "public"."player_achievements"(unlocked_at);
-- Composite index for player-achievement lookups (prevent duplicate unlocks)
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_achievement ON "public"."player_achievements"(player_id, achievement_id);
-- Leaderboards table indexes
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_id ON "public"."leaderboards"(game_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_type ON "public"."leaderboards"(type);
-- Leaderboard Entities table indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_id ON "public"."leaderboard_entities"(leaderboard_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_player_id ON "public"."leaderboard_entities"(player_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_rank ON "public"."leaderboard_entities"(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_score ON "public"."leaderboard_entities"(score DESC);
-- Composite index for leaderboard rankings
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_rank ON "public"."leaderboard_entities"(leaderboard_id, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_score ON "public"."leaderboard_entities"(leaderboard_id, score DESC);
-- Purchases table indexes
CREATE INDEX IF NOT EXISTS idx_purchases_player_id ON "public"."purchases"(player_id);
CREATE INDEX IF NOT EXISTS idx_purchases_game_id ON "public"."purchases"(game_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchase_date ON "public"."purchases"(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_method ON "public"."purchases"(payment_method);
CREATE INDEX IF NOT EXISTS idx_purchases_amount ON "public"."purchases"(amount);
-- Composite index for player purchase history
CREATE INDEX IF NOT EXISTS idx_purchases_player_date ON "public"."purchases"(player_id, purchase_date DESC);
-- JSONB indexes for flexible queries using GIN indexing technique
CREATE INDEX IF NOT EXISTS idx_player_profiles_settings ON "public"."player_profiles" USING GIN(settings);
CREATE INDEX IF NOT EXISTS idx_achievements_unlock_criteria ON "public"."achievements" USING GIN(unlock_criteria);

-- Additional JSONB indexes for hybrid data reporting performance
-- Developers metadata GIN index for company_size, specialties, founded_year queries
CREATE INDEX IF NOT EXISTS idx_developers_metadata ON "public"."developers" USING GIN(metadata);

-- Games metadata GIN index for ratings, tags, system_requirements queries
CREATE INDEX IF NOT EXISTS idx_games_metadata ON "public"."games" USING GIN(metadata);

-- JSONB path indexes for specific field queries (PostgreSQL 14+)
-- Note: These provide targeted indexing for frequently accessed fields
CREATE INDEX IF NOT EXISTS idx_developers_metadata_company_size ON "public"."developers" USING GIN((metadata->'company_size'));
CREATE INDEX IF NOT EXISTS idx_developers_metadata_specialties ON "public"."developers" USING GIN((metadata->'specialties'));
CREATE INDEX IF NOT EXISTS idx_games_metadata_average_rating ON "public"."games" USING GIN((metadata->'average_rating'));
CREATE INDEX IF NOT EXISTS idx_games_metadata_tags ON "public"."games" USING GIN((metadata->'tags'));