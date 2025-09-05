import React from 'react';
import { CheckCircle, AlertTriangle, Info, X, Lightbulb } from 'lucide-react';

const FeedbackCard = ({ feedback, onClose }) => {
  const getIcon = () => {
    switch (feedback.sentiment) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'negative':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (feedback.sentiment) {
      case 'positive':
        return 'border-accent/30';
      case 'negative':
        return 'border-red-400/30';
      default:
        return 'border-blue-400/30';
    }
  };

  return (
    <div className={`glass-effect rounded-lg p-6 border-2 ${getBorderColor()} animate-slide-up`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h3 className="font-medium text-white">AI Trade Feedback</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-white/80 mb-4">{feedback.message}</p>
      
      {feedback.tips && feedback.tips.length > 0 && (
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Trading Tips</span>
          </div>
          <ul className="space-y-1">
            {feedback.tips.map((tip, index) => (
              <li key={index} className="text-sm text-white/70 flex items-start">
                <span className="mr-2">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;