-- Report 2: Player Engagement Analysis
-- Combines structured data (tables), semi-structured data (JSONB), and unstructured data (image URLs)
-- Joins: players + sessions + achievements + player_profiles

CREATE OR REPLACE FUNCTION get_player_engagement_report(
  p_country countries DEFAULT NULL,
  p_min_level INT DEFAULT NULL,
  p_max_level INT DEFAULT NULL,
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_privacy_setting TEXT DEFAULT NULL,
  p_theme TEXT DEFAULT NULL,
  p_min_achievements INT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'retention_score',
  p_sort_direction TEXT DEFAULT 'DESC',
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  player_id UUID,
  username TEXT,
  email TEXT,
  -- Structured data
  country TEXT,
  level INT,
  total_score BIGINT,
  account_created TIMESTAMP WITH TIME ZONE,
  -- Semi-structured data (JSONB extraction)
  privacy TEXT,
  theme TEXT,
  notifications_enabled BOOLEAN,
  -- Unstructured data (image URLs)
  avatar_url TEXT,
  -- Calculated metrics
  total_sessions BIGINT,
  total_playtime_hours DECIMAL(10,2),
  avg_session_duration DECIMAL(10,2),
  achievements_unlocked BIGINT,
  achievement_completion_rate DECIMAL(5,2),
  days_since_last_session INT,
  retention_score DECIMAL(5,2)
) AS $$
DECLARE
  v_sort_clause TEXT;
BEGIN
  -- Validate privacy setting
  IF p_privacy_setting IS NOT NULL AND p_privacy_setting NOT IN ('public', 'friends', 'private') THEN
    p_privacy_setting := NULL;
  END IF;

  -- Validate theme
  IF p_theme IS NOT NULL AND p_theme NOT IN ('light', 'dark', 'auto') THEN
    p_theme := NULL;
  END IF;

  -- Validate and build sort clause
  v_sort_clause := CASE
    WHEN p_sort_by = 'username' THEN 'p.username'
    WHEN p_sort_by = 'level' THEN 'p.level'
    WHEN p_sort_by = 'total_playtime_hours' THEN 'total_playtime_hours'
    WHEN p_sort_by = 'achievements_unlocked' THEN 'achievements_unlocked'
    WHEN p_sort_by = 'retention_score' THEN 'retention_score'
    WHEN p_sort_by = 'days_since_last_session' THEN 'days_since_last_session'
    ELSE 'retention_score'
  END;

  IF UPPER(p_sort_direction) NOT IN ('ASC', 'DESC') THEN
    p_sort_direction := 'DESC';
  END IF;

  RETURN QUERY
  WITH player_metrics AS (
    SELECT
      p.id AS player_id,
      p.username,
      p.email,
      p.country::TEXT,
      p.level,
      p.total_score,
      p.created_at,
      pp.avatar_url,

      -- Extract JSONB settings from player_profiles
      pp.settings->>'privacy' AS privacy,
      pp.settings->>'theme' AS theme,
      (pp.settings->'notifications'->>'email')::BOOLEAN AS notifications_enabled,

      -- Calculate session metrics
      COUNT(DISTINCT s.id) AS total_sessions,
      COALESCE(SUM(s.duration), 0) / 3600.0 AS total_playtime_hours,
      CASE
        WHEN COUNT(s.id) > 0
        THEN COALESCE(SUM(s.duration), 0) / 3600.0 / COUNT(s.id)
        ELSE 0
      END AS avg_session_duration,

      -- Get last session date for retention calculation
      MAX(s.session_end) AS last_session_date,

      -- Calculate achievement metrics
      COUNT(DISTINCT pa.id) AS achievements_unlocked

    FROM players p
    LEFT JOIN player_profiles pp ON p.id = pp.player_id
    LEFT JOIN sessions s ON p.id = s.player_id
    LEFT JOIN player_achievements pa ON p.id = pa.player_id
    WHERE
      -- Country filter
      (p_country IS NULL OR p.country = p_country) AND
      -- Level range filter
      (p_min_level IS NULL OR p.level >= p_min_level) AND
      (p_max_level IS NULL OR p.level <= p_max_level) AND
      -- Account creation date filter
      (p_date_from IS NULL OR DATE(p.created_at) >= p_date_from) AND
      (p_date_to IS NULL OR DATE(p.created_at) <= p_date_to) AND
      -- Privacy filter (JSONB)
      (p_privacy_setting IS NULL OR pp.settings->>'privacy' = p_privacy_setting) AND
      -- Theme filter (JSONB)
      (p_theme IS NULL OR pp.settings->>'theme' = p_theme)
    GROUP BY
      p.id, p.username, p.email, p.country, p.level, p.total_score, p.created_at,
      pp.avatar_url, privacy, theme, notifications_enabled
  ),
  enhanced_metrics AS (
    SELECT
      *,
      -- Calculate days since last session
      CASE
        WHEN last_session_date IS NULL THEN 999
        ELSE GREATEST(0, EXTRACT(DAYS FROM (NOW() - last_session_date))::INT)
      END AS days_since_last_session,

      -- Calculate retention score (0-100, higher is better)
      CASE
        WHEN last_session_date IS NULL THEN 0
        ELSE GREATEST(0, LEAST(100, 100 - EXTRACT(DAYS FROM (NOW() - last_session_date))::INT))
      END AS retention_score,

      -- Calculate achievement completion rate (assuming 100 total achievements)
      CASE
        WHEN achievements_unlocked = 0 THEN 0
        ELSE LEAST(100, (achievements_unlocked::DECIMAL / 100) * 100)
      END AS achievement_completion_rate

    FROM player_metrics
  )
  SELECT
    player_id,
    username,
    email,
    -- Structured data
    country,
    level,
    total_score,
    account_created,
    -- Semi-structured data (JSONB)
    privacy,
    theme,
    notifications_enabled,
    -- Unstructured data (image URL)
    avatar_url,
    -- Calculated metrics
    total_sessions,
    total_playtime_hours,
    avg_session_duration,
    achievements_unlocked,
    achievement_completion_rate,
    days_since_last_session,
    retention_score
  FROM enhanced_metrics
  WHERE
    -- Minimum achievements filter
    (p_min_achievements IS NULL OR achievements_unlocked >= p_min_achievements)
  ORDER BY
    CASE
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'p.username' THEN username
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'p.level' THEN level
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'total_playtime_hours' THEN total_playtime_hours
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'achievements_unlocked' THEN achievements_unlocked
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'retention_score' THEN retention_score
      WHEN UPPER(p_sort_direction) = 'ASC' AND v_sort_clause = 'days_since_last_session' THEN days_since_last_session
    END ASC NULLS LAST,
    CASE
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'p.username' THEN username
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'p.level' THEN level
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'total_playtime_hours' THEN total_playtime_hours
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'achievements_unlocked' THEN achievements_unlocked
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'retention_score' THEN retention_score
      WHEN UPPER(p_sort_direction) = 'DESC' AND v_sort_clause = 'days_since_last_session' THEN days_since_last_session
    END DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION get_player_engagement_report IS 'Report 2: Player Engagement Analysis - Combines players, sessions, achievements, and player_profiles with JSONB settings and avatar URLs. Supports filtering by country, level range, date range, privacy settings, and theme with sorting options.';