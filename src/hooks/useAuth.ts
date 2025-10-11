import { clearAuthData, getValidatedToken, TokenInfo } from '@/lib/tokenUtils';
import { authService } from '@/services/authService';
import { useCallback, useEffect, useState } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenInfo: TokenInfo | null;
  user: Record<string, unknown> | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    tokenInfo: null,
    user: null,
  });

  const checkAuthStatus = useCallback(() => {
    if (typeof window === 'undefined') {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        tokenInfo: null,
        user: null,
      });
      return;
    }

    const tokenInfo = getValidatedToken();
    const userStr = localStorage.getItem('user');
    let user = null;

    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    setAuthState({
      isAuthenticated: tokenInfo.isValid && !tokenInfo.isExpired,
      isLoading: false,
      tokenInfo,
      user,
    });

    // If token is invalid/expired, clear auth data
    if (!tokenInfo.isValid || tokenInfo.isExpired) {
      clearAuthData();
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      checkAuthStatus();
    }
  }, [checkAuthStatus]);

  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      checkAuthStatus();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      checkAuthStatus();
      return false;
    }
  }, [checkAuthStatus]);

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [checkAuthStatus]);

  return {
    ...authState,
    logout,
    refreshToken,
    checkAuthStatus,
  };
}
