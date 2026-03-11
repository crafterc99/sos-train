-- ═══ ROW LEVEL SECURITY POLICIES ═══
-- Enable RLS on ALL tables and define access rules

-- ──────────────────────────────────────────────
-- PROFILES
-- ──────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles (public info)" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin full access profiles" ON profiles
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- CONTENT TABLES (read by subscribed users, managed by admin)
-- ──────────────────────────────────────────────
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribed users can read published programs" ON programs
  FOR SELECT USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND subscription_status IN ('active', 'trialing')
    )
  );

CREATE POLICY "Admin full access programs" ON programs
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribed users can read published workouts" ON workouts
  FOR SELECT USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND subscription_status IN ('active', 'trialing')
    )
  );

CREATE POLICY "Admin full access workouts" ON workouts
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribed users can read exercises" ON exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND subscription_status IN ('active', 'trialing')
    )
  );

CREATE POLICY "Admin full access exercises" ON exercises
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribed users can read workout exercises" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND subscription_status IN ('active', 'trialing')
    )
  );

CREATE POLICY "Admin full access workout_exercises" ON workout_exercises
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- USER-OWNED TABLES (CRUD own data only)
-- ──────────────────────────────────────────────

-- Workout Logs
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own workout logs" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout logs" ON workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs" ON workout_logs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admin full access workout_logs" ON workout_logs
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Exercise Logs
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own exercise logs" ON exercise_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM workout_logs WHERE id = exercise_logs.workout_log_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own exercise logs" ON exercise_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM workout_logs WHERE id = exercise_logs.workout_log_id AND user_id = auth.uid())
  );

CREATE POLICY "Admin full access exercise_logs" ON exercise_logs
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Habit Logs
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own habit logs" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access habit_logs" ON habit_logs
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Progress Entries
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own progress entries" ON progress_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access progress_entries" ON progress_entries
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Progress Photos
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own progress photos" ON progress_photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access progress_photos" ON progress_photos
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- COMMUNITY (read all, write own)
-- ──────────────────────────────────────────────
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read all posts" ON community_posts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admin full access community_posts" ON community_posts
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read comments" ON post_comments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create comments" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admin full access post_comments" ON post_comments
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read reactions" ON post_reactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage own reactions" ON post_reactions
  FOR ALL USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- MESSAGES (read/write own conversations)
-- ──────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can mark messages read" ON messages
  FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Admin full access messages" ON messages
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- COACHING
-- ──────────────────────────────────────────────
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read live sessions" ON live_sessions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access live_sessions" ON live_sessions
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE live_session_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own RSVPs" ON live_session_rsvps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can read all RSVPs" ON live_session_rsvps
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own check-ins" ON check_ins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access check_ins" ON check_ins
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ──────────────────────────────────────────────
-- LOCKER ROOM (read by subscribed, managed by admin)
-- ──────────────────────────────────────────────
ALTER TABLE locker_room_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscribed users can read published locker room" ON locker_room_content
  FOR SELECT USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND subscription_status IN ('active', 'trialing')
    )
  );

CREATE POLICY "Admin full access locker_room_content" ON locker_room_content
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE locker_room_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read locker room reactions" ON locker_room_reactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage own locker room reactions" ON locker_room_reactions
  FOR ALL USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- COMMERCE
-- ──────────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published events" ON events
  FOR SELECT USING (is_published = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access events" ON events
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own event registrations" ON event_registrations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access event_registrations" ON event_registrations
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access products" ON products
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access orders" ON orders
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read active challenges" ON challenges
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin full access challenges" ON challenges
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read challenge participants" ON challenge_participants
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage own participation" ON challenge_participants
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin full access challenge_participants" ON challenge_participants
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
