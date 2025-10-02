-- 309_seed_player_achievements.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate player achievements

CREATE OR REPLACE FUNCTION populate_player_achievements()
RETURNS void AS $$
DECLARE
    player_record RECORD;
    achievement_record RECORD;
    achievement_count INTEGER;
    total_unlocks INTEGER := 0;
BEGIN
    -- Clear existing data
    DELETE FROM player_achievements;

    -- Each player unlocks 3-10 random achievements
    FOR player_record IN SELECT id FROM players LOOP
        achievement_count := (random() * 7 + 3)::int;

        FOR i IN 1..achievement_count LOOP
            SELECT id INTO achievement_record FROM achievements ORDER BY random() LIMIT 1;

            -- Check if this player already has this achievement
            IF NOT EXISTS (
                SELECT 1 FROM player_achievements
                WHERE player_id = player_record.id AND achievement_id = achievement_record.id
            ) THEN
                INSERT INTO player_achievements (player_id, achievement_id, unlocked_at) VALUES
                (
                    player_record.id,
                    achievement_record.id,
                    now() - (random() * 30)::int * interval '1 day'
                );

                total_unlocks := total_unlocks + 1;
            END IF;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Populated % player achievement unlocks', total_unlocks;
END;
$$ LANGUAGE plpgsql;
