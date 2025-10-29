-- Players table policies
CREATE POLICY "Players: Allow read access to all users" ON "public"."players" FOR
SELECT TO public USING (true);
CREATE POLICY "Players: Allow authenticated users to create players" ON "public"."players" FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Players: Allow users to update their own profile" ON "public"."players" FOR
UPDATE TO authenticated USING (auth.uid()::text = id::text) WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Players: Allow users to delete their own profile" ON "public"."players" FOR DELETE TO authenticated USING (auth.uid()::text = id::text);

-- Player profiles table policies
CREATE POLICY "Player Profiles: Allow read access to all users" ON "public"."player_profiles" FOR
SELECT TO public USING (true);
CREATE POLICY "Player Profiles: Allow authenticated users to create their profile" ON "public"."player_profiles" FOR
INSERT TO authenticated WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Player Profiles: Allow users to update their own profile" ON "public"."player_profiles" FOR
UPDATE TO authenticated USING (auth.uid()::text = player_id::text) WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Player Profiles: Allow users to delete their own profile" ON "public"."player_profiles" FOR DELETE TO authenticated USING (auth.uid()::text = player_id::text);

-- Achievements table policies
CREATE POLICY "Achievements: Allow read access to all users" ON "public"."achievements" FOR
SELECT TO public USING (true);
CREATE POLICY "Achievements: Allow authenticated users to create achievements" ON "public"."achievements" FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Achievements: Allow authenticated users to update achievements" ON "public"."achievements" FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Achievements: Allow authenticated users to delete achievements" ON "public"."achievements" FOR DELETE TO authenticated USING (true);

-- Player achievements table policies
CREATE POLICY "Player Achievements: Allow read access to all users" ON "public"."player_achievements" FOR
SELECT TO public USING (true);
CREATE POLICY "Player Achievements: Allow users to create their own achievements" ON "public"."player_achievements" FOR
INSERT TO authenticated WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Player Achievements: Allow users to update their own achievements" ON "public"."player_achievements" FOR
UPDATE TO authenticated USING (auth.uid()::text = player_id::text) WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Player Achievements: Allow users to delete their own achievements" ON "public"."player_achievements" FOR DELETE TO authenticated USING (auth.uid()::text = player_id::text);

-- Games table policies
CREATE POLICY "Games: Allow read access to all users" ON "public"."games" FOR
SELECT TO public USING (true);
CREATE POLICY "Games: Allow authenticated users to create games" ON "public"."games" FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Games: Allow authenticated users to update games" ON "public"."games" FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Games: Allow authenticated users to delete games" ON "public"."games" FOR DELETE TO authenticated USING (true);

-- Sessions table policies
CREATE POLICY "Sessions: Allow read access to all users" ON "public"."sessions" FOR
SELECT TO public USING (true);
CREATE POLICY "Sessions: Allow users to create their own sessions" ON "public"."sessions" FOR
INSERT TO authenticated WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Sessions: Allow users to update their own sessions" ON "public"."sessions" FOR
UPDATE TO authenticated USING (auth.uid()::text = player_id::text) WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Sessions: Allow users to delete their own sessions" ON "public"."sessions" FOR DELETE TO authenticated USING (auth.uid()::text = player_id::text);

-- Leaderboards table policies
CREATE POLICY "Leaderboards: Allow read access to all users" ON "public"."leaderboards" FOR
SELECT TO public USING (true);
CREATE POLICY "Leaderboards: Allow authenticated users to create leaderboards" ON "public"."leaderboards" FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Leaderboards: Allow authenticated users to update leaderboards" ON "public"."leaderboards" FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Leaderboards: Allow authenticated users to delete leaderboards" ON "public"."leaderboards" FOR DELETE TO authenticated USING (true);

-- Leaderboard entities table policies
CREATE POLICY "Leaderboard Entities: Allow read access to all users" ON "public"."leaderboard_entities" FOR
SELECT TO public USING (true);
CREATE POLICY "Leaderboard Entities: Allow users to create their own entries" ON "public"."leaderboard_entities" FOR
INSERT TO authenticated WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Leaderboard Entities: Allow users to update their own entries" ON "public"."leaderboard_entities" FOR
UPDATE TO authenticated USING (auth.uid()::text = player_id::text) WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Leaderboard Entities: Allow users to delete their own entries" ON "public"."leaderboard_entities" FOR DELETE TO authenticated USING (auth.uid()::text = player_id::text);

-- Purchases table policies
CREATE POLICY "Purchases: Allow read access to all users" ON "public"."purchases" FOR
SELECT TO public USING (true);
CREATE POLICY "Purchases: Allow users to create their own purchases" ON "public"."purchases" FOR
INSERT TO authenticated WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Purchases: Allow users to update their own purchases" ON "public"."purchases" FOR
UPDATE TO authenticated USING (auth.uid()::text = player_id::text) WITH CHECK (auth.uid()::text = player_id::text);
CREATE POLICY "Purchases: Allow users to delete their own purchases" ON "public"."purchases" FOR DELETE TO authenticated USING (auth.uid()::text = player_id::text);

-- Developers table policies
CREATE POLICY "Developers: Allow read access to all users" ON "public"."developers" FOR
SELECT TO public USING (true);
CREATE POLICY "Developers: Allow authenticated users to create developers" ON "public"."developers" FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Developers: Allow authenticated users to update developers" ON "public"."developers" FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Developers: Allow authenticated users to delete developers" ON "public"."developers" FOR DELETE TO authenticated USING (true);