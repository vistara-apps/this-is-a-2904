import React, { useState } from 'react';
import { X, ArrowRight, TrendingUp, Brain, BookOpen, Target } from 'lucide-react';

export function OnboardingModal({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to SimuTrade!',
      content: 'Master trading strategies risk-free with virtual currency and instant AI feedback.',
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Virtual Trading Environment',
      content: 'Start with $10,000 virtual money to practice trading real market scenarios without any financial risk.',
      icon: <Target className="w-12 h-12 text-accent" />,
    },
    {
      title: 'AI-Powered Feedback',
      content: 'Get instant analysis of your trades with personalized insights to improve your trading decisions.',
      icon: <Brain className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Guided Learning',
      content: 'Practice with realistic market scenarios and access contextual tutorials to build your skills.',
      icon: <BookOpen className="w-12 h-12 text-accent" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-muted hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-xl font-bold mb-3">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-muted mb-6 leading-relaxed">
            {steps[currentStep].content}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-2 px-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Skip Tour
          </button>
          
          <button
            onClick={handleNext}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}