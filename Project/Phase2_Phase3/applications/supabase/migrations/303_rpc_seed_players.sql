-- Function to populate players
CREATE OR REPLACE FUNCTION populate_players() RETURNS void AS $$
DECLARE i INTEGER;
country_choice countries;
BEGIN -- Clear existing data
DELETE FROM "public"."player_profiles";
DELETE FROM "public"."players";
-- Insert sample players
FOR i IN 1..20 LOOP country_choice := CASE
    (i % 5)
    WHEN 0 THEN 'AU'
    WHEN 1 THEN 'US'
    WHEN 2 THEN 'UK'
    WHEN 3 THEN 'JP'
    WHEN 4 THEN 'VN'
END;
INSERT INTO "public"."players" (username, email, country, level, total_score)
VALUES (
        'player' || i,
        'player' || i || '@example.com',
        country_choice,
        (random() * 99)::int + 1,
        (random() * 100000)::bigint
    );
END LOOP;
RAISE NOTICE 'Populated 20 players';
END;
$$ LANGUAGE plpgsql;