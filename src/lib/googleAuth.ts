import { authService } from "@/services";

export const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback`,
  scope: 'openid email profile',
};

const MEDITRACK_URL = process.env.MEDITRACK_URL || 'http://localhost:3000';

export interface GoogleUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleAuthResponse {
  user: GoogleUser;
}

export const getGoogleAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CONFIG.scope,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const handleGoogleCallback = async (code: string) => {
  try {
    const dataSignInGoogle = { code, redirectUri: MEDITRACK_URL + '/auth/google/callback' }
    const response = await authService.googleSignIn(dataSignInGoogle);
    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};
