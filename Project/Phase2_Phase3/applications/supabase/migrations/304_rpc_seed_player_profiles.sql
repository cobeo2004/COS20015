-- 304_rpc_seed_player_profiles.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate player profiles
CREATE OR REPLACE FUNCTION populate_player_profiles() RETURNS void AS $$
DECLARE player_record RECORD;
BEGIN -- Clear existing data
DELETE FROM player_profiles;
-- Create profiles for all players
FOR player_record IN
SELECT id
FROM "public"."players" LOOP
INSERT INTO "public"."player_profiles" (player_id, bio, avatar_url, settings)
VALUES (
        player_record.id,
        'Gaming enthusiast who loves ' || CASE
            (random() * 4)::int
            WHEN 0 THEN 'RPG games'
            WHEN 1 THEN 'competitive FPS'
            WHEN 2 THEN 'strategy games'
            WHEN 3 THEN 'casual puzzles'
            WHEN 4 THEN 'sports simulation'
        END,
        'https://avatar.example.com/' || md5(player_record.id::text) || '.png',
        jsonb_build_object(
            'notifications',
            random() > 0.5,
            'privacy',
            CASE
                (random() * 2)::int
                WHEN 0 THEN 'public'
                WHEN 1 THEN 'friends'
                WHEN 2 THEN 'private'
            END,
            'theme',
            CASE
                (random() * 1)::int
                WHEN 0 THEN 'dark'
                WHEN 1 THEN 'light'
            END
        )
    );
END LOOP;
RAISE NOTICE 'Populated player profiles';
END;
$$ LANGUAGE plpgsql;