import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, Sparkles, PhoneOff, Mic, Volume2, TrendingUp, ShieldCheck, Leaf, Activity, ArrowUpRight, Clock, MapPin, Zap } from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';
import { CBAMCalculator } from '@/components/CBAMCalculator';

import { ProjectInfo } from '@/components/dashboard/ProjectInfo';
import { FormulaBreakdown } from '@/components/dashboard/FormulaBreakdown';
import { GreenInvestment } from '@/components/dashboard/GreenInvestment';
import { ComplianceControlPanel } from '@/components/dashboard/ComplianceControlPanel';
import { FeatureShortcuts } from '@/components/dashboard/FeatureShortcuts';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { dataService } from '@/services/dataService';
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
    const navigate = useNavigate();

    // Dynamic Data State
    const [stats, setStats] = useState({
        portfolioValue: "₹0",
        credits: 0,
        impactScore: 0,
        risk: "Low"
    });
    const [activity, setActivity] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.id) {
                const s = await dataService.getUserStats(user.id);
                // Also pass user ID for activity if supported, otherwise it gets public/related activity
                const a = await dataService.getRecentActivity(user.id);
                setStats(s);
                setActivity(a);
            }
        };
        loadData();
    }, [user]);

    // Update active tab if location state changes
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const handleTabChange = (tab: string) => {
        if (tab === 'methodology') { navigate('/methodology'); return; }
        if (tab === 'listings') { navigate('/my-listings'); return; }
        if (tab === 'exchange') { navigate('/exchange'); return; } // Kept for safety, though removed from nav
        setActiveTab(tab);
    };



    // --- Components for Command Center ---

    const StatCard = ({ title, value, sub, icon: Icon, trend, color }: any) => (
        <Card className={`relative overflow-hidden glass-card border-none shadow-lg hover:shadow-xl transition-all duration-300 group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 dark:opacity-5 group-hover:opacity-20 dark:group-hover:opacity-10 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={`p-2 rounded-full bg-primary/10 dark:bg-white/5 backdrop-blur-md`}>
                    <Icon className="h-4 w-4 text-primary dark:text-foreground/70" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
                <div className="flex items-center gap-2 mt-1">
                    {trend && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-0 text-[10px] px-1.5 py-0">
                            <TrendingUp className="h-3 w-3 mr-1" /> {trend}
                        </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
            </CardContent>
        </Card>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'compliance': return <ComplianceControlPanel />;
            case 'invest': return <GreenInvestment />;
            case 'calculator': return <CBAMCalculator />;

            case 'settings': return <SettingsPanel />;
            default: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Hero Section */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-500 bg-clip-text text-transparent">
                                Good Morning, {user?.user_metadata?.full_name?.split(' ')[0] || "Trader"}.
                            </h1>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* Quick Action Buttons */}
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-border/50 hover:bg-accent transition-colors text-sm font-medium" onClick={() => handleTabChange('invest')}>
                                <Zap className="w-4 h-4 text-amber-500 dark:text-yellow-400" /> Quick Invest
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-border/50 hover:bg-accent transition-colors text-sm font-medium" onClick={() => handleTabChange('calculator')}>
                                <ArrowUpRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> CBAM Calc
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Portfolio Value"
                            value={stats.portfolioValue}
                            sub="Total Assets"
                            trend={stats.portfolioValue === "₹0" ? null : "+12.5%"}
                            icon={Activity}
                            color="from-emerald-500 to-teal-500"
                        />
                        <StatCard
                            title="Carbon Credits"
                            value={stats.credits.toLocaleString()}
                            sub="tCO2e Verified"
                            trend={stats.credits > 0 ? "+850" : null}
                            icon={Leaf}
                            color="from-green-500 to-lime-500"
                        />
                        <StatCard
                            title="Impact Score"
                            value={stats.impactScore || "N/A"}
                            sub="Sustainability Rating"
                            trend={stats.impactScore > 0 ? "Top 1%" : null}
                            icon={ShieldCheck}
                            color="from-blue-500 to-indigo-500"
                        />
                        <StatCard
                            title="Compliance Risk"
                            value={stats.risk}
                            sub="CBAM Ready"
                            icon={ShieldCheck}
                            color="from-amber-500 to-orange-500"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-6 md:grid-cols-7">

                        {/* Left Column: Visuals & Deep Data */}
                        <div className="col-span-4 space-y-6">
                            {/* Project Info replaced with a more integrated 'Active Projects' view or maintained */}
                            <Card className="glass-panel border-border/50 bg-white/50 dark:bg-black/20">
                                <CardHeader>
                                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        Performance Analytics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormulaBreakdown />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Live Feed & Shortcuts */}
                        <div className="col-span-3 space-y-6">
                            {/* Live Market Pulse */}
                            <Card className="glass-panel border-border/50 bg-white/50 dark:bg-black/20 h-[300px] flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-rose-500" />
                                            Live Market Pulse
                                        </CardTitle>
                                        <Badge variant="outline" className="text-[10px] animate-pulse text-rose-500 border-rose-500/50">LIVE</Badge>
                                    </div>
                                </CardHeader>
                                <ScrollArea className="flex-1 px-4">
                                    <div className="space-y-4 pr-2">
                                        {activity.length === 0 ? (
                                            <div className="text-center text-muted-foreground text-sm py-8">
                                                No recent activity to report.
                                            </div>
                                        ) : (
                                            activity.map((item) => (
                                                <div key={item.id} className="flex items-start justify-between group">
                                                    <div className="flex gap-3 items-center">
                                                        <div className={`w-2 h-2 rounded-full ${item.type === 'invest' ? 'bg-emerald-500' :
                                                            item.type === 'verify' ? 'bg-blue-500' :
                                                                item.type === 'market' ? 'bg-amber-500' : 'bg-purple-500'
                                                            }`} />
                                                        <div>
                                                            <p className="text-sm font-medium leading-none group-hover:text-emerald-400 transition-colors">{item.project}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold">{item.amount}</p>
                                                        <p className="text-[10px] text-muted-foreground">{item.status}</p>
                                                    </div>
                                                </div>
                                            )))}
                                    </div>
                                </ScrollArea>
                            </Card>

                            <FeatureShortcuts onTabChange={handleTabChange} />
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
                <div className="max-w-7xl mx-auto">
                    <div key={activeTab} className="h-full">
                        {renderContent()}
                    </div>
                </div>
            </main>


        </div>
    );
};

export default Dashboard;
