/**
 * Mock data for admin dashboard
 * 
 * This file contains sample data for users and posts
 * In a real application, this would come from API calls
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  postsCount: number;
}

export interface MockPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

// Mock users data
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:22:00Z',
    postsCount: 12,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'USER',
    status: 'active',
    createdAt: '2024-01-16T09:15:00Z',
    lastLogin: '2024-01-20T11:45:00Z',
    postsCount: 8,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'MODERATOR',
    status: 'active',
    createdAt: '2024-01-17T16:20:00Z',
    lastLogin: '2024-01-19T13:30:00Z',
    postsCount: 15,
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'USER',
    status: 'inactive',
    createdAt: '2024-01-18T12:00:00Z',
    lastLogin: '2024-01-18T12:00:00Z',
    postsCount: 3,
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'USER',
    status: 'suspended',
    createdAt: '2024-01-19T08:45:00Z',
    lastLogin: '2024-01-19T08:45:00Z',
    postsCount: 0,
  },
  {
    id: '6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'USER',
    status: 'active',
    createdAt: '2024-01-20T14:10:00Z',
    lastLogin: '2024-01-20T14:10:00Z',
    postsCount: 5,
  },
];

// Mock posts data
export const mockPosts: MockPost[] = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    content: 'A comprehensive guide to React hooks and their usage patterns...',
    author: 'John Doe',
    authorEmail: 'john.doe@example.com',
    status: 'published',
    category: 'React',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 1250,
    likes: 45,
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    content: 'Essential TypeScript patterns and best practices for modern development...',
    author: 'Jane Smith',
    authorEmail: 'jane.smith@example.com',
    status: 'published',
    category: 'TypeScript',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    views: 890,
    likes: 32,
  },
  {
    id: '3',
    title: 'Next.js App Router Guide',
    content: 'Complete guide to Next.js App Router and its new features...',
    author: 'Mike Johnson',
    authorEmail: 'mike.johnson@example.com',
    status: 'draft',
    category: 'Next.js',
    createdAt: '2024-01-17T16:20:00Z',
    updatedAt: '2024-01-19T13:30:00Z',
    views: 0,
    likes: 0,
  },
  {
    id: '4',
    title: 'CSS Grid Layout Tutorial',
    content: 'Master CSS Grid with practical examples and use cases...',
    author: 'Sarah Wilson',
    authorEmail: 'sarah.wilson@example.com',
    status: 'published',
    category: 'CSS',
    createdAt: '2024-01-18T12:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    views: 567,
    likes: 18,
  },
  {
    id: '5',
    title: 'JavaScript Async Patterns',
    content: 'Understanding async/await, Promises, and modern JavaScript patterns...',
    author: 'Emily Davis',
    authorEmail: 'emily.davis@example.com',
    status: 'published',
    category: 'JavaScript',
    createdAt: '2024-01-20T14:10:00Z',
    updatedAt: '2024-01-20T14:10:00Z',
    views: 423,
    likes: 25,
  },
  {
    id: '6',
    title: 'Tailwind CSS Tips and Tricks',
    content: 'Advanced Tailwind CSS techniques for better styling...',
    author: 'John Doe',
    authorEmail: 'john.doe@example.com',
    status: 'archived',
    category: 'CSS',
    createdAt: '2024-01-14T08:30:00Z',
    updatedAt: '2024-01-19T10:15:00Z',
    views: 234,
    likes: 12,
  },
];
