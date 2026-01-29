import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const deadlines = [
    { id: 1, title: 'Q4 2025 CBAM Report', date: '31 Jan 2026', status: 'urgent', daysLeft: 2 },
    { id: 2, title: 'Supplier Data Verification', date: '15 Feb 2026', status: 'pending', daysLeft: 17 },
    { id: 3, title: 'Q1 2026 Estimates', date: '30 Apr 2026', status: 'upcoming', daysLeft: 91 },
];

export function DeadlineTracker() {
    return (
        <Card className="data-card h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-muted-foreground flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Upcoming Deadlines
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {deadlines.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-muted/30 transition-colors">
                        {item.status === 'urgent' ? (
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                        ) : (
                            <CalendarClock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <Badge variant={item.status === 'urgent' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                                    {item.daysLeft} days left
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Due: {item.date}</p>
                        </div>
                    </div>
                ))}
                <div className="pt-2">
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Q3 2025 Report Submitted successfully</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
