import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDeadlines } from '@/hooks/useDeadlines';
import { useEffect } from 'react';

export function DeadlineTracker() {
    const { deadlines, loading } = useDeadlines();

    const getDaysLeft = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatus = (daysLeft: number, status: string): 'urgent' | 'pending' | 'upcoming' | 'completed' => {
        if (status === 'completed') return 'completed';
        if (daysLeft <= 3) return 'urgent';
        if (daysLeft <= 14) return 'pending';
        return 'upcoming';
    };

    const activeDeadlines = deadlines.filter(d => d.status !== 'completed').slice(0, 3);
    const completedDeadlines = deadlines.filter(d => d.status === 'completed').slice(0, 1);

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
                {loading ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        Loading deadlines...
                    </div>
                ) : activeDeadlines.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                        No upcoming deadlines
                    </div>
                ) : (
                    activeDeadlines.map((item) => {
                        const daysLeft = getDaysLeft(item.due_date);
                        const displayStatus = getStatus(daysLeft, item.status);

                        return (
                            <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-muted/30 transition-colors">
                                {displayStatus === 'urgent' ? (
                                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                ) : (
                                    <CalendarClock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-medium text-sm truncate">{item.title}</p>
                                        <Badge variant={displayStatus === 'urgent' ? 'destructive' : 'secondary'} className="text-[10px] h-5">
                                            {daysLeft} days left
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Due: {new Date(item.due_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                {completedDeadlines.length > 0 && (
                    <div className="pt-2">
                        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{completedDeadlines[0].title} completed</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
