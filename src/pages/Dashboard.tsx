import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AppSidebar } from '@/components/AppSidebar';
import { CBAMCalculator } from '@/components/CBAMCalculator';
import { ProjectInfo } from '@/components/dashboard/ProjectInfo';
import { FormulaBreakdown } from '@/components/dashboard/FormulaBreakdown';
import { GreenInvestment } from '@/components/dashboard/GreenInvestment';
import { VerifiedCreditsInfo } from '@/components/dashboard/VerifiedCreditsInfo';
import { FeatureShortcuts } from '@/components/dashboard/FeatureShortcuts';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';


const Dashboard = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
    const navigate = useNavigate();

    // Update active tab if location state changes (e.g. browsing back)
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            // Clear state to prevent loop/re-trigger
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleTabChange = (tab: string) => {
        if (tab === 'methodology') {
            navigate('/methodology');
            return;
        }
        if (tab === 'listings') {
            navigate('/my-listings');
            return;
        }
        setActiveTab(tab);
    };



    const renderContent = () => {
        switch (activeTab) {
            case 'invest':
                return <GreenInvestment initialOpenListing={location.state?.openListingModal} />;
            case 'calculator':
                return <CBAMCalculator />;
            case 'settings':
                return <SettingsPanel />;
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
                            <div className="lg:col-span-2 h-full flex flex-col gap-6">
                                <VerifiedCreditsInfo />
                                <FeatureShortcuts onTabChange={handleTabChange} />
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
            <AppSidebar activeTab={activeTab} onTabChange={handleTabChange} />

            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </div>
            </main>




        </div>
    );
};

export default Dashboard;
