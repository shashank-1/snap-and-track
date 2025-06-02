"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, ChevronDown, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const authData = localStorage.getItem('home-care-auth');
    if (authData) {
      const auth = JSON.parse(authData);
      setUser(auth.user);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('home-care-auth');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-2"
      >
        <User className="w-5 h-5 text-gray-700" />
        {user && (
          <>
            <span className="text-sm text-gray-500 font-medium hidden sm:block">
              {user.name}
            </span>
            <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
        {!user && (
          <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
          >
            {user ? (
              <>
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        router.push('/admin');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-purple-700 hover:bg-purple-50 flex items-center space-x-3"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // You can add settings page navigation here
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/login');
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 