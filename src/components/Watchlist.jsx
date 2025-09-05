import React from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useTradingStore } from '../stores/tradingStore';

export function Watchlist({ onTutorialTrigger }) {
  const { symbols, selectedSymbol, setSelectedSymbol, lastPrices } = useTradingStore();

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
    
    // Show tutorial on first symbol selection
    const hasSelectedBefore = localStorage.getItem('simutrade_symbol_selected');
    if (!hasSelectedBefore) {
      localStorage.setItem('simutrade_symbol_selected', 'true');
      onTutorialTrigger({
        tutorialId: 'symbol_selection',
        title: 'Stock Selected',
        contentType: 'text',
        content: `
          Great! You've selected ${symbol} to trade.
          
          • The chart now shows ${symbol}'s price movement
          • Use the trading form to buy or sell shares
          • Watch for price changes in real-time
          • Remember: this is virtual money, so practice freely!
          
          Try placing a small trade to see how it works.
        `,
      });
    }
  };

  return (
    <div className="card">
      <h3 className="text-heading mb-md">Watchlist</h3>
      
      <div className="space-y-2">
        {symbols.map((stock) => {
          const currentPrice = lastPrices[stock.symbol];
          const priceChange = currentPrice - stock.price;
          const percentChange = ((priceChange / stock.price) * 100);
          const isSelected = selectedSymbol === stock.symbol;
          
          return (
            <button
              key={stock.symbol}
              onClick={() => handleSymbolSelect(stock.symbol)}
              className={`w-full text-left p-3 rounded-md border transition-colors ${
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold">{stock.symbol}</div>
                <Star className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-gray-300'}`} />
              </div>
              
              <div className="text-sm text-muted mb-2">{stock.name}</div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  ${currentPrice?.toFixed(2) || stock.price.toFixed(2)}
                </div>
                
                <div className={`flex items-center space-x-1 text-sm ${
                  priceChange >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  {priceChange >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {priceChange >= 0 ? '+' : ''}${Math.abs(priceChange).toFixed(2)}
                  </span>
                  <span>
                    ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-md pt-md border-t">
        <p className="text-xs text-muted">
          Real-time simulated market data. Perfect for risk-free practice trading.
        </p>
      </div>
    </div>
  );
}