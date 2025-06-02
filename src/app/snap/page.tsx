"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EphemeralTaskCards from '@/components/EphemeralTaskCards';
import { 
  Camera, 
  Upload, 
  Zap, 
  Brain, 
  CheckCircle2, 
  Edit, 
  Save, 
  X, 
  AlertTriangle,
  Home,
  Wrench,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Sparkles,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

// Mock AI task detection results
const mockAIDetection = {
  "roof-crack.jpg": {
    title: "Inspect Roof Crack",
    category: "structural",
    area: "roof",
    priority: "high",
    estimatedCost: 200,
    description: "Detected potential crack in roofing material that may lead to water damage if not addressed.",
    confidence: 94
  },
  "gutter-debris.jpg": {
    title: "Clean Gutters",
    category: "maintenance",
    area: "exterior",
    priority: "medium",
    estimatedCost: 150,
    description: "Significant debris accumulation detected in gutters that could cause water overflow.",
    confidence: 89
  },
  "hvac-filter.jpg": {
    title: "Replace HVAC Filter",
    category: "heating_cooling",
    area: "basement",
    priority: "medium",
    estimatedCost: 25,
    description: "Filter appears dirty and may be reducing air quality and system efficiency.",
    confidence: 96
  }
};

// Recent snap tasks for the feed
const recentSnapTasks = [
  {
    id: 1,
    title: "Inspect Roof Crack",
    image: "/api/placeholder/300/200",
    category: "structural",
    area: "roof",
    priority: "high",
    createdAt: "2 hours ago",
    status: "pending"
  },
  {
    id: 2,
    title: "Clean Gutters",
    image: "/api/placeholder/300/200",
    category: "maintenance",
    area: "exterior",
    priority: "medium",
    createdAt: "1 day ago",
    status: "in_progress"
  },
  {
    id: 3,
    title: "Check Basement Moisture",
    image: "/api/placeholder/300/200",
    category: "safety",
    area: "basement",
    priority: "low",
    createdAt: "3 days ago",
    status: "completed"
  }
];

interface TaskForm {
  title: string;
  description: string;
  category: string;
  area: string;
  priority: string;
  estimatedCost: number;
  assignee: string;
  dueDate: string;
}

export default function SnapAndTrack() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiDetection, setAiDetection] = useState<any>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState<TaskForm>({
    title: "",
    description: "",
    category: "maintenance",
    area: "living_room",
    priority: "medium",
    estimatedCost: 0,
    assignee: "Me",
    dueDate: ""
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setUploadedFileName(file.name);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const mockKey = Object.keys(mockAIDetection)[0]; // Use first mock result
      const detection = mockAIDetection[mockKey as keyof typeof mockAIDetection];
      setAiDetection(detection);
      setTaskForm({
        ...taskForm,
        title: detection.title,
        description: detection.description,
        category: detection.category,
        area: detection.area,
        priority: detection.priority,
        estimatedCost: detection.estimatedCost
      });
      setIsProcessing(false);
      setShowTaskForm(true);
    }, 2000);
  };

  const handleSaveTask = () => {
    console.log('Saving task:', taskForm);
    // Here you would save to your backend
    
    // Reset form
    setUploadedImage(null);
    setUploadedFileName("");
    setAiDetection(null);
    setShowTaskForm(false);
    setTaskForm({
      title: "",
      description: "",
      category: "maintenance",
      area: "living_room",
      priority: "medium",
      estimatedCost: 0,
      assignee: "Me",
      dueDate: ""
    });
    
    // Show success message
    alert("✅ Task created successfully! You can view it in your task list.");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Ephemeral Task Cards */}
      <EphemeralTaskCards maxCards={3} visibleDuration={3000} staggerDelay={400} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📸 Snap & Track</h1>
              <p className="text-gray-600">AI-powered task creation from photos</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upload Area */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="p-8">
                <div
                  className={`text-center transition-all duration-300 ${
                    dragActive ? 'scale-105 border-blue-500' : ''
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {!uploadedImage ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Upload or take a photo
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Our AI will analyze the image and suggest maintenance tasks
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => cameraInputRef.current?.click()}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500">
                        Supports JPG, PNG, WebP up to 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="max-w-full h-64 object-cover rounded-lg mx-auto"
                        />
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedFileName("");
                            setAiDetection(null);
                            setShowTaskForm(false);
                          }}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      {isProcessing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center space-x-2 text-blue-600"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">AI analyzing image...</span>
                        </motion.div>
                      )}

                      {aiDetection && !isProcessing && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-50 border border-green-200 rounded-lg p-4"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Brain className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-800">AI Detection Complete</span>
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              {aiDetection.confidence}% confident
                            </Badge>
                          </div>
                          <p className="text-green-700 text-sm">
                            Detected: <strong>{aiDetection.title}</strong>
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Task Creation Form */}
            <AnimatePresence>
              {showTaskForm && aiDetection && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <span>AI-Generated Task</span>
                        <Badge variant="outline" className="text-xs">Editable</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title
                          </label>
                          <Input
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                          </label>
                          <Input
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                          </label>
                          <select
                            value={taskForm.priority}
                            onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={taskForm.category}
                            onChange={(e) => setTaskForm({...taskForm, category: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            <option value="maintenance">Maintenance</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="heating_cooling">HVAC</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="structural">Structural</option>
                            <option value="landscaping">Landscaping</option>
                            <option value="safety">Safety</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area
                          </label>
                          <select
                            value={taskForm.area}
                            onChange={(e) => setTaskForm({...taskForm, area: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            <option value="kitchen">Kitchen</option>
                            <option value="living_room">Living Room</option>
                            <option value="bathroom">Bathroom</option>
                            <option value="bedroom">Bedroom</option>
                            <option value="basement">Basement</option>
                            <option value="attic">Attic</option>
                            <option value="garage">Garage</option>
                            <option value="yard">Yard</option>
                            <option value="roof">Roof</option>
                            <option value="exterior">Exterior</option>
                            <option value="whole_home">Whole Home</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Cost ($)
                          </label>
                          <Input
                            type="number"
                            value={taskForm.estimatedCost}
                            onChange={(e) => setTaskForm({...taskForm, estimatedCost: parseInt(e.target.value) || 0})}
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign To
                          </label>
                          <select
                            value={taskForm.assignee}
                            onChange={(e) => setTaskForm({...taskForm, assignee: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            <option value="Me">Me</option>
                            <option value="John">John</option>
                            <option value="Sarah">Sarah</option>
                            <option value="Mike">Mike</option>
                            <option value="Professional">Hire Professional</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                        <Button 
                          onClick={handleSaveTask}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Task
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowTaskForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Snap Tasks Feed */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <span>Recent Snap Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSnapTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <Camera className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {task.title}
                          </h4>
                          {getStatusIcon(task.status)}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{task.area}</span>
                        </div>
                        
                        <p className="text-xs text-gray-500">{task.createdAt}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="text-center py-4">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    View All Tasks →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">💡 AI Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Take clear, well-lit photos for better detection</li>
                      <li>• Include context (surrounding area) in your shots</li>
                      <li>• Multiple angles help identify issues accurately</li>
                      <li>• Review AI suggestions before saving tasks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 