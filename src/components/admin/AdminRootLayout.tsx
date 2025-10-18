"use client";

import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { NextIntlClientProvider } from 'next-intl';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface AdminRootLayoutProps {
  children: React.ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
}

/**
 * AdminRootLayout Component
 * 
 * Provides a completely separate layout for admin pages:
 * - No client Navigation or Footer
 * - Admin-specific styling and branding
 * - Responsive sidebar navigation
 * - Top header with admin-specific features
 * - Main content area with admin styling
 */
export default function AdminRootLayout({ children, locale = 'vi', messages }: AdminRootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const content = (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:ml-0">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page content */}
          <main className="flex-1 py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>

        {/* Toast notifications for admin */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AdminAuthGuard>
  );

  // If messages are provided, wrap with NextIntlClientProvider
  if (messages) {
    return (
      <NextIntlClientProvider messages={messages} locale={locale}>
        {content}
      </NextIntlClientProvider>
    );
  }

  return content;
}
