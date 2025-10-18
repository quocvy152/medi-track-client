"use client";

import Loading from '@/components/ui/Loading';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AdminAuthGuardProps {
  children: ReactNode;
}

/**
 * AdminAuthGuard Component
 * 
 * Provides authentication and authorization for admin pages:
 * - Role-based access control (only ADMIN users can access)
 * - Automatic redirect for non-admin users
 * - Loading state while checking auth status
 */
export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

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
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  // If not authenticated or not admin, don't render anything (redirect will happen)
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
