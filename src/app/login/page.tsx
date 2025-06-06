"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Shield, Sparkles, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [currentTagline, setCurrentTagline] = useState(0);
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: ''
  });
  const [createAccountData, setCreateAccountData] = useState({
    name: '',
    username: '',
    usernameType: 'email', // 'email' or 'phone'
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const taglines = [
    "Snap it in a second.",
    "Track it without the hassle."
  ];

  // Rotate tagline every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAdminCheckboxChange = (checked: boolean) => {
    setIsAdminLogin(checked);
    
    if (checked) {
      console.log('Admin checkbox checked - starting auto-login');
      setLoginFormData({
        email: 'admin@homecare.app',
        password: 'admin123'
      });
      
      setIsLoading(true);
      setTimeout(() => {
        const adminAuthData = {
          isAuthenticated: true,
          user: {
            email: 'admin@homecare.app',
            name: 'Admin User',
            role: 'admin',
            loginTime: new Date().toISOString()
          }
        };
        
        console.log('Setting admin auth data:', adminAuthData);
        try {
          localStorage.setItem('home-care-auth', JSON.stringify(adminAuthData));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", 'admin@homecare.app');
          
          console.log('Auth data set successfully');
          // Verify data was set correctly
          const verifyAuth = localStorage.getItem('home-care-auth');
          console.log('Verification - stored auth data:', verifyAuth);
          
          console.log('Redirecting to admin...');
          router.push('/admin');
          setIsLoading(false);
        } catch (error) {
          console.error('Error setting localStorage:', error);
          alert('Error during admin login. Please try again.');
          setIsLoading(false);
        }
      }, 1500); // Increased delay to ensure proper setting
    } else {
      setLoginFormData({
        email: '',
        password: ''
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let userRole = 'user';
    let userName = loginFormData.email.split('@')[0] || 'User';
    
    if (loginFormData.email === 'admin@homecare.app' && loginFormData.password === 'admin123') {
      userRole = 'admin';
      userName = 'Admin User';
    }
    
    setTimeout(() => {
      try {
        const authData = {
          isAuthenticated: true,
          user: {
            email: loginFormData.email,
            name: userName,
            role: userRole,
            loginTime: new Date().toISOString()
          }
        };
        
        console.log('Setting login auth data:', authData);
        localStorage.setItem('home-care-auth', JSON.stringify(authData));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", loginFormData.email);
        
        // Verify data was set correctly
        const verifyAuth = localStorage.getItem('home-care-auth');
        console.log('Verification - stored auth data:', verifyAuth);
        
        console.log('Redirecting user with role:', userRole);
        if (userRole === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (createAccountData.password !== createAccountData.confirmPassword) {
      alert('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (createAccountData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      setIsLoading(false);
      return;
    }

    // Create account
    setTimeout(() => {
      const userEmail = createAccountData.usernameType === 'email' 
        ? createAccountData.username 
        : `${createAccountData.username}@homecare.app`;

      localStorage.setItem('home-care-auth', JSON.stringify({
        isAuthenticated: true,
        user: {
          email: userEmail,
          name: createAccountData.name,
          role: 'user',
          loginTime: new Date().toISOString()
        }
      }));
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", userEmail);
      
      router.push('/');
      setIsLoading(false);
    }, 1200);
  };

  const handleGuestLogin = () => {
    localStorage.setItem('home-care-auth', JSON.stringify({
      isAuthenticated: true,
      user: {
        email: 'guest@homecare.app',
        name: 'Guest User',
        role: 'user',
        loginTime: new Date().toISOString()
      }
    }));
    
    router.push('/');
  };

  const closeAllModals = () => {
    setShowLoginForm(false);
    setShowCreateAccountForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 relative">
      {/* Main Content */}
      <div className="min-h-screen flex flex-col justify-center items-center relative z-10 px-4 py-6">
        {/* Main Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-black tracking-tight leading-none font-sans" style={{ fontWeight: 900 }}>
            Snap and Track
          </h1>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center relative">
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <img 
                src="/hero-illustration.png" 
                alt="Snap and Track - Ghibli-style house illustration with floating to-do list and camera"
                className="w-full h-full object-contain rounded-2xl"
              />
              
              {/* Floating sparkles around the image */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="w-full max-w-sm space-y-5">
          {/* Rotating Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <motion.p 
              key={currentTagline}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base text-gray-600 leading-relaxed"
            >
              {taglines[currentTagline]}
            </motion.p>
          </motion.div>

          {/* Primary CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full"
          >
            <Button 
              onClick={() => setShowCreateAccountForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 text-lg font-semibold shadow-lg transition-all duration-200 active:scale-95"
              disabled={isLoading}
            >
              Create an Account
            </Button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full space-y-4"
          >
            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={() => setShowLoginForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors active:scale-95"
              >
                Sign in
              </button>
            </div>
            
            {/* Guest Button */}
            <Button 
              onClick={handleGuestLogin}
              variant="outline" 
              className="w-full rounded-xl py-3 border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 active:scale-95"
              disabled={isLoading}
            >
              Continue as Guest
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.8 }}
              transition={{ 
                type: 'spring', 
                damping: 35, 
                stiffness: 300, 
                duration: 0.7,
                exit: { duration: 0.8, ease: "easeInOut" }
              }}
              className="w-full max-w-md h-[50vh] bg-white/70 backdrop-blur-xl rounded-t-3xl shadow-2xl border border-white/40 overflow-hidden pointer-events-auto mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                  <button 
                    onClick={closeAllModals}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        value={loginFormData.email}
                        onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})}
                        placeholder="Email address"
                        className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base"
                        required
                        disabled={isAdminLogin || isLoading}
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="password"
                        value={loginFormData.password}
                        onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                        placeholder="Password"
                        className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base"
                        required
                        disabled={isAdminLogin || isLoading}
                      />
                    </div>

                    {/* Admin Checkbox */}
                    <div className="flex justify-end">
                      <div className="flex items-center space-x-2 opacity-30 hover:opacity-60 transition-opacity">
                        <input
                          type="checkbox"
                          id="adminLogin"
                          checked={isAdminLogin}
                          onChange={(e) => handleAdminCheckboxChange(e.target.checked)}
                          className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                          disabled={isLoading}
                        />
                        <label htmlFor="adminLogin" className="text-xs text-gray-500 cursor-pointer flex items-center space-x-1">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition-all duration-200 active:scale-95"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <span className="text-gray-600">Don&apos;t have an account? </span>
                    <button
                      onClick={() => {
                        setShowLoginForm(false);
                        setShowCreateAccountForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                    >
                      Create one
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Account Modal */}
      <AnimatePresence>
        {showCreateAccountForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.8 }}
              transition={{ 
                type: 'spring', 
                damping: 35, 
                stiffness: 300, 
                duration: 0.7,
                exit: { duration: 0.8, ease: "easeInOut" }
              }}
              className="w-full max-w-md h-[50vh] bg-white/70 backdrop-blur-xl rounded-t-3xl shadow-2xl border border-white/40 overflow-hidden pointer-events-auto mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                  <button 
                    onClick={closeAllModals}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleCreateAccount} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        value={createAccountData.name}
                        onChange={(e) => setCreateAccountData({...createAccountData, name: e.target.value})}
                        placeholder="Full name"
                        className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose your username type:
                      </label>
                      <div className="flex space-x-3 mb-3">
                        <button
                          type="button"
                          onClick={() => setCreateAccountData({...createAccountData, usernameType: 'email', username: ''})}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                            createAccountData.usernameType === 'email' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-300 text-gray-600'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCreateAccountData({...createAccountData, usernameType: 'phone', username: ''})}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                            createAccountData.usernameType === 'phone' 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-300 text-gray-600'
                          }`}
                        >
                          <Phone className="w-4 h-4" />
                          <span>Phone</span>
                        </button>
                      </div>
                      <Input
                        type={createAccountData.usernameType === 'email' ? 'email' : 'tel'}
                        value={createAccountData.username}
                        onChange={(e) => setCreateAccountData({...createAccountData, username: e.target.value})}
                        placeholder={createAccountData.usernameType === 'email' ? 'your@email.com' : 'Your phone number'}
                        className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="password"
                        value={createAccountData.password}
                        onChange={(e) => setCreateAccountData({...createAccountData, password: e.target.value})}
                        placeholder="Password (min 6 characters)"
                        className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>

                    <div>
                      <Input
                        type="password"
                        value={createAccountData.confirmPassword}
                        onChange={(e) => setCreateAccountData({...createAccountData, confirmPassword: e.target.value})}
                        placeholder="Confirm password"
                        className="w-full rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 py-3 px-4 text-base"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition-all duration-200 active:scale-95"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <button
                      onClick={() => {
                        setShowCreateAccountForm(false);
                        setShowLoginForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 