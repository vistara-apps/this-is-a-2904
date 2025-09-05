import React, { useState } from 'react';
import { Play, CheckCircle, Clock, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ScenarioPanel = () => {
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarioProgress, setScenarioProgress] = useState({});

  const scenarios = [
    {
      id: 'market-crash',
      title: 'Market Crash Response',
      description: 'Learn how to react during a sudden market downturn. Practice protective strategies.',
      difficulty: 'Advanced',
      estimatedTime: '15 min',
      icon: TrendingDown,
      isPremium: false,
      steps: [
        'Market drops 10% in 30 minutes',
        'Analyze your portfolio exposure',
        'Decide: Hold, hedge, or sell?',
        'Execute your chosen strategy',
        'Review the outcome'
      ]
    },
    {
      id: 'earnings-announcement',
      title: 'Earnings Announcement',
      description: 'Navigate trading around earnings releases. Learn about volatility and timing.',
      difficulty: 'Intermediate',
      estimatedTime: '10 min',
      icon: TrendingUp,
      isPremium: false,
      steps: [
        'Company announces earnings in 1 hour',
        'Review analyst expectations',
        'Consider pre-earnings position',
        'Manage trade through announcement',
        'Analyze post-earnings movement'
      ]
    },
    {
      id: 'news-impact',
      title: 'Breaking News Impact',
      description: 'Practice trading when unexpected news hits the market.',
      difficulty: 'Intermediate',
      estimatedTime: '12 min',
      icon: AlertTriangle,
      isPremium: true,
      steps: [
        'Breaking news affects market sector',
        'Identify affected stocks',
        'Assess impact magnitude',
        'Execute trades based on analysis',
        'Monitor follow-up developments'
      ]
    },
    {
      id: 'trend-reversal',
      title: 'Trend Reversal Detection',
      description: 'Learn to identify when trends are changing direction.',
      difficulty: 'Advanced',
      estimatedTime: '20 min',
      icon: TrendingUp,
      isPremium: true,
      steps: [
        'Analyze current market trend',
        'Look for reversal signals',
        'Confirm with multiple indicators',
        'Plan entry and exit strategy',
        'Execute the reversal trade'
      ]
    }
  ];

  const startScenario = (scenarioId) => {
    if (scenarios.find(s => s.id === scenarioId)?.isPremium && user.subscriptionTier === 'free') {
      alert('This scenario requires a Premium or Pro subscription');
      return;
    }
    
    setSelectedScenario(scenarioId);
    setScenarioProgress(prev => ({
      ...prev,
      [scenarioId]: { currentStep: 0, completed: false, startTime: Date.now() }
    }));
  };

  const completeStep = (scenarioId, stepIndex) => {
    setScenarioProgress(prev => {
      const current = prev[scenarioId] || { currentStep: 0, completed: false };
      const scenario = scenarios.find(s => s.id === scenarioId);
      const isLastStep = stepIndex === scenario.steps.length - 1;
      
      return {
        ...prev,
        [scenarioId]: {
          ...current,
          currentStep: Math.max(current.currentStep, stepIndex + 1),
          completed: isLastStep,
          completedTime: isLastStep ? Date.now() : current.completedTime
        }
      };
    });

    if (stepIndex === scenarios.find(s => s.id === scenarioId).steps.length - 1) {
      // Scenario completed
      setTimeout(() => {
        setSelectedScenario(null);
        alert('Scenario completed! Great job practicing this trading situation.');
      }, 1000);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-accent bg-opacity-20 text-accent';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-600';
      case 'Advanced':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (selectedScenario) {
    const scenario = scenarios.find(s => s.id === selectedScenario);
    const progress = scenarioProgress[selectedScenario] || { currentStep: 0 };
    const Icon = scenario.icon;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icon size={24} className="text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-text">{scenario.title}</h2>
                <p className="text-muted text-sm">{scenario.description}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedScenario(null)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Exit Scenario
            </button>
          </div>

          <div className="space-y-4">
            {scenario.steps.map((step, index) => {
              const isCompleted = progress.currentStep > index;
              const isCurrent = progress.currentStep === index;
              const isLocked = progress.currentStep < index;

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all ${
                    isCompleted ? 'border-accent bg-accent bg-opacity-5' :
                    isCurrent ? 'border-primary bg-primary bg-opacity-5' :
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-accent text-white' :
                        isCurrent ? 'bg-primary text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? <CheckCircle size={16} /> : index + 1}
                      </div>
                      <span className={`font-medium ${
                        isCompleted ? 'text-accent' :
                        isCurrent ? 'text-primary' :
                        'text-muted'
                      }`}>
                        Step {index + 1}: {step}
                      </span>
                    </div>

                    {isCurrent && (
                      <button
                        onClick={() => completeStep(selectedScenario, index)}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Complete Step
                      </button>
                    )}

                    {isCompleted && (
                      <CheckCircle size={20} className="text-accent" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {progress.completed && (
            <div className="mt-6 bg-accent bg-opacity-10 border border-accent rounded-lg p-4">
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle size={20} />
                <span className="font-medium">Scenario Completed!</span>
              </div>
              <p className="text-sm text-muted mt-1">
                You've successfully navigated this trading scenario. Practice makes perfect!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-text mb-2">Practice Scenarios</h2>
        <p className="text-muted">
          Improve your trading skills with realistic market scenarios. Practice makes perfect!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const progress = scenarioProgress[scenario.id];
          const isCompleted = progress?.completed;
          const hasStarted = progress?.currentStep > 0;

          return (
            <div
              key={scenario.id}
              className="bg-surface rounded-lg p-6 shadow-card border border-gray-200 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon size={32} className="text-primary" />
                {scenario.isPremium && user.subscriptionTier === 'free' && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Premium
                  </span>
                )}
                {isCompleted && (
                  <CheckCircle size={24} className="text-accent" />
                )}
              </div>

              <h3 className="text-lg font-semibold text-text mb-2">{scenario.title}</h3>
              <p className="text-muted text-sm mb-4">{scenario.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className={`px-2 py-1 rounded ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
                <div className="flex items-center gap-1 text-muted">
                  <Clock size={14} />
                  {scenario.estimatedTime}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => startScenario(scenario.id)}
                  disabled={scenario.isPremium && user.subscriptionTier === 'free'}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  {hasStarted ? 'Continue' : 'Start'} Scenario
                </button>

                {progress && !isCompleted && (
                  <div className="text-sm text-muted">
                    Progress: {progress.currentStep}/{scenario.steps.length} steps
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScenarioPanel;