-- 311_rpc_clear_populated_data.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to clear the entire database

CREATE OR REPLACE FUNCTION clear_database()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Clearing all database tables...';

    -- Clear in reverse dependency order
    DELETE FROM leaderboard_entities;
    DELETE FROM leaderboards;
    DELETE FROM player_achievements;
    DELETE FROM achievements;
    DELETE FROM sessions;
    DELETE FROM purchases;
    DELETE FROM player_profiles;
    DELETE FROM players;
    DELETE FROM games;
    DELETE FROM developers;

    RAISE NOTICE 'Database cleared successfully!';
END;
$$ LANGUAGE plpgsql;
