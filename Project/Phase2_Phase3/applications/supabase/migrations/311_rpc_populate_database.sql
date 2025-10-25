-- 311_rpc_populate_database.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate the entire database

CREATE OR REPLACE FUNCTION populate_database()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Starting database population...';

    -- Populate in dependency order
    PERFORM populate_developers();
    PERFORM populate_games();
    PERFORM populate_players();
    PERFORM populate_player_profiles();
    PERFORM populate_achievements();
    PERFORM populate_leaderboards();
    PERFORM populate_purchases();
    PERFORM populate_sessions();
    PERFORM populate_player_achievements();
    PERFORM populate_leaderboard_entities();

    RAISE NOTICE 'Database population completed successfully!';

    -- Display statistics
    RAISE NOTICE 'Database Statistics:';
    RAISE NOTICE '- Developers: %', (SELECT COUNT(*) FROM developers);
    RAISE NOTICE '- Games: %', (SELECT COUNT(*) FROM games);
    RAISE NOTICE '- Players: %', (SELECT COUNT(*) FROM players);
    RAISE NOTICE '- Sessions: %', (SELECT COUNT(*) FROM sessions);
    RAISE NOTICE '- Leaderboard Entries: %', (SELECT COUNT(*) FROM leaderboard_entities);
    RAISE NOTICE '- Achievements: %', (SELECT COUNT(*) FROM achievements);
    RAISE NOTICE '- Player Achievements: %', (SELECT COUNT(*) FROM player_achievements);
    RAISE NOTICE '- Purchases: %', (SELECT COUNT(*) FROM purchases);
END;
$$ LANGUAGE plpgsql;
