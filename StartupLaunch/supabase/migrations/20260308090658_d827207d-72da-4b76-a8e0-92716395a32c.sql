-- Create updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create pitches table for StartupTV
CREATE TABLE public.pitches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  startup_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  document_urls TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pitches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view pitches" ON public.pitches FOR SELECT USING (true);
CREATE POLICY "Users can create their own pitches" ON public.pitches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pitches" ON public.pitches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pitches" ON public.pitches FOR DELETE USING (auth.uid() = user_id);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  startup_name TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'Idea',
  description TEXT,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-videos', 'pitch-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-documents', 'pitch-documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('pitch-images', 'pitch-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Storage policies
CREATE POLICY "Anyone can view pitch videos" ON storage.objects FOR SELECT USING (bucket_id = 'pitch-videos');
CREATE POLICY "Auth users upload pitch videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pitch-videos' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view pitch documents" ON storage.objects FOR SELECT USING (bucket_id = 'pitch-documents');
CREATE POLICY "Auth users upload pitch documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pitch-documents' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view pitch images" ON storage.objects FOR SELECT USING (bucket_id = 'pitch-images');
CREATE POLICY "Auth users upload pitch images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pitch-images' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view post images" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Auth users upload post images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Triggers
CREATE TRIGGER update_pitches_updated_at BEFORE UPDATE ON public.pitches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();