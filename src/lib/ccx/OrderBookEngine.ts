import { Order, Side, Trade, OrderBookState, PriceLevel } from './types';

export class OrderBookEngine {
    private bids: Order[] = []; // Sorted High to Low
    private asks: Order[] = []; // Sorted Low to High
    private trades: Trade[] = [];
    private orders: Map<string, Order> = new Map();

    // Market Stats
    private lastPrice: number = 10.00;
    private openPrice24h: number = 9.80; // Mock open price
    private volume24h: number = 12500; // Mock volume

    constructor() {
        // Initialize with some dummy data for liquidity
        this.seedMarket();
    }

    private seedMarket() {
        // Seed some initial orders
        const initialBids = [
            { p: 9.95, q: 500 }, { p: 9.90, q: 1200 }, { p: 9.85, q: 800 },
            { p: 9.80, q: 2000 }, { p: 9.75, q: 1500 }
        ];
        const initialAsks = [
            { p: 10.05, q: 400 }, { p: 10.10, q: 900 }, { p: 10.15, q: 1500 },
            { p: 10.20, q: 600 }, { p: 10.25, q: 3000 }
        ];

        initialBids.forEach((o, i) => this.placeOrder({
            side: 'BUY', price: o.p, quantity: o.q, userId: 'market_maker', type: 'LIMIT'
        } as any));

        initialAsks.forEach((o, i) => this.placeOrder({
            side: 'SELL', price: o.p, quantity: o.q, userId: 'market_maker', type: 'LIMIT'
        } as any));
    }

    public placeOrder(orderRequest: Omit<Order, 'id' | 'filled' | 'remaining' | 'timestamp' | 'status'>): Order {
        const order: Order = {
            ...orderRequest,
            id: Math.random().toString(36).substr(2, 9),
            filled: 0,
            remaining: orderRequest.quantity,
            timestamp: Date.now(),
            status: 'OPEN'
        };

        this.matchOrder(order);

        // If not fully filled, add to book
        if (order.remaining > 0) {
            this.addToBook(order);
            this.orders.set(order.id, order);
        }

        return order;
    }

    private matchOrder(takerOrder: Order) {
        const isBuy = takerOrder.side === 'BUY';
        const opposingBook = isBuy ? this.asks : this.bids;

        // Iterate through opposing book
        // Note: We mutate the array in place, so we need to be careful with indices or use a while loop
        let i = 0;
        while (i < opposingBook.length && takerOrder.remaining > 0) {
            const makerOrder = opposingBook[i];

            // Check Price Condition
            const priceMatch = isBuy
                ? makerOrder.price <= takerOrder.price
                : makerOrder.price >= takerOrder.price;

            if (!priceMatch) break; // No more matching prices (books are sorted)

            // Execute Trade
            const tradeQty = Math.min(takerOrder.remaining, makerOrder.remaining);
            const tradePrice = makerOrder.price; // Maker sets the price

            this.executeTrade(takerOrder, makerOrder, tradeQty, tradePrice);

            // Update Maker Order in Book
            if (makerOrder.remaining === 0) {
                // Remove fully filled maker order
                opposingBook.splice(i, 1);
                // Don't increment i, as next element shifts to i
            } else {
                // Partial fill on maker, we move to next (shouldn't happen logic-wise if taker has more qty, but for safety)
                i++;
            }
        }
    }

    private executeTrade(taker: Order, maker: Order, qty: number, price: number) {
        // Update Taker
        taker.filled += qty;
        taker.remaining -= qty;
        taker.status = taker.remaining === 0 ? 'FILLED' : 'PARTIAL';

        // Update Maker
        maker.filled += qty;
        maker.remaining -= qty;
        maker.status = maker.remaining === 0 ? 'FILLED' : 'PARTIAL';

        // Record Trade
        const trade: Trade = {
            id: Math.random().toString(36).substr(2, 9),
            makerOrderId: maker.id,
            takerOrderId: taker.id,
            price: price,
            quantity: qty,
            timestamp: Date.now(),
            side: taker.side
        };
        this.trades.unshift(trade);

        // Keep only last 50 trades
        if (this.trades.length > 50) this.trades.pop();

        // Update Market Stats
        this.lastPrice = price;
        this.volume24h += qty;
    }

    private addToBook(order: Order) {
        const book = order.side === 'BUY' ? this.bids : this.asks;

        // Insert sorted
        // Bids: High -> Low
        // Asks: Low -> High

        let index = -1;
        if (order.side === 'BUY') {
            index = book.findIndex(o => o.price < order.price);
        } else {
            index = book.findIndex(o => o.price > order.price);
        }

        if (index === -1) {
            book.push(order);
        } else {
            book.splice(index, 0, order);
        }
    }

    public getOrderBookState(depth: number = 15): OrderBookState {
        return {
            bids: this.aggregateLevels(this.bids, depth),
            asks: this.aggregateLevels(this.asks, depth),
            lastPrice: this.lastPrice,
            priceChange24h: ((this.lastPrice - this.openPrice24h) / this.openPrice24h) * 100,
            volume24h: this.volume24h
        };
    }

    private aggregateLevels(orders: Order[], depth: number): PriceLevel[] {
        const levels: { [price: number]: PriceLevel } = {};

        for (const order of orders) {
            if (!levels[order.price]) {
                levels[order.price] = { price: order.price, totalQuantity: 0, orderCount: 0 };
            }
            levels[order.price].totalQuantity += order.remaining;
            levels[order.price].orderCount++;

            if (Object.keys(levels).length > depth * 2) break; // Optimization cap
        }

        return Object.values(levels)
            .slice(0, depth);
    }

    public getRecentTrades(): Trade[] {
        return this.trades;
    }
}

// Singleton Instance for the App
export const exchangeEngine = new OrderBookEngine();
