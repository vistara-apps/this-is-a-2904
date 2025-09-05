import React from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';

const Portfolio = () => {
  const { trades, marketData, closeTrade } = useTrading();
  const { user } = useAuth();

  const openTrades = trades.filter(trade => trade.status === 'open');
  const closedTrades = trades.filter(trade => trade.status === 'closed').slice(0, 10);

  const calculateUnrealizedPL = (trade) => {
    const currentPrice = marketData[trade.symbol]?.price || trade.entryPrice;
    return trade.type === 'buy' 
      ? (currentPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - currentPrice) * trade.quantity;
  };

  const totalUnrealizedPL = openTrades.reduce((total, trade) => {
    return total + calculateUnrealizedPL(trade);
  }, 0);

  const totalRealizedPL = closedTrades.reduce((total, trade) => {
    return total + (trade.profitLoss || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text mb-2">Virtual Balance</h3>
          <div className="text-2xl font-bold text-text">
            ${user.virtualBalance.toLocaleString()}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text mb-2">Unrealized P&L</h3>
          <div className={`text-2xl font-bold ${totalUnrealizedPL >= 0 ? 'text-accent' : 'text-red-500'}`}>
            {totalUnrealizedPL >= 0 ? '+' : ''}${totalUnrealizedPL.toFixed(2)}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text mb-2">Total Realized P&L</h3>
          <div className={`text-2xl font-bold ${totalRealizedPL >= 0 ? 'text-accent' : 'text-red-500'}`}>
            {totalRealizedPL >= 0 ? '+' : ''}${totalRealizedPL.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-text mb-4">Open Positions</h3>
        
        {openTrades.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <p>No open positions</p>
            <p className="text-sm">Execute your first trade to see positions here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-muted">Symbol</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Type</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Quantity</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Entry Price</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Current Price</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">P&L</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {openTrades.map((trade) => {
                  const currentPrice = marketData[trade.symbol]?.price || trade.entryPrice;
                  const unrealizedPL = calculateUnrealizedPL(trade);
                  const plPercentage = ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
                  
                  return (
                    <tr key={trade.tradeId} className="border-b border-gray-100">
                      <td className="py-3 font-medium">{trade.symbol}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.type === 'buy' ? 'bg-accent bg-opacity-20 text-accent' : 'bg-red-100 text-red-600'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">{trade.quantity}</td>
                      <td className="py-3">${trade.entryPrice.toFixed(2)}</td>
                      <td className="py-3">${currentPrice.toFixed(2)}</td>
                      <td className="py-3">
                        <div className={`${unrealizedPL >= 0 ? 'text-accent' : 'text-red-500'}`}>
                          {unrealizedPL >= 0 ? '+' : ''}${unrealizedPL.toFixed(2)}
                          <div className="text-xs text-muted">
                            ({plPercentage.toFixed(2)}%)
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => closeTrade(trade.tradeId)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trade History */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-text mb-4">Recent Trade History</h3>
        
        {closedTrades.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <p>No completed trades yet</p>
            <p className="text-sm">Your closed positions will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-muted">Date</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Symbol</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Type</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Quantity</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Entry</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">Exit</th>
                  <th className="text-left py-2 text-sm font-medium text-muted">P&L</th>
                </tr>
              </thead>
              <tbody>
                {closedTrades.map((trade) => (
                  <tr key={trade.tradeId} className="border-b border-gray-100">
                    <td className="py-3 text-sm">
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-medium">{trade.symbol}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.type === 'buy' ? 'bg-accent bg-opacity-20 text-accent' : 'bg-red-100 text-red-600'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">{trade.quantity}</td>
                    <td className="py-3">${trade.entryPrice.toFixed(2)}</td>
                    <td className="py-3">${trade.exitPrice?.toFixed(2) || 'N/A'}</td>
                    <td className="py-3">
                      <span className={`font-medium ${trade.profitLoss >= 0 ? 'text-accent' : 'text-red-500'}`}>
                        {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;