"use client";

import {
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  HomeIcon,
  ShieldCheckIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AdminSidebar Component
 * 
 * Provides professional navigation for admin pages:
 * - Dashboard overview
 * - User management
 * - Post management
 * - Settings and security
 * - Responsive design with mobile overlay
 * - Professional admin branding
 */
export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      current: pathname === '/admin',
      description: 'Overview & Analytics'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
      current: pathname === '/admin/users',
      description: 'User Management'
    },
    {
      name: 'Posts',
      href: '/admin/posts',
      icon: DocumentTextIcon,
      current: pathname === '/admin/posts',
      description: 'Content Management'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      current: pathname === '/admin/analytics',
      description: 'Reports & Insights'
    },
    {
      name: 'Security',
      href: '/admin/security',
      icon: ShieldCheckIcon,
      current: pathname === '/admin/security',
      description: 'Access Control'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: CogIcon,
      current: pathname === '/admin/settings',
      description: 'System Configuration'
    },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">MediTrack</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              type="button"
              className="lg:hidden rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
              Management
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${item.current
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <Icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                    `}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${item.current ? 'text-blue-100' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">MT</span>
              </div>
              <div>
                <div className="text-xs font-medium text-white">MediTrack Admin</div>
                <div className="text-xs text-gray-400">v1.0.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
