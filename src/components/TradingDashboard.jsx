import React from 'react';
import MarketOverview from './MarketOverview';
import TradingChart from './TradingChart';
import TradeForm from './TradeForm';
import TradeHistory from './TradeHistory';
import TutorialPanel from './TutorialPanel';

const TradingDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Market Overview */}
      <div className="lg:col-span-12">
        <MarketOverview />
      </div>
      
      {/* Trading Chart */}
      <div className="lg:col-span-8">
        <TradingChart />
      </div>
      
      {/* Trade Form */}
      <div className="lg:col-span-4">
        <TradeForm />
      </div>
      
      {/* Trade History */}
      <div className="lg:col-span-7">
        <TradeHistory />
      </div>
      
      {/* Tutorial Panel */}
      <div className="lg:col-span-5">
        <TutorialPanel />
      </div>
    </div>
  );
};

export default TradingDashboard;