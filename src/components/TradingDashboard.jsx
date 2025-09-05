import React, { useState } from 'react';
import { Chart } from './Chart';
import { TradeForm } from './TradeForm';
import { Portfolio } from './Portfolio';
import { Watchlist } from './Watchlist';
import { FeedbackCard } from './FeedbackCard';
import { ScenarioPanel } from './ScenarioPanel';
import { useTradingStore } from '../stores/tradingStore';

export function TradingDashboard({ onTutorialTrigger }) {
  const { selectedSymbol } = useTradingStore();
  const [latestFeedback, setLatestFeedback] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);

  const handleTradeFeedback = (feedback) => {
    setLatestFeedback(feedback);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg animate-fade-in">
      {/* Left Sidebar - Watchlist & Scenarios */}
      <div className="lg:col-span-3 space-y-lg">
        <Watchlist onTutorialTrigger={onTutorialTrigger} />
        <ScenarioPanel 
          onScenarioStart={setActiveScenario}
          onTutorialTrigger={onTutorialTrigger}
        />
      </div>

      {/* Main Trading Area */}
      <div className="lg:col-span-6 space-y-lg">
        <div className="card">
          <div className="mb-md">
            <h2 className="text-heading">{selectedSymbol}</h2>
            <p className="text-muted text-sm">Live Market Simulation</p>
          </div>
          <Chart symbol={selectedSymbol} scenario={activeScenario} />
        </div>

        {latestFeedback && (
          <FeedbackCard 
            feedback={latestFeedback}
            onClose={() => setLatestFeedback(null)}
          />
        )}
      </div>

      {/* Right Sidebar - Trading & Portfolio */}
      <div className="lg:col-span-3 space-y-lg">
        <TradeForm 
          onFeedback={handleTradeFeedback}
          onTutorialTrigger={onTutorialTrigger}
        />
        <Portfolio onTutorialTrigger={onTutorialTrigger} />
      </div>
    </div>
  );
}