-- 305_rpc_seed_player_achievements.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate player achievements

CREATE OR REPLACE FUNCTION populate_achievements()
RETURNS void AS $$
DECLARE
    game_record RECORD;
    j INTEGER;
BEGIN
    -- Clear existing data
    DELETE FROM player_achievements;
    DELETE FROM achievements;

    -- Create achievements for each game
    FOR game_record IN SELECT id, title FROM games LOOP
        FOR j IN 1..5 LOOP
            INSERT INTO achievements (game_id, name, description, points, unlock_criteria) VALUES
            (
                game_record.id,
                'Achievement ' || j || ' for ' || game_record.title,
                'Complete ' || j || ' specific challenges in ' || game_record.title,
                (j * 10)::int,
                jsonb_build_object(
                    'type', CASE (j % 3)
                        WHEN 0 THEN 'completion'
                        WHEN 1 THEN 'score'
                        WHEN 2 THEN 'time'
                    END,
                    'target', j * 100,
                    'difficulty', CASE (j % 3)
                        WHEN 0 THEN 'easy'
                        WHEN 1 THEN 'medium'
                        WHEN 2 THEN 'hard'
                    END
                )
            );
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Populated achievements for all games';
END;
$$ LANGUAGE plpgsql;
