-- 1. Enable UUID extension (Required for generating IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the 'projects' table explicitly in the 'public' schema
CREATE TABLE IF NOT EXISTS public.projects (
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

-- 3. Enable Security (Row Level Security)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Drop existing ones first to avoid duplicates)
DROP POLICY IF EXISTS "Public Read Access" ON public.projects;
CREATE POLICY "Public Read Access" 
ON public.projects FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated Insert Access" ON public.projects;
CREATE POLICY "Authenticated Insert Access" 
ON public.projects FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
