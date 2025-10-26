-- 311_rpc_clear_populated_data.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to clear the entire database
CREATE OR REPLACE FUNCTION clear_database() RETURNS void AS $$ BEGIN RAISE NOTICE 'Clearing all database tables...';
-- Clear in reverse dependency order
DELETE FROM "public"."leaderboard_entities";
DELETE FROM "public"."leaderboards";
DELETE FROM "public"."player_achievements";
DELETE FROM "public"."achievements";
DELETE FROM "public"."sessions";
DELETE FROM "public"."purchases";
DELETE FROM "public"."player_profiles";
DELETE FROM "public"."players";
DELETE FROM "public"."games";
DELETE FROM "public"."developers";
RAISE NOTICE 'Database cleared successfully!';
END;
$$ LANGUAGE plpgsql;