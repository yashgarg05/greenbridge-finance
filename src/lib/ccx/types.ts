export type Side = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';

export interface Order {
    id: string;
    side: Side;
    price: number;
    quantity: number;
    filled: number;
    remaining: number;
    timestamp: number;
    userId: string;
    status: 'OPEN' | 'PARTIAL' | 'FILLED' | 'CANCELLED';
}

export interface Trade {
    id: string;
    makerOrderId: string;
    takerOrderId: string;
    price: number;
    quantity: number;
    timestamp: number;
    side: Side; // Side of the taker
}

export interface PriceLevel {
    price: number;
    totalQuantity: number;
    orderCount: number;
}

export interface OrderBookState {
    bids: PriceLevel[];
    asks: PriceLevel[];
    lastPrice: number;
    priceChange24h: number;
    volume24h: number;
}
