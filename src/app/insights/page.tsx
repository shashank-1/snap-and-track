"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, User, LogOut, Bell, Target, Activity, BarChart3, Construction, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InsightsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");
    
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    
    setUserEmail(email || "demo@homecare.app");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  const navigationItems = [
    { id: "tasks", label: "Tasks", icon: ListChecks, path: "/tasks" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Home Care</h1>
                <p className="text-xs text-gray-500">AI Insights (Coming Soon)</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={item.id === "tasks" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.path)}
                  className="text-sm"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-xl">
                <Bell className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-700 hidden lg:inline">{userEmail}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="bg-white rounded-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Construction className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚧 Insights Page Under Construction</h3>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Insights</h2>
              <p className="text-gray-600 mb-4">AI insights are now integrated into the Tasks page</p>
              <Button 
                onClick={() => router.push('/tasks')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 