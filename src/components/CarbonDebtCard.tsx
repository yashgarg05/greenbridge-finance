import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EMISSION_FACTOR = 1.9;
const ETS_PRICE = 88.0;
const PHASE_IN = 0.025;

interface CarbonDebtCardProps {
  tonnes: string;
  onTonnesChange: (value: string) => void;
}

export function CarbonDebtCard({ tonnes, onTonnesChange }: CarbonDebtCardProps) {
  const liability = useMemo(() => {
    const qty = parseFloat(tonnes) || 0;
    return qty * EMISSION_FACTOR * ETS_PRICE * PHASE_IN;
  }, [tonnes]);

  return (
    <div className="data-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Net Carbon Debt</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tonnes" className="text-xs text-muted-foreground">
          Steel Tonnes
        </Label>
        <Input
          id="tonnes"
          type="number"
          value={tonnes}
          onChange={(e) => onTonnesChange(e.target.value)}
          placeholder="0"
          className="text-lg font-medium h-12"
        />
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground mb-1">Estimated Liability (2026)</p>
        <p className="text-3xl font-bold financial-value">
          €{liability.toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {tonnes || '0'}t × {EMISSION_FACTOR} × €{ETS_PRICE} × {PHASE_IN * 100}%
        </p>
      </div>
    </div>
  );
}