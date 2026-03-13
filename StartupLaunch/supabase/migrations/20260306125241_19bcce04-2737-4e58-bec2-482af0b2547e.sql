-- Add skills and interests to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS startup_domain text DEFAULT NULL;

-- Create mentors table
CREATE TABLE public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  expertise text[] DEFAULT '{}',
  bio text,
  avatar_url text,
  available_slots jsonb DEFAULT '[]',
  rating numeric(2,1) DEFAULT 5.0,
  sessions_completed integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mentors" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Mentors can update own profile" ON public.mentors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth users can create mentor profile" ON public.mentors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.mentors(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text NOT NULL DEFAULT 'pending',
  topic text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT m.user_id FROM public.mentors m WHERE m.id = mentor_id));
CREATE POLICY "Auth users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookings" ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- Create startup_progress table
CREATE TABLE public.startup_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  stage text NOT NULL DEFAULT 'Idea',
  milestones jsonb DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(startup_id)
);

ALTER TABLE public.startup_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view progress" ON public.startup_progress FOR SELECT USING (true);
CREATE POLICY "Owners can insert progress" ON public.startup_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update progress" ON public.startup_progress FOR UPDATE USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_startup_progress_updated_at BEFORE UPDATE ON public.startup_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed some mentors
INSERT INTO public.mentors (user_id, name, title, expertise, bio, available_slots, rating, sessions_completed) VALUES
('00000000-0000-0000-0000-000000000001', 'Dr. Sarah Chen', 'Serial Entrepreneur & Investor', ARRAY['Product Strategy', 'Fundraising', 'Market Analysis'], 'Founded 3 startups with 2 successful exits. Angel investor with 50+ portfolio companies.', '[{"day": "Monday", "time": "10:00"}, {"day": "Wednesday", "time": "14:00"}, {"day": "Friday", "time": "11:00"}]', 4.9, 127),
('00000000-0000-0000-0000-000000000002', 'Marcus Johnson', 'CTO at TechVentures', ARRAY['Technical Architecture', 'Scaling', 'AI/ML'], 'Former Google engineer. Built systems serving 100M+ users.', '[{"day": "Tuesday", "time": "09:00"}, {"day": "Thursday", "time": "15:00"}]', 4.8, 89),
('00000000-0000-0000-0000-000000000003', 'Priya Sharma', 'Growth Marketing Expert', ARRAY['Growth Hacking', 'SEO', 'Content Strategy', 'Social Media'], 'Grew 5 startups from 0 to 1M users. Marketing advisor to YC companies.', '[{"day": "Monday", "time": "13:00"}, {"day": "Wednesday", "time": "10:00"}, {"day": "Friday", "time": "14:00"}]', 4.7, 156),
('00000000-0000-0000-0000-000000000004', 'James Park', 'UX Design Lead', ARRAY['UI/UX Design', 'User Research', 'Prototyping'], 'Former design lead at Airbnb. Passionate about user-centric product development.', '[{"day": "Tuesday", "time": "11:00"}, {"day": "Thursday", "time": "13:00"}]', 4.9, 73),
('00000000-0000-0000-0000-000000000005', 'Elena Rodriguez', 'Startup Lawyer & Advisor', ARRAY['Legal', 'Fundraising', 'IP Protection', 'Incorporation'], 'Helped 200+ startups with legal structuring and IP strategy.', '[{"day": "Monday", "time": "15:00"}, {"day": "Friday", "time": "09:00"}]', 4.6, 94);

-- Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.startup_progress;