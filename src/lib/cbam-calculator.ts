// CBAM Compliance Calculator Logic

export type CommodityType = 'steel' | 'aluminum' | 'cement' | 'fertilizer';

export interface CBAMInput {
  commodityType: CommodityType;
  importQuantity: number;
  countryOfOrigin: string;
}

export interface CBAMResult {
  totalEmissions: number;
  emissionFactor: number;
  etsPrice: number;
  phaseInMultiplier: number;
  grossLiability: number;
  estimatedLiability: number;
  commodityType: CommodityType;
  quantity: number;
}

// Emission factors (tonnes CO2 per tonne of product)
export const EMISSION_FACTORS: Record<CommodityType, number> = {
  steel: 2.1,
  aluminum: 1.8,
  cement: 0.9,
  fertilizer: 1.5,
};

// Current EU ETS price in EUR per tonne CO2
export const CURRENT_ETS_PRICE = 85.50;

// 2026 Phase-in multiplier (2.5%)
export const PHASE_IN_MULTIPLIER_2026 = 0.025;

// Country risk factors (simplified)
export const COUNTRY_FACTORS: Record<string, number> = {
  'China': 1.15,
  'India': 1.10,
  'Russia': 1.20,
  'Turkey': 1.05,
  'United States': 0.95,
  'Brazil': 1.0,
  'South Korea': 0.90,
  'Japan': 0.85,
  'Other': 1.0,
};

export function calculateCBAMLiability(input: CBAMInput): CBAMResult {
  const emissionFactor = EMISSION_FACTORS[input.commodityType];
  const countryFactor = COUNTRY_FACTORS[input.countryOfOrigin] || 1.0;
  
  // Total emissions = quantity * emission factor * country adjustment
  const totalEmissions = input.importQuantity * emissionFactor * countryFactor;
  
  // Gross liability = emissions * ETS price
  const grossLiability = totalEmissions * CURRENT_ETS_PRICE;
  
  // Estimated liability after phase-in
  const estimatedLiability = grossLiability * PHASE_IN_MULTIPLIER_2026;
  
  return {
    totalEmissions,
    emissionFactor,
    etsPrice: CURRENT_ETS_PRICE,
    phaseInMultiplier: PHASE_IN_MULTIPLIER_2026,
    grossLiability,
    estimatedLiability,
    commodityType: input.commodityType,
    quantity: input.importQuantity,
  };
}

export function formatCurrency(value: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-EU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
