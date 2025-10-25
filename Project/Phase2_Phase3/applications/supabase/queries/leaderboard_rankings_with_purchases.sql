-- Query 2: JOIN Operation (5 tables)
-- Get leaderboard rankings with player purchase history and game information
-- This query joins leaderboards, leaderboard_entities, players, player_profiles, games, and purchases tables

SELECT
    l.type AS leaderboard_type,
    le.rank AS rank_position,
    le.score,
    p.username,
    p.country,
    pp.bio,
    g.title AS game_title,
    g.price AS game_price,
    pur.purchase_date,
    pur.payment_method,
    pur.amount AS purchase_amount
FROM
    leaderboard_entities le
    JOIN leaderboards l ON le.leaderboard_id = l.id
    JOIN players p ON le.player_id = p.id
    JOIN player_profiles pp ON p.id = pp.player_id
    JOIN games g ON l.game_id = g.id
    LEFT JOIN purchases pur ON p.id = pur.player_id AND pur.game_id = g.id
WHERE
    le.rank <= 10
    AND l.type ILIKE '%score%'
ORDER BY
    l.type,
    le.rank,
    le.score DESC;