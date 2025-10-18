"use client";

import { useAuth } from '@/hooks/useAuth';
import { ArrowRightOnRectangleIcon, Bars3Icon, BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface User {
  name?: string;
  role?: string;
}

interface AdminHeaderProps {
  onMenuClick: () => void;
}

/**
 * AdminHeader Component
 * 
 * Provides a professional admin header with:
 * - Mobile menu button
 * - Admin branding and logo
 * - Notifications bell
 * - User profile dropdown
 * - Settings access
 * - Logout functionality
 */
export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Safely derive display values from possibly untyped user object
  const displayName = typeof (user as User)?.name === 'string' ? ((user as User).name as string) : 'Admin User';
  const displayRole = typeof (user as User)?.role === 'string' ? ((user as User).role as string) : 'ADMIN';
  const displayInitial = String(displayName).charAt(0).toUpperCase();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu button and branding */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {/* Admin branding */}
          <div className="ml-4 lg:ml-0 flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                MediTrack Admin
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Management Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Notifications, User info and actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200">
            <Cog6ToothIcon className="h-5 w-5" />
          </button>

          {/* User profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500">
                  {displayRole}
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                <span className="text-white text-sm font-medium">
                  {displayInitial}
                </span>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayRole}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
