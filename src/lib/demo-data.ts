import { supabase } from '@/lib/supabase';

export const seedDemoData = async (userId: string) => {
    if (!userId) return false;

    try {
        // 1. Seed Projects (Green Investment)
        // Check if projects exist first to avoid duplicates? Or just insert.
        // Let's Insert. If unique constraint fails, fine. But projects usually have auto-id.
        // We'll insert a few fixed ones.

        const projects = [
            {
                user_id: userId,
                name: "Gujarat Solar Park Expansion",
                description: "Large scale solar power generation project in India reducing coal dependency.",
                location: "Gujarat, India",
                sector: "Renewable Energy",
                carbon_price: 25.50,
                available_credits: 50000,
                rating: "A+",
                vintage: "2025"
            },
            {
                user_id: userId,
                name: "Amazonas Reforestation Initiative",
                description: "Restoring 500 hectares of degraded rainforest in Brazil, creating biodiversity corridors.",
                location: "Manaus, Brazil",
                sector: "Forestry",
                carbon_price: 45.00,
                available_credits: 12000,
                rating: "AAA",
                vintage: "2024"
            },
            {
                user_id: userId,
                name: "Nordic Wind Farm Alpha",
                description: "Offshore wind energy project supplying clean power to the European grid.",
                location: "North Sea, Norway",
                sector: "Renewable Energy",
                carbon_price: 32.75,
                available_credits: 25000,
                rating: "AA",
                vintage: "2025"
            },
            {
                user_id: userId,
                name: "Vietnam Rice Methane Capture",
                description: "Innovative agricultural methane capture technology in rice paddies.",
                location: "Mekong Delta, Vietnam",
                sector: "Agriculture",
                carbon_price: 18.20,
                available_credits: 8500,
                rating: "A",
                vintage: "2025"
            }
        ];

        const { error: projError } = await supabase.from('projects').insert(projects);
        if (projError) console.error("Error seeding projects:", projError);

        // 2. Seed Calculations (For Map & List)
        // Need varied countries for map visualization
        const calculations = [
            {
                user_id: userId,
                commodity_type: "Steel",
                import_quantity: 5000,
                country_of_origin: "CN", // China
                emission_factor: 2.1,
                total_emissions: 10500,
                gross_liability: 924000,
                estimated_liability: 23100, // 2.5% phase in
                ets_price: 88,
                status: "verified"
            },
            {
                user_id: userId,
                commodity_type: "Aluminum",
                import_quantity: 2000,
                country_of_origin: "IN", // India
                emission_factor: 8.5, // High intensity
                total_emissions: 17000,
                gross_liability: 1496000,
                estimated_liability: 37400,
                ets_price: 88,
                status: "draft"
            },
            {
                user_id: userId,
                commodity_type: "Cement",
                import_quantity: 10000,
                country_of_origin: "TR", // Turkey
                emission_factor: 0.6,
                total_emissions: 6000,
                gross_liability: 528000,
                estimated_liability: 13200,
                ets_price: 88,
                status: "verified"
            },
            {
                user_id: userId,
                commodity_type: "Fertilizer",
                import_quantity: 1500,
                country_of_origin: "US", // USA
                emission_factor: 0.3,
                total_emissions: 450,
                gross_liability: 39600,
                estimated_liability: 990,
                ets_price: 88,
                status: "finalized"
            },
            {
                user_id: userId,
                commodity_type: "Steel",
                import_quantity: 3500,
                country_of_origin: "KR", // South Korea
                emission_factor: 1.8,
                total_emissions: 6300,
                gross_liability: 554400,
                estimated_liability: 13860,
                ets_price: 88,
                status: "paid"
            }
        ];

        const { error: calcError } = await supabase.from('cbam_calculations').insert(calculations);
        if (calcError) console.error("Error seeding calculations:", calcError);

        // 3. Seed Deadlines
        const deadlines = [
            {
                user_id: userId,
                title: "Q4 2025 CBAM Declaration",
                description: "Final submission for the transitional period quarter.",
                due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
                status: 'urgent'
            },
            {
                user_id: userId,
                title: "Supplier Emissions Verification",
                description: "Verify emission data from Steel suppliers in China.",
                due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days
                status: 'pending'
            },
            {
                user_id: userId,
                title: "Annual Carbon Audit",
                description: "Internal audit of carbon footprint.",
                due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days
                status: 'upcoming'
            }
        ];

        // Check if table exists first? Hopefully user ran the script.
        const { error: deadlineError } = await supabase.from('compliance_deadlines').insert(deadlines);
        if (deadlineError) console.error("Error seeding deadlines:", deadlineError);

        return true;
    } catch (error) {
        console.error("Seeding failed:", error);
        return false;
    }
};
