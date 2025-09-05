import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '1',
    username: 'TradingPro',
    email: 'user@example.com',
    subscriptionTier: 'free', // free, premium, pro
    virtualBalance: 100000,
    tradeHistory: [],
    tutorialProgress: 0,
  });

  const addTrade = (trade) => {
    const newTrade = {
      ...trade,
      tradeId: Date.now().toString(),
      userId: user.userId,
      timestamp: new Date().toISOString(),
    };
    
    setUser(prev => ({
      ...prev,
      tradeHistory: [newTrade, ...prev.tradeHistory],
      virtualBalance: prev.virtualBalance + (trade.profitLoss || 0),
    }));

    return newTrade;
  };

  const updateBalance = (amount) => {
    setUser(prev => ({
      ...prev,
      virtualBalance: prev.virtualBalance + amount,
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser, addTrade, updateBalance }}>
      {children}
    </UserContext.Provider>
  );
};