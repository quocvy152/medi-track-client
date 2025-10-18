"use client";

import { mockPosts, mockUsers } from '@/data/mockData';
import { ChartBarIcon, ClockIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/outline';

/**
 * Admin Dashboard Page
 * 
 * Main dashboard showing overview statistics and quick access to management sections
 */
export default function AdminDashboard() {
  // Calculate statistics
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(user => user.status === 'active').length;
  const totalPosts = mockPosts.length;
  const publishedPosts = mockPosts.filter(post => post.status === 'published').length;

  const stats = [
    {
      name: 'Total Users',
      value: totalUsers,
      icon: UsersIcon,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Users',
      value: activeUsers,
      icon: ChartBarIcon,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Posts',
      value: totalPosts,
      icon: DocumentTextIcon,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: 'Published Posts',
      value: publishedPosts,
      icon: ClockIcon,
      change: '+15%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the admin dashboard. Here&apos;s what&apos;s happening with your application.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm ring-1 ring-gray-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {mockUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {mockPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {post.author.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      by {post.author}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <UsersIcon className="h-4 w-4 mr-2" />
              Manage Users
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Manage Posts
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Analytics
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ClockIcon className="h-4 w-4 mr-2" />
              System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
