"use client";

import React, { useState } from 'react';
import { AlertTriangle, X, Filter } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const insights = [
  {
    id: 1,
    message: "HVAC Filter Due — Last changed 3 months ago",
    action: "Order Filter",
    type: "warning"
  },
  {
    id: 2,
    message: "Roof Inspection Overdue — Winter damage risk detected",
    action: "Schedule Now",
    type: "urgent"
  },
  {
    id: 3,
    message: "Gutter Cleaning Season — Fall cleanup recommended",
    action: "Book Service",
    type: "info"
  }
];

export default function AIInsightsBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [dismissedInsights, setDismissedInsights] = useState<number[]>([]);

  const activeInsights = insights.filter(insight => !dismissedInsights.includes(insight.id));
  
  if (activeInsights.length === 0) return null;

  const insight = activeInsights[currentInsight] || activeInsights[0];

  const handleDismiss = () => {
    setDismissedInsights(prev => [...prev, insight.id]);
    if (currentInsight >= activeInsights.length - 1) {
      setCurrentInsight(0);
    }
  };

  const handleAction = () => {
    router.push('/tasks');
  };

  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 border-b ${getBackgroundColor()}`}>
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-gray-700">{insight.message}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAction}
              className="text-sm bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded"
            >
              {insight.action}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 