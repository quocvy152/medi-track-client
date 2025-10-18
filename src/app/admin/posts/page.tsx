"use client";

import DataTable from '@/components/admin/DataTable';
import { MockPost, mockPosts } from '@/data/mockData';
import { useState } from 'react';

/**
 * Posts Management Page
 * 
 * Displays a table of all posts with search, sort, and action capabilities
 */
export default function PostsManagement() {
  const [posts, setPosts] = useState<MockPost[]>(mockPosts);

  // Define table columns
  const columns = [
    {
      key: 'title' as keyof MockPost,
      label: 'Title',
      sortable: true,
      render: (value: string, post: MockPost) => (
        <div className="max-w-xs">
          <div className="text-sm font-medium text-gray-900 truncate">
            {value}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {post.content.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      key: 'author' as keyof MockPost,
      label: 'Author',
      sortable: true,
    },
    {
      key: 'category' as keyof MockPost,
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {value}
        </span>
      ),
    },
    {
      key: 'status' as keyof MockPost,
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'published' 
            ? 'bg-green-100 text-green-800'
            : value === 'draft'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'views' as keyof MockPost,
      label: 'Views',
      sortable: true,
    },
    {
      key: 'likes' as keyof MockPost,
      label: 'Likes',
      sortable: true,
    },
    {
      key: 'createdAt' as keyof MockPost,
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEdit = (post: MockPost) => {
    console.log('Edit post:', post);
    // TODO: Implement edit functionality
    alert(`Edit post: ${post.title}`);
  };

  const handleDelete = (post: MockPost) => {
    if (confirm(`Are you sure you want to delete post "${post.title}"?`)) {
      setPosts(posts.filter(p => p.id !== post.id));
      // TODO: Implement API call to delete post
    }
  };

  const handleView = (post: MockPost) => {
    console.log('View post:', post);
    // TODO: Implement view functionality
    alert(`View post: ${post.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage posts, content, and publishing status.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Create New Post
        </button>
      </div>

      {/* Posts Table */}
      <DataTable
        data={posts}
        columns={columns}
        title="Posts"
        searchPlaceholder="Search posts..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Posts</div>
                <div className="text-2xl font-semibold text-gray-900">{posts.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">P</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Published</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'published').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">D</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Drafts</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'draft').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">V</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Views</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {posts.reduce((sum, post) => sum + post.views, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Posts by Category</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from(new Set(posts.map(p => p.category))).map((category) => (
              <div key={category} className="text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.category === category).length}
                </div>
                <div className="text-sm text-gray-500">{category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
