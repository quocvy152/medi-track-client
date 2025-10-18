# Admin Dashboard Implementation

This document describes the implementation of the Admin Dashboard for the MediTrack application.

## 🏗️ File Structure

```
src/
├── app/admin/                 # Admin route group (independent from locale)
│   ├── layout.tsx            # Admin layout wrapper with role-based access control
│   ├── page.tsx              # Main dashboard overview page
│   ├── users/
│   │   └── page.tsx          # User management page
│   └── posts/
│       └── page.tsx          # Post management page
├── components/admin/
│   ├── AdminRootLayout.tsx    # Main admin layout component
│   ├── AdminAuthGuard.tsx    # Authentication guard component
│   ├── AdminSidebar.tsx      # Sidebar navigation component
│   ├── AdminHeader.tsx       # Top header component
│   └── DataTable.tsx         # Reusable data table component
└── data/
    └── mockData.ts           # Mock data for users and posts
```

## 🔐 Authentication & Authorization

### Role-Based Access Control

The admin dashboard implements strict role-based access control:

1. **Authentication Check**: Users must be logged in to access admin routes
2. **Role Verification**: Only users with `role: 'ADMIN'` can access admin pages
3. **Automatic Redirects**: 
   - Non-authenticated users → `/vi/login`
   - Non-admin users → `/vi` (home page)

### Implementation Details

The access control is implemented in `/src/components/admin/AdminAuthGuard.tsx`:

```typescript
// Check if user is authenticated
if (!isAuthenticated) {
  router.push('/vi/login');
  return;
}

// Check if user has ADMIN role
if (user && user.role !== 'ADMIN') {
  router.push('/vi');
  return;
}
```

## 🎨 UI Components

### AdminLayout
- Responsive layout with sidebar and main content area
- Mobile-friendly with collapsible sidebar
- Clean, modern design using TailwindCSS

### AdminSidebar
- Navigation menu with Dashboard, Users, Posts
- Active state highlighting
- Mobile overlay support
- Brand logo and admin panel title

### AdminHeader
- Mobile menu button
- User information display
- Logout functionality
- Responsive design

### DataTable
- Reusable table component
- Search functionality
- Column sorting
- Action buttons (View, Edit, Delete)
- Responsive design
- Custom cell rendering support

## 📊 Dashboard Features

### Main Dashboard (`/admin`)
- **Statistics Cards**: Total users, active users, total posts, published posts
- **Recent Activity**: Latest users and posts
- **Quick Actions**: Direct links to management sections
- **Visual Indicators**: Color-coded status badges

### User Management (`/admin/users`)
- **User Table**: Name, email, role, status, posts count, join date, last login
- **Role Badges**: Color-coded role indicators (ADMIN, USER, MODERATOR)
- **Status Badges**: Active, inactive, suspended status
- **Actions**: View, edit, delete user accounts
- **Statistics**: Total, active, and suspended user counts

### Post Management (`/admin/posts`)
- **Post Table**: Title, author, category, status, views, likes, creation date
- **Status Badges**: Published, draft, archived status
- **Category Tags**: Visual category indicators
- **Actions**: View, edit, delete posts
- **Statistics**: Total posts, published, drafts, total views
- **Category Distribution**: Posts grouped by category

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Responsive table layouts
- Touch-friendly interface

### Search & Filter
- Real-time search across all table data
- Column-based sorting
- Status and role filtering

### Data Management
- Mock data for demonstration
- Easy integration with real APIs
- State management for CRUD operations

### User Experience
- Loading states
- Confirmation dialogs for destructive actions
- Toast notifications (integrated with existing system)
- Consistent navigation patterns

## 🔧 Integration Guide

### Adding New Admin Pages

1. Create a new page in `/src/app/[locale]/admin/[page-name]/page.tsx`
2. Add navigation item to `AdminSidebar.tsx`
3. Implement page-specific components as needed

### Connecting to Real APIs

Replace mock data in `/src/data/mockData.ts` with actual API calls:

```typescript
// Example API integration
const fetchUsers = async () => {
  const response = await fetch('/api/admin/users');
  return response.json();
};
```

### Customizing the Design

The dashboard uses TailwindCSS classes. Key customization points:

- **Colors**: Modify color schemes in component files
- **Layout**: Adjust spacing and sizing in `AdminLayout.tsx`
- **Typography**: Update font sizes and weights throughout components

## 🚀 Usage

1. **Access**: Navigate to `/admin`
2. **Authentication**: Must be logged in with ADMIN role
3. **Navigation**: Use sidebar to switch between sections
4. **Management**: Use table actions to manage users and posts

## 🔒 Security Considerations

- Role-based access control at layout level
- Client-side validation (should be backed by server-side validation)
- Secure logout functionality
- No sensitive data exposure in client-side code

## 📱 Mobile Support

- Responsive sidebar with mobile overlay
- Touch-friendly buttons and interactions
- Optimized table layouts for small screens
- Mobile menu for navigation

## 🎨 Design System

The admin dashboard follows a consistent design system:

- **Primary Color**: Blue (#3B82F6)
- **Success Color**: Green (#10B981)
- **Warning Color**: Yellow (#F59E0B)
- **Error Color**: Red (#EF4444)
- **Neutral Colors**: Gray scale for text and backgrounds
- **Typography**: Inter font family
- **Spacing**: Consistent padding and margins using TailwindCSS
- **Shadows**: Subtle shadows for depth and hierarchy

This implementation provides a solid foundation for admin functionality while maintaining clean, maintainable code and excellent user experience.
