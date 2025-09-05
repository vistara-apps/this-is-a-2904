import React from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useTradingStore } from '../stores/tradingStore';
import { useUserStore } from '../stores/userStore';

export function Portfolio({ onTutorialTrigger }) {
  const { positions, closePosition, getCurrentPrice } = useTradingStore();
  const { addTrade } = useUserStore();

  const handleClosePosition = (position) => {
    const currentPrice = getCurrentPrice(position.symbol);
    const closedPosition = closePosition(position.id, currentPrice);
    
    if (closedPosition) {
      addTrade(closedPosition);
      
      // Show tutorial for first position close
      if (positions.length === 1) {
        onTutorialTrigger({
          tutorialId: 'position_closed',
          title: 'Position Closed Successfully',
          contentType: 'text',
          content: `
            You've closed your position in ${position.symbol}!
            
            • Entry Price: $${position.entryPrice.toFixed(2)}
            • Exit Price: $${currentPrice.toFixed(2)}
            • Profit/Loss: $${closedPosition.profitLoss.toFixed(2)}
            
            This ${closedPosition.profitLoss >= 0 ? 'profit' : 'loss'} has been added to your virtual balance.
            Keep practicing to improve your timing!
          `,
        });
      }
    }
  };

  const calculateUnrealizedPL = (position) => {
    const currentPrice = getCurrentPrice(position.symbol);
    return position.type === 'buy' 
      ? (currentPrice - position.entryPrice) * position.quantity
      : (position.entryPrice - currentPrice) * position.quantity;
  };

  return (
    <div className="card">
      <h3 className="text-heading mb-md">Open Positions</h3>
      
      {positions.length === 0 ? (
        <div className="text-center py-lg text-muted">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No open positions</p>
          <p className="text-sm">Place your first trade to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((position) => {
            const currentPrice = getCurrentPrice(position.symbol);
            const unrealizedPL = calculateUnrealizedPL(position);
            const plPercentage = ((unrealizedPL / (position.entryPrice * position.quantity)) * 100);
            
            return (
              <div 
                key={position.id}
                className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{position.symbol}</div>
                    <div className="text-sm text-muted">
                      {position.quantity} shares • {position.type.toUpperCase()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleClosePosition(position)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Close Position"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted">Entry Price</div>
                    <div>${position.entryPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted">Current Price</div>
                    <div>${currentPrice.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted">Unrealized P/L:</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    unrealizedPL >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {unrealizedPL >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-medium">
                      ${Math.abs(unrealizedPL).toFixed(2)}
                    </span>
                    <span className="text-xs">
                      ({plPercentage >= 0 ? '+' : ''}{plPercentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}