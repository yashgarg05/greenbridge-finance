import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export const FormulaBreakdown = () => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    Calculation Methodology
                </CardTitle>
                <CardDescription>
                    How we calculate your Carbon Liability
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Main Formula */}
                <div className="bg-muted p-4 rounded-lg border border-border/50 text-center">
                    <p className="font-mono text-sm md:text-base font-semibold text-primary">
                        Liability = Mass × Emissions × ETS Price × Phase-In
                    </p>
                </div>

                {/* Variable Definitions */}
                <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm">
                        <div className="font-bold min-w-[120px] text-foreground">Mass</div>
                        <div className="text-muted-foreground">The total weight of imported goods (e.g., steel, aluminum) in metric tonnes.</div>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                        <div className="font-bold min-w-[120px] text-foreground">Emissions</div>
                        <div className="text-muted-foreground">
                            Specific Embedded Emissions (SEE) of the product.
                            <span className="block mt-1 text-xs italic opacity-80">Default: 1.9 tCO2e/t for generic steel.</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                        <div className="font-bold min-w-[120px] text-foreground">ETS Price</div>
                        <div className="text-muted-foreground">
                            The weekly average price of EU Emission Trading System (ETS) allowances.
                            <span className="block mt-1 text-xs italic opacity-80">Current Baseline: €88.00/tCO2e.</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                        <div className="font-bold min-w-[120px] text-foreground">Phase-In</div>
                        <div className="text-muted-foreground">
                            The transitional factor determining the percentage of emissions subject to payment.
                            <span className="block mt-1 text-xs italic opacity-80">2026 Factor: 2.5% (increasing annually).</span>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <p className="text-xs text-muted-foreground">
                        * This formula provides an estimated financial liability for the year 2026. Actual costs may vary based on specific verified emission reports and market fluctuations.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
