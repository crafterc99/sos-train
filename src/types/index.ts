// ═══ USER & AUTH ═══
export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  role: 'member' | 'admin'
  fitness_goals: string[]
  program_preference: string | null
  onboarding_completed: boolean
  subscription_tier: 'none' | 'member' | 'premium'
  subscription_status: 'active' | 'trialing' | 'canceled' | 'past_due' | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_period_end: string | null
  created_at: string
  updated_at: string
}

// ═══ TRAINING ═══
export interface Program {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_weeks: number
  tier_required: 'member' | 'premium'
  is_published: boolean
  created_at: string
  workouts?: Workout[]
}

export interface Workout {
  id: string
  program_id: string | null
  title: string
  description: string | null
  thumbnail_url: string | null
  mux_playback_id: string | null
  mux_asset_id: string | null
  duration_minutes: number | null
  difficulty: 'easy' | 'moderate' | 'hard'
  equipment: string[]
  tier_required: 'member' | 'premium'
  is_published: boolean
  order_index: number
  created_at: string
  exercises?: WorkoutExercise[]
}

export interface Exercise {
  id: string
  name: string
  description: string | null
  instructions: string[]
  muscle_groups: string[]
  equipment: string[]
  difficulty: 'easy' | 'moderate' | 'hard'
  mux_playback_id: string | null
  mux_asset_id: string | null
  thumbnail_url: string | null
  created_at: string
}

export interface WorkoutExercise {
  id: string
  workout_id: string
  exercise_id: string
  sets: number | null
  reps: string | null
  rest_seconds: number | null
  order_index: number
  notes: string | null
  exercise?: Exercise
}

// ═══ LOGGING & PROGRESS ═══
export interface WorkoutLog {
  id: string
  user_id: string
  workout_id: string
  completed_at: string
  duration_minutes: number | null
  notes: string | null
  workout?: Workout
}

export interface ExerciseLog {
  id: string
  workout_log_id: string
  exercise_id: string
  sets_completed: { reps: number; weight_kg: number }[]
  notes: string | null
}

export interface ProgressEntry {
  id: string
  user_id: string
  weight_kg: number | null
  body_fat_pct: number | null
  notes: string | null
  recorded_at: string
}

export interface ProgressPhoto {
  id: string
  user_id: string
  storage_path: string
  angle: 'front' | 'back' | 'side'
  taken_at: string
}

export interface HabitLog {
  id: string
  user_id: string
  habit_type: string
  value: number | null
  logged_at: string
  notes: string | null
}

// ═══ COMMUNITY ═══
export interface CommunityPost {
  id: string
  user_id: string
  content: string
  post_type: 'general' | 'win' | 'question' | 'progress' | 'transformation'
  image_url: string | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  profile?: Profile
  comments_count?: number
  reactions?: PostReaction[]
}

export interface PostComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profile?: Profile
}

export interface PostReaction {
  post_id: string
  user_id: string
  emoji: string
  created_at: string
}

// ═══ MESSAGING ═══
export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read_at: string | null
  created_at: string
  sender?: Profile
  recipient?: Profile
}

// ═══ COACHING ═══
export interface LiveSession {
  id: string
  title: string
  description: string | null
  session_type: 'group' | 'one-on-one'
  scheduled_at: string
  daily_room_url: string | null
  recording_url: string | null
  max_participants: number | null
  status: 'scheduled' | 'live' | 'completed' | 'canceled'
  created_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  weight_kg: number | null
  energy_level: number
  mood_level: number
  wins: string | null
  struggles: string | null
  photo_url: string | null
  coach_feedback: string | null
  coach_voice_note_url: string | null
  is_reviewed: boolean
  week_of: string
  checked_in_at: string
  profile?: Profile
}

// ═══ LOCKER ROOM ═══
export interface LockerRoomContent {
  id: string
  title: string
  body: string | null
  content_type: 'voice_note' | 'video' | 'text'
  media_url: string | null
  mux_playback_id: string | null
  is_weekly_pep_talk: boolean
  is_published: boolean
  created_at: string
}

// ═══ COMMERCE ═══
export interface Product {
  id: string
  name: string
  description: string | null
  price_cents: number
  stripe_price_id: string | null
  image_url: string | null
  sizes: string[]
  colors: string[]
  in_stock: boolean
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  stripe_payment_intent_id: string | null
  total_cents: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled'
  line_items: { product_id: string; name: string; quantity: number; price_cents: number; size?: string; color?: string }[]
  shipping_address: string | null
  created_at: string
}

// ═══ EVENTS ═══
export interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  is_virtual: boolean
  event_at: string
  price_cents: number
  max_attendees: number | null
  image_url: string | null
  is_published: boolean
  created_at: string
  registrations_count?: number
}

export interface EventRegistration {
  event_id: string
  user_id: string
  registered_at: string
}

// ═══ CHALLENGES ═══
export interface Challenge {
  id: string
  title: string
  description: string | null
  challenge_type: 'workout_count' | 'transformation' | 'habit_streak'
  starts_at: string
  ends_at: string
  scoring_rules: Record<string, unknown>
  is_active: boolean
  created_at: string
}

export interface ChallengeParticipant {
  challenge_id: string
  user_id: string
  joined_at: string
  score: number
  progress: Record<string, unknown>
  profile?: Profile
}

// ═══ SUBSCRIPTION ═══
export interface Subscription {
  tier: 'member' | 'premium'
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
  current_period_end: string
  cancel_at_period_end: boolean
  stripe_subscription_id: string
}

// ═══ MUX ═══
export interface MuxUploadUrl {
  upload_id: string
  url: string
}
