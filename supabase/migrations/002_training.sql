-- ═══ TRAINING CONTENT TABLES ═══

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INT,
  tier_required TEXT NOT NULL DEFAULT 'member' CHECK (tier_required IN ('member', 'premium')),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_programs_published ON programs(is_published);
CREATE INDEX idx_programs_created ON programs(created_at DESC);

-- Workouts
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  mux_playback_id TEXT,
  mux_asset_id TEXT,
  duration_minutes INT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  equipment TEXT[] DEFAULT '{}',
  tier_required TEXT NOT NULL DEFAULT 'member' CHECK (tier_required IN ('member', 'premium')),
  is_published BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workouts_program ON workouts(program_id);
CREATE INDEX idx_workouts_published ON workouts(is_published);
CREATE INDEX idx_workouts_order ON workouts(program_id, order_index);

-- Exercises
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT[] DEFAULT '{}',
  muscle_groups TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  mux_playback_id TEXT,
  mux_asset_id TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);

-- Workout-Exercise junction
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INT,
  reps TEXT,
  rest_seconds INT,
  order_index INT DEFAULT 0,
  notes TEXT
);

CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id, order_index);

-- Workout Logs (user completes a workout)
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INT,
  notes TEXT
);

CREATE INDEX idx_workout_logs_user ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_completed ON workout_logs(completed_at DESC);
CREATE INDEX idx_workout_logs_user_date ON workout_logs(user_id, completed_at DESC);

-- Exercise Logs (individual exercise performance within a workout)
CREATE TABLE IF NOT EXISTS exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  sets_completed JSONB DEFAULT '[]',
  notes TEXT
);

CREATE INDEX idx_exercise_logs_workout_log ON exercise_logs(workout_log_id);
CREATE INDEX idx_exercise_logs_exercise ON exercise_logs(exercise_id);

-- Habit Logs
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  habit_type TEXT NOT NULL,
  value NUMERIC,
  logged_at DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  UNIQUE(user_id, habit_type, logged_at)
);

CREATE INDEX idx_habit_logs_user ON habit_logs(user_id);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, logged_at DESC);
