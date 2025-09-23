import { config } from "@/lib/config";
import axios, {
	AxiosError,
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	InternalAxiosRequestConfig
} from "axios";

// Types for API responses
export interface ApiResponse<T = unknown> {
	data: T;
	message?: string;
	success: boolean;
}

export interface ApiError {
	message: string;
	status: number;
	code?: string;
}

// Request interceptor
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
	// Add auth token if available
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	
	// Add timestamp for caching
	config.headers['X-Request-Time'] = Date.now().toString();
	
	return config;
};

// Response interceptor
const responseInterceptor = (response: AxiosResponse) => {
	// You can transform the response here if needed
	return response;
};

// Error interceptor
const errorInterceptor = (error: AxiosError): Promise<never> => {
	if (error.response) {
		// Server responded with error status
		const { status, data } = error.response;
		
		switch (status) {
			case 401:
				// Unauthorized - redirect to login
				if (typeof window !== 'undefined') {
					localStorage.removeItem('authToken');
					
					// Dispatch custom event to notify Navigation component
					window.dispatchEvent(new Event('authStateChanged'));
					
					window.location.href = '/login';
				}
				break;
			case 403:
				// Forbidden
				console.error('Access forbidden');
				break;
			case 404:
				// Not found
				console.error('Resource not found');
				break;
			case 500:
				// Internal server error
				console.error('Internal server error');
				break;
			default:
				console.error(`HTTP Error: ${status}`);
		}
		
		// Create standardized error object
		const apiError: ApiError = {
			message: (data as Record<string, unknown>)?.message as string || error.message || 'An error occurred',
			status: status,
			code: (data as Record<string, unknown>)?.code as string
		};
		
		return Promise.reject(apiError);
	} else if (error.request) {
		// Request was made but no response received
		const networkError: ApiError = {
			message: 'Network error - no response received',
			status: 0
		};
		return Promise.reject(networkError);
	} else {
		// Something else happened
		const unknownError: ApiError = {
			message: error.message || 'An unknown error occurred',
			status: 0
		};
		return Promise.reject(unknownError);
	}
};

export function createApiClient(): AxiosInstance {
	const instance = axios.create({
		baseURL: config.apiBaseUrl,
		timeout: 25000, // 25 seconds
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		},
	});

	// Add interceptors
	instance.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error));
	instance.interceptors.response.use(responseInterceptor, errorInterceptor);

	return instance;
}

// Create and export the main API client instance
export const apiClient = createApiClient();

// Helper functions for common HTTP methods
export const api = {
	get: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
		apiClient.get<ApiResponse<T>>(url, config).then(res => res.data),
	
	post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
		apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data),
	
	put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
		apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data),
	
	patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
		apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data),
	
	delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => 
		apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data),
}; 