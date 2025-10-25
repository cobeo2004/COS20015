-- Ternary Logic in SQL
-- This file demonstrates NULL value handling and three-valued logic (TRUE, FALSE, UNKNOWN)
-- ========================================
-- Query 1: Finding sessions with incomplete data
-- ========================================
-- Demonstrates IS NULL and IS NOT NULL with ternary logic
SELECT s.id as session_id,
    p.username,
    g.title as game_title,
    CASE
        WHEN s.start_time IS NULL THEN 'Not Started'
        WHEN s.end_time IS NULL THEN 'In Progress'
        WHEN s.score IS NULL THEN 'Completed (No Score)'
        ELSE 'Complete'
    END as session_status,
    s.start_time,
    s.end_time,
    s.score,
    CASE
        WHEN s.start_time IS NOT NULL
        AND s.end_time IS NOT NULL THEN EXTRACT(
            EPOCH
            FROM (s.end_time - s.start_time)
        ) / 60
        ELSE NULL
    END as duration_minutes
FROM sessions s
    JOIN players p ON s.player_id = p.id
    JOIN games g ON s.game_id = g.id
WHERE s.start_time IS NULL
    OR s.end_time IS NULL
    OR s.score IS NULL
ORDER BY session_status,
    p.username;
-- ========================================
-- Query 2: Complex ternary logic with achievement unlocking
-- ========================================
-- Demonstrates how NULL values affect logical conditions
SELECT p.username,
    g.title as game_title,
    a.name as achievement_name,
    pa.unlocked_at,
    CASE
        WHEN pa.unlocked_at IS NULL THEN 'Locked'
        WHEN pa.unlocked_at <= CURRENT_DATE - INTERVAL '30 days' THEN 'Veteran'
        WHEN pa.unlocked_at <= CURRENT_DATE - INTERVAL '7 days' THEN 'Recent'
        ELSE 'New'
    END as unlock_status,
    CASE
        WHEN pa.unlocked_at IS NULL THEN 'Keep trying!'
        WHEN pa.unlocked_at <= g.release_date + INTERVAL '7 days' THEN 'Early Achiever!'
        ELSE 'Regular Progress'
    END as achievement_comment
FROM players p
    JOIN player_achievements pa ON p.id = pa.player_id
    JOIN achievements a ON pa.achievement_id = a.id
    JOIN games g ON a.game_id = g.id
WHERE -- This WHERE clause demonstrates ternary logic
    (
        pa.unlocked_at IS NULL
        OR pa.unlocked_at >= CURRENT_DATE - INTERVAL '90 days'
    )
    AND (
        g.release_date IS NULL
        OR g.release_date <= CURRENT_DATE
    )
ORDER BY unlock_status,
    p.username;
-- ========================================
-- Query 3: Demonstrating Three-Valued Logic with NULL Comparisons
-- ========================================
-- This query shows how NULL values affect logical operations
SELECT p.username,
    p.country,
    pp.bio,
    pp.avatar_url,
    CASE
        WHEN pp.bio IS NULL THEN 'No bio provided'
        WHEN LENGTH(pp.bio) < 10 THEN 'Short bio'
        ELSE 'Detailed bio'
    END as bio_status,
    CASE
        WHEN pp.avatar_url IS NULL THEN 'No avatar'
        WHEN pp.avatar_url LIKE 'http%' THEN 'Web avatar'
        ELSE 'Local avatar'
    END as avatar_status
FROM players p
    LEFT JOIN player_profiles pp ON p.id = pp.player_id
WHERE pp.bio IS NULL
    OR pp.avatar_url IS NULL
    OR pp.settings IS NULL
ORDER BY p.username;
-- ========================================
-- Query 4: Complex NULL Logic in Game Data
-- ========================================
-- Finding games with incomplete information
SELECT g.title,
    g.genre,
    g.price,
    g.release_date,
    d.name as developer_name,
    CASE
        WHEN g.price IS NULL
        AND g.release_date IS NULL THEN 'Unreleased - Free'
        WHEN g.price IS NULL
        AND g.release_date IS NOT NULL THEN 'Free Game'
        WHEN g.price IS NOT NULL
        AND g.release_date IS NULL THEN 'Priced - Unreleased'
        WHEN g.price > 50 THEN 'Premium Game'
        ELSE 'Standard Game'
    END as game_category,
    CASE
        WHEN d.name IS NULL THEN 'Unknown Developer'
        ELSE d.name
    END as developer_status
FROM games g
    LEFT JOIN developers d ON g.developer_id = d.id
WHERE g.price IS NULL
    OR g.release_date IS NULL
    OR d.name IS NULL
ORDER BY game_category,
    g.title;
-- ========================================
-- Query 5: NULL handling in player purchases
-- ========================================
-- Demonstrating NULL values in financial data
SELECT p.username,
    pur.id as purchase_id,
    g.title as game_title,
    pur.amount,
    pur.purchase_date,
    CASE
        WHEN pur.amount IS NULL THEN 'Free acquisition'
        WHEN pur.amount = 0 THEN 'Free game'
        WHEN pur.amount < 20 THEN 'Budget purchase'
        WHEN pur.amount < 50 THEN 'Standard purchase'
        ELSE 'Premium purchase'
    END as purchase_category,
    CASE
        WHEN pur.purchase_date IS NULL THEN 'Date not recorded'
        WHEN pur.purchase_date <= CURRENT_DATE - INTERVAL '30 days' THEN 'Old purchase'
        WHEN pur.purchase_date <= CURRENT_DATE - INTERVAL '7 days' THEN 'Recent purchase'
        ELSE 'Very recent purchase'
    END as purchase_timing
FROM players p
    JOIN purchases pur ON p.id = pur.player_id
    JOIN games g ON pur.game_id = g.id
WHERE pur.amount IS NULL
    OR pur.purchase_date IS NULL
    OR g.price IS NULL
ORDER BY purchase_category,
    p.username;
-- ========================================
-- Query 6: COALESCE function examples
-- ========================================
-- Using COALESCE to handle NULL values in calculations
SELECT p.username,
    COUNT(s.id) as total_sessions,
    COUNT(s.score) as scored_sessions,
    COALESCE(SUM(s.score), 0) as total_score,
    COALESCE(AVG(s.score), 0) as average_score,
    COALESCE(MAX(s.score), 0) as highest_score,
    -- Calculate session duration, handling NULL values
    COALESCE(
        AVG(
            CASE
                WHEN s.start_time IS NOT NULL
                AND s.end_time IS NOT NULL THEN EXTRACT(
                    EPOCH
                    FROM (s.end_time - s.start_time)
                ) / 60
                ELSE NULL
            END
        ),
        0
    ) as avg_session_minutes,
    -- Percentage of sessions with scores
    CASE
        WHEN COUNT(s.id) = 0 THEN 0
        ELSE ROUND(COUNT(s.score)::numeric / COUNT(s.id) * 100, 2)
    END as scored_session_percentage
FROM players p
    LEFT JOIN sessions s ON p.id = s.player_id
GROUP BY p.id,
    p.username
ORDER BY total_score DESC;
-- ========================================
-- Query 7: NULLIF function examples
-- ========================================
-- Using NULLIF to handle division by zero and special cases
SELECT g.title,
    COUNT(s.id) as session_count,
    COUNT(pa.achievement_id) as achievement_count,
    -- Avoid division by zero using NULLIF
    CASE
        WHEN COUNT(pa.achievement_id) = 0 THEN 0
        ELSE ROUND(
            COUNT(s.id)::numeric / NULLIF(COUNT(pa.achievement_id), 0),
            2
        )
    END as sessions_per_achievement,
    -- Handle price calculations with NULL values
    CASE
        WHEN COUNT(s.id) = 0 THEN NULL
        WHEN g.price IS NULL THEN NULL
        ELSE ROUND(g.price / NULLIF(COUNT(s.id), 0), 2)
    END as cost_per_session
FROM games g
    LEFT JOIN sessions s ON g.id = s.game_id
    LEFT JOIN achievements a ON g.id = a.game_id
    LEFT JOIN player_achievements pa ON a.id = pa.achievement_id
GROUP BY g.id,
    g.title,
    g.price
ORDER BY session_count DESC;
-- ========================================
-- Query 8: Demonstrating three-valued logic in WHERE clauses
-- ========================================
-- Shows how UNKNOWN results affect filtering
-- This query excludes players with NULL countries
SELECT username,
    country,
    total_score
FROM players
WHERE country IN ('US', 'UK', 'CA', 'AU')
ORDER BY country,
    username;
-- This query explicitly includes players with NULL countries
SELECT username,
    country,
    total_score
FROM players
WHERE country IN ('US', 'UK', 'CA', 'AU')
    OR country IS NULL
ORDER BY country NULLS LAST,
    username;
-- This query shows how NULL affects logical operations
SELECT username,
    total_score,
    country,
    CASE
        WHEN total_score > 1000 THEN 'High scorer'
        WHEN total_score <= 1000 THEN 'Standard scorer'
        ELSE 'No score recorded' -- This handles NULL scores
    END as score_category,
    CASE
        WHEN country IS NULL THEN 'Unknown location'
        WHEN country IN ('US', 'CA') THEN 'North America'
        WHEN country IN ('UK', 'DE', 'FR') THEN 'Europe'
        ELSE 'Other region'
    END as region_category
FROM players
ORDER BY total_score DESC NULLS LAST;