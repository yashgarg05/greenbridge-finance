import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { CarbonDebtCard } from '@/components/CarbonDebtCard';
import { CBAMCalculator } from '@/components/CBAMCalculator';
import { DocumentVault } from '@/components/DocumentVault';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [tonnes, setTonnes] = useState('1000');

    const renderContent = () => {
        switch (activeTab) {
            case 'calculator':
                return <CBAMCalculator />;
            case 'documents':
                return <DocumentVault />;
            default:
                return (
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                            <p className="text-sm text-muted-foreground">CBAM Compliance Overview</p>
                        </div>

                        {/* Main Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Left Column */}
                            <div className="space-y-6 lg:col-span-1">
                                <CarbonDebtCard tonnes={tonnes} onTonnesChange={setTonnes} />
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
