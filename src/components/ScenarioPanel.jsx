import React, { useState } from 'react';
import { Play, BookOpen, Award } from 'lucide-react';
import { generateMarketScenario } from '../utils/marketSimulator';

export function ScenarioPanel({ onScenarioStart, onTutorialTrigger }) {
  const [activeScenario, setActiveScenario] = useState(null);

  const scenarios = [
    {
      id: 'earnings_beat',
      title: 'Earnings Beat',
      description: 'Company reports better than expected earnings',
      difficulty: 'Beginner',
      icon: '📈',
    },
    {
      id: 'market_crash',
      title: 'Market Crash',
      description: 'Sudden market downturn due to economic concerns',
      difficulty: 'Advanced',
      icon: '📉',
    },
    {
      id: 'news_spike',
      title: 'Breaking News',
      description: 'Positive regulatory news causes price movement',
      difficulty: 'Intermediate',
      icon: '📰',
    },
  ];

  const handleStartScenario = (scenarioId) => {
    const scenario = generateMarketScenario(scenarioId);
    setActiveScenario(scenario);
    onScenarioStart(scenario);

    // Show scenario tutorial
    onTutorialTrigger({
      tutorialId: `scenario_${scenarioId}`,
      title: `Scenario: ${scenario.title}`,
      contentType: 'text',
      content: `
        ${scenario.description}
        
        **Your Challenge:**
        Decide how to react to this market event. Consider:
        
        • Should you buy, sell, or hold?
        • What's the likely impact on stock price?
        • How long might this effect last?
        
        The market will simulate realistic price movements based on this scenario.
        Trade wisely and watch for the AI feedback!
      `,
    });

    // Auto-stop scenario after duration
    setTimeout(() => {
      setActiveScenario(null);
      onScenarioStart(null);
    }, scenario.duration * 60 * 1000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-success bg-success/10';
      case 'Intermediate':
        return 'text-warning bg-warning/10';
      case 'Advanced':
        return 'text-danger bg-danger/10';
      default:
        return 'text-muted bg-gray-100';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-md">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-heading">Practice Scenarios</h3>
      </div>
      
      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id}
            className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{scenario.icon}</span>
                <div>
                  <div className="font-medium">{scenario.title}</div>
                  <div className="text-sm text-muted">{scenario.description}</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(scenario.difficulty)}`}>
                {scenario.difficulty}
              </span>
              
              <button
                onClick={() => handleStartScenario(scenario.id)}
                disabled={activeScenario?.title === scenario.title}
                className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeScenario?.title === scenario.title ? (
                  <>
                    <Award className="w-3 h-3" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Start</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-md pt-md border-t">
        <p className="text-xs text-muted">
          Practice with realistic market scenarios to improve your trading skills and decision-making.
        </p>
      </div>
    </div>
  );
}