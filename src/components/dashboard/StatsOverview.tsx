
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";

interface StatsProps {
    stats: {
        totalCredits: string;
        complianceScore: number;
        financialImpact: string;
        projectedLiability: string;
    } | undefined;
    isLoading: boolean;
}

export const StatsOverview = ({ stats, isLoading }: StatsProps) => {
    if (isLoading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
            ))}
        </div>;
    }

    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card glow-box border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Credits
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold glow-text">{stats.totalCredits}</div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                    </p>
                </CardContent>
            </Card>
            <Card className="glass-card glow-box border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Compliance Score
                    </CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold glow-text">{stats.complianceScore}/100</div>
                    <p className="text-xs text-muted-foreground">
                        Top 5% of companies
                    </p>
                </CardContent>
            </Card>
            <Card className="glass-card glow-box border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Financial Impact
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold glow-text">{stats.financialImpact}</div>
                    <p className="text-xs text-muted-foreground">
                        Savings from offsets
                    </p>
                </CardContent>
            </Card>
            <Card className="glass-card glow-box border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Projected Liability
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold glow-text">{stats.projectedLiability}</div>
                    <p className="text-xs text-muted-foreground">
                        Estimated 2026 payment
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
