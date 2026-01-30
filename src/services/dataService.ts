import { supabase, isMockMode } from '@/integrations/supabase/client';

export interface Listing {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    pricePerUnit: number;
    image: string;
    verified: boolean;
    type: string;
    available_credits: number;
    vintage: string;
    sdgs: string[];
}

export interface ActivityItem {
    id: number;
    type: string;
    project: string;
    amount: string;
    time: string;
    status: string;
}

// Mock Data
const MOCK_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Sahara Solar Initiative',
        description: 'Large-scale solar farm in the Sahara desert, powering 50k homes.',
        location: 'Morocco',
        price: 1500000,
        pricePerUnit: 150,
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60',
        verified: true,
        type: 'solar',
        available_credits: 10000,
        vintage: '2024',
        sdgs: ['7', '13']
    },
    {
        id: '2',
        title: 'Amazon Reforestation',
        description: 'Restoring native flora in the Brazilian rainforest.',
        location: 'Brazil',
        price: 2400000,
        pricePerUnit: 240,
        image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&auto=format&fit=crop&q=60',
        verified: true,
        type: 'forestry',
        available_credits: 5000,
        vintage: '2023',
        sdgs: ['13', '15']
    },
    {
        id: '3',
        title: 'Gujarat Wind Farm',
        description: 'Offshore wind energy project reducing coal dependency.',
        location: 'India',
        price: 1800000,
        pricePerUnit: 180,
        image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&auto=format&fit=crop&q=60',
        verified: true,
        type: 'wind',
        available_credits: 8000,
        vintage: '2024',
        sdgs: ['7', '9']
    }
];

const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 1, type: 'invest', project: 'Sahara Solar Initiative', amount: '₹15,00,000', time: '2 mins ago', status: 'Pending' },
    { id: 2, type: 'verify', project: 'Gujarat Clean Water', amount: 'Gold Standard', time: '1 hour ago', status: 'Verified' },
    { id: 3, type: 'compliance', project: 'CBAM Q1 Report', amount: 'Submitted', time: '4 hours ago', status: 'Success' },
    { id: 4, type: 'market', project: 'Global Carbon Price', amount: '+2.4%', time: '6 hours ago', status: 'Up' },
];

export const dataService = {
    getListings: async (): Promise<Listing[]> => {
        if (isMockMode) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return MOCK_LISTINGS;
        } else {
            const { data, error } = await supabase.from('listings').select('*');
            if (error) throw error;
            return data.map(l => ({
                ...l,
                image: l.image_url,
                pricePerUnit: l.price_per_unit
            })) as Listing[];
        }
    },

    getRecentActivity: async (): Promise<ActivityItem[]> => {
        if (isMockMode) {
            return MOCK_ACTIVITY;
        } else {
            // Real implementation would join investments and listings
            return MOCK_ACTIVITY; // Fallback for now as 'activity' table doesn't strictly exist
        }
    },

    seedDemoData: async () => {
        if (isMockMode) {
            console.log("Seeding Mock Data...");
            // In mock mode, data is static, so just return success
            return true;
        } else {
            // In real mode, insert MOCK_LISTINGS into Supabase
            // Only if table is empty to avoid dupes?
            const { error } = await supabase.from('listings').insert(
                MOCK_LISTINGS.map(l => ({
                    title: l.title,
                    description: l.description,
                    location: l.location,
                    price: l.price,
                    price_per_unit: l.pricePerUnit,
                    image_url: l.image,
                    verified: l.verified,
                    type: l.type,
                    available_credits: l.available_credits,
                    vintage: l.vintage,
                    sdgs: l.sdgs
                }))
            );
            if (error) throw error;
            return true;
        }
    }
};
