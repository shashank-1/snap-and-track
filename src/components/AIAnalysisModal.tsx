"use client";

import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  analysis: any;
  onCreateTask: () => void;
}

export default function AIAnalysisModal({ 
  isOpen, 
  onClose, 
  image, 
  analysis, 
  onCreateTask 
}: AIAnalysisModalProps) {
  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">AI Analysis Complete</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Preview */}
          {image && (
            <div className="aspect-video rounded-xl overflow-hidden mb-4">
              <img src={image} alt="Analysis" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Analysis Results */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Issue Detected</h3>
              <div className="flex items-center space-x-1 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">{analysis.confidence}% confident</span>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-red-800 mb-2">{analysis.issue}</h4>
              <p className="text-red-700 text-sm">{analysis.description}</p>
            </div>

            {/* Suggested Task */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-2">Suggested Task</h4>
              <h5 className="font-semibold text-gray-900 mb-1">{analysis.suggestedTask.title}</h5>
              <p className="text-gray-600 text-sm mb-3">{analysis.suggestedTask.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Estimated Cost:</span>
                <span className="font-medium text-gray-900">${analysis.suggestedTask.estimatedCost}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Priority:</span>
                <span className={`font-medium ${
                  analysis.suggestedTask.priority === 'high' ? 'text-red-600' : 
                  analysis.suggestedTask.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {analysis.suggestedTask.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={onCreateTask}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 