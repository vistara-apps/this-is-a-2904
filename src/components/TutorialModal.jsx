import React from 'react';
import { X, Play, FileText } from 'lucide-react';

export function TutorialModal({ tutorial, onClose }) {
  const getIcon = (contentType) => {
    switch (contentType) {
      case 'video':
        return <Play className="w-6 h-6 text-primary" />;
      case 'text':
      default:
        return <FileText className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {getIcon(tutorial.contentType)}
            <h2 className="text-xl font-bold">{tutorial.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {tutorial.contentType === 'video' ? (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-muted">Video content would load here</p>
              </div>
            </div>
          ) : null}

          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-text leading-relaxed">
              {tutorial.content}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}