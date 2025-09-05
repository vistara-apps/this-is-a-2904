import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

export function FeedbackCard({ feedback, onClose }) {
  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'negative':
        return <XCircle className="w-5 h-5 text-danger" />;
      default:
        return <CheckCircle className="w-5 h-5 text-primary" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'positive':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'negative':
        return 'border-danger/20 bg-danger/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  return (
    <div className={`card animate-slide-up border ${getBorderColor(feedback.type)}`}>
      <div className="flex items-start justify-between mb-md">
        <div className="flex items-center space-x-2">
          {getFeedbackIcon(feedback.type)}
          <h3 className="font-semibold">AI Trade Analysis</h3>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {feedback.trade && (
        <div className="bg-gray-50 rounded-md p-3 mb-md">
          <div className="text-sm">
            <strong>{feedback.trade.type.toUpperCase()}</strong> {feedback.trade.quantity} shares of{' '}
            <strong>{feedback.trade.symbol}</strong> at ${feedback.trade.entryPrice.toFixed(2)}
          </div>
        </div>
      )}

      <div className="prose prose-sm">
        <p className="text-text whitespace-pre-line">
          {feedback.feedback}
        </p>
      </div>

      <div className="mt-md pt-md border-t">
        <p className="text-xs text-muted">
          💡 This AI-powered feedback helps you improve your trading skills. Keep practicing!
        </p>
      </div>
    </div>
  );
}