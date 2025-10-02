-- full.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the full database for the project
-- It includes all the tables and types that are needed for the project
-- It is used to create the database for the project

-- ENUM types

-- ENUM types
CREATE TYPE countries AS ENUM ('AU', 'US', 'UK', 'JP', 'VN'); -- extend list as needed
CREATE TYPE game_genres AS ENUM ('RPG', 'FPS', 'Strategy', 'Puzzle', 'Sports');
CREATE TYPE payment_methods AS ENUM ('CreditCard', 'PayPal', 'Crypto', 'BankTransfer');

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  country countries,
  level SMALLINT CHECK (level <= 100),
  total_score BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Player Profiles (1:1)
CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID UNIQUE NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  bio VARCHAR(255),
  avatar_url CHAR(400),
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Developers
CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Games
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  genre game_genres,
  release_date TIMESTAMPTZ,
  price NUMERIC(10,2),
  developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  score BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  points INT,
  unlock_criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Player Achievements
CREATE TABLE player_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboards
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard Entities (weak entity)
CREATE TABLE leaderboard_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  rank INT,
  score BIGINT,
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Purchases
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ,
  amount NUMERIC(10,2),
  payment_method payment_methods,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for query optimization

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
CREATE INDEX IF NOT EXISTS idx_sessions_player_game ON sessions(player_id, game_id);
CREATE INDEX IF NOT EXISTS idx_sessions_game_start_time ON sessions(game_id, start_time);

-- Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_achievements_game_id ON achievements(game_id);
CREATE INDEX IF NOT EXISTS idx_achievements_points ON achievements(points DESC);

-- Player Achievements table indexes
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_id ON player_achievements(player_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_achievement_id ON player_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_unlocked_at ON player_achievements(unlocked_at);
CREATE INDEX IF NOT EXISTS idx_player_achievements_player_achievement ON player_achievements(player_id, achievement_id);

-- Leaderboards table indexes
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_id ON leaderboards(game_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_type ON leaderboards(type);

-- Leaderboard Entities table indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_id ON leaderboard_entities(leaderboard_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_player_id ON leaderboard_entities(player_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_rank ON leaderboard_entities(rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_score ON leaderboard_entities(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_rank ON leaderboard_entities(leaderboard_id, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_entities_leaderboard_score ON leaderboard_entities(leaderboard_id, score DESC);

-- Purchases table indexes
CREATE INDEX IF NOT EXISTS idx_purchases_player_id ON purchases(player_id);
CREATE INDEX IF NOT EXISTS idx_purchases_game_id ON purchases(game_id);
CREATE INDEX IF NOT EXISTS idx_purchases_purchase_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_method ON purchases(payment_method);
CREATE INDEX IF NOT EXISTS idx_purchases_amount ON purchases(amount);
CREATE INDEX IF NOT EXISTS idx_purchases_player_date ON purchases(player_id, purchase_date DESC);

-- JSONB indexes for flexible queries
CREATE INDEX IF NOT EXISTS idx_player_profiles_settings ON player_profiles USING GIN(settings);
CREATE INDEX IF NOT EXISTS idx_achievements_unlock_criteria ON achievements USING GIN(unlock_criteria);
