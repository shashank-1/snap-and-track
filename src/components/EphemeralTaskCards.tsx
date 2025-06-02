"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Mock upcoming tasks data - in real app this would come from props or API
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
  },
  {
    id: 4,
    title: "Service Garage Door",
    room: "Garage",
    dueDate: "2024-01-25",
    priority: "medium",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Deep Clean Kitchen",
    room: "Kitchen",
    dueDate: "2024-01-18",
    priority: "low",
    status: "due_today"
  }
];

interface EphemeralTaskCardsProps {
  maxCards?: number;
  visibleDuration?: number;
  staggerDelay?: number;
  tasks?: Task[];
}

interface CardState {
  task: Task;
  phase: 'entering' | 'visible' | 'exiting' | 'removed';
  showTime: number;
}

const EphemeralTaskCards: React.FC<EphemeralTaskCardsProps> = ({
  maxCards = 3,
  visibleDuration = 3000,
  staggerDelay = 500,
  tasks = upcomingTasks
}) => {
  const [cardStates, setCardStates] = useState<CardState[]>([]);
  const [hasShown, setHasShown] = useState(false);

  // Filter and sort tasks by priority
  const prioritizedTasks = tasks
    .filter(task => task.status === 'overdue' || task.status === 'due_today' || task.status === 'due_soon')
    .sort((a, b) => {
      // Sort by status priority first (overdue > due_today > due_soon)
      const statusPriority: Record<Task['status'], number> = { 
        overdue: 3, 
        due_today: 2, 
        due_soon: 1, 
        upcoming: 0 
      };
      const statusDiff = statusPriority[b.status] - statusPriority[a.status];
      if (statusDiff !== 0) return statusDiff;

      // Then by task priority
      const taskPriority: Record<Task['priority'], number> = { 
        high: 3, 
        medium: 2, 
        low: 1 
      };
      return taskPriority[b.priority] - taskPriority[a.priority];
    })
    .slice(0, maxCards);

  useEffect(() => {
    if (prioritizedTasks.length === 0 || hasShown) return;

    // Initialize cards in entering phase
    const initialStates: CardState[] = prioritizedTasks.map((task, index) => ({
      task,
      phase: 'entering',
      showTime: Date.now() + (index * staggerDelay)
    }));

    setCardStates(initialStates);
    setHasShown(true);

    // Set up timers for each card
    initialStates.forEach((cardState, index) => {
      const cardDelay = index * staggerDelay;
      
      // Enter phase
      setTimeout(() => {
        setCardStates(prev => prev.map((state, i) => 
          i === index ? { ...state, phase: 'visible' } : state
        ));
      }, cardDelay);

      // Exit phase
      setTimeout(() => {
        setCardStates(prev => prev.map((state, i) => 
          i === index ? { ...state, phase: 'exiting' } : state
        ));
      }, cardDelay + visibleDuration);

      // Remove phase
      setTimeout(() => {
        setCardStates(prev => prev.map((state, i) => 
          i === index ? { ...state, phase: 'removed' } : state
        ));
      }, cardDelay + visibleDuration + 1000); // Extra time for exit animation
    });

    // Clean up all cards after all have exited
    const totalDuration = ((prioritizedTasks.length - 1) * staggerDelay) + visibleDuration + 2000;
    setTimeout(() => {
      setCardStates([]);
    }, totalDuration);

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

  const getAnimationProps = (phase: CardState['phase']) => {
    switch (phase) {
      case 'entering':
        return {
          initial: { 
            opacity: 0, 
            y: -60,
            scale: 0.8,
            filter: 'blur(4px)'
          },
          animate: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94] // Custom ease curve
            }
          }
        };
      case 'visible':
        return {
          animate: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            filter: 'blur(0px)'
          }
        };
      case 'exiting':
        return {
          animate: { 
            opacity: 0, 
            y: -120,
            scale: 0.9,
            filter: 'blur(2px)',
            transition: {
              duration: 1.2,
              ease: [0.55, 0.055, 0.675, 0.19] // Custom exit ease
            }
          }
        };
      default:
        return {
          animate: { opacity: 0, scale: 0 }
        };
    }
  };

  const visibleCards = cardStates.filter(state => state.phase !== 'removed');

  if (visibleCards.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="flex flex-col space-y-3">
        <AnimatePresence>
          {visibleCards.map((cardState, index) => {
            const { task, phase } = cardState;
            const badge = getBadgeContent(task);
            const animationProps = getAnimationProps(phase);
            
            return (
              <motion.div
                key={`${task.id}-${index}`}
                {...animationProps}
                className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-4 min-w-[340px] max-w-[400px] mx-auto"
                style={{
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
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: phase === 'visible' ? '100%' : '0%',
                      transition: { 
                        duration: visibleDuration / 1000,
                        ease: 'linear'
                      }
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EphemeralTaskCards; 