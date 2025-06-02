"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  room: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "overdue" | "due_today" | "due_soon" | "upcoming";
  daysOverdue?: number;
}

// Mock upcoming tasks data
const upcomingTasks: Task[] = [
  {
    id: 1,
    title: "Replace HVAC Filter",
    room: "Basement",
    dueDate: "2024-01-15",
    priority: "high",
    status: "overdue",
    daysOverdue: 2
  },
  {
    id: 2,
    title: "Clean Gutters",
    room: "Exterior",
    dueDate: "2024-01-20",
    priority: "medium",
    status: "due_today"
  },
  {
    id: 3,
    title: "Check Smoke Detectors",
    room: "Whole Home",
    dueDate: "2024-01-22",
    priority: "high",
    status: "due_soon"
  }
];

interface EphemeralTaskCardsCssProps {
  maxCards?: number;
  visibleDuration?: number;
  staggerDelay?: number;
  tasks?: Task[];
}

const EphemeralTaskCardsCss: React.FC<EphemeralTaskCardsCssProps> = ({
  maxCards = 3,
  visibleDuration = 3000,
  staggerDelay = 500,
  tasks = upcomingTasks
}) => {
  const [showCards, setShowCards] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Filter and sort tasks by priority
  const prioritizedTasks = tasks
    .filter(task => task.status === 'overdue' || task.status === 'due_today' || task.status === 'due_soon')
    .sort((a, b) => {
      const statusPriority: Record<Task['status'], number> = { 
        overdue: 3, due_today: 2, due_soon: 1, upcoming: 0 
      };
      const statusDiff = statusPriority[b.status] - statusPriority[a.status];
      if (statusDiff !== 0) return statusDiff;

      const taskPriority: Record<Task['priority'], number> = { 
        high: 3, medium: 2, low: 1 
      };
      return taskPriority[b.priority] - taskPriority[a.priority];
    })
    .slice(0, maxCards);

  useEffect(() => {
    if (prioritizedTasks.length === 0 || hasShown) return;

    // Show cards
    setShowCards(true);
    setHasShown(true);

    // Hide cards after duration
    const timeout = setTimeout(() => {
      setShowCards(false);
    }, visibleDuration + (prioritizedTasks.length * staggerDelay));

    return () => clearTimeout(timeout);
  }, [prioritizedTasks, visibleDuration, staggerDelay, hasShown]);

  const getBadgeContent = (task: Task) => {
    switch (task.status) {
      case 'overdue':
        return {
          text: task.daysOverdue ? `${task.daysOverdue}d overdue` : 'Overdue',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'due_today':
        return {
          text: 'Due Today',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'due_soon':
        return {
          text: 'Due Soon',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      default:
        return {
          text: 'Upcoming',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'medium':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
    }
  };

  if (prioritizedTasks.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-60px) scale(0.8);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes floatOutToTop {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(0.9);
            filter: blur(2px);
          }
        }
        
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .ephemeral-card {
          animation: slideInFromTop 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .ephemeral-card.exiting {
          animation: floatOutToTop 1.2s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
        }
        
        .progress-bar {
          animation: progressBar ${visibleDuration}ms linear;
        }
      `}</style>
      
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
        <div className="flex flex-col space-y-3">
          {showCards && prioritizedTasks.map((task, index) => {
            const badge = getBadgeContent(task);
            const shouldExit = !showCards;
            
            return (
              <div
                key={task.id}
                className={`ephemeral-card ${shouldExit ? 'exiting' : ''} bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-4 min-w-[340px] max-w-[400px] mx-auto`}
                style={{
                  animationDelay: `${index * staggerDelay}ms`,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getPriorityIcon(task.priority)}
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{task.room}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${badge.className} flex-shrink-0`}
                  >
                    {badge.text}
                  </Badge>
                </div>

                {/* Subtle progress indicator */}
                <div className="mt-3 w-full bg-gray-100 rounded-full h-0.5 overflow-hidden">
                  <div
                    className="progress-bar h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{
                      animationDelay: `${index * staggerDelay}ms`,
                      animationFillMode: 'both'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default EphemeralTaskCardsCss; 