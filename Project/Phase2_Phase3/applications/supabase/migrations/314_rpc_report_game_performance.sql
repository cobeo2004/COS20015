-- Report 1: Game Performance Analytics
-- Combines structured data (tables), semi-structured data (JSONB), and unstructured data (image URLs)
-- Joins: games + sessions + purchases + developers

CREATE OR REPLACE FUNCTION get_game_performance_report(
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_genre game_genres DEFAULT NULL,
  p_developer_id UUID DEFAULT NULL,
  p_min_rating DECIMAL(3,2) DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_min_revenue DECIMAL(10,2) DEFAULT NULL,
  p_sort_direction TEXT DEFAULT 'DESC',
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  game_id UUID,
  game_title TEXT,
  genre TEXT,
  developer_name TEXT,
  -- Structured data
  release_date DATE,
  price DECIMAL(10,2),
  total_sessions BIGINT,
  unique_players BIGINT,
  -- Semi-structured data (JSONB extraction)
  average_rating DECIMAL(3,2),
  total_reviews BIGINT,
  tags TEXT[],
  company_size TEXT,
  specialties TEXT[],
  -- Unstructured data (image URLs)
  cover_image_url TEXT,
  logo_url TEXT,
  -- Calculated metrics
  total_revenue DECIMAL(10,2),
  total_playtime_hours DECIMAL(10,2),
  avg_session_duration DECIMAL(10,2),
  revenue_per_player DECIMAL(10,2)
) AS $$
BEGIN
  IF UPPER(p_sort_direction) NOT IN ('ASC', 'DESC') THEN
    p_sort_direction := 'DESC';
  END IF;

  RETURN QUERY
  WITH game_metrics AS (
    SELECT
      g.id AS game_id,
      g.title,
      g.genre::TEXT,
      g.release_date,
      g.price,
      g.cover_image_url,
      d.name AS developer_name,
      d.logo_url,

      -- Extract JSONB metadata from games
      (g.metadata->>'average_rating')::DECIMAL(3,2) AS avg_rating,
      (g.metadata->>'total_reviews')::BIGINT AS review_count,
      g.metadata->'tags' AS tags,

      -- Extract JSONB metadata from developers
      d.metadata->>'company_size' AS company_size,
      d.metadata->'specialties' AS specialties,

      -- Calculate session metrics
      COUNT(DISTINCT s.id) AS total_sessions,
      COUNT(DISTINCT s.player_id) AS unique_players,
      COALESCE(SUM(s.duration), 0) / 3600.0 AS total_playtime_hours,
      CASE
        WHEN COUNT(s.id) > 0
        THEN COALESCE(SUM(s.duration), 0) / 3600.0 / COUNT(s.id)
        ELSE 0
      END AS avg_session_duration,

      -- Calculate revenue metrics
      COALESCE(SUM(p.amount), 0) AS total_revenue,
      CASE
        WHEN COUNT(DISTINCT s.player_id) > 0
        THEN COALESCE(SUM(p.amount), 0) / COUNT(DISTINCT s.player_id)
        ELSE 0
      END AS revenue_per_player

    FROM games g
    LEFT JOIN developers d ON g.developer_id = d.id
    LEFT JOIN sessions s ON g.id = s.game_id
    LEFT JOIN purchases p ON g.id = p.game_id
    WHERE
      -- Date range filter
      (p_date_from IS NULL OR g.release_date >= p_date_from) AND
      (p_date_to IS NULL OR g.release_date <= p_date_to) AND
      -- Genre filter
      (p_genre IS NULL OR g.genre = p_genre) AND
      -- Developer filter
      (p_developer_id IS NULL OR g.developer_id = p_developer_id) AND
      -- Rating filter
      (p_min_rating IS NULL OR (g.metadata->>'average_rating')::DECIMAL(3,2) >= p_min_rating) AND
      -- Tags filter (JSONB array containment)
      (p_tags IS NULL OR g.metadata->'tags' @> p_tags::jsonb)
    GROUP BY
      g.id, g.title, g.genre, g.release_date, g.price, g.cover_image_url,
      d.name, d.logo_url, avg_rating, review_count, tags, company_size, specialties
  )
  SELECT
    game_id,
    game_title,
    genre,
    developer_name,
    release_date,
    price,
    total_sessions,
    unique_players,
    -- Semi-structured data
    avg_rating AS average_rating,
    review_count AS total_reviews,
    tags,
    company_size,
    specialties,
    -- Unstructured data
    cover_image_url,
    logo_url,
    -- Calculated metrics
    total_revenue,
    total_playtime_hours,
    avg_session_duration,
    revenue_per_player
  FROM game_metrics
  WHERE
    -- Revenue filter (applied after calculation)
    (p_min_revenue IS NULL OR total_revenue >= p_min_revenue)
  ORDER BY
    CASE WHEN UPPER(p_sort_direction) = 'DESC' THEN total_revenue END DESC NULLS LAST,
    CASE WHEN UPPER(p_sort_direction) != 'DESC' THEN total_revenue END ASC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION get_game_performance_report IS 'Report 1: Game Performance Analytics - Combines games, sessions, purchases, and developers with JSONB metadata and image URLs. Supports filtering by date range, genre, developer, rating, and tags with sorting options.';