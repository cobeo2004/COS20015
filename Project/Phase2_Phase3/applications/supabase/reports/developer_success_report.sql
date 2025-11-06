-- Developer Success Dashboard Report
-- Combines: developers + games + purchases + sessions
-- Includes: structured data, JSONB metadata, image URLs
--
-- Parameters:
--   p_min_revenue: Filter by minimum total revenue (optional)
--   p_company_size: Filter by company size (optional)
--   p_min_founded_year: Filter by minimum founded year (optional)
--   p_specialty: Filter by specialty (optional)
CREATE OR REPLACE FUNCTION developer_success_report(
        p_min_revenue NUMERIC DEFAULT NULL,
        p_company_size TEXT DEFAULT NULL,
        p_min_founded_year INTEGER DEFAULT NULL,
        p_specialty TEXT DEFAULT NULL
    ) RETURNS TABLE (
        developer_id UUID,
        developer_name TEXT,
        email TEXT,
        total_games BIGINT,
        earliest_release_date DATE,
        latest_release_date DATE,
        company_size TEXT,
        founded_year INTEGER,
        headquarters TEXT,
        specialties JSONB,
        awards_count INTEGER,
        logo_url TEXT,
        total_revenue NUMERIC,
        total_players BIGINT,
        avg_game_rating NUMERIC,
        total_playtime_hours NUMERIC,
        revenue_per_game NUMERIC,
        active_players_last_30_days BIGINT
    ) LANGUAGE plpgsql AS $$ BEGIN RETURN QUERY WITH developer_games AS (
        -- Get all games per developer with their release dates
        SELECT g.developer_id,
            COUNT(g.id) as game_count,
            MIN(g.release_date) as earliest_release,
            MAX(g.release_date) as latest_release
        FROM games g
        GROUP BY g.developer_id
    ),
    game_revenue AS (
        -- Calculate revenue per game
        SELECT g.developer_id,
            SUM(p.amount) as total_revenue
        FROM games g
            LEFT JOIN purchases p ON g.id = p.game_id
        GROUP BY g.developer_id
    ),
    game_sessions AS (
        -- Calculate session metrics per developer
        SELECT g.developer_id,
            COUNT(DISTINCT s.player_id) as unique_players,
            SUM(
                EXTRACT(
                    EPOCH
                    FROM (s.end_time - s.start_time)
                ) / 3600
            ) as total_hours,
            COUNT(
                DISTINCT CASE
                    WHEN s.end_time >= NOW() - INTERVAL '30 days' THEN s.player_id
                END
            ) as active_players_30d
        FROM games g
            LEFT JOIN sessions s ON g.id = s.game_id
        WHERE s.end_time IS NOT NULL
        GROUP BY g.developer_id
    ),
    game_ratings AS (
        -- Calculate average ratings per developer
        SELECT g.developer_id,
            AVG((g.metadata->>'average_rating')::NUMERIC) as avg_rating,
            COUNT(
                CASE
                    WHEN (g.metadata->>'average_rating')::NUMERIC IS NOT NULL THEN 1
                END
            ) as rating_count
        FROM games g
        WHERE (g.metadata->>'average_rating') IS NOT NULL
        GROUP BY g.developer_id
    ),
    developer_data AS (
        -- Main query combining all data
        SELECT d.id,
            d.name::TEXT,
            d.email::TEXT,
            COALESCE(dg.game_count, 0) as total_games,
            dg.earliest_release::DATE,
            dg.latest_release::DATE,
            (d.metadata->>'company_size')::TEXT as company_size,
            (d.metadata->>'founded_year')::INTEGER as founded_year,
            (d.metadata->>'headquarters')::TEXT as headquarters,
            d.metadata->'specialties' as specialties,
            CASE
                WHEN jsonb_typeof(d.metadata->'awards') = 'array' THEN jsonb_array_length(d.metadata->'awards')
                ELSE 0
            END as awards_count,
            d.logo_url::TEXT,
            COALESCE(gr.total_revenue, 0) as total_revenue,
            COALESCE(gs.unique_players, 0) as total_players,
            COALESCE(grat.avg_rating, 0) as avg_game_rating,
            COALESCE(gs.total_hours, 0) as total_playtime_hours,
            CASE
                WHEN COALESCE(dg.game_count, 0) > 0 THEN COALESCE(gr.total_revenue, 0) / dg.game_count
                ELSE 0
            END as revenue_per_game,
            COALESCE(gs.active_players_30d, 0) as active_players_last_30_days
        FROM developers d
            LEFT JOIN developer_games dg ON d.id = dg.developer_id
            LEFT JOIN game_revenue gr ON d.id = gr.developer_id
            LEFT JOIN game_sessions gs ON d.id = gs.developer_id
            LEFT JOIN game_ratings grat ON d.id = grat.developer_id
    )
SELECT dd.id,
    dd.name,
    dd.email,
    dd.total_games,
    dd.earliest_release,
    dd.latest_release,
    dd.company_size,
    dd.founded_year,
    dd.headquarters,
    dd.specialties,
    dd.awards_count,
    dd.logo_url,
    dd.total_revenue,
    dd.total_players,
    dd.avg_game_rating,
    dd.total_playtime_hours,
    dd.revenue_per_game,
    dd.active_players_last_30_days
FROM developer_data dd
WHERE (
        p_min_revenue IS NULL
        OR dd.total_revenue >= p_min_revenue
    )
    AND (
        p_company_size IS NULL
        OR dd.company_size = p_company_size
    )
    AND (
        p_min_founded_year IS NULL
        OR dd.founded_year >= p_min_founded_year
    )
    AND (
        p_specialty IS NULL
        OR EXISTS (
            SELECT 1
            FROM jsonb_array_elements_text(dd.specialties) as specialty
            WHERE specialty = p_specialty
        )
    )
ORDER BY dd.total_revenue DESC,
    dd.total_players DESC;
END;
$$;