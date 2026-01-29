import { AppSidebar } from "@/components/AppSidebar";
import { TradeTerminal } from "@/components/exchange/TradeTerminal";
import { useNavigate } from "react-router-dom";

const Exchange = () => {
    const navigate = useNavigate();

    return (
        <div className="flex bg-background min-h-screen">
            <AppSidebar activeTab="exchange" onTabChange={(tab) => {
                if (tab === 'exchange') return;
                navigate('/dashboard', { state: { activeTab: tab } });
            }} />

            <main className="flex-1 overflow-hidden flex flex-col">
                <div className="border-b px-6 py-3 flex justify-between items-center bg-card">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">CCX Pro Terminal</h1>
                        <p className="text-xs text-muted-foreground">Centralized Carbon Exchange • GCC/EUR</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-mono text-green-500">MARKET OPEN</span>
                    </div>
                </div>

                <TradeTerminal />
            </main>
        </div>
    );
};

export default Exchange;
