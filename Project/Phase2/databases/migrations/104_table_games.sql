-- games.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the games table for the database

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
