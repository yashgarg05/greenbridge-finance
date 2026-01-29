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


export interface Recommendation {
  title: string;
  description: string;
  potentialSavingsEUR?: number;
  type: 'sourcing' | 'technology' | 'methodology';
  impact: 'high' | 'medium' | 'low';
}

export interface OptimizationResult {
  recommendations: Recommendation[];
}

export function generateRecommendations(input: CBAMInput, result: CBAMResult): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Sourcing Optimization
  // Check if current country has a high risk factor (> 1.0)
  const currentFactor = COUNTRY_FACTORS[input.countryOfOrigin] || 1.0;
  if (currentFactor > 1.0) {
    // Find better alternative in a simplified way (e.g. Japan 0.85)
    const betterOption = 'Japan'; // Simplified target
    const betterFactor = COUNTRY_FACTORS[betterOption];

    // Calculate difference
    const currentTotal = result.grossLiability; // Full liability without phase-in for clearer impact
    const optimizedTotal = currentTotal * (betterFactor / currentFactor);
    const savings = currentTotal - optimizedTotal;

    recs.push({
      title: 'Optimize Sourcing Origin',
      description: `Switching sourcing from ${input.countryOfOrigin} to a lower-risk region like ${betterOption} could reduce embodied emissions significantly.`,
      potentialSavingsEUR: savings,
      type: 'sourcing',
      impact: savings > 1000 ? 'high' : 'medium',
    });
  }

  // 2. Methodology Optimization (Actual vs Default)
  // Assuming defaults are usually 20% higher than well-managed actuals
  const potentialActualSavings = result.grossLiability * 0.20;
  recs.push({
    title: 'Switch to Actual Data',
    description: 'Using default values often overestimates emissions. Collecting actual supplier data typically reduces liability by ~20%.',
    potentialSavingsEUR: potentialActualSavings,
    type: 'methodology',
    impact: 'medium',
  });

  // 3. Technology / Best Practices (Sector specific)
  switch (input.commodityType) {
    case 'steel':
      recs.push({
        title: 'Adopt Electric Arc Furnace (EAF)',
        description: 'Sourcing steel produced via EAF powered by renewables instead of Blast Furnaces can reduce emissions by up to 75%.',
        type: 'technology',
        impact: 'high',
      });
      break;
    case 'aluminum':
      recs.push({
        title: 'Increase Recycled Content',
        description: 'Aluminum produced from recycled scrap consumes 95% less energy than primary aluminum.',
        type: 'technology',
        impact: 'high',
      });
      break;
    case 'cement':
      recs.push({
        title: 'Alternative Fuels & Clinker Substitution',
        description: 'Using biomass fuels and reducing clinker-to-cement ratio are key levers for cement decarbonization.',
        type: 'technology',
        impact: 'medium',
      });
      break;
    case 'fertilizer':
      recs.push({
        title: 'Green Ammonia Feedstock',
        description: 'Transitioning to fertilizers produced with Green Hydrogen (Green Ammonia) drastically lowers the carbon footprint.',
        type: 'technology',
        impact: 'high',
      });
      break;
  }

  return recs;
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
