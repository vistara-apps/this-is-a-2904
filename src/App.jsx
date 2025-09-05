import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TradingDashboard from './components/TradingDashboard';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import { TradingProvider } from './context/TradingContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
      <div className="min-h-screen bg-black bg-opacity-20">
        <Header 
          onShowAuth={() => setShowAuth(true)}
          onShowSubscription={() => setShowSubscription(true)}
        />
        
        {isAuthenticated ? (
          <TradingProvider>
            <TradingDashboard />
          </TradingProvider>
        ) : (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">SimuTrade</h1>
              <p className="text-xl mb-8">Master trading, risk-free. Practice strategies and get instant feedback.</p>
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}

        {showSubscription && (
          <SubscriptionModal onClose={() => setShowSubscription(false)} />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;