import React, { useState } from 'react';
import { X, Play, Book, FileText } from 'lucide-react';

const TutorialModal = ({ onClose }) => {
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const tutorials = [
    {
      id: 'risk-management',
      title: 'Risk Management Basics',
      type: 'text',
      content: `
        Risk management is crucial for successful trading. Here are key principles:
        
        1. **Position Sizing**: Never risk more than 1-2% of your account on a single trade
        2. **Stop Losses**: Always set a stop loss before entering a trade
        3. **Diversification**: Don't put all your money in one stock or sector
        4. **Risk-Reward Ratio**: Aim for at least 2:1 reward-to-risk ratio
        5. **Emotional Control**: Stick to your plan and don't let emotions drive decisions
        
        Remember: The goal is to preserve capital while growing your account consistently.
      `,
      icon: FileText
    },
    {
      id: 'technical-analysis',
      title: 'Technical Analysis Introduction',
      type: 'text',
      content: `
        Technical analysis involves studying price charts to predict future movements:
        
        **Key Concepts:**
        - **Support and Resistance**: Price levels where buying/selling pressure increases
        - **Trends**: The general direction of price movement (up, down, sideways)
        - **Volume**: The number of shares traded, confirming price movements
        - **Moving Averages**: Smoothed price lines showing trend direction
        
        **Common Patterns:**
        - Head and Shoulders (reversal)
        - Double Top/Bottom (reversal)
        - Triangles (continuation)
        - Breakouts (momentum)
        
        Practice identifying these patterns on the charts to improve your timing.
      `,
      icon: Book
    },
    {
      id: 'market-psychology',
      title: 'Understanding Market Psychology',
      type: 'text',
      content: `
        Market psychology drives price movements beyond fundamentals:
        
        **Fear and Greed Cycle:**
        - Fear: Leads to panic selling and oversold conditions
        - Greed: Causes buying frenzies and overbought markets
        
        **Cognitive Biases to Avoid:**
        - Confirmation Bias: Only seeing information that confirms your view
        - Loss Aversion: Holding losing trades too long
        - FOMO: Fear of missing out on big moves
        - Overconfidence: Trading too large after winning streaks
        
        **Tips:**
        - Keep a trading journal to track emotional decisions
        - Use mechanical rules to reduce emotional trading
        - Take breaks after big wins or losses
      `,
      icon: Brain
    }
  ];

  if (selectedTutorial) {
    const tutorial = tutorials.find(t => t.id === selectedTutorial);
    const Icon = tutorial.icon;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-text">{tutorial.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTutorial(null)}
                className="text-muted hover:text-text transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-text leading-relaxed font-sans">
                {tutorial.content}
              </pre>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTutorial(null)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Back to Tutorials
              </button>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">Trading Tutorials</h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-text transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-muted mt-1">Learn essential trading concepts and strategies</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              return (
                <div
                  key={tutorial.id}
                  onClick={() => setSelectedTutorial(tutorial.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-primary" />
                    <h3 className="font-medium text-text">{tutorial.title}</h3>
                    <span className="ml-auto text-primary">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;