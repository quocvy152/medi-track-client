export const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback`,
  scope: 'openid email profile',
};

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleAuthResponse {
  user: GoogleUser;
  accessToken: string;
  idToken: string;
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

export const handleGoogleCallback = async (code: string): Promise<GoogleAuthResponse> => {
  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CONFIG.clientId,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_CONFIG.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();
    const { access_token, id_token } = tokens;

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const user = await userResponse.json();

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        given_name: user.given_name,
        family_name: user.family_name,
      },
      accessToken: access_token,
      idToken: id_token,
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};
