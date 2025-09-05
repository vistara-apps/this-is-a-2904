import React from 'react';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';

const TradeHistory = () => {
  const { user } = useUser();

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatProfitLoss = (amount) => {
    const isPositive = amount > 0;
    return (
      <span className={isPositive ? 'text-accent' : 'text-red-400'}>
        {isPositive ? '+' : ''}${Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Trades</h2>
        <Clock className="w-5 h-5 text-white/50" />
      </div>
      
      {user.tradeHistory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/50">No trades yet. Start trading to see your history!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {user.tradeHistory.slice(0, 10).map((trade) => (
            <div
              key={trade.tradeId}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    trade.type === 'buy' ? 'bg-accent/20' : 'bg-red-500/20'
                  }`}>
                    {trade.type === 'buy' ? (
                      <ArrowUp className="w-4 h-4 text-accent" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {trade.type.toUpperCase()} {trade.symbol}
                    </p>
                    <p className="text-sm text-white/70">
                      {trade.quantity} shares @ ${trade.entryPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatProfitLoss(trade.profitLoss)}
                  </p>
                  <p className="text-xs text-white/50">
                    {formatTime(trade.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeHistory;