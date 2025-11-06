-- Game Performance Analytics Report
-- Combines: games + sessions + purchases + developers
-- Includes: structured data (tables), JSONB metadata, image URLs
--
-- Parameters:
--   p_genre: Filter by game genre (optional)
--   p_developer_id: Filter by developer ID (optional)
--   p_date_from: Filter by release date from (optional)
--   p_date_to: Filter by release date to (optional)
--   p_min_rating: Filter by minimum average rating (optional)
--   p_min_revenue: Filter by minimum total revenue (optional)
--   p_tags: Filter by tags (optional, array of strings)
CREATE OR REPLACE FUNCTION game_performance_report(
        p_genre TEXT DEFAULT NULL,
        p_developer_id UUID DEFAULT NULL,
        p_date_from DATE DEFAULT NULL,
        p_date_to DATE DEFAULT NULL,
        p_min_rating NUMERIC DEFAULT NULL,
        p_min_revenue NUMERIC DEFAULT NULL,
        p_tags TEXT [] DEFAULT NULL
    ) RETURNS TABLE (
        game_id UUID,
        game_title TEXT,
        genre TEXT,
        developer_name TEXT,
        release_date DATE,
        price NUMERIC,
        total_sessions BIGINT,
        unique_players BIGINT,
        average_rating NUMERIC,
        total_reviews INTEGER,
        tags JSONB,
        company_size TEXT,
        specialties JSONB,
        cover_image_url TEXT,
        logo_url TEXT,
        total_revenue NUMERIC,
        total_playtime_hours NUMERIC,
        avg_session_duration NUMERIC,
        revenue_per_player NUMERIC
    ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY WITH game_sessions AS (
        -- Calculate session metrics per game
        SELECT s.game_id,
            COUNT(s.id) as session_count,
            COUNT(DISTINCT s.player_id) as player_count,
            SUM(
                EXTRACT(
                    EPOCH
                    FROM (s.end_time - s.start_time)
                ) / 3600
            ) as total_hours
        FROM sessions s
        WHERE s.end_time IS NOT NULL
        GROUP BY s.game_id
    ),
    game_purchases AS (
        -- Calculate purchase metrics per game
        SELECT p.game_id,
            SUM(p.amount) as total_revenue
        FROM purchases p
        GROUP BY p.game_id
    ),
    game_data AS (
        -- Main query combining all data
        SELECT g.id,
            g.title::TEXT,
            g.genre::TEXT,
            d.name::TEXT as developer_name,
            g.release_date::DATE,
            g.price,
            COALESCE(gs.session_count, 0) as total_sessions,
            COALESCE(gs.player_count, 0) as unique_players,
            (g.metadata->>'average_rating')::NUMERIC as average_rating,
            (g.metadata->>'total_reviews')::INTEGER as total_reviews,
            g.metadata->'tags' as tags,
            (d.metadata->>'company_size')::TEXT as company_size,
            d.metadata->'specialties' as specialties,
            g.cover_image_url::TEXT,
            d.logo_url::TEXT,
            COALESCE(gp.total_revenue, 0) as total_revenue,
            COALESCE(gs.total_hours, 0) as total_playtime_hours,
            CASE
                WHEN COALESCE(gs.session_count, 0) > 0 THEN COALESCE(gs.total_hours, 0) / gs.session_count
                ELSE 0
            END as avg_session_duration,
            CASE
                WHEN COALESCE(gs.player_count, 0) > 0 THEN COALESCE(gp.total_revenue, 0) / gs.player_count
                ELSE 0
            END as revenue_per_player
        FROM games g
            LEFT JOIN developers d ON g.developer_id = d.id
            LEFT JOIN game_sessions gs ON g.id = gs.game_id
            LEFT JOIN game_purchases gp ON g.id = gp.game_id
        WHERE (
                p_genre IS NULL
                OR g.genre::TEXT = p_genre
            )
            AND (
                p_developer_id IS NULL
                OR g.developer_id = p_developer_id
            )
            AND (
                p_date_from IS NULL
                OR g.release_date >= p_date_from
            )
            AND (
                p_date_to IS NULL
                OR g.release_date <= p_date_to
            )
            AND (
                p_min_rating IS NULL
                OR (g.metadata->>'average_rating')::NUMERIC >= p_min_rating
            )
    )
SELECT gd.id,
    gd.title,
    gd.genre,
    gd.developer_name,
    gd.release_date,
    gd.price,
    gd.total_sessions,
    gd.unique_players,
    gd.average_rating,
    gd.total_reviews,
    gd.tags,
    gd.company_size,
    gd.specialties,
    gd.cover_image_url,
    gd.logo_url,
    gd.total_revenue,
    gd.total_playtime_hours,
    gd.avg_session_duration,
    gd.revenue_per_player
FROM game_data gd
WHERE (
        p_min_revenue IS NULL
        OR gd.total_revenue >= p_min_revenue
    )
    AND (
        p_tags IS NULL
        OR p_tags = '{}'::TEXT []
        OR EXISTS (
            SELECT 1
            FROM jsonb_array_elements_text(gd.tags) as tag
            WHERE tag = ANY(p_tags)
        )
    )
ORDER BY gd.total_revenue DESC,
    gd.unique_players DESC;
END;
$$;