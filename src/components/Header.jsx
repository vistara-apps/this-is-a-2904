import React from 'react';
import { LogOut, User, Crown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onShowAuth, onShowSubscription }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const getSubscriptionBadge = () => {
    switch (user?.subscriptionTier) {
      case 'premium':
        return <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium">Premium</span>;
      case 'pro':
        return <span className="bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
          <Crown size={12} /> Pro
        </span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-medium">Free</span>;
    }
  };

  return (
    <header className="bg-surface bg-opacity-95 backdrop-blur-sm border-b border-white border-opacity-20">
      <div className="max-w-6xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">SimuTrade</h1>
            <span className="text-sm text-muted">Master trading, risk-free</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-muted" />
                      <span className="font-medium text-text">{user?.username}</span>
                      {getSubscriptionBadge()}
                    </div>
                    <div className="text-sm text-muted">
                      Balance: ${user?.virtualBalance?.toLocaleString() || '0'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {user?.subscriptionTier === 'free' && (
                      <button
                        onClick={onShowSubscription}
                        className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Upgrade
                      </button>
                    )}
                    
                    <button
                      onClick={logout}
                      className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
                      title="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={onShowAuth}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;