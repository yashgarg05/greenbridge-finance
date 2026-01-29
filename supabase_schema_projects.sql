-- Create projects table for Real Green Investment Marketplace
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price_per_unit NUMERIC NOT NULL,
  credits_per_unit NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  funding_percentage NUMERIC DEFAULT 0,
  verified_by TEXT DEFAULT 'Pending',
  quality_rating TEXT,
  sdg_goals NUMERIC[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read projects
CREATE POLICY "Projects are viewable by everyone" 
ON projects FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to insert projects
CREATE POLICY "Users can insert projects" 
ON projects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow users to update their own projects (if we track owner_id later)
-- For now, allowing all authenticated users to update (demo mode) or restrict it.
-- Let's just stick to Insert/Select for now.

-- Seed some initial real data (Optional - User asked for NO DUMMY DATA, but "real time data")
-- So we will NOT seed dummy data. The table will be empty initially.
