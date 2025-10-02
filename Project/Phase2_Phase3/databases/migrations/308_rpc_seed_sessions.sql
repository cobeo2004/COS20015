-- Function to populate sessions (largest table - ensure 25+ records)
CREATE OR REPLACE FUNCTION populate_sessions()
RETURNS void AS $$
DECLARE
    player_record RECORD;
    game_record RECORD;
    session_count INTEGER;
    total_sessions INTEGER := 0;
    start_time TIMESTAMPTZ;
    end_time TIMESTAMPTZ;
    duration_hours INTEGER;
BEGIN
    -- Clear existing data
    DELETE FROM sessions;

    -- Create sessions (each player has 3-8 sessions for different games)
    FOR player_record IN SELECT id FROM players LOOP
        session_count := (random() * 5 + 3)::int;

        FOR i IN 1..session_count LOOP
            SELECT id INTO game_record FROM games ORDER BY random() LIMIT 1;

            duration_hours := (random() * 4 + 0.5)::int;
            start_time := now() - (random() * 30)::int * interval '1 day' - duration_hours * interval '1 hour';
            end_time := start_time + duration_hours * interval '1 hour';

            INSERT INTO sessions (player_id, game_id, start_time, end_time, score) VALUES
            (
                player_record.id,
                game_record.id,
                start_time,
                end_time,
                (random() * 50000 + 1000)::bigint
            );

            total_sessions := total_sessions + 1;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Populated % sessions', total_sessions;
END;
$$ LANGUAGE plpgsql;
