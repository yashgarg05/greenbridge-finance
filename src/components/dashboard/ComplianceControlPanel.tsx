import { Button } from "@/components/ui/button";
import { Download, ShieldCheck } from "lucide-react";
import { ReadinessScore } from "@/components/compliance/ReadinessScore";
import { DeadlineTracker } from "@/components/compliance/DeadlineTracker";
import { SavedCalculations } from "@/components/compliance/SavedCalculations";
import { SupplierSummary } from "@/components/compliance/SupplierSummary";
import { RecentActivity } from "@/components/compliance/RecentActivity";

export function ComplianceControlPanel() {
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
                <Button>
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
