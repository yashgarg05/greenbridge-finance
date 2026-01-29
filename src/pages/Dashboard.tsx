import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, PhoneOff, Mic, Volume2 } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { CBAMCalculator } from '@/components/CBAMCalculator';
import { DocumentVault } from '@/components/DocumentVault';
import { ProjectInfo } from '@/components/dashboard/ProjectInfo';
import { FormulaBreakdown } from '@/components/dashboard/FormulaBreakdown';
import { GreenInvestment } from '@/components/dashboard/GreenInvestment';
import { ComplianceControlPanel } from '@/components/dashboard/ComplianceControlPanel';
import { VerifiedCreditsInfo } from '@/components/dashboard/VerifiedCreditsInfo';
import { FeatureShortcuts } from '@/components/dashboard/FeatureShortcuts';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { ChatSupport } from '@/components/dashboard/ChatSupport';
import { SupplyChainMap } from '@/components/dashboard/SupplyChainMap';
import { CallAgent } from '@/components/dashboard/CallAgent';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    const handleTabChange = (tab: string) => {
        if (tab === 'methodology') {
            navigate('/methodology');
            return;
        }
        setActiveTab(tab);
    };

    // Call Simulation State
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [callStage, setCallStage] = useState<'setup' | 'connecting' | 'connected'>('setup');
    const [timer, setTimer] = useState(0);

    // Call Settings
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallOpen && callStage === 'connected') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallOpen, callStage]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

                            {/* Row 2: Supply Chain Map */}
                            <div className="lg:col-span-3">
                                <SupplyChainMap />
                            </div>

                            {/* Row 3: Formula Breakdown */}
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

            {/* AI Agent Floating Button */}
            <button
                className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 z-50 group"
                onClick={() => {
                    setIsCallOpen(true);
                }}
            >
                <Bot className="h-6 w-6" />
                <span className="font-semibold">Call AI Agent</span>
                <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 text-yellow-300" />
            </button>

            {/* AI Call UI */}
            <CallAgent isOpen={isCallOpen} onClose={() => setIsCallOpen(false)} />

            {/* Chatbot Widget */}
            <ChatSupport />
        </div>
    );
};

export default Dashboard;
