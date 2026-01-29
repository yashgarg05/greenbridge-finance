import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { CBAMCalculator } from '@/components/CBAMCalculator';
import { DocumentVault } from '@/components/DocumentVault';
import { ProjectInfo } from '@/components/dashboard/ProjectInfo';
import { FormulaBreakdown } from '@/components/dashboard/FormulaBreakdown';
import { GreenInvestment } from '@/components/dashboard/GreenInvestment';
import { ComplianceControlPanel } from '@/components/dashboard/ComplianceControlPanel';
import { VerifiedCreditsInfo } from '@/components/dashboard/VerifiedCreditsInfo';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'compliance':
                return <ComplianceControlPanel />;
            case 'invest':
                return <GreenInvestment />;
            case 'calculator':
                return <CBAMCalculator />;
            case 'documents':
                return <DocumentVault />;
            default:
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">CBAM Compliance Overview & Financial Projections</p>
                        </div>

                        {/* Main Layout */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Card 1: Verified Credits Info */}
                            <div className="lg:col-span-2 h-full">
                                <VerifiedCreditsInfo />
                            </div>

                            {/* Card 2: Project Info */}
                            <div className="lg:col-span-1 h-full">
                                <ProjectInfo />
                            </div>

                            {/* Row 2: Formula Breakdown */}
                            <div className="lg:col-span-3">
                                <FormulaBreakdown />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
