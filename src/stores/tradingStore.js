import { create } from 'zustand';
import { generateMarketData, generateRealTimePrice } from '../utils/marketSimulator';

export const useTradingStore = create((set, get) => ({
  marketData: {},
  selectedSymbol: 'AAPL',
  positions: [],
  pendingOrders: [],
  lastPrices: {},
  
  symbols: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 150.00 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2500.00 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 300.00 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 200.00 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3200.00 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 800.00 },
  ],

  initializeMarketData: () => {
    const { symbols } = get();
    const marketData = {};
    const lastPrices = {};
    
    symbols.forEach(({ symbol, price }) => {
      marketData[symbol] = generateMarketData(price);
      lastPrices[symbol] = price;
    });
    
    set({ marketData, lastPrices });
    
    // Start real-time price updates
    get().startPriceUpdates();
  },

  startPriceUpdates: () => {
    setInterval(() => {
      const { symbols, lastPrices } = get();
      const newPrices = {};
      
      symbols.forEach(({ symbol }) => {
        const currentPrice = lastPrices[symbol];
        newPrices[symbol] = generateRealTimePrice(currentPrice);
      });
      
      set({ lastPrices: newPrices });
    }, 3000); // Update every 3 seconds
  },

  setSelectedSymbol: (symbol) => {
    set({ selectedSymbol: symbol });
  },

  addPosition: (position) => {
    const { positions } = get();
    set({ positions: [...positions, position] });
  },

  updatePosition: (positionId, updates) => {
    const { positions } = get();
    const updatedPositions = positions.map(pos =>
      pos.id === positionId ? { ...pos, ...updates } : pos
    );
    set({ positions: updatedPositions });
  },

  closePosition: (positionId, exitPrice) => {
    const { positions } = get();
    const position = positions.find(pos => pos.id === positionId);
    
    if (position) {
      const profitLoss = position.type === 'buy' 
        ? (exitPrice - position.entryPrice) * position.quantity
        : (position.entryPrice - exitPrice) * position.quantity;
      
      const closedPosition = {
        ...position,
        exitPrice,
        profitLoss,
        status: 'closed',
        exitTime: new Date().toISOString(),
      };
      
      const updatedPositions = positions.filter(pos => pos.id !== positionId);
      set({ positions: updatedPositions });
      
      return closedPosition;
    }
    
    return null;
  },

  getCurrentPrice: (symbol) => {
    const { lastPrices } = get();
    return lastPrices[symbol] || 0;
  },
}));