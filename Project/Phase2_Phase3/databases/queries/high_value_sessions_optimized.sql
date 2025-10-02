-- Query 5: Filter + Sort with Index Optimization
-- Get high-value sessions with specific criteria, optimized for performance
-- Uses existing indexes: idx_sessions_score, idx_sessions_game_start_time, idx_sessions_player_game, idx_sessions_player_id

WITH recent_active_players AS (
    -- Subquery to identify recently active players (uses idx_sessions_player_id)
    SELECT DISTINCT player_id
    FROM sessions
    WHERE start_time >= CURRENT_DATE - INTERVAL '7 days'
),
high_score_threshold AS (
    -- Subquery to determine high score threshold (90th percentile) (uses idx_sessions_score)
    SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY score DESC) as threshold_score
    FROM sessions
    WHERE start_time >= CURRENT_DATE - INTERVAL '30 days'
)

SELECT
    s.id,
    s.player_id,
    p.username,
    s.game_id,
    g.title AS game_title,
    g.genre,
    s.score,
    EXTRACT(EPOCH FROM (s.end_time - s.start_time))/60 AS duration_minutes,
    s.start_time,
    s.created_at,
    pp.bio,
    p.country,
    CASE
        WHEN s.score > (SELECT threshold_score FROM high_score_threshold) THEN 'ELITE'
        WHEN s.score > (SELECT threshold_score * 0.75 FROM high_score_threshold) THEN 'HIGH'
        WHEN s.score > (SELECT threshold_score * 0.5 FROM high_score_threshold) THEN 'ABOVE_AVERAGE'
        ELSE 'AVERAGE'
    END AS performance_tier
FROM
    sessions s
    JOIN players p ON s.player_id = p.id
    JOIN player_profiles pp ON p.id = pp.player_id
    JOIN games g ON s.game_id = g.id
    JOIN recent_active_players rap ON s.player_id = rap.player_id
WHERE
    s.score >= (SELECT threshold_score * 0.5 FROM high_score_threshold)  -- Uses idx_sessions_score
    AND EXTRACT(EPOCH FROM (s.end_time - s.start_time))/60 >= 10
    AND s.start_time >= CURRENT_DATE - INTERVAL '30 days'  -- Uses idx_sessions_game_start_time
    AND g.genre IN ('RPG', 'FPS', 'Strategy')  -- Filter by popular genres
ORDER BY
    s.score DESC,           -- Primary sort by score (uses idx_sessions_score)
    duration_minutes DESC,  -- Secondary sort by duration
    s.start_time DESC       -- Tertiary sort by start time (uses idx_sessions_game_start_time)
LIMIT 100;  -- Limit results for performance