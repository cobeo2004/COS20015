-- 306_rpc_seed_leaderboards.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate leaderboards
CREATE OR REPLACE FUNCTION populate_leaderboards() RETURNS void AS $$
DECLARE game_record RECORD;
BEGIN -- Clear existing data
DELETE FROM "public"."leaderboard_entities";
DELETE FROM "public"."leaderboards";
-- Create leaderboards for each game
FOR game_record IN
SELECT id
FROM "public"."games" LOOP
INSERT INTO "public"."leaderboards" (game_id, type)
VALUES (game_record.id, 'Global Score'),
    (game_record.id, 'Weekly Score'),
    (game_record.id, 'Time Attack');
END LOOP;
RAISE NOTICE 'Populated leaderboards for all games';
END;
$$ LANGUAGE plpgsql;