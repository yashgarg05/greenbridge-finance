import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exchangeEngine } from '@/lib/ccx/OrderBookEngine';
import { OrderBookState, PriceLevel } from '@/lib/ccx/types';

export const OrderBookPanel = () => {
    const [state, setState] = useState<OrderBookState | null>(null);

    useEffect(() => {
        const update = () => setState(exchangeEngine.getOrderBookState(15));
        update();
        // Poll for updates (Simulation simplified)
        const interval = setInterval(update, 500);
        return () => clearInterval(interval);
    }, []);

    if (!state) return <div>Loading Market Data...</div>;

    const maxVol = Math.max(
        ...state.bids.map(b => b.totalQuantity),
        ...state.asks.map(a => a.totalQuantity)
    );

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium flex justify-between">
                    <span>Order Book</span>
                    <span className="text-muted-foreground text-xs font-normal">Spread: {(state.asks[0]?.price - state.bids[0]?.price).toFixed(2)}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="grid grid-cols-3 text-xs text-muted-foreground px-4 py-2 bg-muted/30">
                    <span>Price (€)</span>
                    <span className="text-right">Size (T)</span>
                    <span className="text-right">Total</span>
                </div>

                {/* Asks (Sell Orders) - Red - Reversed to show lowest ask at bottom */}
                <div className="flex-1 flex flex-col justify-end overflow-hidden">
                    {[...state.asks].reverse().map((level, i) => (
                        <OrderRow key={i} level={level} maxVol={maxVol} type="ask" />
                    ))}
                </div>

                {/* Current Price */}
                <div className="py-2 px-4 border-y bg-background font-mono text-center flex items-center justify-center gap-4">
                    <span className={`text-lg font-bold ${state.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        €{state.lastPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Vol: {state.volume24h.toLocaleString()} T
                    </span>
                </div>

                {/* Bids (Buy Orders) - Green */}
                <div className="flex-1 overflow-hidden">
                    {state.bids.map((level, i) => (
                        <OrderRow key={i} level={level} maxVol={maxVol} type="bid" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const OrderRow = ({ level, maxVol, type }: { level: PriceLevel, maxVol: number, type: 'bid' | 'ask' }) => {
    const width = (level.totalQuantity / maxVol) * 100;
    const color = type === 'bid' ? 'bg-green-500/10' : 'bg-red-500/10';
    const textColor = type === 'bid' ? 'text-green-600' : 'text-red-600';

    return (
        <div className="relative grid grid-cols-3 text-xs py-0.5 px-4 hover:bg-muted/50 font-mono cursor-pointer group">
            <div
                className={`absolute inset-y-0 right-0 ${color} transition-all duration-300`}
                style={{ width: `${width}%` }}
            />
            <span className={`relative z-10 ${textColor}`}>{level.price.toFixed(2)}</span>
            <span className="relative z-10 text-right text-foreground">{level.totalQuantity.toLocaleString()}</span>
            <span className="relative z-10 text-right text-muted-foreground">{(level.price * level.totalQuantity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
    );
};
