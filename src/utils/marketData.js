export const generateMarketData = (symbol) => {
  // Base prices for different symbols
  const basePrices = {
    'AAPL': 150,
    'GOOGL': 2800,
    'MSFT': 350,
    'TSLA': 800,
    'AMZN': 3200,
    'META': 300,
    'NVDA': 450,
    'NFLX': 600
  };

  const basePrice = basePrices[symbol] || 100;
  const variation = (Math.random() - 0.5) * 20; // -10 to +10
  const currentPrice = Math.max(1, basePrice + variation);
  const openPrice = currentPrice - (Math.random() - 0.5) * 5;
  const change = currentPrice - openPrice;
  const changePercent = (change / openPrice) * 100;

  return {
    symbol,
    price: currentPrice,
    openPrice,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 1000000) + 500000,
    high: Math.max(currentPrice, openPrice) + Math.random() * 5,
    low: Math.min(currentPrice, openPrice) - Math.random() * 5,
    lastUpdated: new Date().toISOString()
  };
};

export const updatePrice = (currentData) => {
  const change = (Math.random() - 0.5) * 2; // -1 to +1
  const newPrice = Math.max(1, currentData.price + change);
  
  return {
    ...currentData,
    price: newPrice,
    change: newPrice - currentData.openPrice,
    changePercent: ((newPrice - currentData.openPrice) / currentData.openPrice) * 100,
    lastUpdated: new Date().toISOString()
  };
};