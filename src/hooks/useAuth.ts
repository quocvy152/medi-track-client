import { clearAuthData, getValidatedToken, TokenInfo } from '@/lib/tokenUtils';
import { authService } from '@/services/authService';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  tokenInfo: TokenInfo | null;
  user: Record<string, unknown> | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    isLoggingOut: false,
    tokenInfo: null,
    user: null,
  });
  const isCheckingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  const checkAuthStatus = useCallback(() => {
    // Prevent infinite loop - if already checking, skip
    if (isCheckingRef.current) {
      return;
    }

    if (typeof window === 'undefined') {
      setAuthState(prev => ({
        isAuthenticated: false,
        isLoading: false,
        isLoggingOut: prev.isLoggingOut,
        tokenInfo: null,
        user: null,
      }));
      return;
    }

    isCheckingRef.current = true;

    try {
      const token = localStorage.getItem('authToken');
      const tokenInfo = getValidatedToken();
      const userStr = localStorage.getItem('user');
      let user = null;

      try {
        user = userStr ? JSON.parse(userStr) : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }

      // Update last token reference
      lastTokenRef.current = token;

      setAuthState(prev => ({
        isAuthenticated: tokenInfo.isValid && !tokenInfo.isExpired,
        isLoading: false,
        isLoggingOut: prev.isLoggingOut,
        tokenInfo,
        user,
      }));

      // Only clear auth data if token is invalid AND we haven't already cleared it
      // This prevents infinite loop
      if ((!tokenInfo.isValid || tokenInfo.isExpired) && token !== null) {
        // Token exists but is invalid - clear it (but don't dispatch event to avoid loop)
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        lastTokenRef.current = null;
      }
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  const logout = useCallback(async () => {
    // Prevent multiple simultaneous logout calls
    if (authState.isLoggingOut) {
      return;
    }

    // Set logging out state
    setAuthState(prev => ({ ...prev, isLoggingOut: true }));
    
    try {
      // Clear auth data first (without dispatching event to avoid loop)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        lastTokenRef.current = null;
      }

      // Call authService logout silently to prevent event loop
      await authService.logout(true);
      
      // Small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure data is cleared even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        lastTokenRef.current = null;
      }
    } finally {
      // Update state directly without triggering checkAuthStatus to avoid loop
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        isLoggingOut: false,
        tokenInfo: {
          isValid: false,
          isExpired: true,
        },
        user: null,
      });
    }
  }, [authState.isLoggingOut]);

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

    // Listen for auth state changes with debounce to prevent infinite loops
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleAuthChange = () => {
      // Debounce to prevent rapid-fire calls
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        if (!isCheckingRef.current) {
          checkAuthStatus();
        }
      }, 100);
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [checkAuthStatus]);

  return {
    ...authState,
    logout,
    refreshToken,
    checkAuthStatus,
  };
}
