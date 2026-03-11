-- ═══ STORAGE BUCKETS ═══
-- Run these via Supabase dashboard SQL editor or storage settings

-- Create buckets (public = accessible without auth token for GET)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('progress-photos', 'progress-photos', false),
  ('voice-notes', 'voice-notes', false),
  ('workout-thumbnails', 'workout-thumbnails', true),
  ('product-images', 'product-images', true),
  ('event-images', 'event-images', true),
  ('community-images', 'community-images', true)
ON CONFLICT (id) DO NOTHING;

-- ═══ STORAGE POLICIES ═══

-- Avatars: anyone can read, users can upload to their own folder
CREATE POLICY "Public avatar read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Progress photos: private, users can only access own
CREATE POLICY "Users can read own progress photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload own progress photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own progress photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Voice notes: private, users can only access own (admin can read all via service role)
CREATE POLICY "Users can read own voice notes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'voice-notes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admin can upload voice notes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'voice-notes'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public buckets: anyone can read, admin can upload
CREATE POLICY "Public workout thumbnail read" ON storage.objects
  FOR SELECT USING (bucket_id = 'workout-thumbnails');

CREATE POLICY "Admin can upload workout thumbnails" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'workout-thumbnails'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Public product image read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Public event image read" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Admin can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Community images: authenticated users can upload to own folder, all authenticated can read
CREATE POLICY "Authenticated can read community images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'community-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can upload community images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'community-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
