import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';

const TradeForm = () => {
  const { selectedSymbol, currentPrice, executeTrade, loading } = useTrading();
  const { user } = useAuth();
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    const totalCost = quantity * currentPrice;
    
    if (tradeType === 'buy' && totalCost > user.virtualBalance) {
      setError('Insufficient virtual balance for this trade');
      return;
    }

    try {
      await executeTrade({
        type: tradeType,
        quantity: parseInt(quantity)
      });
      
      // Reset form
      setQuantity(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const totalValue = quantity * currentPrice;
  const canAfford = tradeType === 'sell' || totalValue <= user.virtualBalance;

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-text mb-4">Place Trade</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trade Type */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Trade Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTradeType('buy')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                tradeType === 'buy'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp size={16} />
              Buy
            </button>
            <button
              type="button"
              onClick={() => setTradeType('sell')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                tradeType === 'sell'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingDown size={16} />
              Sell
            </button>
          </div>
        </div>

        {/* Symbol Display */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Symbol</label>
          <div className="bg-gray-50 p-3 rounded-md">
            <span className="font-medium">{selectedSymbol}</span>
            <span className="text-muted ml-2">${currentPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Price per share:</span>
            <span className="text-text">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Quantity:</span>
            <span className="text-text">{quantity}</span>
          </div>
          <div className="flex justify-between font-medium border-t border-gray-200 pt-2">
            <span className="text-text">Total {tradeType === 'buy' ? 'Cost' : 'Proceeds'}:</span>
            <span className={`${canAfford ? 'text-text' : 'text-red-500'}`}>
              ${totalValue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Balance Check */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Available Balance:</span>
          <span className="text-text">${user.virtualBalance.toLocaleString()}</span>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !canAfford}
          className={`w-full py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            tradeType === 'buy'
              ? 'bg-accent hover:bg-accent/90 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {loading ? 'Executing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedSymbol}`}
        </button>
      </form>
    </div>
  );
};

export default TradeForm;