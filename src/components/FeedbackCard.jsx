import React from 'react';
import { X, Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const FeedbackCard = ({ feedback, onClose, onShowTutorial }) => {
  if (!feedback) return null;

  const getIcon = () => {
    switch (feedback.type) {
      case 'positive':
        return <CheckCircle className="text-accent" size={24} />;
      case 'negative':
        return <AlertTriangle className="text-red-500" size={24} />;
      default:
        return <Brain className="text-primary" size={24} />;
    }
  };

  const getBorderColor = () => {
    switch (feedback.type) {
      case 'positive':
        return 'border-accent';
      case 'negative':
        return 'border-red-500';
      default:
        return 'border-primary';
    }
  };

  return (
    <div className={`bg-surface rounded-lg p-6 shadow-card border-l-4 ${getBorderColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getIcon()}
          <h3 className="text-lg font-semibold text-text">AI Trade Analysis</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-text transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-text mb-2">Decision Analysis</h4>
          <p className="text-muted text-sm leading-relaxed">{feedback.analysis}</p>
        </div>

        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div>
            <h4 className="font-medium text-text mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} className="text-muted text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.riskLevel && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text">Risk Level:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              feedback.riskLevel === 'low' ? 'bg-accent bg-opacity-20 text-accent' :
              feedback.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {feedback.riskLevel.toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-gray-200">
          <button
            onClick={onShowTutorial}
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;