-- Query 1: JOIN Operation (4 tables)
-- Get detailed player achievement information including game details and player profiles
-- This query joins players, player_profiles, player_achievements, achievements, and games tables

SELECT
    p.username,
    p.country,
    pp.bio,
    g.title AS game_title,
    g.genre AS game_genre,
    a.name AS achievement_name,
    a.description AS achievement_description,
    pa.unlocked_at,
    p.created_at AS player_since
FROM
    player_achievements pa
    JOIN players p ON pa.player_id = p.id
    JOIN player_profiles pp ON p.id = pp.player_id
    JOIN achievements a ON pa.achievement_id = a.id
    JOIN games g ON a.game_id = g.id
WHERE
    pa.unlocked_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY
    pa.unlocked_at DESC,
    g.title,
    a.name;