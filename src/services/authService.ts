import { BaseService } from './baseService';

type ApiResponse<T> = {
	state: boolean;
	data: T | null;
	message?: string;
  };

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterData {
	email: string;
	password: string;
	firstName: string;
}

export interface AuthResponse {
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
	accessToken: string;
	refreshToken: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: string;
	createdAt: string;
	updatedAt: string;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

export class AuthService extends BaseService {
	constructor() {
		super('/users/auth');
	}

	/**
	 * User login
	 */
	async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
		const response = await this.post<AuthResponse>('/signin', credentials);
		
		if (typeof window !== 'undefined') {
			localStorage.setItem('authToken', response.accessToken);
			localStorage.setItem('refreshToken', response.refreshToken);
			localStorage.setItem('user', JSON.stringify(response.user));
			
			window.dispatchEvent(new Event('authStateChanged'));
		}
		
		return {
			state: true,
			data: response,
		};
	}

	/**
	 * User registration
	 */
	async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
		try {
			const response = await this.post<AuthResponse>('/signup', data);
		
			if (typeof window !== 'undefined') {
				localStorage.setItem('authToken', response.accessToken);
				localStorage.setItem('refreshToken', response.refreshToken);
				localStorage.setItem('user', JSON.stringify(response.user));
				
				window.dispatchEvent(new Event('authStateChanged'));
			}
			
			return {
				state: true,
				data: response,
			};
		} catch (error: unknown) {
			return {
				state: false,
				data: null,
				message: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * User logout
	 */
	async logout(): Promise<void> {
		try {
			await this.post('/logout');
		} catch (error) {
			// Even if logout fails, clear local storage
			console.warn('Logout request fails, but clearing local storage' + error);
		} finally {
			// Clear local storage
			if (typeof window !== 'undefined') {
				localStorage.removeItem('authToken');
				localStorage.removeItem('refreshToken');
				localStorage.removeItem('user');
				
				// Dispatch custom event to notify Navigation component
				window.dispatchEvent(new Event('authStateChanged'));
			}
		}
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(): Promise<{ token: string }> {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await this.post<{ token: string }>('/refresh', { refreshToken });
		
		// Update stored token
		if (typeof window !== 'undefined') {
			localStorage.setItem('authToken', response.token);
			
			// Dispatch custom event to notify Navigation component
			window.dispatchEvent(new Event('authStateChanged'));
		}
		
		return response;
	}

	/**
	 * Get current user profile
	 */
	async getProfile(): Promise<User> {
		return this.get<User>('/profile');
	}

	/**
	 * Update user profile
	 */
	async updateProfile(data: Partial<User>): Promise<User> {
		return this.put<User>('/profile', data);
	}

	/**
	 * Change password
	 */
	async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
		return this.post('/change-password', data);
	}

	/**
	 * Request password reset
	 */
	async requestPasswordReset(email: string): Promise<void> {
		return this.post('/forgot-password', { email });
	}

	/**
	 * Reset password with token
	 */
	async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
		return this.post('/reset-password', data);
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		if (typeof window === 'undefined') return false;
		return !!localStorage.getItem('authToken');
	}

	/**
	 * Get current user from localStorage
	 */
	getCurrentUser(): User | null {
		if (typeof window === 'undefined') return null;
		
		const userStr = localStorage.getItem('user');
		if (!userStr) return null;
		
		try {
			return JSON.parse(userStr) as User;
		} catch {
			return null;
		}
	}

	/**
	 * Get auth token
	 */
	getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem('authToken');
	}

	/**
	 * Google Sign-In: send only googleId, backend issues app tokens
	 */
	async googleSignIn(data: GoogleSignInData): Promise<ApiResponse<AuthResponse>> {
		const response = await this.post<AuthResponse>('/google', data);

		if (typeof window !== 'undefined') {
			localStorage.setItem('authToken', response.accessToken);
			localStorage.setItem('refreshToken', response.refreshToken);
			localStorage.setItem('user', JSON.stringify(response.user));
			window.dispatchEvent(new Event('authStateChanged'));
		}

		return {
			state: true,
			data: response,
		};
	}
}

// Export singleton instance
export const authService = new AuthService(); 
export interface GoogleSignInData {
	code: string;
	redirectUri: string;
}

