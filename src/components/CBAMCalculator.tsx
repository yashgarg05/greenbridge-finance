import { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateCBAMLiability,
  formatCurrency,
  formatNumber,
  generateRecommendations,
  CURRENT_ETS_PRICE,
  PHASE_IN_MULTIPLIER_2026,
  EMISSION_FACTORS,
  COUNTRY_FACTORS,
  type CommodityType,
  type CBAMResult,
} from '@/lib/cbam-calculator';

const commodities: { value: CommodityType; label: string }[] = [
  { value: 'steel', label: 'Steel' },
  { value: 'aluminum', label: 'Aluminum' },
  { value: 'cement', label: 'Cement' },
  { value: 'fertilizer', label: 'Fertilizer' },
];

const countries = Object.keys(COUNTRY_FACTORS);

export function CBAMCalculator() {
  const [commodityType, setCommodityType] = useState<CommodityType>('steel');
  const [quantity, setQuantity] = useState<string>('1000');
  const [country, setCountry] = useState<string>('China');
  const [result, setResult] = useState<CBAMResult | null>(null);

  const handleCalculate = () => {
    const input = {
      commodityType,
      importQuantity: parseFloat(quantity) || 0,
      countryOfOrigin: country,
    };
    const calculation = calculateCBAMLiability(input);
    setResult(calculation);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            CBAM Compliance Calculator
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estimate your Carbon Border Adjustment Mechanism liability
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>EU ETS Price: {formatCurrency(CURRENT_ETS_PRICE)}/tCO₂</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="data-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Import Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commodity" className="metric-label">
                Commodity Type
              </Label>
              <Select value={commodityType} onValueChange={(v) => setCommodityType(v as CommodityType)}>
                <SelectTrigger id="commodity" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commodities.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label} (EF: {EMISSION_FACTORS[c.value]} tCO₂/t)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="metric-label">
                Import Quantity (Tonnes)
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="bg-background font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="metric-label">
                Country of Origin
              </Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCalculate} className="w-full mt-4" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Liability
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Main Liability Card */}
              <Card className="data-card glow-primary border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="metric-label mb-2">Estimated CBAM Liability (2026)</p>
                    <p className="text-4xl font-bold financial-value">
                      {formatCurrency(result.estimatedLiability)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {(PHASE_IN_MULTIPLIER_2026 * 100).toFixed(1)}% phase-in rate applied
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Optimization Opportunities
                  </p>
                  <div className="grid gap-3">
                    {generateRecommendations({ commodityType, importQuantity: parseFloat(quantity) || 0, countryOfOrigin: country }, result).map((rec, i) => (
                      <Card key={i} className="border-l-4 border-l-green-500 bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <div className="space-y-1">
                              <p className="font-semibold text-sm">{rec.title}</p>
                              {rec.potentialCredits && (rec.potentialCredits > 0) && (
                                <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 w-fit rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                                  <span>Earn {rec.potentialCredits} Verified Credits</span>
                                </div>
                              )}
                            </div>
                            {rec.potentialSavingsEUR && (
                              <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded-full shrink-0">
                                Save ~{formatCurrency(rec.potentialSavingsEUR)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{rec.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="data-card">
                  <CardContent className="pt-4">
                    <p className="metric-label">Total Emissions</p>
                    <p className="text-2xl font-semibold font-mono mt-1">
                      {formatNumber(result.totalEmissions)} <span className="text-sm text-muted-foreground">tCO₂</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="data-card">
                  <CardContent className="pt-4">
                    <p className="metric-label">Gross Liability</p>
                    <p className="text-2xl font-semibold font-mono mt-1">
                      {formatCurrency(result.grossLiability)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="data-card">
                  <CardContent className="pt-4">
                    <p className="metric-label">Emission Factor</p>
                    <p className="text-2xl font-semibold font-mono mt-1">
                      {result.emissionFactor} <span className="text-sm text-muted-foreground">tCO₂/t</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="data-card">
                  <CardContent className="pt-4">
                    <p className="metric-label">EU ETS Price</p>
                    <p className="text-2xl font-semibold font-mono mt-1">
                      €{result.etsPrice}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Projection Alert */}
              <Card className="data-card border-warning/30 bg-warning/5">
                <CardContent className="pt-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Phase-in Projection</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      By 2034 (100% phase-in), your liability would be{' '}
                      <span className="font-mono text-foreground">{formatCurrency(result.grossLiability)}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="data-card h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Enter import details and calculate</p>
                <p className="text-sm mt-1">to see your CBAM liability estimate</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
