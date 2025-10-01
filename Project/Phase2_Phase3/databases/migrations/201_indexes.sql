-- ndexes.sql
-- Index creation for query optimization
-- Author: Xuan Tuan Minh Nguyen

-- Players table indexes
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_country ON players(country);
CREATE INDEX IF NOT EXISTS idx_players_level ON players(level);
CREATE INDEX IF NOT EXISTS idx_players_total_score ON players(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_players_created_at ON players(created_at);

-- Player Profiles table indexes
CREATE INDEX IF NOT EXISTS idx_player_profiles_player_id ON player_profiles(player_id);

-- Games table indexes
CREATE INDEX IF NOT EXISTS idx_games_developer_id ON games(developer_id);
CREATE INDEX IF NOT EXISTS idx_games_genre ON games(genre);
CREATE INDEX IF NOT EXISTS idx_games_release_date ON games(release_date);
CREATE INDEX IF NOT EXISTS idx_games_price ON games(price);
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);

-- Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_sessions_player_id ON sessions(player_id);
CREATE INDEX IF NOT EXISTS idx_sessions_game_id ON sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_end_time ON sessions(end_time);
CREATE INDEX IF NOT EXISTS idx_sessions_score ON sessions(score DESC);
-- Composite index for player-game session queries
CREATE INDEX IF NOT EXISTS idx_sessions_player_game ON sessions(player_id, game_id);
-- Composite index for time range queries
CREATE INDEX IF NOT EXISTS idx_sessions_game_start_time ON sessions(game_id, start_time);

-- Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_achievements_game_id ON achievements(game_id);
CREATE INDEX IF NOT EXISTS idx_achievements_points ON achievements(points DESC);

-- Player Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_id ON player_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_achievement_id ON player_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_unlocked_at ON player_achievements(unlocked_at);
-- Composite index for player-achievement lookups (prevent duplicate unlocks)
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_achievement ON player_achievements(player_id, achievement_id);

-- Leaderboards table indexes
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_id ON leaderboards(game_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_type ON leaderboards(type);

-- Leaderboard Entities table indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_id ON leaderboard_entities(leaderboard_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_player_id ON leaderboard_entities(player_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_rank ON leaderboard_entities(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_score ON leaderboard_entities(score DESC);
-- Composite index for leaderboard rankings
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_rank ON leaderboard_entities(leaderboard_id, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_score ON leaderboard_entities(leaderboard_id, score DESC);

-- Purchases table indexes
CREATE INDEX IF NOT EXISTS idx_purchases_player_id ON purchases(player_id);
CREATE INDEX IF NOT EXISTS idx_purchases_game_id ON purchases(game_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchase_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_method ON purchases(payment_method);
CREATE INDEX IF NOT EXISTS idx_purchases_amount ON purchases(amount);
-- Composite index for player purchase history
CREATE INDEX IF NOT EXISTS idx_purchases_player_date ON purchases(player_id, purchase_date DESC);

-- JSONB indexes for flexible queries
CREATE INDEX IF NOT EXISTS idx_player_profiles_settings ON player_profiles USING GIN(settings);
CREATE INDEX IF NOT EXISTS idx_achievements_unlock_criteria ON achievements USING GIN(unlock_criteria);
