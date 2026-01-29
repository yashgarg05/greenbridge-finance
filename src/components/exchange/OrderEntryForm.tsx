import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { exchangeEngine } from '@/lib/ccx/OrderBookEngine';
import { useToast } from "@/hooks/use-toast";


export const OrderEntryForm = () => {
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState('10.00');
    const [quantity, setQuantity] = useState('100');
    const { toast } = useToast();

    const handleSubmit = async () => {
        const p = parseFloat(price);
        const q = parseFloat(quantity);

        if (!p || !q || p <= 0 || q <= 0) {
            toast({ title: "Invalid Input", description: "Price and Quantity must be positive.", variant: "destructive" });
            return;
        }

        exchangeEngine.placeOrder({
            side: side === 'buy' ? 'BUY' : 'SELL',
            price: p,
            quantity: q,
            userId: 'current_user', // Mock user
            type: 'LIMIT'
        });

        toast({
            title: "Order Placed",
            description: `${side.toUpperCase()} ${q} @ €${p}`,
        });

        // Reset (optional)
        // setQuantity(''); 
    };

    return (
        <Card>
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium">Place Order</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
                <Tabs value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Buy</TabsTrigger>
                        <TabsTrigger value="sell" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Sell</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Price (€)</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="pl-8 font-mono"
                            />
                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">€</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Quantity (Tonnes)</Label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="font-mono"
                        />
                    </div>



                    <Button
                        className={`w-full ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        onClick={handleSubmit}
                    >
                        {side === 'buy' ? 'Buy' : 'Sell'} GCC
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
