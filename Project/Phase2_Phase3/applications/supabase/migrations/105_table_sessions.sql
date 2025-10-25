-- sessions.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the sessions table for the database
CREATE TABLE IF NOT EXISTS "public"."sessions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  score BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);