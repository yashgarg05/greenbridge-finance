import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileCheck, Upload, Download, Calculator } from 'lucide-react';

const activities = [
    { id: 1, action: 'Exported Q4 Report', time: '2 hours ago', icon: Download, color: 'text-blue-500' },
    { id: 2, action: 'Verified Steel Supplier Data', time: '5 hours ago', icon: FileCheck, color: 'text-green-500' },
    { id: 3, action: 'Calculated Cement Liability', time: '1 day ago', icon: Calculator, color: 'text-purple-500' },
    { id: 4, action: 'Uploaded EORI Certificate', time: '2 days ago', icon: Upload, color: 'text-orange-500' },
];

export function RecentActivity() {
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
                    {activities.map((item, index) => (
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
                                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
