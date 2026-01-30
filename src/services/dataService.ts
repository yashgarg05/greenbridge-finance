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
        // Now delegating to the unified listingService or using direct query
        const { data, error } = await supabase.from('listings').select('*');
        if (error) {
            console.error(error);
            return [];
        }
        return data.map(l => ({
            ...l,
            image: l.image_url,
            pricePerUnit: l.price_per_unit
        })) as Listing[];
    },

    getRecentActivity: async (userId?: string): Promise<ActivityItem[]> => {
        // If no user ID is passed, we might want to return nothing or all public activity
        // But usually this is user specific.
        const { data: investments, error } = await supabase
            .from('investments')
            .select('*, listings(title)')
            .order('purchased_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error(error);
            return [];
        }

        return investments.map(inv => ({
            id: inv.id,
            type: 'invest',
            project: inv.listings?.title || 'Unknown Project',
            amount: `₹${inv.amount_invested}`,
            time: new Date(inv.purchased_at).toLocaleDateString(),
            status: inv.status
        }));
    },

    getUserStats: async (userId: string) => {
        // 1. Calculate Portfolio Value (Sum of investments)
        const { data: investments, error } = await supabase
            .from('investments')
            .select('amount_invested, credits_purchased')
            .eq('user_id', userId);

        if (error) {
            console.error("Stats Error", error);
            return { portfolioValue: "₹0", credits: 0, impactScore: 0, risk: "Low" };
        }

        const totalInvested = investments?.reduce((sum, item) => sum + Number(item.amount_invested), 0) || 0;
        const totalCredits = investments?.reduce((sum, item) => sum + Number(item.credits_purchased), 0) || 0;

        return {
            portfolioValue: `₹${totalInvested.toLocaleString()}`,
            credits: totalCredits,
            impactScore: Math.floor(totalCredits * 0.8), // Mock logic for impact
            risk: "Low" // Placeholder logic
        };
    },

    seedDemoData: async () => {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) return false;

        // 1. Listings (if empty)
        const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true });
        if (count === 0) {
            // Re-use MOCK_LISTINGS from top of file but map keys
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
                    sdgs: l.sdgs,
                    owner_id: user.id // Assign to current user as admin/owner
                }))
            );
            if (error) console.error("Error Seeding Listings", error);
        }

        // 2. Clear existing investments to avoid mess (optional, but good for reset)
        // await supabase.from('investments').delete().eq('user_id', user.id);

        // 3. Investments (Create 3 dummy investments)
        // Need listing IDs first
        const { data: listings } = await supabase.from('listings').select('id, price_per_unit').limit(3);
        if (listings && listings.length > 0) {
            const investments = listings.map(l => ({
                user_id: user.id,
                listing_id: l.id,
                amount_invested: (l.price_per_unit || 100) * 50, // Buy 50 units
                credits_purchased: 50,
                status: 'completed',
                purchased_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // Random time last week
            }));

            const { error: invError } = await supabase.from('investments').insert(investments);
            if (invError) console.error("Error Seeding Investments", invError);
        }

        // 4. Sensor Readings (Simulate IoT history)
        const sensors = ['sensor-001', 'sensor-002', 'sensor-003'];
        const readings = [];
        const now = Date.now();
        for (let i = 0; i < 50; i++) {
            readings.push({
                sensor_id: sensors[i % 3],
                user_id: user.id,
                value: 400 + Math.random() * 100, // CO2 ppm range
                timestamp: new Date(now - i * 3600000).toISOString() // Hourly past readings
            });
        }
        const { error: sensorError } = await supabase.from('sensor_readings').insert(readings);
        if (sensorError) console.error("Error Seeding Sensors", sensorError);

        return true;
    },

    saveSensorReading: async (reading: { sensor_id: string; value: number; user_id?: string }) => {
        const { error } = await supabase.from('sensor_readings').insert({
            sensor_id: reading.sensor_id,
            value: reading.value,
            user_id: reading.user_id
        });
        if (error) {
            console.error("Error saving reading:", error);
            throw error;
        }
        return true;
    },

    // New: Handle Investment
    createInvestment: async (userId: string, listingId: string, amount: number, credits: number) => {
        const { error } = await supabase.from('investments').insert({
            user_id: userId,
            listing_id: listingId,
            amount_invested: amount,
            credits_purchased: credits,
            status: 'completed',
            purchased_at: new Date().toISOString()
        });

        if (error) throw error;

        // Optionally update available credits in listing
        // const { error: updateError } = await supabase.rpc('decrement_listing_credits', { lid: listingId, amt: credits });

        return true;
    }
};
