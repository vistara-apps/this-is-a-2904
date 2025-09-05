import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateMarketData } from '../utils/marketData';
import { getAIFeedback } from '../utils/aiService';

const TradingContext = createContext();

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [marketData, setMarketData] = useState({});
  const [currentPrice, setCurrentPrice] = useState(150);
  const [trades, setTrades] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Market symbols available for trading
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX'];

  useEffect(() => {
    // Initialize market data for all symbols
    const initData = {};
    symbols.forEach(symbol => {
      initData[symbol] = generateMarketData(symbol);
    });
    setMarketData(initData);
    setCurrentPrice(initData[selectedSymbol]?.price || 150);
  }, []);

  useEffect(() => {
    // Update current price when symbol changes
    if (marketData[selectedSymbol]) {
      setCurrentPrice(marketData[selectedSymbol].price);
    }
  }, [selectedSymbol, marketData]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        symbols.forEach(symbol => {
          if (updated[symbol]) {
            const change = (Math.random() - 0.5) * 2; // -1 to 1
            const newPrice = Math.max(1, updated[symbol].price + change);
            updated[symbol] = {
              ...updated[symbol],
              price: newPrice,
              change: newPrice - updated[symbol].openPrice,
              changePercent: ((newPrice - updated[symbol].openPrice) / updated[symbol].openPrice) * 100
            };
          }
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const executeTrade = async (tradeData) => {
    setLoading(true);
    
    try {
      const trade = {
        tradeId: Math.random().toString(36).substr(2, 9),
        userId: user.userId,
        symbol: selectedSymbol,
        type: tradeData.type,
        quantity: tradeData.quantity,
        entryPrice: currentPrice,
        exitPrice: null,
        profitLoss: 0,
        timestamp: new Date().toISOString(),
        feedback: null,
        status: 'open'
      };

      // Calculate cost/proceeds
      const totalValue = trade.quantity * trade.entryPrice;
      
      if (trade.type === 'buy') {
        if (user.virtualBalance < totalValue) {
          throw new Error('Insufficient virtual balance');
        }
        updateUser({ virtualBalance: user.virtualBalance - totalValue });
      } else {
        updateUser({ virtualBalance: user.virtualBalance + totalValue });
      }

      // Add trade to history
      const newTrades = [trade, ...trades];
      setTrades(newTrades);
      
      // Update user's trade history
      updateUser({ tradeHistory: [...(user.tradeHistory || []), trade] });

      // Get AI feedback
      const aiFeedback = await getAIFeedback(trade, marketData[selectedSymbol]);
      setFeedback(aiFeedback);

      return trade;
    } catch (error) {
      console.error('Trade execution failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const closeTrade = async (tradeId) => {
    const trade = trades.find(t => t.tradeId === tradeId);
    if (!trade || trade.status === 'closed') return;

    const exitPrice = currentPrice;
    const profitLoss = trade.type === 'buy' 
      ? (exitPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - exitPrice) * trade.quantity;

    const updatedTrade = {
      ...trade,
      exitPrice,
      profitLoss,
      status: 'closed'
    };

    // Update balance with profit/loss
    updateUser({ virtualBalance: user.virtualBalance + profitLoss });

    // Update trades
    const updatedTrades = trades.map(t => 
      t.tradeId === tradeId ? updatedTrade : t
    );
    setTrades(updatedTrades);

    // Get feedback on closed trade
    const aiFeedback = await getAIFeedback(updatedTrade, marketData[selectedSymbol]);
    setFeedback(aiFeedback);
  };

  const value = {
    selectedSymbol,
    setSelectedSymbol,
    marketData,
    currentPrice,
    trades,
    feedback,
    setFeedback,
    loading,
    symbols,
    executeTrade,
    closeTrade
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};