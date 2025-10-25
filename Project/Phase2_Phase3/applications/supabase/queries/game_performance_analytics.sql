-- Query 3: GROUP BY with Aggregate Functions
-- Game performance analytics by genre with session statistics and revenue data
-- Uses COUNT, AVG, SUM, and MAX aggregate functions

SELECT
    g.genre,
    COUNT(g.id) AS total_games,
    COUNT(DISTINCT d.id) AS total_developers,
    COUNT(DISTINCT s.player_id) AS unique_players,
    COUNT(s.id) AS total_sessions,
    AVG(EXTRACT(EPOCH FROM (s.end_time - s.start_time))/60) AS avg_session_duration,
    SUM(EXTRACT(EPOCH FROM (s.end_time - s.start_time))/60) AS total_playtime_minutes,
    MAX(s.score) AS highest_score,
    COALESCE(SUM(pur.amount), 0) AS total_revenue,
    COALESCE(AVG(g.price), 0) AS avg_game_price,
    ROUND(AVG(s.score), 2) AS avg_score
FROM
    games g
    LEFT JOIN developers d ON g.developer_id = d.id
    LEFT JOIN sessions s ON g.id = s.game_id
    LEFT JOIN purchases pur ON g.id = pur.game_id
GROUP BY
    g.genre
HAVING
    COUNT(g.id) > 0
ORDER BY
    total_revenue DESC,
    total_playtime_minutes DESC;