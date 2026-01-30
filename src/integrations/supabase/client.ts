
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing! Falling back to Mock Mode for Demo.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Helper to check if we are in Mock Mode
export const isMockMode = !supabaseUrl || !supabaseAnonKey;
