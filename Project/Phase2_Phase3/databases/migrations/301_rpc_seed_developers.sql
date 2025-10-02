-- 301_rpc_seed_developers.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate developers

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
