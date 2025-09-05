import React, { useState } from 'react';
import TradingChart from './TradingChart';
import TradeForm from './TradeForm';
import Portfolio from './Portfolio';
import FeedbackCard from './FeedbackCard';
import TutorialModal from './TutorialModal';
import ScenarioPanel from './ScenarioPanel';
import { useTrading } from '../context/TradingContext';

const TradingDashboard = () => {
  const { feedback, setFeedback } = useTrading();
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState('trading');

  const tabs = [
    { id: 'trading', label: 'Trading' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'scenarios', label: 'Practice Scenarios' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 py-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-surface bg-opacity-80 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'trading' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trading Area */}
          <div className="lg:col-span-2 space-y-6">
            <TradingChart />
            {feedback && (
              <FeedbackCard 
                feedback={feedback} 
                onClose={() => setFeedback(null)}
                onShowTutorial={() => setShowTutorial(true)}
              />
            )}
          </div>

          {/* Trading Form */}
          <div className="space-y-6">
            <TradeForm />
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <Portfolio />
      )}

      {activeTab === 'scenarios' && (
        <ScenarioPanel />
      )}

      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
};

export default TradingDashboard;