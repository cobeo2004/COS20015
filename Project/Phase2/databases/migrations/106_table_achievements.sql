-- achievements.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the achievements table for the database

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  points INT,
  unlock_criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
