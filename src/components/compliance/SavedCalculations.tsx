import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileBarChart2 } from 'lucide-react';
import { formatCurrency } from '@/lib/cbam-calculator';

const savedCalcs = [
    { id: 'calc-101', date: '28 Jan 2026', commodity: 'Steel', quantity: '1,500t', liability: 269000, status: 'Draft' },
    { id: 'calc-098', date: '15 Jan 2026', commodity: 'Aluminum', quantity: '500t', liability: 76500, status: 'Verifying' },
    { id: 'calc-095', date: '10 Dec 2025', commodity: 'Cement', quantity: '2,000t', liability: 153000, status: 'Finalized' },
];

export function SavedCalculations() {
    return (
        <Card className="data-card">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileBarChart2 className="h-4 w-4 text-primary" />
                        Saved Calculations
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b">
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1">Commodity</div>
                        <div className="col-span-1">Liability Used</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>
                    {savedCalcs.map((item) => (
                        <div key={item.id} className="grid grid-cols-5 gap-4 p-3 text-sm items-center hover:bg-muted/20 transition-colors border-b last:border-0">
                            <div className="col-span-1 text-muted-foreground">{item.date}</div>
                            <div className="col-span-1 font-medium">{item.commodity} <span className="text-xs text-muted-foreground">({item.quantity})</span></div>
                            <div className="col-span-1 font-mono">{formatCurrency(item.liability)}</div>
                            <div className="col-span-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.status === 'Finalized' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                        item.status === 'Verifying' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="col-span-1 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <FileDown className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
