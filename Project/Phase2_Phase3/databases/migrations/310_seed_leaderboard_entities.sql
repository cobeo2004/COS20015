-- 310_seed_leaderboard_entities.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate leaderboard entities

CREATE OR REPLACE FUNCTION populate_leaderboard_entities()
RETURNS void AS $$
DECLARE
    leaderboard_record RECORD;
    player_record RECORD;
    entry_count INTEGER;
    current_rank INTEGER;
    total_entries INTEGER := 0;
BEGIN
    -- Clear existing data
    DELETE FROM leaderboard_entities;

    -- Populate each leaderboard with player rankings
    FOR leaderboard_record IN SELECT id FROM leaderboards LOOP
        -- Each leaderboard has 10-20 players ranked
        entry_count := (random() * 10 + 10)::int;
        current_rank := 1;

        -- Get random players for this leaderboard
        FOR player_record IN SELECT id FROM players ORDER BY random() LIMIT entry_count LOOP
            INSERT INTO leaderboard_entities (leaderboard_id, player_id, rank, score, achieved_at) VALUES
            (
                leaderboard_record.id,
                player_record.id,
                current_rank,
                (100000 - current_rank * 1000 + random() * 500)::bigint,
                now() - (random() * 7)::int * interval '1 day'
            );

            current_rank := current_rank + 1;
            total_entries := total_entries + 1;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Populated % leaderboard entries', total_entries;
END;
$$ LANGUAGE plpgsql;
