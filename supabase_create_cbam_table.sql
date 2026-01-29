-- 1. Create cbam_calculations table
CREATE TABLE IF NOT EXISTS public.cbam_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- We won't strictly Reference auth.users to avoid issues if users are mishandled, but normally you would.
    commodity_type TEXT NOT NULL,
    import_quantity NUMERIC NOT NULL,
    country_of_origin TEXT NOT NULL,
    emission_factor NUMERIC NOT NULL,
    total_emissions NUMERIC NOT NULL,
    gross_liability NUMERIC NOT NULL,
    estimated_liability NUMERIC NOT NULL,
    ets_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.cbam_calculations ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Allow users to see their OWN calculations
DROP POLICY IF EXISTS "Users can view own calculations" ON public.cbam_calculations;
CREATE POLICY "Users can view own calculations"
ON public.cbam_calculations FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their OWN calculations
DROP POLICY IF EXISTS "Users can insert own calculations" ON public.cbam_calculations;
CREATE POLICY "Users can insert own calculations"
ON public.cbam_calculations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their OWN calculations
DROP POLICY IF EXISTS "Users can update own calculations" ON public.cbam_calculations;
CREATE POLICY "Users can update own calculations"
ON public.cbam_calculations FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to delete their OWN calculations
DROP POLICY IF EXISTS "Users can delete own calculations" ON public.cbam_calculations;
CREATE POLICY "Users can delete own calculations"
ON public.cbam_calculations FOR DELETE
USING (auth.uid() = user_id);
