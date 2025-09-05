import React from 'react';
import { X, TrendingUp, Shield, Brain, BookOpen } from 'lucide-react';

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-effect rounded-xl p-8 max-w-2xl w-full mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-white">Welcome to SimuTrade</h1>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-white/80 mb-8 text-lg">
          Master trading, risk-free. Practice strategies and get instant feedback.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-white mb-2">Risk-Free Trading</h3>
            <p className="text-sm text-white/70">
              Practice with virtual currency and learn without financial risk
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">AI Feedback</h3>
            <p className="text-sm text-white/70">
              Get instant analysis and tips on every trade you make
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-semibold text-white mb-2">Learn & Grow</h3>
            <p className="text-sm text-white/70">
              Access tutorials and practice scenarios to improve your skills
            </p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">Getting Started:</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Select a stock from the market overview
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Choose buy or sell and enter your quantity
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Execute the trade and receive AI feedback
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
              Explore tutorials to learn new strategies
            </li>
          </ul>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-accent hover:bg-accent/80 text-white rounded-lg font-medium transition-colors"
        >
          Start Trading
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;