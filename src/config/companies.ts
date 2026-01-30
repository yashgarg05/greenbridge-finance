export interface CompanyConfig {
    name: string;
    roles: string[];
}

export const ALLOWED_DOMAINS: Record<string, CompanyConfig> = {
    'greenbridge.finance': {
        name: 'GreenBridge Finance',
        roles: ['Super Admin', 'System Auditor', 'Platform Manager']
    },
    'carbonchain.com': {
        name: 'CarbonChain',
        roles: ['Carbon Analyst', 'Verification Officer', 'Compliance Manager']
    },
    'tesla.com': {
        name: 'Tesla Inc.',
        roles: ['Sustainability Director', 'Energy Trader', 'Supply Chain Analyst']
    },
    'maersk.com': {
        name: 'Maersk Line',
        roles: ['Logistics Coordinator', 'Fuel Procurement', 'Sustainability Lead']
    },
    'unilever.com': {
        name: 'Unilever',
        roles: ['Sourcing Manager', 'Impact Officer', 'Corporate Strategy']
    },
    'google.com': {
        name: 'Google LLC',
        roles: ['Data Center Energy Lead', 'Carbon Portfolio Manager', 'Sustainability Strategy']
    },
    'example.com': {
        name: 'Demo Corp',
        roles: ['Demo User', 'Tester']
    },
    'demo.com': {
        name: 'Acme Industries',
        roles: ['Facility Manager', 'Environmental Engineer']
    }
};
