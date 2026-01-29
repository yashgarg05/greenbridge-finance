
export type ProjectType = 'Solar' | 'Forestry' | 'Wind' | 'Water' | 'Direct Air Capture';
export type QualityRating = 'AAA' | 'AA' | 'A' | 'B+';

export interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    pricePerUnit: number;
    creditsPerUnit: number;
    image: string;
    category: ProjectType;
    fundingPercentage: number;
    verifiedBy: string;
    qualityRating: QualityRating;
    article6: boolean;
    sdgGoals: number[];
    url: string;
}

export const projects: Project[] = [
    {
        id: '1',
        title: 'Sahara Solar Initiative',
        description: 'Large-scale solar farm expansion in Northern Africa, replacing diesel generators with clean renewable energy.',
        location: 'Morocco',
        pricePerUnit: 25.00,
        creditsPerUnit: 1,
        image: '/images/marketplace/solar.png',
        category: 'Solar',
        fundingPercentage: 78,
        verifiedBy: 'Gold Standard',
        qualityRating: 'A',
        article6: true,
        sdgGoals: [7, 13],
        url: 'https://en.wikipedia.org/wiki/Ouarzazate_Solar_Power_Station'
    },
    {
        id: '2',
        title: 'Amazon Rainfall Conservation',
        description: 'Protecting 50,000 hectares of primary rainforest from illegal logging through community patrols.',
        location: 'Brazil',
        pricePerUnit: 18.50,
        creditsPerUnit: 1,
        image: '/images/marketplace/forest.png',
        category: 'Forestry',
        fundingPercentage: 92,
        verifiedBy: 'Verra (VCS)',
        qualityRating: 'AA',
        article6: false,
        sdgGoals: [13, 15],
        url: 'https://www.conservation.org/places/amazon'
    },
    {
        id: '3',
        title: 'North Sea Wind Farm',
        description: 'Offshore wind power generation supplying clean electricity to 500,000 homes in the EU grid.',
        location: 'Netherlands',
        pricePerUnit: 35.00,
        creditsPerUnit: 1,
        image: '/images/marketplace/wind.png',
        category: 'Wind',
        fundingPercentage: 45,
        verifiedBy: 'Gold Standard',
        qualityRating: 'AAA',
        article6: true,
        sdgGoals: [7, 9, 13],
        url: 'https://orsted.com/en/our-business/offshore-wind'
    },
    {
        id: '4',
        title: 'Kenya Clean Water Access',
        description: 'Borehole rehabilitation and water purification systems reducing the need for wood-fuel boiling.',
        location: 'Kenya',
        pricePerUnit: 12.00,
        creditsPerUnit: 0.8,
        image: '/images/marketplace/water.png',
        category: 'Water',
        fundingPercentage: 60,
        verifiedBy: 'UN CDM',
        qualityRating: 'A',
        article6: false,
        sdgGoals: [6, 13],
        url: 'https://www.charitywater.org/our-work/where-we-work/kenya'
    },
    {
        id: '5',
        title: 'AtmosClear Direct Air Capture',
        description: 'Cutting-edge DAC facility permanently removing CO2 from the atmosphere and mineralizing it underground.',
        location: 'Iceland',
        pricePerUnit: 150.00,
        creditsPerUnit: 1,
        image: '/images/marketplace/dac.png',
        category: 'Direct Air Capture',
        fundingPercentage: 30,
        verifiedBy: 'Puro.earth',
        qualityRating: 'AAA',
        article6: true,
        sdgGoals: [9, 13],
        url: 'https://climeworks.com/'
    },
    {
        id: '6',
        title: 'Gujarat Clean Water Project',
        description: 'Community-led water purification and conservation initiative in rural Gujarat, improving health and reducing boiling-related emissions.',
        location: 'India',
        pricePerUnit: 18.00,
        creditsPerUnit: 1.5,
        image: '/images/marketplace/water.png',
        category: 'Water',
        fundingPercentage: 65,
        verifiedBy: 'Gold Standard',
        qualityRating: 'AA',
        article6: true,
        sdgGoals: [6, 3, 13],
        url: 'https://en.wikipedia.org/wiki/Gujarat'
    }
];
