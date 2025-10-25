-- Database Isolation Levels in PostgreSQL
-- This file demonstrates transaction examples with different isolation levels
-- ========================================
-- Read Committed Isolation Level (Default in PostgreSQL)
-- ========================================
-- Each transaction sees a snapshot of the database as of the start of each query within the transaction
-- Good balance between consistency and performance, prevents dirty reads
-- Example 1: Session recording transaction
BEGIN ISOLATION LEVEL READ COMMITTED;
UPDATE players
SET total_score = total_score + 1000
WHERE id = 'player-uuid';
INSERT INTO sessions (player_id, game_id, score)
VALUES ('player-uuid', 'game-uuid', 1000);
COMMIT;
-- Example 2: Simple purchase transaction
BEGIN ISOLATION LEVEL READ COMMITTED;
-- Check player balance
SELECT total_score
FROM players
WHERE id = 'player-uuid';
-- Process purchase
UPDATE players
SET total_score = total_score - 50
WHERE id = 'player-uuid';
INSERT INTO purchases (player_id, game_id, amount)
VALUES ('player-uuid', 'game-uuid', 50);
COMMIT;
-- Example 3: Leaderboard update with read committed
BEGIN ISOLATION LEVEL READ COMMITTED;
-- Get current rank
SELECT rank
FROM leaderboard_entities
WHERE leaderboard_id = 'game-uuid'
    AND player_id = 'player-uuid';
-- Update rank if needed
UPDATE leaderboard_entities
SET score = score + 100
WHERE leaderboard_id = 'game-uuid'
    AND player_id = 'player-uuid';
COMMIT;
-- ========================================
-- Repeatable Read Isolation Level
-- ========================================
-- Transaction sees a snapshot of the database as of the start of the transaction
-- Prevents dirty reads and non-repeatable reads, provides consistent view throughout transaction
-- Example 1: Achievement unlocking transaction
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Check if achievement already unlocked
SELECT achievement_id
FROM player_achievements
WHERE player_id = 'player-uuid'
    AND achievement_id = 'achievement-uuid';
-- If not unlocked, proceed with unlocking
INSERT INTO player_achievements (player_id, achievement_id, unlocked_at)
VALUES ('player-uuid', 'achievement-uuid', NOW());
COMMIT;
-- Example 2: Player profile update with multiple steps
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Get current profile data
SELECT *
FROM player_profiles
WHERE player_id = 'player-uuid';
-- Update multiple fields in a consistent way
UPDATE player_profiles
SET bio = 'Updated bio',
    avatar_url = 'new-avatar.jpg'
WHERE player_id = 'player-uuid';
-- Verify the update
SELECT bio,
    avatar_url
FROM player_profiles
WHERE player_id = 'player-uuid';
COMMIT;
-- Example 3: Complex session analytics
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Get player statistics at transaction start
SELECT COUNT(*) as total_sessions,
    COALESCE(SUM(score), 0) as total_score,
    COALESCE(AVG(score), 0) as avg_score
FROM sessions
WHERE player_id = 'player-uuid'
    AND game_id = 'game-uuid';
-- Insert new session (consistent with the stats above)
INSERT INTO sessions (player_id, game_id, score, start_time, end_time)
VALUES (
        'player-uuid',
        'game-uuid',
        1500,
        NOW() - INTERVAL '1 hour',
        NOW()
    );
-- Calculate new statistics (will be consistent)
SELECT COUNT(*) as new_total_sessions,
    COALESCE(SUM(score), 0) as new_total_score,
    COALESCE(AVG(score), 0) as new_avg_score
FROM sessions
WHERE player_id = 'player-uuid'
    AND game_id = 'game-uuid';
COMMIT;
-- ========================================
-- Serializable Isolation Level
-- ========================================
-- Highest level of isolation; transactions behave as if executed serially
-- Complete protection against all concurrency anomalies, but with performance overhead
-- Example 1: Tournament prize distribution
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- Update leaderboard rankings
UPDATE leaderboard_entities
SET rank = rank + 1
WHERE leaderboard_id = 'tournament-uuid'
    AND rank >= 5;
-- Insert new champion
INSERT INTO leaderboard_entities (leaderboard_id, player_id, rank, score)
VALUES ('tournament-uuid', 'champion-uuid', 5, 100000);
COMMIT;
-- Example 2: In-game purchase with strict validation
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- Check player balance (repeatable read)
SELECT total_score
FROM players
WHERE id = 'player-uuid';
-- Validate and process purchase
DO $$
DECLARE player_balance INTEGER;
game_price INTEGER := 50;
BEGIN
SELECT total_score INTO player_balance
FROM players
WHERE id = 'player-uuid';
IF player_balance >= game_price THEN
UPDATE players
SET total_score = total_score - game_price
WHERE id = 'player-uuid';
INSERT INTO purchases (player_id, game_id, amount)
VALUES ('player-uuid', 'game-uuid', game_price);
ELSE RAISE EXCEPTION 'Insufficient funds: balance=%, price=%',
player_balance,
game_price;
END IF;
END $$;
COMMIT;
-- Example 3: Critical inventory management
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- Check current inventory
SELECT COUNT(*) as current_inventory
FROM player_achievements
WHERE player_id = 'player-uuid'
    AND achievement_id = 'rare-item-uuid';
-- Award rare item if conditions are met
DO $$
DECLARE has_item BOOLEAN;
player_level INTEGER;
BEGIN
SELECT COUNT(*) > 0 INTO has_item
FROM player_achievements
WHERE player_id = 'player-uuid'
    AND achievement_id = 'rare-item-uuid';
SELECT total_score INTO player_level
FROM players
WHERE id = 'player-uuid';
IF NOT has_item
AND player_level >= 10000 THEN
INSERT INTO player_achievements (player_id, achievement_id, unlocked_at)
VALUES ('player-uuid', 'rare-item-uuid', NOW());
ELSIF has_item THEN RAISE EXCEPTION 'Player already has this rare item';
ELSE RAISE EXCEPTION 'Player level insufficient: % < 10000',
player_level;
END IF;
END $$;
COMMIT;
-- ========================================
-- Retry Function for Serializable Transactions
-- ========================================
-- Robust retry function for handling serialization failures
CREATE OR REPLACE FUNCTION safe_transaction_with_retry() RETURNS void AS $$
DECLARE retry_count INTEGER := 0;
max_retries INTEGER := 3;
BEGIN LOOP BEGIN BEGIN ISOLATION LEVEL SERIALIZABLE;
-- Your transaction logic here
-- Example: Transfer achievement points between players
UPDATE players
SET total_score = total_score - 100
WHERE id = 'player1-uuid';
UPDATE players
SET total_score = total_score + 100
WHERE id = 'player2-uuid';
COMMIT;
EXIT;
-- Success, exit retry loop
EXCEPTION
WHEN serialization_failure THEN retry_count := retry_count + 1;
IF retry_count >= max_retries THEN RAISE;
END IF;
-- Wait briefly before retry
PERFORM pg_sleep(0.1 * retry_count);
END;
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- ========================================
-- Comparison Example: Leaderboard Updates
-- ========================================
-- Problem: Concurrent leaderboard updates causing inconsistent rankings
-- Different isolation levels handle this differently
-- Read Committed (may cause issues)
BEGIN ISOLATION LEVEL READ COMMITTED;
-- Two concurrent transactions might read same rank value
SELECT rank
FROM leaderboard_entities
WHERE leaderboard_id = 'game-uuid'
ORDER BY rank DESC
LIMIT 1;
UPDATE leaderboard_entities
SET rank = rank + 1
WHERE player_id = 'player-uuid';
COMMIT;
-- Repeatable Read (better consistency)
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- Consistent view within transaction
SELECT rank
FROM leaderboard_entities
WHERE leaderboard_id = 'game-uuid'
ORDER BY rank DESC
LIMIT 1;
UPDATE leaderboard_entities
SET rank = rank + 1
WHERE player_id = 'player-uuid';
COMMIT;
-- Serializable (ensures absolute consistency)
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- Serialized execution prevents race conditions
SELECT rank
FROM leaderboard_entities
WHERE leaderboard_id = 'game-uuid'
ORDER BY rank DESC
LIMIT 1;
UPDATE leaderboard_entities
SET rank = rank + 1
WHERE player_id = 'player-uuid';
COMMIT;
-- ========================================
-- Performance Impact Analysis
-- ========================================
-- Queries to analyze the performance impact of different isolation levels
-- Test query for isolation level performance
CREATE OR REPLACE FUNCTION test_isolation_performance(
        isolation_level TEXT,
        iterations INTEGER DEFAULT 100
    ) RETURNS TABLE(
        test_isolation_level TEXT,
        execution_time_ms NUMERIC
    ) AS $$
DECLARE start_time TIMESTAMP;
end_time TIMESTAMP;
i INTEGER;
BEGIN -- Record start time
start_time := clock_timestamp();
-- Run test iterations
FOR i IN 1..iterations LOOP EXECUTE format('BEGIN ISOLATION LEVEL %s', isolation_level);
-- Simple read operation
PERFORM COUNT(*)
FROM players
WHERE total_score > 1000;
-- Simple write operation
INSERT INTO sessions (player_id, game_id, score, start_time, end_time)
VALUES ('test-player', 'test-game', 100, NOW(), NOW());
-- Clean up test data
DELETE FROM sessions
WHERE player_id = 'test-player';
COMMIT;
END LOOP;
-- Record end time and calculate duration
end_time := clock_timestamp();
RETURN QUERY
SELECT isolation_level,
    EXTRACT(
        EPOCH
        FROM (end_time - start_time)
    ) * 1000;
END;
$$ LANGUAGE plpgsql;
-- ========================================
-- Isolation Level Recommendations
-- ========================================
-- Use cases for different isolation levels in gaming context
/*
 RECOMMENDATIONS:
 
 1. Use READ COMMITTED for:
 - Session logging
 - Analytics data collection
 - Non-critical updates
 - High-frequency, low-risk operations
 
 2. Use REPEATABLE READ for:
 - Achievement unlocking
 - Player profile updates
 - Multi-step operations
 - Reporting transactions requiring consistency
 
 3. Use SERIALIZABLE for:
 - Financial transactions
 - Tournament operations
 - Critical inventory management
 - Operations requiring absolute consistency
 
 4. Implement retry logic for REPEATABLE READ and SERIALIZABLE:
 - Use the safe_transaction_with_retry() function above
 - Handle serialization_failure exceptions
 - Implement exponential backoff for retries
 */