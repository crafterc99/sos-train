-- ═══ COMMUNITY & SOCIAL TABLES ═══

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'general' CHECK (post_type IN ('general', 'win', 'question', 'progress', 'transformation')),
  image_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_pinned ON community_posts(is_pinned, created_at DESC);
CREATE INDEX idx_community_posts_type ON community_posts(post_type);

-- Post Comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post ON post_comments(post_id, created_at);
CREATE INDEX idx_post_comments_user ON post_comments(user_id);

-- Post Reactions
CREATE TABLE IF NOT EXISTS post_reactions (
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Direct Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id, created_at DESC);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(
  LEAST(sender_id, recipient_id),
  GREATEST(sender_id, recipient_id),
  created_at DESC
);
CREATE INDEX idx_messages_unread ON messages(recipient_id) WHERE read_at IS NULL;

-- Live Sessions
CREATE TABLE IF NOT EXISTS live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL DEFAULT 'group' CHECK (session_type IN ('group', 'one-on-one')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  daily_room_url TEXT,
  daily_room_name TEXT,
  recording_url TEXT,
  max_participants INT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_live_sessions_scheduled ON live_sessions(scheduled_at);
CREATE INDEX idx_live_sessions_status ON live_sessions(status);

-- Live Session RSVPs
CREATE TABLE IF NOT EXISTS live_session_rsvps (
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (session_id, user_id)
);

-- Weekly Check-Ins
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2),
  energy_level INT CHECK (energy_level BETWEEN 1 AND 10),
  mood_level INT CHECK (mood_level BETWEEN 1 AND 10),
  wins TEXT,
  struggles TEXT,
  photo_url TEXT,
  coach_feedback TEXT,
  coach_voice_note_url TEXT,
  is_reviewed BOOLEAN DEFAULT FALSE,
  week_of DATE NOT NULL,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_of)
);

CREATE INDEX idx_check_ins_user ON check_ins(user_id, week_of DESC);
CREATE INDEX idx_check_ins_reviewed ON check_ins(is_reviewed, checked_in_at DESC);

-- Locker Room Content
CREATE TABLE IF NOT EXISTS locker_room_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('voice_note', 'video', 'text')),
  media_url TEXT,
  mux_playback_id TEXT,
  is_weekly_pep_talk BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locker_room_published ON locker_room_content(is_published, created_at DESC);
CREATE INDEX idx_locker_room_pep_talk ON locker_room_content(is_weekly_pep_talk) WHERE is_weekly_pep_talk = TRUE;

-- Locker Room Reactions
CREATE TABLE IF NOT EXISTS locker_room_reactions (
  content_id UUID REFERENCES locker_room_content(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (content_id, user_id)
);
