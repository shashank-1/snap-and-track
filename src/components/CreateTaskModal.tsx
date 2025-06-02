"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Timer, CalendarPlus, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (taskData: any) => void;
  onOpenCamera?: () => void;
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated, onOpenCamera }: CreateTaskModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Task templates
  const taskTemplates = [
    {
      id: 'hvac_filter',
      title: 'Replace HVAC Filter',
      description: 'Replace air filter for better air quality and system efficiency',
      category: 'heating_cooling',
      priority: 'medium',
      estimatedCost: 25,
      frequency: 'monthly',
      room: 'basement',
      icon: '🌡️',
      tips: 'Check filter monthly, replace every 1-3 months depending on usage'
    },
    {
      id: 'gutter_cleaning',
      title: 'Clean Gutters',
      description: 'Remove debris and check for damage to prevent water issues',
      category: 'maintenance',
      priority: 'high',
      estimatedCost: 150,
      frequency: 'seasonal',
      room: 'exterior',
      icon: '🏠',
      tips: 'Best done in fall after leaves drop and spring before heavy rains'
    },
    {
      id: 'smoke_detector',
      title: 'Test Smoke Detectors',
      description: 'Test batteries and functionality of all smoke detectors',
      category: 'safety',
      priority: 'high',
      estimatedCost: 0,
      frequency: 'monthly',
      room: 'whole_home',
      icon: '🚨',
      tips: 'Replace batteries twice yearly when daylight saving time changes'
    },
    {
      id: 'deep_clean',
      title: 'Deep Clean Kitchen',
      description: 'Thorough cleaning of appliances, cabinets, and surfaces',
      category: 'cleaning',
      priority: 'medium',
      estimatedCost: 0,
      frequency: 'monthly',
      room: 'kitchen',
      icon: '🧽',
      tips: 'Include cleaning inside oven, refrigerator coils, and range hood'
    },
    {
      id: 'lawn_care',
      title: 'Fertilize Lawn',
      description: 'Apply seasonal fertilizer for healthy grass growth',
      category: 'landscaping',
      priority: 'medium',
      estimatedCost: 45,
      frequency: 'seasonal',
      room: 'yard',
      icon: '🌱',
      tips: 'Apply in early spring and fall for best results'
    },
    {
      id: 'plumbing_check',
      title: 'Check Water Pressure',
      description: 'Test water pressure in all faucets and showerheads',
      category: 'plumbing',
      priority: 'low',
      estimatedCost: 0,
      frequency: 'quarterly',
      room: 'bathroom',
      icon: '💧',
      tips: 'Low pressure may indicate clogged aerators or pipe issues'
    }
  ];

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
  };

  const handleCreateTask = (taskData: any) => {
    console.log('Creating task:', taskData);
    
    // Call the callback if provided
    if (onTaskCreated) {
      onTaskCreated(taskData);
    }
    
    // Reset and close modal (no alert popup)
    setSelectedTemplate(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    onClose();
  };

  // Task Creation Component
  const TaskCreationInterface = () => {
    const [formData, setFormData] = useState({
      title: selectedTemplate?.title || '',
      description: selectedTemplate?.description || '',
      category: selectedTemplate?.category || 'maintenance',
      priority: selectedTemplate?.priority || 'medium',
      estimatedCost: selectedTemplate?.estimatedCost || 0,
      frequency: selectedTemplate?.frequency || 'monthly',
      room: selectedTemplate?.room || 'living_room',
      dueDate: '',
      assignee: 'Me'
    });

    useEffect(() => {
      if (selectedTemplate) {
        setFormData({
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          category: selectedTemplate.category,
          priority: selectedTemplate.priority,
          estimatedCost: selectedTemplate.estimatedCost,
          frequency: selectedTemplate.frequency,
          room: selectedTemplate.room,
          dueDate: '',
          assignee: 'Me'
        });
      }
    }, [selectedTemplate]);

    return (
      <div className="p-6">
        {!selectedTemplate ? (
          // Template Selection View
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Template</h3>
              <p className="text-gray-600">Select from common home maintenance tasks or create a custom task</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6 max-h-60 overflow-y-auto">
              {taskTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl">{template.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">{template.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{template.category}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{template.frequency}</span>
                        <span className="font-medium">${template.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {/* Camera Button */}
              {onOpenCamera && (
                <Button
                  onClick={() => {
                    onOpenCamera();
                    onClose(); // Close modal when opening camera
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 flex items-center justify-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap & Track</span>
                </Button>
              )}

              {/* Custom Task Button */}
              <Button
                onClick={() => setSelectedTemplate({ id: 'custom', title: '', description: '' })}
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 hover:border-blue-300 rounded-xl p-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Task
              </Button>
            </div>
          </div>
        ) : (
          // Task Creation Form
          <div>
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                {selectedTemplate.icon && <span className="text-xl">{selectedTemplate.icon}</span>}
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTemplate.id === 'custom' ? 'Custom Task Details' : `Create: ${selectedTemplate.title}`}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTemplate(null)}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto"
              >
                ← Back to Templates
              </Button>
            </div>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              // Set default due date if not provided
              const defaultDueDate = new Date();
              defaultDueDate.setDate(defaultDueDate.getDate() + 7);
              const finalFormData = {
                ...formData,
                dueDate: formData.dueDate || defaultDueDate.toISOString().split('T')[0]
              };
              handleCreateTask(finalFormData); 
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter task title"
                    className="rounded-xl text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    placeholder={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="rounded-xl text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Defaults to 1 week from now if not set
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the task in detail"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="heating_cooling">HVAC</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="safety">Safety</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTemplate ? '📝 Create from Template' : '🎯 Create New Task'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto flex-1">
              <TaskCreationInterface />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 