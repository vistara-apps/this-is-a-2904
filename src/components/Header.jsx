import React from 'react';
import { TrendingUp, User, HelpCircle, Settings } from 'lucide-react';
import { useUserStore } from '../stores/userStore';

export function Header({ onTutorialTrigger }) {
  const { user } = useUserStore();

  const handleTutorialClick = () => {
    onTutorialTrigger({
      tutorialId: 'platform_overview',
      title: 'Platform Overview',
      contentType: 'text',
      content: `
        Welcome to SimuTrade! Here's how to get started:
        
        1. **Virtual Portfolio**: You start with $10,000 virtual money
        2. **Real-Time Charts**: Practice with live market data simulation
        3. **AI Feedback**: Get instant analysis of your trades
        4. **Practice Scenarios**: Learn from guided market situations
        
        Start by selecting a stock from the watchlist and placing your first trade!
      `,
    });
  };

  return (
    <header className="bg-surface/10 backdrop-blur-md border-b border-white/20">
      <div className="container max-w-6xl mx-auto px-5 py-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-md">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold text-white">SimuTrade</h1>
            </div>
            <span className="text-sm text-white/70 hidden sm:block">
              Master trading, risk-free
            </span>
          </div>

          <div className="flex items-center space-x-lg">
            {user && (
              <div className="flex items-center space-x-md">
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-white/70">Virtual Balance</div>
                  <div className="font-semibold text-white">
                    ${user.virtualBalance?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-white/70">Total P/L</div>
                  <div className={`font-semibold ${
                    (user.totalProfitLoss || 0) >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    ${user.totalProfitLoss?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-sm">
              <button
                onClick={handleTutorialClick}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
                title="Help & Tutorials"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              
              <button className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}