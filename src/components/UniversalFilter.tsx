import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Activity, CalendarClock, Calendar, TreePine, Thermometer, Droplets, Zap, Paintbrush, Wrench, Shield, Hammer, Building, Bug, ChefHat, Sofa, Bath, Bed, ChevronUp, Car, Trees, Triangle, Home, Grid3X3, CheckCircle2, Clock, AlertTriangle, Edit, ListChecks, Search, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data (in real app, this would come from props or context)
const mockTasks = [
  { id: 1, title: "Replace HVAC Filter", status: "pending", priority: "high", dueDate: "2024-01-15", room: "basement", category: "heating_cooling", frequency: "monthly", assignee: "John", description: "Replace air filter for better air quality", cost: 25, completedDate: null, lastUpdated: "2024-01-10" },
  { id: 2, title: "Clean Gutters", status: "in_progress", priority: "medium", dueDate: "2024-01-20", room: "exterior", category: "maintenance", frequency: "seasonal", assignee: "Sarah", description: "Remove debris and check for damage", cost: 150, completedDate: null, lastUpdated: "2024-01-18" },
  { id: 3, title: "Check Smoke Detectors", status: "completed", priority: "high", dueDate: "2024-01-10", room: "whole_home", category: "safety", frequency: "monthly", assignee: "Mike", description: "Test batteries and functionality", cost: 0, completedDate: "2024-01-10", lastUpdated: "2024-01-10" },
  { id: 4, title: "Service Garage Door", status: "pending", priority: "low", dueDate: "2024-01-25", room: "garage", category: "mechanical", frequency: "yearly", assignee: "John", description: "Lubricate hinges and check springs", cost: 75, completedDate: null, lastUpdated: "2024-01-15" },
  { id: 5, title: "Deep Clean Kitchen", status: "pending", priority: "medium", dueDate: "2024-01-18", room: "kitchen", category: "cleaning", frequency: "monthly", assignee: "Sarah", description: "Clean appliances and sanitize surfaces", cost: 0, completedDate: null, lastUpdated: "2024-01-12" },
  { id: 6, title: "Test Water Pressure", status: "in_progress", priority: "medium", dueDate: "2024-01-22", room: "bathroom", category: "plumbing", frequency: "monthly", assignee: "Mike", description: "Check all faucets and showerheads", cost: 0, completedDate: null, lastUpdated: "2024-01-20" },
  { id: 7, title: "Inspect Electrical Panel", status: "completed", priority: "high", dueDate: "2024-01-12", room: "basement", category: "electrical", frequency: "yearly", assignee: "John", description: "Check for any issues or wear", cost: 125, completedDate: "2024-01-12", lastUpdated: "2024-01-12" },
  { id: 8, title: "Vacuum Living Room", status: "pending", priority: "low", dueDate: "2024-01-16", room: "living_room", category: "cleaning", frequency: "monthly", assignee: "Sarah", description: "Weekly deep clean and dust furniture", cost: 0, completedDate: null, lastUpdated: "2024-01-14" },
  { id: 9, title: "Fertilize Lawn", status: "pending", priority: "medium", dueDate: "2024-01-30", room: "yard", category: "landscaping", frequency: "seasonal", assignee: "Mike", description: "Apply spring fertilizer", cost: 45, completedDate: null, lastUpdated: "2024-01-16" },
  { id: 10, title: "Clean Attic", status: "pending", priority: "low", dueDate: "2024-02-01", room: "attic", category: "cleaning", frequency: "yearly", assignee: "Sarah", description: "Organize and clean storage area", cost: 0, completedDate: null, lastUpdated: "2024-01-18" },
  { id: 11, title: "Inspect Roof", status: "overdue", priority: "high", dueDate: "2024-01-14", room: "roof", category: "structural", frequency: "yearly", assignee: "John", description: "Check for damage after winter", cost: 200, completedDate: null, lastUpdated: "2024-01-08" },
  { id: 12, title: "Pest Control Treatment", status: "completed", priority: "medium", dueDate: "2024-01-08", room: "whole_home", category: "pest_control", frequency: "quarterly", assignee: "Mike", description: "Preventive pest treatment", cost: 120, completedDate: "2024-01-08", lastUpdated: "2024-01-08" }
];

const frequencies = [
  { id: "monthly", name: "Monthly", icon: CalendarClock, color: "blue" },
  { id: "quarterly", name: "Quarterly", icon: Calendar, color: "green" },
  { id: "seasonal", name: "Seasonal", icon: TreePine, color: "orange" },
  { id: "yearly", name: "Yearly", icon: Calendar, color: "purple" }
];

const taskCategories = [
  { id: "heating_cooling", name: "HVAC", icon: Thermometer, color: "red" },
  { id: "plumbing", name: "Plumbing", icon: Droplets, color: "blue" },
  { id: "electrical", name: "Electrical", icon: Zap, color: "yellow" },
  { id: "cleaning", name: "Cleaning", icon: Paintbrush, color: "green" },
  { id: "maintenance", name: "Maintenance", icon: Wrench, color: "gray" },
  { id: "safety", name: "Safety", icon: Shield, color: "red" },
  { id: "mechanical", name: "Mechanical", icon: Hammer, color: "orange" },
  { id: "landscaping", name: "Landscaping", icon: TreePine, color: "green" },
  { id: "structural", name: "Structural", icon: Building, color: "gray" },
  { id: "pest_control", name: "Pest Control", icon: Bug, color: "brown" }
];

const areas = [
  { id: "kitchen", name: "Kitchen", icon: ChefHat, color: "orange" },
  { id: "living_room", name: "Living Room", icon: Sofa, color: "blue" },
  { id: "bathroom", name: "Bathroom", icon: Bath, color: "blue" },
  { id: "bedroom", name: "Bedroom", icon: Bed, color: "purple" },
  { id: "basement", name: "Basement", icon: ChevronUp, color: "gray" },
  { id: "attic", name: "Attic", icon: Building, color: "brown" },
  { id: "garage", name: "Garage", icon: Car, color: "gray" },
  { id: "yard", name: "Yard", icon: Trees, color: "green" },
  { id: "roof", name: "Roof", icon: Triangle, color: "red" },
  { id: "exterior", name: "Exterior", icon: Home, color: "blue" },
  { id: "whole_home", name: "Whole Home", icon: Grid3X3, color: "purple" }
];

// Hook for responsive card sizing
const useResponsiveCardLayout = () => {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [cardWidth, setCardWidth] = useState(160);
  const [cardsPerView, setCardsPerView] = useState(6);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });

      // Calculate optimal card width and cards per view based on screen size
      let newCardWidth = 160;
      let newCardsPerView = 6;

      if (width < 480) {
        // Mobile: smaller cards, fewer per view
        newCardWidth = 120;
        newCardsPerView = 3;
      } else if (width < 640) {
        // Small mobile/large mobile
        newCardWidth = 130;
        newCardsPerView = 4;
      } else if (width < 768) {
        // Tablet
        newCardWidth = 140;
        newCardsPerView = 5;
      } else if (width < 1024) {
        // Small desktop
        newCardWidth = 150;
        newCardsPerView = 6;
      } else {
        // Large desktop
        newCardWidth = 160;
        newCardsPerView = 6;
      }

      setCardWidth(newCardWidth);
      setCardsPerView(newCardsPerView);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  return { screenSize, cardWidth, cardsPerView };
};

// Task Summary Component
const TaskSummary = () => {
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = mockTasks.filter(t => t.status === 'in_progress').length;
  const overdueTasks = mockTasks.filter(t => t.status === 'overdue').length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-600">📊 Task Overview</span>
            <Badge variant="outline" className="text-xs">{totalTasks} total</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span className="text-gray-700">✅ Completed: {completedTasks}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span className="text-gray-700">⏳ In Progress: {inProgressTasks}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
              <span className="text-gray-700">🚨 Overdue: {overdueTasks}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span className="text-gray-700">📈 Progress: {completionRate}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compact Filter Card Component with Responsive Design
const CompactFilterCard = ({ 
  item, 
  taskCount, 
  completedCount, 
  criticalStats, 
  isHovered, 
  onHover, 
  onClick, 
  cardWidth,
  isMobile 
}: any) => {
  const IconComponent = item.icon;
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
  const progressBarWidth = `${progress}%`;
  const [isClicked, setIsClicked] = useState(false);
  
  const colorStyles = {
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100 active:bg-blue-200",
    green: "bg-green-50 border-green-200 hover:bg-green-100 active:bg-green-200",
    red: "bg-red-50 border-red-200 hover:bg-red-100 active:bg-red-200",
    yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100 active:bg-yellow-200",
    orange: "bg-orange-50 border-orange-200 hover:bg-orange-100 active:bg-orange-200",
    purple: "bg-purple-50 border-purple-200 hover:bg-purple-100 active:bg-purple-200",
    gray: "bg-gray-50 border-gray-200 hover:bg-gray-100 active:bg-gray-200",
    brown: "bg-amber-50 border-amber-200 hover:bg-amber-100 active:bg-amber-200"
  };

  const iconStyles = {
    blue: "text-blue-600", green: "text-green-600", red: "text-red-600",
    yellow: "text-yellow-600", orange: "text-orange-600", purple: "text-purple-600",
    gray: "text-gray-600", brown: "text-amber-600"
  };

  const progressColors = {
    blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500',
    yellow: 'bg-yellow-500', orange: 'bg-orange-500', purple: 'bg-purple-500',
    gray: 'bg-gray-500', brown: 'bg-amber-500'
  };

  // Get simplified preview data for hover
  const getPreviewData = () => {
    const tasks = mockTasks.filter(task => {
      switch (item.filterType) {
        case 'frequency': return task.frequency === item.id;
        case 'type': return task.category === item.id;
        case 'area': return task.room === item.id;
        default: return false;
      }
    });

    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    const nextDue = pendingTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    
    // Calculate YTD (Year-To-Date) cost - total cost for all tasks in this category
    const totalCostYTD = tasks.reduce((sum, task) => sum + task.cost, 0);
    
    return {
      nextDue,
      totalCostYTD
    };
  };

  const previewData = getPreviewData();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick && onClick(item);
  };

  // Calculate expanded size (up to 25% larger)
  const expandedWidth = cardWidth * 1.25;
  const expandedHeight = isHovered ? "auto" : "auto";

  // Adjust text sizes based on screen size
  const iconSize = isMobile ? "w-4 h-4" : "w-5 h-5";
  const textSize = isMobile ? "text-xs" : "text-xs";
  const badgeSize = isMobile ? "text-xs px-1 py-0.5 h-3" : "text-xs px-1.5 py-0.5 h-4";

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      animate={{ 
        width: isHovered ? expandedWidth : cardWidth,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ duration: 0.2 }}
      className="relative touch-manipulation"
      style={{ width: isHovered ? expandedWidth : cardWidth }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 border shadow-sm hover:shadow-xl relative h-full ${
          colorStyles[item.color as keyof typeof colorStyles]
        } ${isHovered ? 'border-blue-500 shadow-blue-200 ring-2 ring-blue-100 z-30' : ''} 
        ${isClicked ? 'ring-2 ring-blue-300' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => onHover && onHover(item.id)}
        onMouseLeave={() => onHover && onHover(null)}
        onTouchStart={() => onHover && onHover(item.id)}
        onTouchEnd={() => {
          // Clear hover on touch end for mobile after a delay
          setTimeout(() => onHover && onHover(null), 3000);
        }}
      >
        <motion.div
          layout
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CardContent className="p-2 relative transition-all duration-300 h-full">
            {/* Compact card content - always visible */}
            <div className="text-center space-y-1 relative z-10">
              {/* Debug indicator - shows when hovered */}
              {isHovered && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse z-20"></div>
              )}
              
              <motion.div
                animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent className={`${iconSize} mx-auto ${iconStyles[item.color as keyof typeof iconStyles]}`} />
              </motion.div>
              <div className={`${textSize} font-medium text-gray-900 truncate`} title={item.name}>
                {item.name}
              </div>
              <Badge variant="secondary" className={badgeSize}>
                {taskCount}
              </Badge>
            </div>
            
            {/* Enhanced progress bar */}
            <div className="mt-2 relative z-10">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div 
                  className={`h-1 rounded-full ${progressColors[item.color as keyof typeof progressColors]}`}
                  initial={{ width: 0 }}
                  animate={{ width: progressBarWidth }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>

            {/* Expanded content on hover - shown within the card */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-2 border-t border-gray-200 space-y-2"
                >
                  {/* Upcoming Task */}
                  {previewData.nextDue ? (
                    <div className="text-left">
                      <div className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-blue-500" />
                        Next Due:
                      </div>
                      <div className="text-xs text-gray-900 font-medium truncate" title={previewData.nextDue.title}>
                        {previewData.nextDue.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(previewData.nextDue.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-left">
                      <div className="text-xs text-gray-500 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                        All tasks complete
                      </div>
                    </div>
                  )}

                  {/* YTD Spend */}
                  <div className="text-left">
                    <div className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                      <span className="text-green-600 mr-1">💰</span>
                      YTD Spend:
                    </div>
                    <div className="text-xs font-bold text-green-800">
                      ${previewData.totalCostYTD}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};

// Recent Tasks Component
const RecentTasks = () => {
  const recentTasks = mockTasks.slice(0, 5);
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">📋 Recent Tasks</h3>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </div>
        <div className="space-y-2">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors">
              <div className="flex items-center space-x-3 flex-1">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <span className="text-xs">{getPriorityIcon(task.priority)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{task.room} • {task.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/50">
                  <CheckCircle2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/50">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface UniversalFilterProps {
  title?: string;
  showViewAllButton?: boolean;
  onFilterSelect?: (filterType: string, filterId: string) => void;
}

export default function UniversalFilter({ 
  title = "Task Explorer", 
  showViewAllButton = true, 
  onFilterSelect 
}: UniversalFilterProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("type");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllTabs, setShowAllTabs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Use responsive layout hook
  const { screenSize, cardWidth, cardsPerView } = useResponsiveCardLayout();
  const isMobile = screenSize.width < 768;

  const baseTabs = [
    { id: 'type' as const, label: 'Category', icon: Wrench, emoji: '🛠️', desc: 'Filter by task type' },
    { id: 'area' as const, label: 'Room', icon: Home, emoji: '🏠', desc: 'Filter by location' }
  ];

  const additionalTabs: any[] = [
    // Removed frequency/schedule tab
  ];

  const visibleTabs = showAllTabs ? [...baseTabs, ...additionalTabs] : baseTabs;

  // Reset carousel position when switching tabs
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  const getTaskCountForFilter = (filterId: string, filterType: string) => {
    return mockTasks.filter(task => {
      switch (filterType) {
        case 'frequency': return task.frequency === filterId;
        case 'type': return task.category === filterId;
        case 'area': return task.room === filterId;
        default: return false;
      }
    });
  };

  const getCompletedCountForFilter = (filterId: string, filterType: string) => {
    return mockTasks.filter(task => {
      const matchesFilter = filterType === 'frequency' ? task.frequency === filterId :
                           filterType === 'type' ? task.category === filterId :
                           task.room === filterId;
      return matchesFilter && task.status === 'completed';
    }).length;
  };

  // Get critical stats for hover effect
  const getCriticalStats = (filterId: string, filterType: string) => {
    const tasks = getTaskCountForFilter(filterId, filterType);
    const overdueTasks = tasks.filter(task => task.status === 'overdue').length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);
    
    return {
      overdue: overdueTasks,
      highPriority: highPriorityTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      totalCost
    };
  };

  const renderFilterCards = () => {
    const filterType = activeTab;
    let allItems: any[] = [];
    
    switch (filterType) {
      case 'frequency':
        allItems = frequencies.map(freq => ({
          ...freq,
          filterType,
          taskCount: getTaskCountForFilter(freq.id, 'frequency').length,
          completedCount: getCompletedCountForFilter(freq.id, 'frequency'),
          criticalStats: getCriticalStats(freq.id, 'frequency')
        }));
        break;
      case 'type':
        allItems = taskCategories.map(cat => ({
          ...cat,
          filterType,
          taskCount: getTaskCountForFilter(cat.id, 'type').length,
          completedCount: getCompletedCountForFilter(cat.id, 'type'),
          criticalStats: getCriticalStats(cat.id, 'type')
        }));
        break;
      case 'area':
        allItems = areas.map(area => ({
          ...area,
          filterType,
          taskCount: getTaskCountForFilter(area.id, 'area').length,
          completedCount: getCompletedCountForFilter(area.id, 'area'),
          criticalStats: getCriticalStats(area.id, 'area')
        }));
        break;
    }

    // Filter items with tasks or show all
    const itemsWithTasksFiltered = allItems.filter(item => item.taskCount > 0);
    const itemsToShow = itemsWithTasksFiltered;
    
    // Responsive layout configuration
    const maxIndex = Math.max(0, itemsToShow.length - cardsPerView);
    const canGoLeft = currentIndex > 0;
    const canGoRight = currentIndex < maxIndex;
    
    const goLeft = () => {
      if (canGoLeft) {
        setCurrentIndex(prev => Math.max(0, prev - cardsPerView));
      }
    };
    
    const goRight = () => {
      if (canGoRight) {
        setCurrentIndex(prev => Math.min(maxIndex, prev + cardsPerView));
      }
    };
    
    const visibleItems = itemsToShow.slice(currentIndex, currentIndex + cardsPerView);

    return (
      <div className="space-y-4">
        {/* Responsive Cards Container */}
        <div className="relative">
          {/* Navigation arrows for larger screens */}
          {itemsToShow.length > cardsPerView && !isMobile && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goLeft}
                disabled={!canGoLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  canGoLeft 
                    ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-lg' 
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mx-auto" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goRight}
                disabled={!canGoRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  canGoRight 
                    ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 shadow-lg' 
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4 mx-auto" />
              </motion.button>
            </>
          )}
          
          {/* Cards Container with responsive layout and proper spacing for expansion */}
          <div className={`${isMobile ? 'overflow-x-auto scrollbar-hide' : ''} px-1`}>
            <div 
              className={`
                ${isMobile 
                  ? 'flex gap-3 pb-2 snap-x snap-mandatory' 
                  : `grid gap-4 transition-transform duration-300`
                }
              `}
              style={!isMobile ? { 
                gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))`,
                transform: `translateX(-${(currentIndex / cardsPerView) * 100}%)`
              } : {}}
            >
              {(isMobile ? itemsToShow : visibleItems).map((item, index) => (
                <motion.div
                  key={`${item.id}-${isMobile ? 'mobile' : currentIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${isMobile ? 'flex-shrink-0 snap-start' : ''} relative transition-all duration-300`}
                  style={{ 
                    zIndex: hoveredCard === item.id ? 50 : 1,
                    // Add margin when not hovered to prevent cards from touching when expanded
                    margin: !isMobile ? (hoveredCard === item.id ? '0 8px' : '0 4px') : undefined
                  }}
                >
                  <CompactFilterCard
                    item={item}
                    taskCount={item.taskCount}
                    completedCount={item.completedCount}
                    criticalStats={item.criticalStats}
                    isHovered={hoveredCard === item.id}
                    onHover={setHoveredCard}
                    onClick={() => onFilterSelect && onFilterSelect(filterType, item.id)}
                    cardWidth={cardWidth}
                    isMobile={isMobile}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators for desktop */}
        {itemsToShow.length > cardsPerView && !isMobile && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(itemsToShow.length / cardsPerView) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * cardsPerView)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / cardsPerView) === i
                    ? 'bg-blue-500 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Mobile scroll indicator */}
        {isMobile && itemsToShow.length > 3 && (
          <div className="flex justify-center space-x-2">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Swipe to see more ({itemsToShow.length} total)
            </div>
          </div>
        )}
        
        {/* Progress info for desktop */}
        {itemsToShow.length > cardsPerView && !isMobile && (
          <div className="text-center text-xs text-gray-500">
            Showing {currentIndex + 1}-{Math.min(currentIndex + cardsPerView, itemsToShow.length)} of {itemsToShow.length} categories
          </div>
        )}
        
        {/* Clear All Filters Option */}
        {itemsWithTasksFiltered.length > 0 && (
          <div className="flex justify-center pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterSelect && onFilterSelect('', '')}
              className="text-xs text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-200 hover:border-blue-300"
            >
              ✨ Clear All Filters
            </motion.button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Glassmorphism */}
      <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Filter className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>🧭</span>
                  <span>{title}</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">Click to filter, hover to preview</span> 
                  <span className="mx-2">•</span>
                  <span>Explore tasks your way</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-10 bg-white/80 border-white/30 focus:border-blue-500 rounded-xl w-64"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          setShowSearch(false);
                          setSearchTerm('');
                        }}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`hover:bg-white/50 transition-colors ${showSearch ? 'bg-blue-100 text-blue-600' : ''}`}
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Enhanced Tabbed Navigation with Active Context */}
          <div className="space-y-4">
            <div className="flex items-center space-x-1 p-1 bg-gray-100/80 rounded-xl backdrop-blur-sm">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center relative ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  title={tab.desc}
                >
                  <span className="text-base">{tab.emoji}</span>
                  <span>{tab.label}</span>
                  
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
              
              {/* Expand button for additional tabs */}
              {additionalTabs.length > 0 && (
                <button
                  onClick={() => {
                    setShowAllTabs(!showAllTabs);
                    // If we're hiding tabs and current active tab is hidden, switch to first visible tab
                    if (showAllTabs && !baseTabs.find(t => t.id === activeTab)) {
                      setActiveTab(baseTabs[0].id);
                    }
                  }}
                  className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  title={showAllTabs ? 'Hide additional views' : 'Show additional views'}
                >
                  <motion.div
                    animate={{ rotate: showAllTabs ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
              )}
            </div>
            
            {/* Active Filter Context Breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Filter by: {visibleTabs.find(t => t.id === activeTab)?.label}
                </Badge>
              </div>

              <div className="text-xs text-gray-500">
                {(() => {
                  let items: Array<{id: string, name: string}> = [];
                  switch (activeTab) {
                    case 'type': items = taskCategories; break;
                    case 'frequency': items = frequencies; break;
                    case 'area': items = areas; break;
                  }
                  const activeItems = items.filter(item => {
                    const tasks = getTaskCountForFilter(item.id, activeTab === 'type' ? 'type' : activeTab === 'frequency' ? 'frequency' : 'area');
                    return tasks.length > 0;
                  });
                  return `${activeItems.length} active categories`;
                })()}
              </div>
            </div>
          </div>

          {/* Filter Cards with Enhanced Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              {renderFilterCards()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
} 