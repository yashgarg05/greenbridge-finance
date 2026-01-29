import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileBarChart2, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/cbam-calculator';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";
import { useCalculations } from '@/hooks/useCalculations';

export function SavedCalculations() {
    const { getCalculations, deleteCalculation } = useCalculations();
    const [calculations, setCalculations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadCalculations();
    }, []);

    const loadCalculations = async () => {
        setLoading(true);
        const calcs = await getCalculations();
        setCalculations(calcs);
        setLoading(false);
    };

    const handleDownload = (item: any) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Carbon Liability Calculation Receipt", 14, 22);

        doc.setFontSize(12);
        doc.text(`Calculation ID: ${item.id}`, 14, 40);
        doc.text(`Date: ${new Date(item.created_at).toLocaleDateString()}`, 14, 50);
        doc.text(`Status: ${item.status}`, 14, 60);

        doc.setLineWidth(0.5);
        doc.line(14, 70, 196, 70);

        doc.setFontSize(14);
        doc.text("Details", 14, 85);

        doc.setFontSize(12);
        doc.text(`Commodity: ${item.commodity_type}`, 14, 100);
        doc.text(`Quantity: ${item.import_quantity}t`, 14, 110);
        doc.text(`Country: ${item.country_of_origin}`, 14, 120);

        doc.setFontSize(16);
        doc.setTextColor(22, 163, 74); // Green-600
        doc.text(`Estimated Liability: ${formatCurrency(item.estimated_liability)}`, 14, 140);

        doc.save(`${item.id}_${item.commodity_type}.pdf`);

        toast({
            title: "Download Started",
            description: `Downloading receipt for calculation`,
        });
    };

    const handleDelete = async (id: string) => {
        const success = await deleteCalculation(id);
        if (success) {
            await loadCalculations();
        }
    };

    const handleViewAll = () => {
        toast({
            title: "View All Archive",
            description: "This would navigate to the full calculations archive page.",
        });
    }

    return (
        <Card className="data-card">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileBarChart2 className="h-4 w-4 text-primary" />
                        Saved Calculations
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewAll}>View All</Button>
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
                    {loading ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            Loading calculations...
                        </div>
                    ) : calculations.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No saved calculations found.
                        </div>
                    ) : (
                        calculations.map((item) => (
                            <div key={item.id} className="grid grid-cols-5 gap-4 p-3 text-sm items-center hover:bg-muted/20 transition-colors border-b last:border-0">
                                <div className="col-span-1 text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</div>
                                <div className="col-span-1 font-medium">{item.commodity_type} <span className="text-xs text-muted-foreground">({item.import_quantity}t)</span></div>
                                <div className="col-span-1 font-mono">{formatCurrency(item.estimated_liability)}</div>
                                <div className="col-span-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.status === 'finalized' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                        item.status === 'verifying' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' :
                                            'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="col-span-1 text-right flex justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        onClick={() => handleDownload(item)}
                                        title="Download PDF"
                                    >
                                        <FileDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(item.id)}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
