-- 302_rpc_seed_games.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate games

CREATE OR REPLACE FUNCTION populate_games()
RETURNS void AS $$
DECLARE
    dev_count INTEGER;
    dev_id UUID;
    i INTEGER;
BEGIN
    -- Clear existing data
    DELETE FROM games;

    -- Get developer count
    SELECT COUNT(*) INTO dev_count FROM developers;

    IF dev_count = 0 THEN
        RAISE EXCEPTION 'No developers found. Please run populate_developers() first.';
    END IF;

    -- Insert sample games
    FOR i IN 1..15 LOOP
        SELECT id INTO dev_id FROM developers ORDER BY random() LIMIT 1;

        INSERT INTO games (title, genre, release_date, price, developer_id) VALUES
        (
            CASE i
                WHEN 1 THEN 'Cyber Legends'
                WHEN 2 THEN 'Space Warriors'
                WHEN 3 THEN 'Dragon Quest XII'
                WHEN 4 THEN 'Battlefield 2042'
                WHEN 5 THEN 'Puzzle Master Pro'
                WHEN 6 THEN 'Football Manager 2024'
                WHEN 7 THEN 'Dark Souls V'
                WHEN 8 THEN 'Mario Galaxy 3'
                WHEN 9 THEN 'Grand Theft Auto VI'
                WHEN 10 THEN 'Assassin''s Creed: Shadows'
                WHEN 11 THEN 'Fallout 5'
                WHEN 12 THEN 'Zelda: Tears of Time'
                WHEN 13 THEN 'CS:GO 2'
                WHEN 14 THEN 'Racing Championship'
                WHEN 15 THEN 'Minecraft Legends'
            END,
            CASE (i % 5)
                WHEN 0 THEN 'RPG'::game_genres
                WHEN 1 THEN 'FPS'::game_genres
                WHEN 2 THEN 'Strategy'::game_genres
                WHEN 3 THEN 'Puzzle'::game_genres
                WHEN 4 THEN 'Sports'::game_genres
            END,
            now() - (random() * 365 * 3)::int * interval '1 day',
            (random() * 60 + 19.99)::numeric(10,2),
            dev_id
        );
    END LOOP;

    RAISE NOTICE 'Populated 15 games';
END;
$$ LANGUAGE plpgsql;
