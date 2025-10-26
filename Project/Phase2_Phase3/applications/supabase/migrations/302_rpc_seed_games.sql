-- 302_rpc_seed_games.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate games
CREATE OR REPLACE FUNCTION populate_games() RETURNS void AS $$
DECLARE dev_count INTEGER;
dev_id UUID;
i INTEGER;
game_title TEXT;
game_genre game_genres;
game_price NUMERIC(10, 2);
BEGIN -- Clear existing data
DELETE FROM "public"."games";
-- Get developer count
SELECT COUNT(*) INTO dev_count
FROM "public"."developers";
IF dev_count = 0 THEN RAISE EXCEPTION 'No developers found. Please run populate_developers() first.';
END IF;
-- Insert sample games with cover images and metadata
FOR i IN 1..15 LOOP
    SELECT id INTO dev_id
    FROM "public"."developers"
    ORDER BY random()
    LIMIT 1;

    game_title := CASE i
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
    END;

    game_genre := CASE (i % 5)
        WHEN 0 THEN 'RPG'::game_genres
        WHEN 1 THEN 'FPS'::game_genres
        WHEN 2 THEN 'Strategy'::game_genres
        WHEN 3 THEN 'Puzzle'::game_genres
        WHEN 4 THEN 'Sports'::game_genres
    END;

    game_price := (random() * 60 + 19.99)::numeric(10, 2);

    INSERT INTO "public"."games" (title, genre, release_date, price, developer_id, cover_image_url, metadata)
    VALUES (
        game_title,
        game_genre,
        now() - (random() * 365 * 3)::int * interval '1 day',
        game_price,
        dev_id,
        'https://picsum.photos/seed/' || lower(replace(game_title, ' ', '')) || '/400/600',
        jsonb_build_object(
            'average_rating', (random() * 2 + 3)::numeric(3, 2),  -- Rating between 3.0 and 5.0
            'total_reviews', (random() * 50000 + 1000)::int,
            'tags', CASE game_genre
                WHEN 'RPG'::game_genres THEN jsonb_build_array('story-rich', 'open-world', 'character-customization', 'fantasy')
                WHEN 'FPS'::game_genres THEN jsonb_build_array('multiplayer', 'competitive', 'action', 'shooter')
                WHEN 'Strategy'::game_genres THEN jsonb_build_array('tactical', 'turn-based', 'management', 'challenging')
                WHEN 'Puzzle'::game_genres THEN jsonb_build_array('casual', 'brain-teaser', 'relaxing', 'family-friendly')
                WHEN 'Sports'::game_genres THEN jsonb_build_array('simulation', 'realistic', 'competitive', 'online')
            END,
            'reviews_summary', jsonb_build_object(
                'positive_percentage', (random() * 30 + 70)::int,  -- 70-100% positive
                'negative_percentage', (random() * 20 + 5)::int    -- 5-25% negative
            ),
            'system_requirements', jsonb_build_object(
                'min_ram_gb', CASE
                    WHEN game_price > 50 THEN 16
                    WHEN game_price > 30 THEN 8
                    ELSE 4
                END,
                'min_storage_gb', (random() * 80 + 20)::int,
                'recommended_gpu', CASE
                    WHEN game_price > 50 THEN 'RTX 3070'
                    WHEN game_price > 30 THEN 'GTX 1660'
                    ELSE 'GTX 1050'
                END
            ),
            'screenshots', jsonb_build_array(
                'https://picsum.photos/seed/' || lower(replace(game_title, ' ', '')) || '1/1920/1080',
                'https://picsum.photos/seed/' || lower(replace(game_title, ' ', '')) || '2/1920/1080',
                'https://picsum.photos/seed/' || lower(replace(game_title, ' ', '')) || '3/1920/1080'
            ),
            'peak_concurrent_players', (random() * 100000 + 5000)::int,
            'dlc_available', random() > 0.5,
            'early_access', random() > 0.8
        )
    );
END LOOP;
RAISE NOTICE 'Populated 15 games with cover images and metadata';
END;
$$ LANGUAGE plpgsql;