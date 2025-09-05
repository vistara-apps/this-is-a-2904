import { create } from 'zustand';
import { nanoid } from 'nanoid';

export const useUserStore = create((set, get) => ({
  user: null,
  
  initializeUser: () => {
    // Check for existing user data
    const existingUser = localStorage.getItem('simutrade_user');
    
    if (existingUser) {
      set({ user: JSON.parse(existingUser) });
    } else {
      // Create new user
      const newUser = {
        userId: nanoid(),
        username: 'Trader' + Math.floor(Math.random() * 1000),
        email: '',
        subscriptionTier: 'free',
        virtualBalance: 10000, // Starting with $10,000 virtual money
        tradeHistory: [],
        tutorialProgress: {},
        totalProfitLoss: 0,
        completedScenarios: [],
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('simutrade_user', JSON.stringify(newUser));
      set({ user: newUser });
    }
  },

  updateUser: (updates) => {
    const { user } = get();
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('simutrade_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  addTrade: (trade) => {
    const { user } = get();
    if (!user) return;
    
    const updatedTradeHistory = [...user.tradeHistory, trade];
    const updatedBalance = user.virtualBalance + (trade.profitLoss || 0);
    const updatedTotalPL = user.totalProfitLoss + (trade.profitLoss || 0);
    
    get().updateUser({
      tradeHistory: updatedTradeHistory,
      virtualBalance: updatedBalance,
      totalProfitLoss: updatedTotalPL,
    });
  },

  updateTutorialProgress: (tutorialId) => {
    const { user } = get();
    if (!user) return;
    
    const updatedProgress = {
      ...user.tutorialProgress,
      [tutorialId]: true,
    };
    
    get().updateUser({ tutorialProgress: updatedProgress });
  },
}));