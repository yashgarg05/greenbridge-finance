import { useState, useEffect } from 'react';
import { Bot, Sparkles, PhoneOff, Mic, Volume2 } from 'lucide-react';
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

    // Call Simulation State
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting');
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCallOpen && callStatus === 'connected') {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallOpen, callStatus]);

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

            {/* AI Agent Floating Button */}
            <button
                className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 z-50 group"
                onClick={() => {
                    setIsCallOpen(true);
                    setCallStatus('connecting');
                    // Simulate connection delay
                    setTimeout(() => {
                        setCallStatus('connected');
                    }, 5000);
                }}
            >
                <Bot className="h-6 w-6" />
                <span className="font-semibold">Call AI Agent</span>
                <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 text-yellow-300" />
            </button>

            {/* Call Overlay Modal */}
            {isCallOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-gradient-to-b from-indigo-500/10 to-transparent p-8 flex flex-col items-center justify-center space-y-6">

                            {/* Avatar / Status */}
                            <div className="relative">
                                <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg ${callStatus === 'connecting' ? 'animate-pulse' : ''}`}>
                                    <Bot className="h-10 w-10 text-white" />
                                </div>
                                {callStatus === 'connecting' && (
                                    <>
                                        <span className="absolute -inset-1 rounded-full border-2 border-indigo-500 animate-ping opacity-75"></span>
                                        <span className="absolute -inset-3 rounded-full border border-purple-500 animate-pulse opacity-50"></span>
                                    </>
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">GreenBridge Advisor</h3>
                                {callStatus === 'connecting' ? (
                                    <p className="text-sm text-muted-foreground animate-pulse">Connecting secure line...</p>
                                ) : (
                                    <p className="text-lg font-mono font-medium text-green-600 dark:text-green-400">
                                        {formatTime(timer)}
                                    </p>
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
                                        setCallStatus('connecting');
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
