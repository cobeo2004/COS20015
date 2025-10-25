-- developers.sql
-- 2025-09-14
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the developers table for the database
CREATE TABLE IF NOT EXISTS "public"."developers" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);