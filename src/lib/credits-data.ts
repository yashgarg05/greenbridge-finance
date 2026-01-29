// Green Credits Marketplace Data

export type CreditType = 'carbon' | 'india-gcp';

export interface GreenCredit {
  id: string;
  projectName: string;
  type: CreditType;
  pricePerUnit: number;
  qualityScore: number;
  country: string;
  vintage: number;
  availableUnits: number;
  methodology: string;
  verified: boolean;
}

export const CREDITS_DATA: GreenCredit[] = [
  {
    id: 'gc-001',
    projectName: 'Gujarat Solar Farm Initiative',
    type: 'india-gcp',
    pricePerUnit: 12.50,
    qualityScore: 92,
    country: 'India',
    vintage: 2024,
    availableUnits: 15000,
    methodology: 'VCS + GCP',
    verified: true,
  },
  {
    id: 'gc-002',
    projectName: 'Amazon Rainforest Protection',
    type: 'carbon',
    pricePerUnit: 18.75,
    qualityScore: 88,
    country: 'Brazil',
    vintage: 2023,
    availableUnits: 8500,
    methodology: 'REDD+',
    verified: true,
  },
  {
    id: 'gc-003',
    projectName: 'Rajasthan Wind Power Project',
    type: 'india-gcp',
    pricePerUnit: 9.80,
    qualityScore: 85,
    country: 'India',
    vintage: 2024,
    availableUnits: 22000,
    methodology: 'GS VER',
    verified: true,
  },
  {
    id: 'gc-004',
    projectName: 'Indonesian Mangrove Restoration',
    type: 'carbon',
    pricePerUnit: 24.30,
    qualityScore: 95,
    country: 'Indonesia',
    vintage: 2024,
    availableUnits: 5200,
    methodology: 'Verra Blue Carbon',
    verified: true,
  },
  {
    id: 'gc-005',
    projectName: 'Maharashtra Biogas Collection',
    type: 'india-gcp',
    pricePerUnit: 7.25,
    qualityScore: 78,
    country: 'India',
    vintage: 2023,
    availableUnits: 35000,
    methodology: 'CDM',
    verified: true,
  },
  {
    id: 'gc-006',
    projectName: 'Kenya Cookstove Distribution',
    type: 'carbon',
    pricePerUnit: 15.60,
    qualityScore: 82,
    country: 'Kenya',
    vintage: 2024,
    availableUnits: 12000,
    methodology: 'Gold Standard',
    verified: true,
  },
  {
    id: 'gc-007',
    projectName: 'Tamil Nadu Hydro Power',
    type: 'india-gcp',
    pricePerUnit: 11.20,
    qualityScore: 89,
    country: 'India',
    vintage: 2024,
    availableUnits: 18500,
    methodology: 'VCS + GCP',
    verified: true,
  },
  {
    id: 'gc-008',
    projectName: 'Chilean Wind Energy Park',
    type: 'carbon',
    pricePerUnit: 21.00,
    qualityScore: 91,
    country: 'Chile',
    vintage: 2023,
    availableUnits: 7800,
    methodology: 'VCS',
    verified: true,
  },
];

export function getTypeLabel(type: CreditType): string {
  return type === 'carbon' ? 'Carbon Credit' : 'India GCP';
}

export function getQualityLabel(score: number): { label: string; variant: 'success' | 'warning' | 'error' } {
  if (score >= 90) return { label: 'Premium', variant: 'success' };
  if (score >= 80) return { label: 'Standard', variant: 'warning' };
  return { label: 'Basic', variant: 'error' };
}
