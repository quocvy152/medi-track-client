"use client";

import DataTable from '@/components/admin/DataTable';
import { MockUser, mockUsers } from '@/data/mockData';
import { useState } from 'react';

/**
 * Users Management Page
 * 
 * Displays a table of all users with search, sort, and action capabilities
 */
export default function UsersManagement() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);

  // Define table columns
  const columns = [
    {
      key: 'name' as keyof MockUser,
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email' as keyof MockUser,
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role' as keyof MockUser,
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'ADMIN' 
            ? 'bg-red-100 text-red-800'
            : value === 'MODERATOR'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'status' as keyof MockUser,
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800'
            : value === 'inactive'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'postsCount' as keyof MockUser,
      label: 'Posts',
      sortable: true,
    },
    {
      key: 'createdAt' as keyof MockUser,
      label: 'Joined',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'lastLogin' as keyof MockUser,
      label: 'Last Login',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEdit = (user: MockUser) => {
    console.log('Edit user:', user);
    // TODO: Implement edit functionality
    alert(`Edit user: ${user.name}`);
  };

  const handleDelete = (user: MockUser) => {
    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      setUsers(users.filter(u => u.id !== user.id));
      // TODO: Implement API call to delete user
    }
  };

  const handleView = (user: MockUser) => {
    console.log('View user:', user);
    // TODO: Implement view functionality
    alert(`View user details: ${user.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={columns}
        title="Users"
        searchPlaceholder="Search users..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Users</div>
                <div className="text-2xl font-semibold text-gray-900">{users.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Active Users</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-red-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">S</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Suspended Users</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.status === 'suspended').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
