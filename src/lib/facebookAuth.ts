import { authService } from "@/services";

export const FACEBOOK_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/facebook/callback`,
  scope: 'public_profile',
};

export interface FacebookUser {
  id: string;
  email?: string;
  name?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  first_name?: string;
  last_name?: string;
}

export interface FacebookAuthResponse {
  user: FacebookUser;
}

export const getFacebookAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: FACEBOOK_CONFIG.clientId,
    redirect_uri: FACEBOOK_CONFIG.redirectUri,
    response_type: 'code',
    scope: FACEBOOK_CONFIG.scope,
    state: 'facebook_auth_state',
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
};

export const handleFacebookCallback = async (code: string) => {
  try {
    const dataSignInFacebook = { code, redirectUri: FACEBOOK_CONFIG.redirectUri, platform: 'FACEBOOK', }
    const response = await authService.socialSignIn(dataSignInFacebook);
    return response;
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    throw error;
  }
};
