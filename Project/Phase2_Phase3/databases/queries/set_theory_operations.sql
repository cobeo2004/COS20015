-- Set Theory Operations in SQL
-- This file demonstrates UNION, INTERSECT, and EXCEPT operations using the gaming database
-- ========================================
-- UNION Operation Example
-- ========================================
-- Combining High-Value Players and Achievement Hunters
-- This query demonstrates the UNION set operation to find players who are either
-- high-value customers OR achievement-focused players
WITH high_value_players AS (
    -- Players who have spent more than average on games
    SELECT p.id,
        p.username,
        p.country,
        p.total_score,
        'High Value Customer' as player_type,
        COALESCE(SUM(pur.amount), 0) as total_spent,
        COUNT(pur.id) as purchase_count
    FROM players p
        LEFT JOIN purchases pur ON p.id = pur.player_id
    GROUP BY p.id,
        p.username,
        p.country,
        p.total_score
    HAVING COALESCE(SUM(pur.amount), 0) > (
            SELECT COALESCE(AVG(amount), 0)
            FROM purchases
        )
),
achievement_hunters AS (
    -- Players who have unlocked more than average number of achievements
    SELECT p.id,
        p.username,
        p.country,
        p.total_score,
        'Achievement Hunter' as player_type,
        COALESCE(SUM(pur.amount), 0) as total_spent,
        COUNT(pur.id) as purchase_count
    FROM players p
        LEFT JOIN player_achievements pa ON p.id = pa.player_id
        LEFT JOIN purchases pur ON p.id = pur.player_id
    GROUP BY p.id,
        p.username,
        p.country,
        p.total_score
    HAVING COUNT(pa.achievement_id) > (
            SELECT AVG(achievement_count)
            FROM (
                    SELECT COUNT(pa2.achievement_id) as achievement_count
                    FROM players p2
                        LEFT JOIN player_achievements pa2 ON p2.id = pa2.player_id
                    GROUP BY p2.id
                ) as avg_achievements
        )
) -- UNION operation combines both sets, removing duplicates
SELECT *
FROM high_value_players
UNION
SELECT *
FROM achievement_hunters
ORDER BY total_spent DESC,
    total_score DESC;
-- ========================================
-- INTERSECT Operation Example
-- ========================================
-- Players Who Are Both High-Value and Achievement Hunters
-- This query finds players who meet both criteria (intersection of two sets)
WITH high_value_players AS (
    SELECT p.id,
        p.username,
        p.country,
        p.total_score
    FROM players p
        LEFT JOIN purchases pur ON p.id = pur.player_id
    GROUP BY p.id,
        p.username,
        p.country,
        p.total_score
    HAVING COALESCE(SUM(pur.amount), 0) > (
            SELECT COALESCE(AVG(amount), 0)
            FROM purchases
        )
),
achievement_hunters AS (
    SELECT p.id,
        p.username,
        p.country,
        p.total_score
    FROM players p
        LEFT JOIN player_achievements pa ON p.id = pa.player_id
    GROUP BY p.id,
        p.username,
        p.country,
        p.total_score
    HAVING COUNT(pa.achievement_id) > (
            SELECT AVG(achievement_count)
            FROM (
                    SELECT COUNT(pa2.achievement_id) as achievement_count
                    FROM players p2
                        LEFT JOIN player_achievements pa2 ON p2.id = pa2.player_id
                    GROUP BY p2.id
                ) as avg_achievements
        )
)
SELECT *
FROM high_value_players
INTERSECT
SELECT *
FROM achievement_hunters
ORDER BY total_score DESC;
-- ========================================
-- EXCEPT Operation Example
-- ========================================
-- Players Who Are High-Value But Not Achievement Hunters
-- This query finds players who are in the first set but not in the second set
WITH high_value_players AS (
    SELECT p.id,
        p.username,
        p.country,
        p.total_score
    FROM players p
        LEFT JOIN purchases pur ON p.id = pur.player_id
    GROUP BY p.id,
        p.username,
        p.country,
        p.total_score
    HAVING COALESCE(SUM(pur.amount), 0) > (
            SELECT COALESCE(AVG(amount), 0)
            FROM purchases
        )
),
achievement_hunters AS (
    SELECT p.id,
        p.username,
        p.country,
        p.total_score
    FROM players p
        LEFT JOIN player_achievements pa ON p.id = pa.player_id
    GROUP BY p.id,
        p.username,
        p.country,
        p.total_score
    HAVING COUNT(pa.achievement_id) > (
            SELECT AVG(achievement_count)
            FROM (
                    SELECT COUNT(pa2.achievement_id) as achievement_count
                    FROM players p2
                        LEFT JOIN player_achievements pa2 ON p2.id = pa2.player_id
                    GROUP BY p2.id
                ) as avg_achievements
        )
)
SELECT *
FROM high_value_players
EXCEPT
SELECT *
FROM achievement_hunters
ORDER BY total_score DESC;
-- ========================================
-- Multiple Set Operations Example
-- ========================================
-- Combining different game categories with set operations
-- Find games that are either expensive OR have high achievement counts
-- but NOT both (symmetric difference)
WITH expensive_games AS (
    SELECT g.id,
        g.title,
        g.genre,
        g.price
    FROM games g
    WHERE g.price > (
            SELECT COALESCE(AVG(price), 0)
            FROM games
            WHERE price IS NOT NULL
        )
),
achievement_rich_games AS (
    SELECT g.id,
        g.title,
        g.genre,
        g.price
    FROM games g
        JOIN achievements a ON g.id = a.game_id
    GROUP BY g.id,
        g.title,
        g.genre,
        g.price
    HAVING COUNT(a.id) > (
            SELECT AVG(achievement_count)
            FROM (
                    SELECT COUNT(a2.id) as achievement_count
                    FROM games g3
                        LEFT JOIN achievements a2 ON g3.id = a2.game_id
                    GROUP BY g3.id
                ) as avg_achievements
        )
)
SELECT *
FROM expensive_games
EXCEPT
SELECT *
FROM achievement_rich_games
UNION
SELECT *
FROM achievement_rich_games
EXCEPT
SELECT *
FROM expensive_games
ORDER BY price DESC NULLS LAST;