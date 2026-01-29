import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Globe, Leaf, TrendingUp, AlertCircle } from "lucide-react";
import { useCalculations } from "@/hooks/useCalculations";
import { formatCurrency } from "@/lib/cbam-calculator";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const VerifiedCreditsInfo = () => {
    const { getCalculations } = useCalculations();
    const [stats, setStats] = useState({
        totalLiability: 0,
        totalEmissions: 0,
        count: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        const calcs = await getCalculations();

        const totalLiability = calcs.reduce((acc, curr) => acc + (curr.estimated_liability || 0), 0);
        const totalEmissions = calcs.reduce((acc, curr) => acc + (curr.total_emissions || 0), 0);

        setStats({
            totalLiability,
            totalEmissions,
            count: calcs.length
        });
        setLoading(false);
    };

    return (
        <Card className="h-full border-blue-500/20 bg-blue-50/10 dark:bg-blue-900/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <ShieldCheck className="h-5 w-5" />
                    Carbon Liability Overview
                </CardTitle>
                <CardDescription>
                    Real-time aggregation of your CBAM calculations
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">Total Liability</p>
                                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                                    {formatCurrency(stats.totalLiability)}
                                </p>
                            </div>
                            <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">Total Emissions</p>
                                <p className="text-xl font-bold text-foreground">
                                    {stats.totalEmissions.toFixed(2)}t
                                </p>
                            </div>
                        </div>

                        <Separator className="bg-blue-200 dark:bg-blue-800/50" />

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                                    <TrendingUp className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold">Active Calculations</h4>
                                    <p className="text-xs text-muted-foreground">
                                        You have {stats.count} saved calculation{stats.count !== 1 ? 's' : ''} contributing to your total liability.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold">Action Required</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.totalLiability > 0
                                            ? "Review your high-impact imports to optimize tax efficiency."
                                            : "No liability detected. Add calculations to see your status."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
