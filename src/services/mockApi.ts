
import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    company: string;
    role: 'admin' | 'user';
}

export interface Listing {
    id: string;
    title: string;
    category: string;
    price: string;
    credits: string;
    submittedAt: string;
    status: 'Pending' | 'Verified' | 'Rejected';
    description?: string;
}

export interface DashboardStats {
    totalCredits: string;
    complianceScore: number;
    financialImpact: string;
    projectedLiability: string;
}

// Keys
const KEYS = {
    USERS: 'gb_users',
    LISTINGS: 'gb_listings',
    SESSION: 'gb_session',
};

// Utils
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Pre-seeded Data
const SEED_LISTINGS: Listing[] = [
    {
        id: '1',
        title: 'Reforestation Project - Western Ghats',
        category: 'Reforestation',
        price: '15,00,000',
        credits: '500',
        submittedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        status: 'Verified',
        description: 'Large scale reforestation project in the Western Ghats biodiversity hotspot.'
    },
    {
        id: '2',
        title: 'Solar Farm - Rajasthan',
        category: 'Renewable Energy',
        price: '45,00,000',
        credits: '1200',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        status: 'Pending',
        description: 'New solar farm installation requiring funding for expansion.'
    }
];

const SEED_DASHBOARD: DashboardStats = {
    totalCredits: '1,250',
    complianceScore: 85,
    financialImpact: '₹40,68,000',
    projectedLiability: '₹1,08,45,000'
};

// API
export const mockApi = {
    // Auth
    login: async (email: string, password: string): Promise<User> => {
        await delay(800);
        if (email === 'demo@greenbridge.com' && password === 'demo123') {
            const user: User = {
                id: 'demo-user-1',
                email,
                name: 'Demo User',
                company: 'GreenFlux Industries',
                role: 'user'
            };
            localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
            return user;
        }

        // Check registered users
        const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
        const found = users.find((u: any) => u.email === email && u.password === password);
        if (found) {
            const user: User = {
                id: found.id,
                email: found.email,
                name: found.name,
                company: found.company || 'Unknown Corp',
                role: 'user'
            };
            localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
            return user;
        }

        throw new Error('Invalid credentials');
    },

    signup: async (data: any): Promise<User> => {
        await delay(1000);
        const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
        if (users.find((u: any) => u.email === data.email)) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: uuidv4(),
            ...data
        };

        users.push(newUser);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));

        const userResp: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            company: newUser.company,
            role: 'user'
        };
        localStorage.setItem(KEYS.SESSION, JSON.stringify(userResp));
        return userResp;
    },

    logout: async () => {
        await delay(200);
        localStorage.removeItem(KEYS.SESSION);
    },

    getCurrentUser: async (): Promise<User | null> => {
        await delay(100); // Fast check
        const session = localStorage.getItem(KEYS.SESSION);
        return session ? JSON.parse(session) : null;
    },

    // Dashboard
    getDashboardStats: async (): Promise<DashboardStats> => {
        await delay(600);
        return SEED_DASHBOARD;
    },

    // Listings
    getListings: async (): Promise<Listing[]> => {
        await delay(600);
        const stored = localStorage.getItem(KEYS.LISTINGS);
        if (!stored) {
            localStorage.setItem(KEYS.LISTINGS, JSON.stringify(SEED_LISTINGS));
            return SEED_LISTINGS;
        }
        return JSON.parse(stored);
    },

    createListing: async (listingData: Omit<Listing, 'id' | 'submittedAt' | 'status'>): Promise<Listing> => {
        await delay(1000);
        const newListing: Listing = {
            id: uuidv4(),
            ...listingData,
            submittedAt: new Date().toISOString(),
            status: 'Pending'
        };

        const listings = await mockApi.getListings();
        const updatedListings = [newListing, ...listings];
        localStorage.setItem(KEYS.LISTINGS, JSON.stringify(updatedListings));
        return newListing;
    }
};
