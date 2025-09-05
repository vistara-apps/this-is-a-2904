// Generate historical market data for charts
export function generateMarketData(basePrice, days = 30) {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    
    // Generate realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const drift = 0.0002; // Slight upward trend
    const change = (Math.random() - 0.5) * volatility + drift;
    
    currentPrice = Math.max(currentPrice * (1 + change), 1);
    
    data.push({
      x: date.toISOString().split('T')[0],
      y: parseFloat(currentPrice.toFixed(2)),
    });
  }
  
  return data;
}

// Generate real-time price updates
export function generateRealTimePrice(currentPrice) {
  const volatility = 0.01; // 1% volatility
  const change = (Math.random() - 0.5) * volatility;
  const newPrice = currentPrice * (1 + change);
  
  return Math.max(parseFloat(newPrice.toFixed(2)), 1);
}

// Generate market scenarios for guided practice
export function generateMarketScenario(type) {
  const scenarios = {
    'earnings_beat': {
      title: 'Earnings Beat Scenario',
      description: 'Company just reported earnings that beat expectations by 15%',
      priceImpact: 0.08, // 8% price increase
      volatility: 0.03,
      duration: 5, // minutes
    },
    'market_crash': {
      title: 'Market Crash Scenario',
      description: 'Major market index drops 5% due to economic concerns',
      priceImpact: -0.12, // 12% price decrease
      volatility: 0.05,
      duration: 10,
    },
    'news_spike': {
      title: 'Breaking News Spike',
      description: 'Positive regulatory news causes sudden price movement',
      priceImpact: 0.15, // 15% price increase
      volatility: 0.04,
      duration: 3,
    },
  };
  
  return scenarios[type] || scenarios['earnings_beat'];
}