-- Create compliance_deadlines table
CREATE TABLE IF NOT EXISTS public.compliance_deadlines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    status TEXT CHECK (status IN ('urgent', 'pending', 'upcoming', 'completed')) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: We assume 'documents' table might also be needed? Check hooks.

-- RLS
ALTER TABLE public.compliance_deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deadlines" ON public.compliance_deadlines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deadlines" ON public.compliance_deadlines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deadlines" ON public.compliance_deadlines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deadlines" ON public.compliance_deadlines FOR DELETE USING (auth.uid() = user_id);

-- Insert some default deadlines for new users if needed?
-- No, let's keep it clean.
