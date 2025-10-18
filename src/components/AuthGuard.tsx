"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import Loading from './ui/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showLoginModal?: boolean;
}

export default function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = '/vi/login',
  showLoginModal = true 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, tokenInfo } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated or token is expired
    if (!isAuthenticated || !tokenInfo?.isValid || tokenInfo?.isExpired) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, tokenInfo, showLoginModal, redirectTo, router]);

  const handleLoginSuccess = () => {
    setShowModal(false);
    // The useAuth hook will automatically update the auth state
  };

  const handleModalClose = () => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
    setShowModal(false);
  };

  // Show loading while checking auth status
  if (isLoading) {
    return fallback || <Loading />;
  }

  // If not authenticated, show login modal or fallback
  if (!isAuthenticated || !tokenInfo?.isValid || tokenInfo?.isExpired) {
    if (showLoginModal) {
      return (
        <>
          {fallback || (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="text-white text-xl mb-4">
                  Vui lòng đăng nhập để tiếp tục
                </div>
                <div className="text-gray-400">
                  Phiên đăng nhập của bạn đã hết hạn hoặc không hợp lệ
                </div>
              </div>
            </div>
          )}
          <LoginModal
            isOpen={showModal}
            onClose={handleModalClose}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      );
    }
    
    return fallback || null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
