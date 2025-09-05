import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTradingStore } from '../stores/tradingStore';
import { useUserStore } from '../stores/userStore';
import { generateTradeFeedback } from '../utils/aiService';
import { nanoid } from 'nanoid';

export function TradeForm({ onFeedback, onTutorialTrigger }) {
  const { selectedSymbol, getCurrentPrice, addPosition } = useTradingStore();
  const { user, addTrade, updateUser } = useUserStore();
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentPrice = getCurrentPrice(selectedSymbol);
  const totalValue = parseFloat(quantity) * currentPrice || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || !user) return;

    setIsLoading(true);

    try {
      const trade = {
        tradeId: nanoid(),
        userId: user.userId,
        symbol: selectedSymbol,
        type: tradeType,
        quantity: parseFloat(quantity),
        entryPrice: currentPrice,
        timestamp: new Date().toISOString(),
        status: 'open',
      };

      // Check if user has enough balance for buy orders
      if (tradeType === 'buy' && totalValue > user.virtualBalance) {
        alert('Insufficient virtual balance for this trade.');
        setIsLoading(false);
        return;
      }

      // Add position to trading store
      const position = {
        id: nanoid(),
        ...trade,
      };
      addPosition(position);

      // Update user balance
      const balanceChange = tradeType === 'buy' ? -totalValue : totalValue;
      updateUser({ virtualBalance: user.virtualBalance + balanceChange });

      // Generate AI feedback
      const userContext = {
        level: user.tradeHistory.length < 5 ? 'Beginner' : 'Intermediate',
        tradeCount: user.tradeHistory.length,
        totalPL: user.totalProfitLoss,
      };

      const feedback = await generateTradeFeedback(trade, userContext);
      
      onFeedback({
        trade,
        feedback,
        type: 'positive', // Will be determined by AI analysis
      });

      // Add trade to history
      addTrade(trade);

      // Reset form
      setQuantity('');

      // Trigger tutorial for first trade
      if (user.tradeHistory.length === 0) {
        setTimeout(() => {
          onTutorialTrigger({
            tutorialId: 'first_trade_complete',
            title: 'First Trade Complete!',
            contentType: 'text',
            content: `
              Congratulations on your first trade! You've just:
              
              ${tradeType === 'buy' ? '• Purchased' : '• Sold'} ${quantity} shares of ${selectedSymbol}
              • At $${currentPrice.toFixed(2)} per share
              • Total value: $${totalValue.toFixed(2)}
              
              Your AI feedback will help you understand how well you did. 
              Watch the market and consider when to close this position!
            `,
          });
        }, 2000);
      }

    } catch (error) {
      console.error('Trade execution error:', error);
      alert('Error executing trade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-heading mb-md">Place Order</h3>
      
      <form onSubmit={handleSubmit} className="space-y-md">
        {/* Trade Type Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTradeType('buy')}
            className={`p-3 rounded-md border transition-colors ${
              tradeType === 'buy'
                ? 'bg-success/10 border-success text-success'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Buy</span>
          </button>
          
          <button
            type="button"
            onClick={() => setTradeType('sell')}
            className={`p-3 rounded-md border transition-colors ${
              tradeType === 'sell'
                ? 'bg-danger/10 border-danger text-danger'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <TrendingDown className="w-4 h-4 mx-auto mb-1" />
            <span className="text-sm font-medium">Sell</span>
          </button>
        </div>

        {/* Symbol Display */}
        <div className="bg-gray-50 rounded-md p-3">
          <div className="text-sm text-muted mb-1">Selected Symbol</div>
          <div className="font-semibold">{selectedSymbol}</div>
          <div className="text-sm text-muted">
            Current Price: ${currentPrice.toFixed(2)}
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Quantity (Shares)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input"
            placeholder="Enter number of shares"
            min="1"
            step="1"
            required
          />
        </div>

        {/* Order Summary */}
        {quantity && (
          <div className="bg-gray-50 rounded-md p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Shares:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price per share:</span>
              <span>${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Value:</span>
              <span>${totalValue.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!quantity || isLoading}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            tradeType === 'buy'
              ? 'bg-success hover:bg-success/90 text-white'
              : 'bg-danger hover:bg-danger/90 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <DollarSign className="w-4 h-4 inline mr-2" />
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
            </>
          )}
        </button>
      </form>

      {/* Balance Info */}
      {user && (
        <div className="mt-md pt-md border-t">
          <div className="text-sm text-muted mb-1">Available Balance</div>
          <div className="font-semibold">${user.virtualBalance.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}