import React, { useState, useEffect } from 'react';
import { TradingDashboard } from './components/TradingDashboard';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { TutorialModal } from './components/TutorialModal';
import { useUserStore } from './stores/userStore';
import { useTradingStore } from './stores/tradingStore';

function App() {
  const { user, initializeUser } = useUserStore();
  const { initializeMarketData } = useTradingStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(null);

  useEffect(() => {
    // Initialize app data
    initializeUser();
    initializeMarketData();
    
    // Check if user needs onboarding
    const hasCompletedOnboarding = localStorage.getItem('simutrade_onboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [initializeUser, initializeMarketData]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('simutrade_onboarding', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-red-600">
      <Header onTutorialTrigger={setActiveTutorial} />
      
      <main className="container max-w-6xl mx-auto px-5 py-xl">
        <TradingDashboard onTutorialTrigger={setActiveTutorial} />
      </main>

      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {activeTutorial && (
        <TutorialModal
          tutorial={activeTutorial}
          onClose={() => setActiveTutorial(null)}
        />
      )}
    </div>
  );
}

export default App;