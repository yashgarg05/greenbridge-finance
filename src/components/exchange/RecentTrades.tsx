import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exchangeEngine } from '@/lib/ccx/OrderBookEngine';
import { Trade } from '@/lib/ccx/types';

export const RecentTrades = () => {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        const update = () => setTrades([...exchangeEngine.getRecentTrades()]);
        update();
        const interval = setInterval(update, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
                <table className="w-full text-xs">
                    <thead className="bg-muted/30 text-muted-foreground sticky top-0">
                        <tr>
                            <th className="text-left py-2 px-4 font-normal">Price (€)</th>
                            <th className="text-right py-2 px-4 font-normal">Size</th>
                            <th className="text-right py-2 px-4 font-normal">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((trade) => (
                            <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/30 animate-in fade-in slide-in-from-right-2 duration-300">
                                <td className={`py-1.5 px-4 font-mono ${trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                                    {trade.price.toFixed(2)}
                                </td>
                                <td className="text-right py-1.5 px-4 font-mono text-foreground">
                                    {trade.quantity.toLocaleString()}
                                </td>
                                <td className="text-right py-1.5 px-4 text-muted-foreground">
                                    {new Date(trade.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};
