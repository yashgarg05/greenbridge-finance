import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileCheck, Upload, Calculator } from 'lucide-react';
import { useCalculations } from '@/hooks/useCalculations';
import { useDocuments } from '@/hooks/useDocuments';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
    id: string;
    action: string;
    time: Date;
    type: 'calculation' | 'document' | 'other';
    icon: any;
    color: string;
}

export function RecentActivity() {
    const { getCalculations } = useCalculations();
    const { getDocuments } = useDocuments();
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        setLoading(true);
        const [calcs, docs] = await Promise.all([
            getCalculations(),
            getDocuments()
        ]);

        const items: ActivityItem[] = [];

        // Process Calculations
        calcs?.forEach((c: any) => {
            items.push({
                id: `calc-${c.id}`,
                action: `Calculated ${c.commodity_type} Liability`,
                time: new Date(c.created_at),
                type: 'calculation',
                icon: Calculator,
                color: 'text-purple-500'
            });
        });

        // Process Documents
        docs?.forEach((d: any) => {
            items.push({
                id: `doc-${d.id}`,
                action: `Uploaded ${d.name}`,
                time: new Date(d.created_at),
                type: 'document',
                icon: Upload,
                color: 'text-blue-500'
            });
        });

        // Add some "System" events if empty to look alive? No, let's keep it real.
        // Sort descending
        items.sort((a, b) => b.time.getTime() - a.time.getTime());

        // Take top 5
        setActivities(items.slice(0, 5));
        setLoading(false);
    };

    return (
        <Card className="data-card h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-sm text-muted-foreground text-center">Loading activity...</div>
                    ) : activities.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center">No recent activity found.</div>
                    ) : (
                        activities.map((item, index) => (
                            <div key={item.id} className="flex gap-3 relative">
                                {/* Timeline Line */}
                                {index !== activities.length - 1 && (
                                    <div className="absolute left-[0.95rem] top-6 bottom-[-1rem] w-px bg-border/50" />
                                )}

                                <div className={`mt-0.5 relative z-10 bg-background rounded-full p-1 border ${item.color.replace('text', 'border')}`}>
                                    <item.icon className={`h-3 w-3 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-none">{item.action}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(item.time, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
