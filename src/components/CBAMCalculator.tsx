import { useState, useEffect } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from "@/components/ui/separator";

// --- Constants ---
const CARBON_PRICE_EUR = 85.50;
const EXCHANGE_RATE_INR = 90.0; // 1 EUR = 90 INR

const COMMODITIES = [
  { id: 'steel', name: 'Steel', factor: 1.9 },
  { id: 'cement', name: 'Cement', factor: 0.9 },
  { id: 'aluminum', name: 'Aluminum', factor: 16.5 }, // High intensity
  { id: 'fertilizer', name: 'Fertilizer', factor: 2.6 },
  { id: 'hydrogen', name: 'Hydrogen', factor: 8.9 }
];

const ORIGINS = [
  { id: 'cn', name: 'China', risk: 1.4 }, // High coal grid
  { id: 'in', name: 'India', risk: 1.3 },
  { id: 'tr', name: 'Turkey', risk: 1.1 },
  { id: 'us', name: 'USA', risk: 0.9 }, // Efficiency bonus
  { id: 'eu', name: 'Europe', risk: 0.8 },
];

// --- Helper: Animated Counter ---
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    // Don't animate small changes (optional, but keeps it snappy)
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);

      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      {suffix}
    </span>
  );
}

export function CBAMCalculator() {
  // --- State ---
  const [commodity, setCommodity] = useState(COMMODITIES[0].id);
  const [origin, setOrigin] = useState(ORIGINS[0].id);
  const [quantity, setQuantity] = useState<string>('1000');

  // --- Computed ---
  const [result, setResult] = useState({
    emissions: 0,
    liabilityEUR: 0,
    liabilityINR: 0,
    freeAllowance: 0
  });

  useEffect(() => {
    const selectedComm = COMMODITIES.find(c => c.id === commodity)!;
    const selectedOrigin = ORIGINS.find(o => o.id === origin)!;
    const qty = parseFloat(quantity) || 0;

    // Basic Math: Qty * Factor * OriginRisk
    const rawEmissions = qty * selectedComm.factor * selectedOrigin.risk;

    // Free Allowance (Simplification: 20% free allocation phase-out)
    const freeAllowance = rawEmissions * 0.20;
    const taxableEmissions = Math.max(0, rawEmissions - freeAllowance);

    const liabilityEUR = taxableEmissions * CARBON_PRICE_EUR;

    setResult({
      emissions: rawEmissions,
      freeAllowance,
      liabilityEUR,
      liabilityINR: liabilityEUR * EXCHANGE_RATE_INR
    });
  }, [commodity, origin, quantity]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          CBAM Liability Calculator
        </h2>
        <p className="text-muted-foreground">Estimate carbon taxes for EU imports under the Carbon Border Adjustment Mechanism.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        {/* INPUT SECTION */}
        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Commodity Type</Label>
              <Select value={commodity} onValueChange={setCommodity}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMODITIES.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="font-medium">{c.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (Avg. {c.factor} tCO2/t)
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Country of Origin</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORIGINS.map(o => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Origin determines grid-intensity multipliers.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Quantity (Tonnes)</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-11 font-mono text-lg"
                placeholder="e.g. 1000"
              />
            </div>
          </CardContent>
        </Card>

        {/* OUTPUT / INVOICE SECTION */}
        <Card className="border-border/50 bg-muted/20 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5" />

          <CardContent className="p-8 relative space-y-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Estimated Tax Liability</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-bold tracking-tighter text-foreground tabular-nums">
                  <AnimatedCounter value={result.liabilityEUR} prefix="€" />
                </h3>
                <span className="text-lg text-muted-foreground font-medium">EUR</span>
              </div>
              <p className="text-emerald-600 dark:text-emerald-400 font-mono font-medium mt-2 tabular-nums">
                ≈ <AnimatedCounter value={result.liabilityINR} prefix="₹" /> INR
              </p>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Emissions</span>
                <span className="font-mono font-medium tabular-nums">
                  <AnimatedCounter value={result.emissions} suffix=" tCO2e" />
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Free Allowance Credits</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                  -<AnimatedCounter value={result.freeAllowance} suffix=" tCO2e" />
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Carbon Price (EU ETS)</span>
                <span className="font-mono font-medium">€{CARBON_PRICE_EUR}/tonne</span>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
