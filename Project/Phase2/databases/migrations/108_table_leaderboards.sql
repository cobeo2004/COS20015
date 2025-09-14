-- leaderboards.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the leaderboards table for the database

-- Leaderboards
CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
