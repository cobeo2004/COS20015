-- Player Engagement Analysis Report
-- Combines: players + sessions + achievements + player_profiles
-- Includes: structured data, JSONB settings, image URLs
--
-- Parameters:
--   p_country: Filter by country (optional)
--   p_min_level: Filter by minimum level (optional)
--   p_max_level: Filter by maximum level (optional)
--   p_privacy_setting: Filter by privacy setting (optional)
--   p_theme: Filter by theme preference (optional)
--   p_min_achievements: Filter by minimum achievements unlocked (optional)
CREATE OR REPLACE FUNCTION player_engagement_report(
        p_country TEXT DEFAULT NULL,
        p_min_level INTEGER DEFAULT NULL,
        p_max_level INTEGER DEFAULT NULL,
        p_privacy_setting TEXT DEFAULT NULL,
        p_theme TEXT DEFAULT NULL,
        p_min_achievements INTEGER DEFAULT NULL
    ) RETURNS TABLE (
        player_id UUID,
        username TEXT,
        email TEXT,
        country TEXT,
        level INTEGER,
        total_score INTEGER,
        account_created TIMESTAMPTZ,
        privacy TEXT,
        theme TEXT,
        notifications_enabled BOOLEAN,
        avatar_url TEXT,
        total_sessions BIGINT,
        total_playtime_hours NUMERIC,
        avg_session_duration NUMERIC,
        achievements_unlocked BIGINT,
        achievement_completion_rate NUMERIC,
        days_since_last_session INTEGER,
        retention_score NUMERIC
    ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY WITH player_sessions AS (
        -- Calculate session metrics per player
        SELECT s.player_id,
            COUNT(s.id) as session_count,
            SUM(
                EXTRACT(
                    EPOCH
                    FROM (s.end_time - s.start_time)
                ) / 3600
            ) as total_hours,
            MAX(s.end_time) as last_session_time
        FROM sessions s
        WHERE s.end_time IS NOT NULL
        GROUP BY s.player_id
    ),
    player_achievements_count AS (
        -- Count achievements per player
        SELECT pa.player_id,
            COUNT(pa.id) as achievement_count
        FROM player_achievements pa
        GROUP BY pa.player_id
    ),
    player_data AS (
        -- Main query combining all data
        SELECT p.id,
            p.username::TEXT,
            p.email::TEXT,
            p.country::TEXT,
            p.level::INTEGER,
            p.total_score::INTEGER,
            p.created_at,
            (pp.settings->>'privacy')::TEXT as privacy,
            (pp.settings->>'theme')::TEXT as theme,
            (pp.settings->'notifications'->>'email')::BOOLEAN as notifications_enabled,
            pp.avatar_url::TEXT,
            COALESCE(ps.session_count, 0) as total_sessions,
            COALESCE(ps.total_hours, 0) as total_playtime_hours,
            CASE
                WHEN COALESCE(ps.session_count, 0) > 0 THEN COALESCE(ps.total_hours, 0) / ps.session_count
                ELSE 0
            END as avg_session_duration,
            COALESCE(pac.achievement_count, 0) as achievements_unlocked,
            (
                COALESCE(pac.achievement_count, 0)::NUMERIC / 100.0 * 100.0
            ) as achievement_completion_rate,
            CASE
                WHEN ps.last_session_time IS NOT NULL THEN EXTRACT(
                    DAY
                    FROM (NOW() - ps.last_session_time)
                )::INTEGER
                ELSE 999
            END as days_since_last_session,
            CASE
                WHEN ps.last_session_time IS NOT NULL THEN GREATEST(
                    0,
                    100 - EXTRACT(
                        DAY
                        FROM (NOW() - ps.last_session_time)
                    )::INTEGER
                )::NUMERIC
                ELSE 0::NUMERIC
            END as retention_score
        FROM players p
            LEFT JOIN player_profiles pp ON p.id = pp.player_id
            LEFT JOIN player_sessions ps ON p.id = ps.player_id
            LEFT JOIN player_achievements_count pac ON p.id = pac.player_id
        WHERE (
                p_country IS NULL
                OR p.country::TEXT = p_country
            )
            AND (
                p_min_level IS NULL
                OR p.level >= p_min_level
            )
            AND (
                p_max_level IS NULL
                OR p.level <= p_max_level
            )
    )
SELECT pd.id,
    pd.username,
    pd.email,
    pd.country,
    pd.level,
    pd.total_score,
    pd.created_at,
    pd.privacy,
    pd.theme,
    pd.notifications_enabled,
    pd.avatar_url,
    pd.total_sessions,
    pd.total_playtime_hours,
    pd.avg_session_duration,
    pd.achievements_unlocked,
    pd.achievement_completion_rate,
    pd.days_since_last_session,
    pd.retention_score
FROM player_data pd
WHERE (
        p_privacy_setting IS NULL
        OR pd.privacy = p_privacy_setting
    )
    AND (
        p_theme IS NULL
        OR pd.theme = p_theme
    )
    AND (
        p_min_achievements IS NULL
        OR pd.achievements_unlocked >= p_min_achievements
    )
ORDER BY pd.retention_score DESC,
    pd.total_playtime_hours DESC;
END;
$$;
-- Example usage:
-- SELECT * FROM get_player_engagement_report();
-- SELECT * FROM get_player_engagement_report(p_country := 'USA');
-- SELECT * FROM get_player_engagement_report(p_min_level := 10, p_max_level := 50);
-- SELECT * FROM get_player_engagement_report(p_privacy_setting := 'public', p_theme := 'dark');
-- SELECT * FROM get_player_engagement_report(p_min_achievements := 20);