import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

const MarketOverview = () => {
  const { marketData, selectedSymbol, setSelectedSymbol } = useMarket();

  return (
    <div className="glass-effect rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Market Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(marketData).map(([symbol, data]) => (
          <div
            key={symbol}
            onClick={() => setSelectedSymbol(symbol)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedSymbol === symbol
                ? 'bg-primary/20 border-2 border-primary'
                : 'bg-white/10 border border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{symbol}</span>
              {data.changePercent > 0 ? (
                <TrendingUp className="w-4 h-4 text-accent" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className="text-lg font-bold text-white">
              ${data.price.toFixed(2)}
            </p>
            <p className={`text-sm ${
              data.changePercent > 0 ? 'text-accent' : 'text-red-400'
            }`}>
              {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;