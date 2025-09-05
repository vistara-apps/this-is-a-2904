import React from 'react';
import { TrendingUp, User, Settings } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Header = () => {
  const { user } = useUser();

  return (
    <header className="glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-white">SimuTrade</h1>
            <span className="text-sm text-white/70 hidden sm:block">
              Master trading, risk-free
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white/70">Virtual Balance</p>
              <p className="text-lg font-semibold text-accent">
                ${user.virtualBalance.toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user.username}</p>
                <p className="text-xs text-white/70 capitalize">{user.subscriptionTier}</p>
              </div>
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;