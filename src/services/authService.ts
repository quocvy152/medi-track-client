import type { ApiResponse } from '@/types/api';
import { BaseService } from './baseService';

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

		const { accessToken, refreshToken, user } = response.data;
		
		if (typeof window !== 'undefined') {
			localStorage.setItem('authToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('user', JSON.stringify(user));
			
			window.dispatchEvent(new Event('authStateChanged'));
		}
		
		return response;
	}

	/**
	 * User registration
	 */
	async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
		try {
			const response = await this.post<AuthResponse>('/signup', data);

			const { accessToken, refreshToken, user } = response.data;
		
			if (typeof window !== 'undefined') {
				localStorage.setItem('authToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('user', JSON.stringify(user));
				
				window.dispatchEvent(new Event('authStateChanged'));
			}
			
			return response;
		} catch (error: unknown) {
			return {
				success: false,
				data: null as unknown as AuthResponse,
				message: error instanceof Error ? error.message : String(error),
			};
		}
	}

	/**
	 * User logout - clears all authentication data from localStorage
	 * No API call needed as per requirements
	 * @param silent - If true, don't dispatch authStateChanged event (prevents infinite loops)
	 */
	async logout(silent = false): Promise<void> {
		// Clear local storage immediately
		if (typeof window !== 'undefined') {
			localStorage.removeItem('authToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');
			
			// Only dispatch event if not silent (to prevent infinite loops during logout)
			if (!silent) {
				window.dispatchEvent(new Event('authStateChanged'));
			}
		}
		
		// Return a resolved promise to allow smooth async handling
		return Promise.resolve();
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(): Promise<ApiResponse<{ token: string }>> {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await this.post<{ token: string }>('/refresh', { refreshToken });
		
		const { token } = response.data;
		
		// Update stored token
		if (typeof window !== 'undefined') {
			localStorage.setItem('authToken', token);
			
			// Dispatch custom event to notify Navigation component
			window.dispatchEvent(new Event('authStateChanged'));
		}
		
		return response;
	}

	/**
	 * Get current user profile
	 */
	async getProfile(): Promise<User> {
		const response = await this.get<User>('/profile');
		return response.data;
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
	async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> {
		return this.post('/change-password', data);
	}

	/**
	 * Request password reset
	 */
	async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
		return this.post('/forgot-password', { email });
	}

	/**
	 * Reset password with token
	 */
	async resetPassword(data: { token: string; newPassword: string }): Promise<ApiResponse<void>> {
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
	 * OR
	 * Facebook Sign-In: send only code and redirectUri, backend issues app tokens
	 */
	async socialSignIn(data: GoogleSignInData): Promise<ApiResponse<AuthResponse>> {
		const response = await this.post<AuthResponse>('/social', data);

		const { accessToken, refreshToken, user } = response.data;

		if (typeof window !== 'undefined') {
			localStorage.setItem('authToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('user', JSON.stringify(user));
			window.dispatchEvent(new Event('authStateChanged'));
		}

		return response;
	}
}

// Export singleton instance
export const authService = new AuthService(); 
export interface FacebookSignInData {
	code: string;
	redirectUri: string;
	platform: string;
}

export interface GoogleSignInData {
	code: string;
	redirectUri: string;
	platform: string;
}

