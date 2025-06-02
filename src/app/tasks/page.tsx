"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import CreateTaskModal from '@/components/CreateTaskModal';
import TopNavigation from '@/components/TopNavigation';
import { 
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Bell,
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  ArrowUpDown,
  Camera,
  FileText,
  Shield
} from 'lucide-react';

// Task interface
interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  room: string;
  category: string;
  assignee: string;
  cost: number;
  estimatedCost?: number;
  description: string;
  createdAt: string;
}

// Initial mock data for first-time users
const initialMockTasks: Task[] = [
  { id: '1', title: "Replace HVAC Filter", status: "pending", priority: "high", dueDate: "2024-01-15", room: "basement", category: "heating_cooling", assignee: "John", cost: 25, description: "Replace air filter for better air quality", createdAt: "2024-01-01" },
  { id: '2', title: "Clean Gutters", status: "in_progress", priority: "medium", dueDate: "2024-01-20", room: "exterior", category: "maintenance", assignee: "Sarah", cost: 150, description: "Remove debris and check for damage", createdAt: "2024-01-02" },
  { id: '3', title: "Check Smoke Detectors", status: "completed", priority: "high", dueDate: "2024-01-10", room: "whole_home", category: "safety", assignee: "Mike", cost: 0, description: "Test batteries and functionality", createdAt: "2024-01-03" }
];

// Summary Component
const TasksSummary = ({ tasks, onFilterClick, activeFilter }: { 
  tasks: Task[], 
  onFilterClick: (filter: string) => void,
  activeFilter: string 
}) => {
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  }).length;
  
  const dueThisWeek = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow && task.status !== 'completed';
  }).length;
  
  const highPriority = tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length;
  const totalCost = tasks.reduce((sum, task) => sum + task.cost, 0);

  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      <Card 
        className={`bg-red-50 border-red-200 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'overdue' ? 'ring-2 ring-red-400 bg-red-100' : ''
        }`}
        onClick={() => onFilterClick('overdue')}
      >
        <CardContent className="p-2 text-center">
          <div className="text-sm font-bold text-red-600">{overdueTasks}</div>
          <div className="text-xs text-red-700">Overdue</div>
        </CardContent>
      </Card>
      <Card 
        className={`bg-yellow-50 border-yellow-200 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'due_this_week' ? 'ring-2 ring-yellow-400 bg-yellow-100' : ''
        }`}
        onClick={() => onFilterClick('due_this_week')}
      >
        <CardContent className="p-2 text-center">
          <div className="text-sm font-bold text-yellow-600">{dueThisWeek}</div>
          <div className="text-xs text-yellow-700">This Week</div>
        </CardContent>
      </Card>
      <Card 
        className={`bg-orange-50 border-orange-200 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'high_priority' ? 'ring-2 ring-orange-400 bg-orange-100' : ''
        }`}
        onClick={() => onFilterClick('high_priority')}
      >
        <CardContent className="p-2 text-center">
          <div className="text-sm font-bold text-orange-600">{highPriority}</div>
          <div className="text-xs text-orange-700">High Priority</div>
        </CardContent>
      </Card>
      <Card 
        className={`bg-green-50 border-green-200 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'all' ? 'ring-2 ring-green-400 bg-green-100' : ''
        }`}
        onClick={() => onFilterClick('all')}
      >
        <CardContent className="p-2 text-center">
          <div className="text-sm font-bold text-green-600">${totalCost}</div>
          <div className="text-xs text-green-700">Total Cost</div>
        </CardContent>
      </Card>
    </div>
  );
};

// Status Chip Component
const StatusChip = ({ status }: { status: string }) => {
  const statusConfig = {
    overdue: { icon: "🔴", color: "bg-red-100 text-red-800 border-red-200", label: "Overdue" },
    in_progress: { icon: "🟡", color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "In Progress" },
    completed: { icon: "🟢", color: "bg-green-100 text-green-800 border-green-200", label: "Completed" },
    pending: { icon: "⚪", color: "bg-slate-100 text-slate-800 border-slate-200", label: "Pending" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge className={`${config.color} border text-xs font-medium`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

export default function TasksListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [summaryFilter, setSummaryFilter] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({key: '', direction: 'asc'});
  const [showSearch, setShowSearch] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('home-care-auth');
      const legacyAuth = localStorage.getItem('isLoggedIn');
      
      if (authData) {
        try {
          const auth = JSON.parse(authData);
          if (auth.isAuthenticated && auth.user) {
            setIsAuthenticated(true);
            setIsAdmin(auth.user.role === 'admin');
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
      
      // Check legacy auth for backward compatibility
      if (legacyAuth === 'true') {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // Not authenticated, redirect to login
      router.push('/login');
    };

    checkAuth();
  }, [router]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('home-care-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
    } else {
      // First time user - load initial mock data
      setTasks(initialMockTasks);
      localStorage.setItem('home-care-tasks', JSON.stringify(initialMockTasks));
    }
  }, []);

  // Update overdue status
  useEffect(() => {
    const today = new Date();
    const updatedTasks = tasks.map(task => {
      const dueDate = new Date(task.dueDate);
      if (dueDate < today && task.status === 'pending') {
        return { ...task, status: 'overdue' as const };
      }
      return task;
    });
    
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      setTasks(updatedTasks);
      localStorage.setItem('home-care-tasks', JSON.stringify(updatedTasks));
    }
  }, [tasks]);

  // Filter and sort tasks
  useEffect(() => {
    let filtered = tasks;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply summary filter
    if (summaryFilter !== "all") {
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      switch (summaryFilter) {
        case 'overdue':
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate < today && task.status !== 'completed';
          });
          break;
        case 'due_this_week':
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= today && dueDate <= weekFromNow && task.status !== 'completed';
          });
          break;
        case 'high_priority':
          filtered = filtered.filter(task => task.priority === 'high' && task.status !== 'completed');
          break;
      }
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof typeof a];
        let bValue = b[sortConfig.key as keyof typeof b];
        
        if (sortConfig.key === 'dueDate') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredTasks(filtered);
  }, [searchTerm, statusFilter, summaryFilter, sortConfig, tasks]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const handleTaskCreated = (taskData: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      category: taskData.category,
      priority: taskData.priority,
      room: taskData.room || 'general',
      dueDate: taskData.dueDate,
      assignee: taskData.assignee || 'Me',
      status: 'pending',
      cost: taskData.estimatedCost || 0,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('home-care-tasks', JSON.stringify(updatedTasks));
    
    console.log('Task created and saved:', newTask);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('home-care-tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('home-care-tasks', JSON.stringify(updatedTasks));
  };

  // Handle summary filter clicks
  const handleSummaryFilterClick = (filter: string) => {
    if (summaryFilter === filter && filter !== 'all') {
      // If clicking the same filter, clear it (go to 'all')
      setSummaryFilter('all');
    } else {
      setSummaryFilter(filter);
    }
    // Clear status filter when using summary filter
    if (filter !== 'all') {
      setStatusFilter('all');
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Toggle Menu - Snap and Tasks */}
      <div className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Snap</span>
            </button>
            <button 
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Tasks</span>
            </button>
            {isAdmin && (
              <button 
                onClick={() => router.push('/admin')}
                className="px-8 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        {/* Summary Cards */}
        <TasksSummary
          tasks={tasks}
          onFilterClick={(filter) => handleSummaryFilterClick(filter)}
          activeFilter={summaryFilter}
        />

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
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
                      className="pl-10 pr-10 bg-white border-gray-300 focus:border-blue-500 rounded-xl w-64"
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
              className={`hover:bg-gray-100 rounded-xl transition-colors ${showSearch ? 'bg-blue-100 text-blue-600' : ''}`}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Subtle hint for creating tasks */}
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <span>Tap</span>
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
            <span>to create new tasks</span>
          </div>
        </div>

        {/* Tasks List - Mobile Optimized */}
        <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Tasks ({filteredTasks.length})</span>
              <Badge variant="outline" className="text-xs">
                {filteredTasks.filter(t => {
                  const dueDate = new Date(t.dueDate);
                  const today = new Date();
                  return dueDate < today && t.status !== 'completed';
                }).length} overdue
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="w-8 h-8 text-gray-300" />
                  <p>No tasks found</p>
                  <p className="text-sm">Create your first task to get started!</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-base mb-1 truncate">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-3">
                        {getStatusIcon(task.status)}
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task.id, e.target.value as Task['status'])}
                          className="text-xs bg-transparent border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Task Details */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                        <span>•</span>
                        <span className="capitalize">{task.room}</span>
                        <span>•</span>
                        <span className="font-medium text-gray-900">${task.cost}</span>
                      </div>
                      <Badge className={`text-xs ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Assigned to {task.assignee}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg text-red-600"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6 z-50">
        <button
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        onOpenCamera={() => router.push('/')}
      />
    </div>
  );
} 