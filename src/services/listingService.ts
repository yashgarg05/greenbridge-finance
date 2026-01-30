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

export const listingService = {
    getAll: (): Listing[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LISTINGS));
            return SEED_LISTINGS;
        }
        return JSON.parse(data);
    },

    getVerified: (): Listing[] => {
        const all = listingService.getAll();
        return all.filter(l => l.status === 'Verified');
    },

    addListing: (listing: Partial<Listing>) => {
        const current = listingService.getAll();

        // Robust number parsing (handles "15,00,000" and "1500000")
        const parseValue = (val: string | number | undefined): number => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            return parseFloat(val.replace(/,/g, ''));
        };

        const totalCost = parseValue(listing.price);
        const totalCredits = parseValue(listing.credits);

        // Calculate true Price Per Unit (default to 10 if invalid)
        const calculatedPricePerUnit = (totalCost > 0 && totalCredits > 0)
            ? (totalCost / totalCredits)
            : 10;

        const newListing: Listing = {
            id: Math.random().toString(36).substr(2, 9),
            title: listing.title || 'Untitled Project',
            category: listing.category || 'Other',
            price: listing.price || '0',
            pricePerUnit: calculatedPricePerUnit,
            credits: listing.credits || '0',
            description: listing.description || '',
            location: listing.location || 'Unknown',
            status: 'Pending',
            submittedAt: new Date().toISOString(),
            ownerId: listing.ownerId || null,

            // Defaults for new listings
            fundingPercentage: 0,
            verifiedBy: listing.verifiedBy || 'Pending Audit',
            qualityRating: listing.qualityRating || 'B+',
            article6: listing.article6 || false,
            sdgGoals: listing.sdgGoals || [13],
            image: listing.image || undefined
        };

        const updated = [newListing, ...current];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newListing;
    },

    updateStatus: (id: string, status: ListingStatus) => {
        const current = listingService.getAll();
        const updated = current.map(item =>
            item.id === id ? { ...item, status } : item
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    deleteListing: (id: string) => {
        const current = listingService.getAll();
        const updated = current.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    }
};
