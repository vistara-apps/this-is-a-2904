import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

export const MarketProvider = ({ children }) => {
  const [marketData, setMarketData] = useState({
    'AAPL': { price: 175.50, change: 2.3, changePercent: 1.32 },
    'GOOGL': { price: 2850.25, change: -15.75, changePercent: -0.55 },
    'MSFT': { price: 415.80, change: 8.20, changePercent: 2.01 },
    'TSLA': { price: 245.60, change: -5.40, changePercent: -2.15 },
    'AMZN': { price: 3420.75, change: 25.50, changePercent: 0.75 },
  });

  const [chartData, setChartData] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const volatility = Math.random() * 4 - 2; // -2% to +2%
          const priceChange = updated[symbol].price * (volatility / 100);
          updated[symbol] = {
            ...updated[symbol],
            price: Math.max(updated[symbol].price + priceChange, 1),
            change: priceChange,
            changePercent: volatility,
          };
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const basePrice = marketData[selectedSymbol]?.price || 100;
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const volatility = (Math.random() - 0.5) * 20;
        const price = basePrice + volatility;
        
        data.push({
          time: date.toLocaleDateString(),
          price: Math.max(price, 1),
          volume: Math.floor(Math.random() * 1000000) + 500000,
        });
      }
      
      setChartData(data);
    };

    generateChartData();
  }, [selectedSymbol, marketData]);

  return (
    <MarketContext.Provider value={{
      marketData,
      chartData,
      selectedSymbol,
      setSelectedSymbol,
    }}>
      {children}
    </MarketContext.Provider>
  );
};