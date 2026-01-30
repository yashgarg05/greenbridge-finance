-- 🟢 FIX ADMIN PERMISSIONS
-- Run this in your Supabase SQL Editor to make the Admin Dashboard work for everyone.

-- 1. Enable RLS (Ensure it's on)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies (to avoid conflicts)
DROP POLICY IF EXISTS "Owners can update listings" ON public.listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON public.listings;
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON public.listings;

-- 3. Create PERMISSIVE policies (for Demo/Admin functionality)

-- Allow ANYONE to SELECT (View)
CREATE POLICY "Enable read access for all users" 
ON public.listings FOR SELECT 
USING (true);

-- Allow ANYONE to INSERT (Create)
CREATE POLICY "Enable insert access for all users" 
ON public.listings FOR INSERT 
WITH CHECK (true);

-- Allow ANYONE to UPDATE (Approve/Reject)
-- This is critical for the Admin Dashboard to work without being the owner
CREATE POLICY "Enable update access for all users" 
ON public.listings FOR UPDATE 
USING (true);

-- Allow ANYONE to DELETE
-- This is critical for the Delete button
CREATE POLICY "Enable delete access for all users" 
ON public.listings FOR DELETE 
USING (true);
