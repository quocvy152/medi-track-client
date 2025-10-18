"use client";

import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 * 
 * Provides the main layout structure for admin pages:
 * - Responsive sidebar navigation
 * - Top header with user info and logout
 * - Main content area
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
