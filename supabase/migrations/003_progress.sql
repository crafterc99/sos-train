-- ═══ PROGRESS TRACKING TABLES ═══

-- Progress Entries (weight, body fat, etc.)
CREATE TABLE IF NOT EXISTS progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  chest_cm NUMERIC(5,1),
  waist_cm NUMERIC(5,1),
  hips_cm NUMERIC(5,1),
  arm_cm NUMERIC(5,1),
  thigh_cm NUMERIC(5,1),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_progress_entries_user ON progress_entries(user_id);
CREATE INDEX idx_progress_entries_date ON progress_entries(user_id, recorded_at DESC);

-- Progress Photos
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  angle TEXT CHECK (angle IN ('front', 'back', 'side')),
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_progress_photos_user ON progress_photos(user_id);
CREATE INDEX idx_progress_photos_date ON progress_photos(user_id, taken_at DESC);
