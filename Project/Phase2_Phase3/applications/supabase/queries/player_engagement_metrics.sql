-- Query 4: GROUP BY with Aggregate Functions
-- Player engagement metrics by country with achievement and purchase statistics
-- Uses COUNT, AVG, SUM, MIN, and DATE_PART aggregate functions

SELECT
    p.country,
    COUNT(p.id) AS total_players,
    COUNT(DISTINCT s.game_id) AS unique_games_played,
    COUNT(s.id) AS total_sessions,
    AVG(EXTRACT(EPOCH FROM (s.end_time - s.start_time))/60) AS avg_session_minutes,
    SUM(EXTRACT(EPOCH FROM (s.end_time - s.start_time))/60) AS total_playtime_minutes,
    COUNT(pa.achievement_id) AS total_achievements_unlocked,
    COUNT(DISTINCT pa.achievement_id) AS unique_achievements,
    COUNT(pur.id) AS total_purchases,
    COALESCE(SUM(pur.amount), 0) AS total_spent,
    AVG(pur.amount) AS avg_purchase_amount,
    MIN(p.created_at) AS earliest_player_signup,
    MAX(s.created_at) AS last_session_date,
    ROUND(COUNT(pa.achievement_id)::NUMERIC / NULLIF(COUNT(p.id), 0), 2) AS achievements_per_player
FROM
    player_profiles pp
    JOIN players p ON pp.player_id = p.id
    LEFT JOIN sessions s ON p.id = s.player_id
    LEFT JOIN player_achievements pa ON p.id = pa.player_id
    LEFT JOIN purchases pur ON p.id = pur.player_id
GROUP BY
    p.country
HAVING
    COUNT(p.id) >= 5
ORDER BY
    total_spent DESC,
    total_players DESC;