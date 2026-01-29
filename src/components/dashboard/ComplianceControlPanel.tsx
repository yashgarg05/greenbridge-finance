import { Button } from "@/components/ui/button";
import { Download, ShieldCheck } from "lucide-react";
import { ReadinessScore } from "@/components/compliance/ReadinessScore";
import { DeadlineTracker } from "@/components/compliance/DeadlineTracker";
import { SavedCalculations } from "@/components/compliance/SavedCalculations";
import { SupplierSummary } from "@/components/compliance/SupplierSummary";
import { RecentActivity } from "@/components/compliance/RecentActivity";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from "@/lib/cbam-calculator";

export function ComplianceControlPanel() {
    const handleExport = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        // Header
        doc.setFontSize(20);
        doc.text("GreenBridge Finance - Compliance Report", 14, 22);
        doc.setFontSize(10);
        doc.text(`Generated on: ${date}`, 14, 30);

        // Readiness Summary (Hardcoded for demo match)
        doc.setFontSize(14);
        doc.text("Compliance Readiness", 14, 45);
        doc.setFontSize(12);
        doc.text("Current Score: 78/100 (Good)", 14, 55);
        doc.setFontSize(10);
        doc.text("Status: On Track for Q4 Reporting", 14, 62);

        // Deadlines Data (Mirrored from DeadlineTracker)
        const deadlines = [
            ['Q4 2025 CBAM Report', '31 Jan 2026', 'Urgent (2 days left)'],
            ['Supplier Data Verification', '15 Feb 2026', 'Pending (17 days left)'],
            ['Q1 2026 Estimates', '30 Apr 2026', 'Upcoming (91 days left)'],
        ];

        doc.setFontSize(14);
        doc.text("Upcoming Regulatory Deadlines", 14, 75);

        autoTable(doc, {
            startY: 80,
            head: [['Requirement', 'Due Date', 'Status']],
            body: deadlines,
            theme: 'grid',
            headStyles: { fillColor: [22, 163, 74] } // Green-600
        });

        // Calculations Data (Mirrored from SavedCalculations)
        const calculations = [
            ['28 Jan 2026', 'Steel', '1,500t', formatCurrency(269000), 'Draft'],
            ['15 Jan 2026', 'Aluminum', '500t', formatCurrency(76500), 'Verifying'],
            ['10 Dec 2025', 'Cement', '2,000t', formatCurrency(153000), 'Finalized'],
        ];

        doc.setFontSize(14);
        const finalY = (doc as any).lastAutoTable.finalY || 120;
        doc.text("Recent Carbon Liability Calculations", 14, finalY + 15);

        autoTable(doc, {
            startY: finalY + 20,
            head: [['Date', 'Commodity', 'Quantity', 'Liability', 'Status']],
            body: calculations,
            theme: 'striped',
            headStyles: { fillColor: [40, 40, 40] }
        });

        // Footer
        const pages = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        for (let i = 1; i <= pages; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${pages}`, 180, 290);
            doc.text("GreenBridge Finance Confidential", 14, 290);
        }

        doc.save(`CBAM_Compliance_Report_${date.replace(/\//g, '-')}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        Compliance Control Panel
                    </h2>
                    <p className="text-muted-foreground">Manage your CBAM regulatory obligations, documents, and reporting.</p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Compliance Report
                </Button>
            </div>

            {/* Top Row: Readiness, Suppliers, Deadlines */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-1">
                    <ReadinessScore />
                </div>
                <div className="lg:col-span-1">
                    <SupplierSummary />
                </div>
                <div className="lg:col-span-2">
                    <DeadlineTracker />
                </div>
            </div>

            {/* Middle Row: Calculations & Activity */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <SavedCalculations />
                </div>
                <div className="md:col-span-1">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}
