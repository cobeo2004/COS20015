-- test_population.sql
-- Test script for database population functions
-- Run this script to test the population functions

-- Usage instructions:
-- 1. Connect to your database: psql -d your_database_name
-- 2. Run the population functions: \i populate_database.sql
-- 3. Run the test script below

\echo 'Testing database population functions...'

-- Test 1: Clear existing data
SELECT clear_database();

-- Test 2: Populate the entire database
SELECT populate_database();

-- Test 3: Verify table counts
\echo 'Verifying table counts:'

SELECT
    'developers' as table_name, COUNT(*) as record_count FROM developers
UNION ALL
SELECT
    'games' as table_name, COUNT(*) as record_count FROM games
UNION ALL
SELECT
    'players' as table_name, COUNT(*) as record_count FROM players
UNION ALL
SELECT
    'player_profiles' as table_name, COUNT(*) as record_count FROM player_profiles
UNION ALL
SELECT
    'sessions' as table_name, COUNT(*) as record_count FROM sessions
UNION ALL
SELECT
    'achievements' as table_name, COUNT(*) as record_count FROM achievements
UNION ALL
SELECT
    'player_achievements' as table_name, COUNT(*) as record_count FROM player_achievements
UNION ALL
SELECT
    'leaderboards' as table_name, COUNT(*) as record_count FROM leaderboards
UNION ALL
SELECT
    'leaderboard_entities' as table_name, COUNT(*) as record_count FROM leaderboard_entities
UNION ALL
SELECT
    'purchases' as table_name, COUNT(*) as record_count FROM purchases
ORDER BY record_count DESC;

-- Test 4: Sample data verification
\echo 'Sample data from largest tables:'

-- Sample from sessions (largest table)
\echo 'Sample sessions:'
SELECT s.id, p.username, g.title, s.score, s.start_time
FROM sessions s
JOIN players p ON s.player_id = p.id
JOIN games g ON s.game_id = g.id
LIMIT 5;

-- Sample from leaderboard_entities (largest table)
\echo 'Sample leaderboard entries:'
SELECT le.rank, p.username, g.title, l.type, le.score
FROM leaderboard_entities le
JOIN leaderboards l ON le.leaderboard_id = l.id
JOIN players p ON le.player_id = p.id
JOIN games g ON l.game_id = g.id
ORDER BY le.rank
LIMIT 10;

\echo 'Population test completed successfully!'