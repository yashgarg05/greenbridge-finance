import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be extended as we add more tables)
export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    mobile: string | null;
    company: string | null;
    created_at: string;
    updated_at: string;
}

export interface CBAMCalculation {
    id: string;
    user_id: string;
    commodity_type: 'steel' | 'aluminum' | 'cement' | 'fertilizer';
    import_quantity: number;
    country_of_origin: string;
    emission_factor: number;
    total_emissions: number;
    gross_liability: number;
    estimated_liability: number;
    ets_price: number;
    status: 'draft' | 'verifying' | 'finalized';
    created_at: string;
    updated_at: string;
}

export interface Document {
    id: string;
    user_id: string;
    name: string;
    size: number;
    file_type: string;
    storage_path: string;
    created_at: string;
}

export interface ChecklistItem {
    id: string;
    user_id: string;
    item_key: string;
    title: string;
    description: string;
    completed: boolean;
    required: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserSettings {
    id: string;
    user_id: string;
    theme: string;
    notifications_enabled: boolean;
    email_reports: boolean;
    settings: Record<string, any>;
    created_at: string;
    updated_at: string;
}
