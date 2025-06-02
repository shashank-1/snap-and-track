"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import UserDropdown from '@/components/UserDropdown';

interface TopNavigationProps {
  className?: string;
}

export default function TopNavigation({ className = "" }: TopNavigationProps) {
  const router = useRouter();

  return (
    <header className={`bg-white border-b border-gray-100 sticky top-0 z-50 ${className}`}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Home Button */}
        <button 
          onClick={() => router.push('/')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="Go to Snap & Track"
        >
          <Home className="w-5 h-5 text-gray-700" />
        </button>

        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </header>
  );
} 