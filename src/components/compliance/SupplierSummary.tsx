import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function SupplierSummary() {
    const stats = {
        total: 12,
        verified: 5,
        pending: 4,
        highRisk: 3
    };

    const verificationProgress = Math.round((stats.verified / stats.total) * 100);

    return (
        <Card className="data-card h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Supplier Verification
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Manage</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Verification Progress</span>
                        <span>{verificationProgress}%</span>
                    </div>
                    <Progress value={verificationProgress} className="h-2" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                        <CheckCircle2 className="h-4 w-4 mx-auto text-green-600 mb-1" />
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">{stats.verified}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Verified</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
                        <Clock className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{stats.pending}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Pending</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center">
                        <AlertCircle className="h-4 w-4 mx-auto text-red-600 mb-1" />
                        <p className="text-lg font-bold text-red-700 dark:text-red-400">{stats.highRisk}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Action Req</p>
                    </div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs">
                    Request Missing Data
                </Button>
            </CardContent>
        </Card>
    );
}
