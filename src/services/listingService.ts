export type ListingStatus = 'Pending' | 'Verified' | 'Rejected';
export type QualityRating = 'AAA' | 'AA' | 'A' | 'B+';

export interface Listing {
    id: string;
    title: string;
    category: string;
    price: string; // Display price string (e.g. "15,00,000")
    credits: string;
    submittedAt: string;
    status: ListingStatus;
    description: string;
    location: string;

    // Extended Metadata
    ownerId?: string | null; // Email of the creator
    image?: string;
    pricePerUnit?: number; // Numeric price for calculations
    fundingPercentage?: number;
    verifiedBy?: string;
    qualityRating?: QualityRating;
    sdgGoals?: number[];
    article6?: boolean;
}

const STORAGE_KEY = 'greenbridge_listings_v2';

const SEED_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Sahara Solar Initiative',
        description: 'Large-scale solar farm expansion in Northern Africa, replacing diesel generators with clean renewable energy.',
        location: 'Morocco',
        price: '2,500', // Display
        pricePerUnit: 25.00,
        credits: '5000',
        category: 'Solar',
        fundingPercentage: 78,
        verifiedBy: 'Gold Standard',
        qualityRating: 'A',
        article6: true,
        sdgGoals: [7, 13],
        image: '/images/marketplace/solar.png',
        status: 'Verified',
        submittedAt: new Date().toISOString(),
        ownerId: 'system_admin'
    },
    {
        id: '2',
        title: 'Amazon Reforestation Project',
        description: 'Restoring degraded land in the Amazon basin with native species to sequester carbon and restore biodiversity.',
        location: 'Brazil',
        price: '1,500',
        pricePerUnit: 15.00,
        credits: '10000',
        category: 'Forestry',
        fundingPercentage: 45,
        verifiedBy: 'Verra',
        qualityRating: 'AA',
        article6: false,
        sdgGoals: [13, 15],
        image: '/images/marketplace/reforestation.png',
        status: 'Verified',
        submittedAt: new Date().toISOString(),
        ownerId: 'system_admin'
    },
    {
        id: '3',
        title: 'North Sea Wind Expansion',
        description: 'Offshore wind farm development providing clean grid energy to Northern Europe.',
        location: 'Netherlands',
        price: '4,000',
        pricePerUnit: 40.00,
        credits: '2000',
        category: 'Wind',
        fundingPercentage: 92,
        verifiedBy: 'Gold Standard',
        qualityRating: 'A',
        article6: true,
        sdgGoals: [7, 9, 13],
        image: '/images/marketplace/wind.png',
        status: 'Verified',
        submittedAt: new Date().toISOString(),
        ownerId: 'system_admin'
    },
    {
        id: '4',
        title: 'Gujarat Clean Water Project',
        description: 'Community-led water purification and conservation initiative in rural Gujarat, improving health and reducing boiling-related emissions.',
        location: 'India',
        price: '1,800',
        pricePerUnit: 18.00,
        credits: '3500',
        category: 'Water',
        fundingPercentage: 65,
        verifiedBy: 'Gold Standard',
        qualityRating: 'AA',
        article6: true,
        sdgGoals: [6, 3, 13],
        image: '/images/marketplace/water.png',
        status: 'Verified',
        submittedAt: new Date().toISOString(),
        ownerId: 'system_admin'
    },
    {
        id: '5',
        title: 'AtmosClear Direct Air Capture',
        description: 'Cutting-edge DAC facility permanently removing CO2 from the atmosphere and mineralizing it underground.',
        location: 'Iceland',
        price: '15,000',
        pricePerUnit: 150.00,
        credits: '500',
        category: 'Direct Air Capture',
        fundingPercentage: 30,
        verifiedBy: 'Puro.earth',
        qualityRating: 'AAA',
        article6: true,
        sdgGoals: [9, 13],
        image: '/images/marketplace/dac.png',
        status: 'Verified',
        submittedAt: new Date().toISOString(),
        ownerId: 'system_admin'
    }
];

import { supabase } from '@/integrations/supabase/client';

export type ListingStatus = 'Pending' | 'Verified' | 'Rejected';
export type QualityRating = 'AAA' | 'AA' | 'A' | 'B+';

export interface Listing {
    id: string;
    title: string;
    category: string;
    price: string;
    credits: string;
    submittedAt: string;
    status: ListingStatus;
    description: string;
    location: string;
    ownerId?: string | null;
    image?: string;
    pricePerUnit?: number;
    fundingPercentage?: number;
    verifiedBy?: string;
    qualityRating?: QualityRating;
    sdgGoals?: number[];
    article6?: boolean;
}

export const listingService = {
    getAll: async (): Promise<Listing[]> => {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching listings:', error);
            return [];
        }

        return data.map(mapDbListingToClient);
    },

    getVerified: async (): Promise<Listing[]> => {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('verified', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching verified listings:', error);
            return [];
        }

        return data.map(mapDbListingToClient);
    },

    getByOwner: async (ownerId: string): Promise<Listing[]> => {
        // Assuming ownerId is the email for now, but usually it's UUID.
        // We might need to join with profiles if we only have email, or assume owner is UUID.
        // Let's assume the UI passes the user's UUID or we query by owner_id directly.
        // However, the current app mock uses Email. We should probably stick to UUID matching if possible.

        // If ownerId is an email, we might have an issue if listings store UUID. 
        // Let's assume listings store UUID in `owner_id`.

        // For now, I'll try to fetch by matching the auth user separately in the component?
        // Actually, let's fetch by owner_id if it's a UUID, or filter client side if we must.
        // But for "My Listings", we usually pass the UUID.

        // Let's assume ownerId passed here is the UUID.
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user listings:', error);
            return [];
        }

        return data.map(mapDbListingToClient);
    },

    addListing: async (listing: Partial<Listing>, userId: string) => {
        const parseValue = (val: string | number | undefined): number => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            return parseFloat(val.replace(/,/g, ''));
        };

        const totalCost = parseValue(listing.price);
        const totalCredits = parseValue(listing.credits);
        const calculatedPricePerUnit = (totalCost > 0 && totalCredits > 0) ? (totalCost / totalCredits) : 0;

        const dbPayload = {
            title: listing.title,
            description: listing.description,
            location: listing.location,
            price: totalCost,
            price_per_unit: calculatedPricePerUnit,
            available_credits: totalCredits,
            type: listing.category,
            verified: false, // Default to pending
            owner_id: userId,
            image_url: listing.image,
            sdgs: listing.sdgGoals?.map(String) || [],
            vintage: new Date().getFullYear().toString()
        };

        const { data, error } = await supabase
            .from('listings')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;
        return mapDbListingToClient(data);
    }
};

// Helper to map DB columns to Client Interface
function mapDbListingToClient(dbRecord: any): Listing {
    return {
        id: dbRecord.id,
        title: dbRecord.title,
        description: dbRecord.description,
        location: dbRecord.location,
        price: dbRecord.price?.toString(),
        pricePerUnit: dbRecord.price_per_unit,
        credits: dbRecord.available_credits?.toString(),
        category: dbRecord.type,
        status: dbRecord.verified ? 'Verified' : 'Pending',
        submittedAt: dbRecord.created_at,
        ownerId: dbRecord.owner_id,
        image: dbRecord.image_url,
        // Mocking fields not in DB or derived
        verifiedBy: 'Pending Audit',
        qualityRating: 'A',
        fundingPercentage: 0,
        article6: false,
        sdgGoals: dbRecord.sdgs?.map(Number) || []
    };
}
