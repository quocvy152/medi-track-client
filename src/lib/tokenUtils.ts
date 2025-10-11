/**
 * Utility functions for token validation and management
 */

export interface TokenInfo {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  timeUntilExpiry?: number; // in milliseconds
}

/**
 * Decode JWT token payload (without verification)
 * Note: This is for client-side validation only, server should verify signature
 */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if a token is valid and not expired
 */
export function validateToken(token: string | null): TokenInfo {
  if (!token) {
    return {
      isValid: false,
      isExpired: true,
    };
  }

  try {
    const payload = decodeJWT(token);
    
    if (!payload) {
      return {
        isValid: false,
        isExpired: true,
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp;

    if (!exp || typeof exp !== 'number') {
      // Token doesn't have expiration, consider it invalid for security
      return {
        isValid: false,
        isExpired: true,
      };
    }

    const isExpired = now >= exp;
    const expiresAt = new Date(exp * 1000);
    const timeUntilExpiry = exp * 1000 - Date.now();

    return {
      isValid: !isExpired,
      isExpired,
      expiresAt,
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
    };
  } catch (error) {
    console.error('Error validating token:', error);
    return {
      isValid: false,
      isExpired: true,
    };
  }
}

/**
 * Get token from localStorage and validate it
 */
export function getValidatedToken(): TokenInfo {
  if (typeof window === 'undefined') {
    return {
      isValid: false,
      isExpired: true,
    };
  }

  const token = localStorage.getItem('authToken');
  return validateToken(token);
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Dispatch event to notify components
  window.dispatchEvent(new Event('authStateChanged'));
}

/**
 * Check if user should be redirected to login
 * Returns true if token is invalid/expired
 */
export function shouldRedirectToLogin(): boolean {
  const tokenInfo = getValidatedToken();
  return !tokenInfo.isValid || tokenInfo.isExpired;
}
