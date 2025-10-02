-- seed.sql
-- PostgreSQL RPC functions to populate database with sample data
-- Author: Xuan Tuan Minh Nguyen
-- This file contains functions to populate all tables with realistic sample data

-- Function to populate developers
CREATE OR REPLACE FUNCTION populate_developers()
RETURNS void AS $$
DECLARE
    dev_record RECORD;
BEGIN
    -- Clear existing data
    DELETE FROM developers;

    -- Insert sample developers
    INSERT INTO developers (name, email) VALUES
    ('Epic Games Studio', 'contact@epicgames.com'),
    ('Blizzard Entertainment', 'support@blizzard.com'),
    ('Valve Corporation', 'info@valvesoftware.com'),
    ('CD Projekt Red', 'hello@cdprojektred.com'),
    ('FromSoftware', 'contact@fromsoftware.jp'),
    ('Nintendo EPD', 'dev@nintendo.com'),
    ('Rockstar Games', 'support@rockstargames.com'),
    ('Ubisoft Montreal', 'montreal@ubisoft.com'),
    ('Bethesda Game Studios', 'dev@bethesda.com'),
    ('Naughty Dog', 'info@naughtydog.com');

    RAISE NOTICE 'Populated 10 developers';
END;
$$ LANGUAGE plpgsql;

-- Function to populate games
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
                WHEN 0 THEN 'RPG'
                WHEN 1 THEN 'FPS'
                WHEN 2 THEN 'Strategy'
                WHEN 3 THEN 'Puzzle'
                WHEN 4 THEN 'Sports'
            END,
            now() - (random() * 365 * 3)::int * interval '1 day',
            (random() * 60 + 19.99)::numeric(10,2),
            dev_id
        );
    END LOOP;

    RAISE NOTICE 'Populated 15 games';
END;
$$ LANGUAGE plpgsql;

-- Function to populate players
CREATE OR REPLACE FUNCTION populate_players()
RETURNS void AS $$
DECLARE
    i INTEGER;
    country_choice countries;
BEGIN
    -- Clear existing data
    DELETE FROM player_profiles;
    DELETE FROM players;

    -- Insert sample players
    FOR i IN 1..20 LOOP
        country_choice := CASE (i % 5)
            WHEN 0 THEN 'AU'
            WHEN 1 THEN 'US'
            WHEN 2 THEN 'UK'
            WHEN 3 THEN 'JP'
            WHEN 4 THEN 'VN'
        END;

        INSERT INTO players (username, email, country, level, total_score) VALUES
        (
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

-- Function to populate player profiles
CREATE OR REPLACE FUNCTION populate_player_profiles()
RETURNS void AS $$
DECLARE
    player_record RECORD;
BEGIN
    -- Clear existing data
    DELETE FROM player_profiles;

    -- Create profiles for all players
    FOR player_record IN SELECT id FROM players LOOP
        INSERT INTO player_profiles (player_id, bio, avatar_url, settings) VALUES
        (
            player_record.id,
            'Gaming enthusiast who loves ' ||
            CASE (random() * 4)::int
                WHEN 0 THEN 'RPG games'
                WHEN 1 THEN 'competitive FPS'
                WHEN 2 THEN 'strategy games'
                WHEN 3 THEN 'casual puzzles'
                WHEN 4 THEN 'sports simulation'
            END,
            'https://avatar.example.com/' || md5(player_record.id::text) || '.png',
            jsonb_build_object(
                'notifications', random() > 0.5,
                'privacy', CASE (random() * 2)::int WHEN 0 THEN 'public' WHEN 1 THEN 'friends' WHEN 2 THEN 'private' END,
                'theme', CASE (random() * 1)::int WHEN 0 THEN 'dark' WHEN 1 THEN 'light' END
            )
        );
    END LOOP;

    RAISE NOTICE 'Populated player profiles';
END;
$$ LANGUAGE plpgsql;

-- Function to populate achievements
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

-- Function to populate leaderboards
CREATE OR REPLACE FUNCTION populate_leaderboards()
RETURNS void AS $$
DECLARE
    game_record RECORD;
BEGIN
    -- Clear existing data
    DELETE FROM leaderboard_entities;
    DELETE FROM leaderboards;

    -- Create leaderboards for each game
    FOR game_record IN SELECT id FROM games LOOP
        INSERT INTO leaderboards (game_id, type) VALUES
        (game_record.id, 'Global Score'),
        (game_record.id, 'Weekly Score'),
        (game_record.id, 'Time Attack');
    END LOOP;

    RAISE NOTICE 'Populated leaderboards for all games';
END;
$$ LANGUAGE plpgsql;

-- Function to populate purchases
CREATE OR REPLACE FUNCTION populate_purchases()
RETURNS void AS $$
DECLARE
    player_record RECORD;
    game_record RECORD;
    purchase_count INTEGER;
    payment_method_choice payment_methods;
BEGIN
    -- Clear existing data
    DELETE FROM purchases;

    -- Create purchases (each player buys 2-5 random games)
    FOR player_record IN SELECT id FROM players LOOP
        purchase_count := (random() * 3 + 2)::int;

        FOR i IN 1..purchase_count LOOP
            SELECT id INTO game_record FROM games ORDER BY random() LIMIT 1;

            payment_method_choice := CASE (random() * 3)::int
                WHEN 0 THEN 'CreditCard'
                WHEN 1 THEN 'PayPal'
                WHEN 2 THEN 'Crypto'
                WHEN 3 THEN 'BankTransfer'
            END;

            INSERT INTO purchases (player_id, game_id, purchase_date, amount, payment_method) VALUES
            (
                player_record.id,
                game_record.id,
                now() - (random() * 365)::int * interval '1 day',
                (SELECT price FROM games WHERE id = game_record.id),
                payment_method_choice
            );
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Populated purchases';
END;
$$ LANGUAGE plpgsql;

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

-- Function to populate player achievements
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

-- Function to populate leaderboard entities (largest table - ensure 25+ records)
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

-- Master function to populate entire database
CREATE OR REPLACE FUNCTION populate_database()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Starting database population...';

    -- Populate in dependency order
    PERFORM populate_developers();
    PERFORM populate_games();
    PERFORM populate_players();
    PERFORM populate_player_profiles();
    PERFORM populate_achievements();
    PERFORM populate_leaderboards();
    PERFORM populate_purchases();
    PERFORM populate_sessions();
    PERFORM populate_player_achievements();
    PERFORM populate_leaderboard_entities();

    RAISE NOTICE 'Database population completed successfully!';

    -- Display statistics
    RAISE NOTICE 'Database Statistics:';
    RAISE NOTICE '- Developers: %', (SELECT COUNT(*) FROM developers);
    RAISE NOTICE '- Games: %', (SELECT COUNT(*) FROM games);
    RAISE NOTICE '- Players: %', (SELECT COUNT(*) FROM players);
    RAISE NOTICE '- Sessions: %', (SELECT COUNT(*) FROM sessions);
    RAISE NOTICE '- Leaderboard Entries: %', (SELECT COUNT(*) FROM leaderboard_entities);
    RAISE NOTICE '- Achievements: %', (SELECT COUNT(*) FROM achievements);
    RAISE NOTICE '- Player Achievements: %', (SELECT COUNT(*) FROM player_achievements);
    RAISE NOTICE '- Purchases: %', (SELECT COUNT(*) FROM purchases);
END;
$$ LANGUAGE plpgsql;

-- Function to clear all data (useful for testing)
CREATE OR REPLACE FUNCTION clear_database()
RETURNS void AS $$
BEGIN
    RAISE NOTICE 'Clearing all database tables...';

    -- Clear in reverse dependency order
    DELETE FROM leaderboard_entities;
    DELETE FROM leaderboards;
    DELETE FROM player_achievements;
    DELETE FROM achievements;
    DELETE FROM sessions;
    DELETE FROM purchases;
    DELETE FROM player_profiles;
    DELETE FROM players;
    DELETE FROM games;
    DELETE FROM developers;

    RAISE NOTICE 'Database cleared successfully!';
END;
$$ LANGUAGE plpgsql;
