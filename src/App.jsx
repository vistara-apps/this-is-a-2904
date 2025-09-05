import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TradingDashboard from './components/TradingDashboard';
import WelcomeModal from './components/WelcomeModal';
import { UserProvider } from './context/UserContext';
import { MarketProvider } from './context/MarketContext';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <UserProvider>
      <MarketProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800">
          <Header />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <TradingDashboard />
          </main>
          {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
        </div>
      </MarketProvider>
    </UserProvider>
  );
}

export default App;