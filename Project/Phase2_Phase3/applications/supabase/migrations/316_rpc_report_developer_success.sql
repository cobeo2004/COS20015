-- Report 3: Developer Success Dashboard
-- Combines structured data (tables), semi-structured data (JSONB), and unstructured data (image URLs)
-- Joins: developers + games + purchases + sessions

CREATE OR REPLACE FUNCTION get_developer_success_report(
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_min_revenue DECIMAL(10,2) DEFAULT NULL,
  p_company_size TEXT DEFAULT NULL,
  p_min_founded_year INT DEFAULT NULL,
  p_specialty TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'total_revenue',
  p_sort_direction TEXT DEFAULT 'DESC',
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  developer_id UUID,
  developer_name TEXT,
  email TEXT,
  -- Structured data
  total_games BIGINT,
  earliest_release_date DATE,
  latest_release_date DATE,
  -- Semi-structured data (JSONB extraction)
  company_size TEXT,
  founded_year INT,
  headquarters TEXT,
  specialties TEXT[],
  awards_count BIGINT,
  -- Unstructured data (image URLs)
  logo_url TEXT,
  -- Calculated metrics
  total_revenue DECIMAL(10,2),
  total_players BIGINT,
  avg_game_rating DECIMAL(3,2),
  total_playtime_hours DECIMAL(10,2),
  revenue_per_game DECIMAL(10,2),
  active_players_last_30_days BIGINT
) AS $$
DECLARE
  v_sort_clause TEXT;
BEGIN
  -- Validate company size
  IF p_company_size IS NOT NULL AND p_company_size NOT IN (
    'Indie (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (200-500)', 'Enterprise (500+)'
  ) THEN
    p_company_size := NULL;
  END IF;

  -- Validate and build sort clause
  v_sort_clause := CASE
    WHEN p_sort_by = 'developer_name' THEN 'd.name'
    WHEN p_sort_by = 'total_revenue' THEN 'total_revenue'
    WHEN p_sort_by = 'total_games' THEN 'total_games'
    WHEN p_sort_by = 'avg_game_rating' THEN 'avg_game_rating'
    WHEN p_sort_by = 'total_players' THEN 'total_players'
    ELSE 'total_revenue'
  END;

  IF UPPER(p_sort_direction) NOT IN ('ASC', 'DESC') THEN
    p_sort_direction := 'DESC';
  END IF;

  RETURN QUERY
  WITH developer_game_metrics AS (
    SELECT
      d.id AS developer_id,
      d.name,
      d.email,
      d.logo_url,

      -- Extract JSONB metadata from developers
      d.metadata->>'company_size' AS company_size,
      (d.metadata->>'founded_year')::INT AS founded_year,
      -- Concatenate headquarters city and country
      CASE
        WHEN d.metadata->>'headquarters' IS NOT NULL
        THEN (d.metadata->'headquarters'->>'city') || ', ' || (d.metadata->'headquarters'->>'country')
        ELSE NULL
      END AS headquarters,
      d.metadata->'specialties' AS specialties,
      jsonb_array_length(d.metadata->'awards') AS awards_count,

      -- Game counts and release dates
      COUNT(DISTINCT g.id) AS total_games,
      MIN(g.release_date) AS earliest_release_date,
      MAX(g.release_date) AS latest_release_date,

      -- Calculate revenue metrics across all games
      COALESCE(SUM(p.amount), 0) AS total_revenue,
      CASE
        WHEN COUNT(DISTINCT g.id) > 0
        THEN COALESCE(SUM(p.amount), 0) / COUNT(DISTINCT g.id)
        ELSE 0
      END AS revenue_per_game,

      -- Calculate player metrics
      COUNT(DISTINCT s.player_id) AS total_players,

      -- Calculate playtime metrics
      COALESCE(SUM(s.duration), 0) / 3600.0 AS total_playtime_hours,

      -- Calculate average rating from game metadata
      CASE
        WHEN COUNT(g.id) > 0
        THEN AVG(COALESCE((g.metadata->>'average_rating')::DECIMAL(3,2), 0))
        ELSE 0
      END AS avg_game_rating,

      -- Count active players in last 30 days
      COUNT(DISTINCT CASE
        WHEN s.session_start >= NOW() - INTERVAL '30 days'
        THEN s.player_id
        ELSE NULL
      END) AS active_players_last_30_days

    FROM developers d
    LEFT JOIN games g ON d.id = g.developer_id
    LEFT JOIN purchases p ON g.id = p.game_id
    LEFT JOIN sessions s ON g.id = s.game_id
    WHERE
      -- Company size filter (JSONB)
      (p_company_size IS NULL OR d.metadata->>'company_size' = p_company_size) AND
      -- Founded year filter (JSONB)
      (p_min_founded_year IS NULL OR (d.metadata->>'founded_year')::INT >= p_min_founded_year) AND
      -- Specialty filter (JSONB array containment)
      (p_specialty IS NULL OR d.metadata->'specialties' @> to_jsonb(p_specialty)) AND
      -- Date range filter for game releases
      (p_date_from IS NULL OR g.release_date >= p_date_from) AND
      (p_date_to IS NULL OR g.release_date <= p_date_to)
    GROUP BY
      d.id, d.name, d.email, d.logo_url,
      company_size, founded_year, headquarters, specialties, awards_count
  )
  SELECT
    developer_id,
    developer_name,
    email,
    -- Structured data
    total_games,
    earliest_release_date,
    latest_release_date,
    -- Semi-structured data (JSONB)
    company_size,
    founded_year,
    headquarters,
    specialties,
    awards_count,
    -- Unstructured data (image URL)
    logo_url,
    -- Calculated metrics
    total_revenue,
    total_players,
    avg_game_rating,
    total_playtime_hours,
    revenue_per_game,
    active_players_last_30_days
  FROM developer_game_metrics
  WHERE
    -- Revenue filter (applied after calculation)
    (p_min_revenue IS NULL OR total_revenue >= p_min_revenue)
  ORDER BY
    CASE
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'd.name' THEN developer_name
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'total_revenue' THEN total_revenue
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'total_games' THEN total_games
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'avg_game_rating' THEN avg_game_rating
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'total_players' THEN total_players
      WHEN UPPER(p_sort_direction) = 'ASC' THEN total_revenue
    END ASC NULLS LAST,
    CASE
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'd.name' THEN developer_name
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'total_revenue' THEN total_revenue
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'total_games' THEN total_games
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'avg_game_rating' THEN avg_game_rating
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'total_players' THEN total_players
      WHEN UPPER(p_sort_direction) = 'DESC' THEN total_revenue
    END DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION get_developer_success_report IS 'Report 3: Developer Success Dashboard - Combines developers, games, purchases, and sessions with JSONB metadata and logo URLs. Supports filtering by date range, company size, founded year, and specialty with sorting options.';