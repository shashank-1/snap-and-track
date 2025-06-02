"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Home, User, Upload, FileText, X, Sparkles, Check, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateTaskModal from '@/components/CreateTaskModal';
import AIAnalysisModal from '@/components/AIAnalysisModal';
import TopNavigation from '@/components/TopNavigation';

export default function HomePage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // Simulate AI analysis of uploaded image
  const simulateAIAnalysis = (imageData: string) => {
    const possibleAnalyses = [
      {
        type: "maintenance",
        confidence: 92,
        issue: "Clogged Gutter",
        description: "Debris accumulation detected in gutter system. Recommended cleaning to prevent water damage.",
        suggestedTask: {
          title: "Clean Gutters - Debris Removal",
          category: "maintenance",
          priority: "high",
          estimatedCost: 150,
          room: "exterior",
          description: "Remove accumulated debris from gutters to prevent water damage and ensure proper drainage."
        }
      },
      {
        type: "safety",
        confidence: 88,
        issue: "Smoke Detector Battery",
        description: "Low battery indicator visible on smoke detector. Immediate replacement recommended.",
        suggestedTask: {
          title: "Replace Smoke Detector Battery",
          category: "safety",
          priority: "high",
          estimatedCost: 15,
          room: "living_room",
          description: "Replace low battery in smoke detector to ensure proper safety protection."
        }
      },
      {
        type: "plumbing",
        confidence: 85,
        issue: "Leaky Faucet",
        description: "Water stains and dripping detected around faucet area. Requires repair to prevent water waste.",
        suggestedTask: {
          title: "Repair Leaky Kitchen Faucet",
          category: "plumbing",
          priority: "medium",
          estimatedCost: 75,
          room: "kitchen",
          description: "Fix dripping faucet to prevent water waste and potential damage."
        }
      },
      {
        type: "electrical",
        confidence: 79,
        issue: "Outlet Cover Damage",
        description: "Damaged electrical outlet cover detected. Safety hazard that requires immediate attention.",
        suggestedTask: {
          title: "Replace Damaged Outlet Cover",
          category: "electrical",
          priority: "high",
          estimatedCost: 25,
          room: "bedroom",
          description: "Replace damaged electrical outlet cover to ensure safety and proper functionality."
        }
      }
    ];

    return possibleAnalyses[Math.floor(Math.random() * possibleAnalyses.length)];
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setUploadedImage(e.target.result);
          setIsProcessing(true);
          
          // Simulate AI processing delay
          setTimeout(() => {
            if (e.target?.result) {
              const analysis = simulateAIAnalysis(e.target.result as string);
              setAiAnalysis(analysis);
              setIsProcessing(false);
              setShowAnalysisModal(true);
            }
          }, 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSnapTask = () => cameraInputRef.current?.click();
  const handleQuickTask = () => setIsCreateTaskModalOpen(true);

  const handleTaskCreated = (taskData: any) => {
    console.log('Task created from modal:', taskData);
  };

  const handleCreateTaskFromAI = () => {
    if (aiAnalysis) {
      const taskWithImage = {
        ...aiAnalysis.suggestedTask,
        image: uploadedImage,
        aiGenerated: true,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      // Save to localStorage directly
      const existingTasks = JSON.parse(localStorage.getItem('home-care-tasks') || '[]');
      const newTask = {
        id: Date.now().toString(),
        ...taskWithImage,
        status: 'pending',
        assignee: 'Me',
        cost: taskWithImage.estimatedCost,
        createdAt: new Date().toISOString()
      };
      
      const updatedTasks = [newTask, ...existingTasks];
      localStorage.setItem('home-care-tasks', JSON.stringify(updatedTasks));
      
      // Reset state
      setShowAnalysisModal(false);
      setUploadedImage(null);
      setAiAnalysis(null);
      
      // Redirect to tasks
      setTimeout(() => {
        router.push('/tasks');
      }, 1000);
    }
  };

  const handleDiscardAnalysis = () => {
    setShowAnalysisModal(false);
    setUploadedImage(null);
    setAiAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Toggle Menu - Snap and Tasks */}
      <div className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button 
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Snap</span>
            </button>
            <button 
              onClick={() => router.push('/tasks')}
              className="px-8 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium transition-all duration-200 flex items-center space-x-2"
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
      <main className="max-w-screen-sm mx-auto px-6 pt-6 pb-24">
        {/* Camera Icon and Title */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-gray-100">
            <Camera className="w-12 h-12 text-gray-800" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Snap to Create Task
          </h2>
          <p className="text-gray-600 mb-2">
            Turn your home into a well-oiled machine.
          </p>
          <p className="text-gray-600">
            Snap, track, and never forget that leaky faucet again ✨
          </p>
        </div>

        {/* Camera Preview */}
        {uploadedImage && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="aspect-square relative">
              <img src={uploadedImage} alt="Captured" className="w-full h-full object-cover" />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="relative mb-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      <Sparkles className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-base font-medium text-gray-900">AI analyzing image...</p>
                    <p className="text-sm text-gray-600 mt-1">Detecting maintenance issues</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button 
            onClick={handleSnapTask}
            className="w-full bg-blue-100 hover:bg-blue-200 rounded-2xl p-6 text-center transition-colors"
          >
            <div className="flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-blue-600">Upload Picture</span>
            </div>
            <p className="text-blue-500">Choose from gallery</p>
          </button>

          <button 
            onClick={handleQuickTask}
            className="w-full bg-green-100 hover:bg-green-200 rounded-2xl p-6 text-center transition-colors"
          >
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-lg font-semibold text-green-600">Quick Task</span>
            </div>
            <p className="text-green-500">Use template</p>
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6 z-50">
        <button
          onClick={handleSnapTask}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Camera className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Hidden camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* AI Analysis Modal */}
      {showAnalysisModal && aiAnalysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">AI Analysis Complete</h2>
                </div>
                <button
                  onClick={handleDiscardAnalysis}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                {uploadedImage && (
                  <img src={uploadedImage} alt="Analysis" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Issue Detected</h3>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">{aiAnalysis.confidence}% confident</span>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-red-800 mb-2">{aiAnalysis.issue}</h4>
                  <p className="text-red-700 text-sm">{aiAnalysis.description}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Suggested Task</h4>
                  <h5 className="font-semibold text-gray-900 mb-1">{aiAnalysis.suggestedTask.title}</h5>
                  <p className="text-gray-600 text-sm mb-3">{aiAnalysis.suggestedTask.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estimated Cost:</span>
                    <span className="font-medium text-gray-900">${aiAnalysis.suggestedTask.estimatedCost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Priority:</span>
                    <span className={`font-medium ${
                      aiAnalysis.suggestedTask.priority === 'high' ? 'text-red-600' : 
                      aiAnalysis.suggestedTask.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {aiAnalysis.suggestedTask.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDiscardAnalysis}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleCreateTaskFromAI}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}