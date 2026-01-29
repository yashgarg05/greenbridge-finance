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

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

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

            {/* AI Agent Floating Button */}
            <button
                className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 z-50 group"
                onClick={() => {
                    setIsCallOpen(true);
                    setCallStage('setup');
                }}
            >
                <Bot className="h-6 w-6" />
                <span className="font-semibold">Call AI Agent</span>
                <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 text-yellow-300" />
            </button>

            {/* AI Call UI */}
            {isCallOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    {/* ... (Existing Call UI Content) ... actually I should verify I am not deleting content accidentally. 
                        The replace block should be precise. 
                        I will target the end of the return but BEFORE the closing div.
                    */}
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                        {/* SETUP STAGE */}
                        {callStage === 'setup' && (
                            <div className="p-6 space-y-6">
                                <div className="text-center space-y-2">
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bot className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold">Configure Call</h3>
                                    <p className="text-sm text-muted-foreground">Setup your AI Agent session</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase text-muted-foreground">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                                    onClick={() => {
                                        setCallStage('connecting');
                                        setTimeout(() => {
                                            setCallStage('connected');
                                        }, 5000);
                                    }}
                                >
                                    Start Call
                                </button>
                                <button
                                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsCallOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {/* CONNECTING / CONNECTED STAGE */}
                        {callStage !== 'setup' && (
                            <div className="bg-gradient-to-b from-indigo-500/10 to-transparent p-8 flex flex-col items-center justify-center space-y-6">

                                {/* Avatar / Status */}
                                <div className="relative">
                                    <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg ${callStage === 'connecting' ? 'animate-pulse' : ''}`}>
                                        <Bot className="h-10 w-10 text-white" />
                                    </div>
                                    {callStage === 'connecting' && (
                                        <>
                                            <span className="absolute -inset-1 rounded-full border-2 border-indigo-500 animate-ping opacity-75"></span>
                                            <span className="absolute -inset-3 rounded-full border border-purple-500 animate-pulse opacity-50"></span>
                                        </>
                                    )}
                                </div>

                                {/* Text Info */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">Alex</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">B2B Sustainability Advisor</p>

                                    {callStage === 'connecting' ? (
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground animate-pulse mt-2">Connecting secure line...</p>
                                            {phoneNumber && <p className="text-xs text-muted-foreground/60">Dialing {phoneNumber}</p>}
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            <p className="text-lg font-mono font-medium text-green-600 dark:text-green-400">
                                                {formatTime(timer)}
                                            </p>
                                            <div className="bg-muted/50 p-3 rounded-lg text-sm text-left italic text-muted-foreground border border-border/50">
                                                "Hi, this is Alex from GreenFlux. Have you calculated your 2026 CBAM liability yet?"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="pt-4 flex gap-4">
                                    <button className="h-12 w-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                                        <Mic className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                    <button
                                        className="h-14 w-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-105 transition-all"
                                        onClick={() => {
                                            setIsCallOpen(false);
                                            setCallStage('setup');
                                            setTimer(0);
                                        }}
                                    >
                                        <PhoneOff className="h-6 w-6 text-white" />
                                    </button>
                                    <button className="h-12 w-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                                        <Volume2 className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chatbot Widget */}
            <ChatSupport />
        </div>
    );
};

export default Dashboard;
