import { OrderBookPanel } from './OrderBookPanel';
import { OrderEntryForm } from './OrderEntryForm';
import { RecentTrades } from './RecentTrades';

export const TradeTerminal = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] gap-4 p-4 overflow-y-auto">
            {/* Header/Stats Bar could go here */}

            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                {/* Left: Order Book (3 cols) */}
                <div className="col-span-3 min-h-0">
                    <OrderBookPanel />
                </div>

                {/* Center: Chart (Placeholder) & Order Entry (6 cols) */}
                <div className="col-span-6 flex flex-col gap-4 min-h-0">
                    {/* Chart Placeholder */}
                    <div className="flex-1 bg-card border rounded-lg p-4 flex items-center justify-center text-muted-foreground relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20" />
                        <span className="relative z-10">TradingView Chart Integration (Future)</span>
                        {/* Simple SVG Chart Graphic */}
                        <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-10 text-primary" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 20 L0 15 L10 12 L20 18 L30 10 L40 14 L50 5 L60 8 L70 2 L80 6 L90 4 L100 0 V20 H0Z" fill="currentColor" />
                        </svg>
                    </div>
                    {/* Order Entry */}
                    <div>
                        <OrderEntryForm />
                    </div>
                </div>

                {/* Right: Recent Trades & User History (3 cols) */}
                <div className="col-span-3 min-h-0 flex flex-col gap-4">
                    <div className="flex-1 min-h-0">
                        <RecentTrades />
                    </div>
                    <div className="h-1/3 bg-card border rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Your Open Orders</h3>
                        <div className="text-center text-xs text-muted-foreground py-8">
                            No open orders
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
