-- 301_rpc_seed_developers.sql
-- 2025-10-01
-- Author: Xuan Tuan Minh Nguyen
-- This file is used to create the function to populate developers
CREATE OR REPLACE FUNCTION populate_developers() RETURNS void AS $$
DECLARE dev_record RECORD;
BEGIN -- Clear existing data
DELETE FROM "public"."developers";
-- Insert sample developers with logo URLs and metadata
INSERT INTO "public"."developers" (name, email, logo_url, metadata)
VALUES
    ('Epic Games Studio', 'contact@epicgames.com', 'https://picsum.photos/seed/epic/200/200',
     jsonb_build_object(
       'company_size', 'Large (500+ employees)',
       'founded_year', 1991,
       'headquarters', 'Cary, NC, USA',
       'social_links', jsonb_build_object('website', 'https://www.epicgames.com', 'twitter', '@EpicGames'),
       'specialties', jsonb_build_array('Action', 'FPS', 'Battle Royale'),
       'awards', jsonb_build_array('Game of the Year 2020', 'Best Game Engine')
     )),
    ('Blizzard Entertainment', 'support@blizzard.com', 'https://picsum.photos/seed/blizzard/200/200',
     jsonb_build_object(
       'company_size', 'Large (500+ employees)',
       'founded_year', 1991,
       'headquarters', 'Irvine, CA, USA',
       'social_links', jsonb_build_object('website', 'https://www.blizzard.com', 'twitter', '@Blizzard_Ent'),
       'specialties', jsonb_build_array('RPG', 'Strategy', 'MMORPG'),
       'awards', jsonb_build_array('Best Developer 2018', 'Industry Icon Award')
     )),
    ('Valve Corporation', 'info@valvesoftware.com', 'https://picsum.photos/seed/valve/200/200',
     jsonb_build_object(
       'company_size', 'Medium (50-500 employees)',
       'founded_year', 1996,
       'headquarters', 'Bellevue, WA, USA',
       'social_links', jsonb_build_object('website', 'https://www.valvesoftware.com', 'twitter', '@valvesoftware'),
       'specialties', jsonb_build_array('FPS', 'Puzzle', 'VR'),
       'awards', jsonb_build_array('Innovation Award 2020', 'Best Platform 2019')
     )),
    ('CD Projekt Red', 'hello@cdprojektred.com', 'https://picsum.photos/seed/cdpr/200/200',
     jsonb_build_object(
       'company_size', 'Medium (50-500 employees)',
       'founded_year', 2002,
       'headquarters', 'Warsaw, Poland',
       'social_links', jsonb_build_object('website', 'https://www.cdprojektred.com', 'twitter', '@CDPROJEKTRED'),
       'specialties', jsonb_build_array('RPG', 'Open-world', 'Story-rich'),
       'awards', jsonb_build_array('Game of the Year 2015', 'Best RPG 2020')
     )),
    ('FromSoftware', 'contact@fromsoftware.jp', 'https://picsum.photos/seed/fromsoft/200/200',
     jsonb_build_object(
       'company_size', 'Medium (50-500 employees)',
       'founded_year', 1986,
       'headquarters', 'Tokyo, Japan',
       'social_links', jsonb_build_object('website', 'https://www.fromsoftware.jp', 'twitter', '@fromsoftware_pr'),
       'specialties', jsonb_build_array('RPG', 'Action', 'Souls-like'),
       'awards', jsonb_build_array('Game of the Year 2022', 'Best Game Direction 2022')
     )),
    ('Nintendo EPD', 'dev@nintendo.com', 'https://picsum.photos/seed/nintendo/200/200',
     jsonb_build_object(
       'company_size', 'Large (500+ employees)',
       'founded_year', 1889,
       'headquarters', 'Kyoto, Japan',
       'social_links', jsonb_build_object('website', 'https://www.nintendo.com', 'twitter', '@NintendoAmerica'),
       'specialties', jsonb_build_array('Platformer', 'Adventure', 'Family-friendly'),
       'awards', jsonb_build_array('Lifetime Achievement Award', 'Innovation in Gaming')
     )),
    ('Rockstar Games', 'support@rockstargames.com', 'https://picsum.photos/seed/rockstar/200/200',
     jsonb_build_object(
       'company_size', 'Large (500+ employees)',
       'founded_year', 1998,
       'headquarters', 'New York, NY, USA',
       'social_links', jsonb_build_object('website', 'https://www.rockstargames.com', 'twitter', '@RockstarGames'),
       'specialties', jsonb_build_array('Action', 'Open-world', 'Adventure'),
       'awards', jsonb_build_array('Best Studio 2018', 'Game of the Year 2013')
     )),
    ('Ubisoft Montreal', 'montreal@ubisoft.com', 'https://picsum.photos/seed/ubisoft/200/200',
     jsonb_build_object(
       'company_size', 'Large (500+ employees)',
       'founded_year', 1997,
       'headquarters', 'Montreal, QC, Canada',
       'social_links', jsonb_build_object('website', 'https://montreal.ubisoft.com', 'twitter', '@UbisoftMTL'),
       'specialties', jsonb_build_array('Action', 'Adventure', 'Stealth'),
       'awards', jsonb_build_array('Best Action Game 2020', 'Studio of the Year 2017')
     )),
    ('Bethesda Game Studios', 'dev@bethesda.com', 'https://picsum.photos/seed/bethesda/200/200',
     jsonb_build_object(
       'company_size', 'Medium (50-500 employees)',
       'founded_year', 1986,
       'headquarters', 'Rockville, MD, USA',
       'social_links', jsonb_build_object('website', 'https://bethesdagamestudios.com', 'twitter', '@BethesdaStudios'),
       'specialties', jsonb_build_array('RPG', 'Open-world', 'Fantasy'),
       'awards', jsonb_build_array('Game of the Year 2011', 'Best RPG 2015')
     )),
    ('Naughty Dog', 'info@naughtydog.com', 'https://picsum.photos/seed/naughtydog/200/200',
     jsonb_build_object(
       'company_size', 'Medium (50-500 employees)',
       'founded_year', 1984,
       'headquarters', 'Santa Monica, CA, USA',
       'social_links', jsonb_build_object('website', 'https://www.naughtydog.com', 'twitter', '@Naughty_Dog'),
       'specialties', jsonb_build_array('Action', 'Adventure', 'Story-rich'),
       'awards', jsonb_build_array('Game of the Year 2020', 'Best Narrative 2020')
     ));
RAISE NOTICE 'Populated 10 developers with logos and metadata';
END;
$$ LANGUAGE plpgsql;