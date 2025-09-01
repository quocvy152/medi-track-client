// Common API types
export interface PaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ApiError {
	message: string;
	status: number;
	code?: string;
	details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
	data: T;
	message?: string;
	success: boolean;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface RequestConfig {
	headers?: Record<string, string>;
	params?: Record<string, unknown>;
	timeout?: number;
	cancelToken?: AbortSignal;
}

// API Endpoint configuration
export interface ApiEndpoint {
	url: string;
	method: HttpMethod;
	requiresAuth?: boolean;
	timeout?: number;
}

// Common response statuses
export enum ApiStatus {
	SUCCESS = 'success',
	ERROR = 'error',
	LOADING = 'loading',
	IDLE = 'idle'
}

// API State for React hooks
export interface ApiState<T> {
	data: T | null;
	error: ApiError | null;
	status: ApiStatus;
	isLoading: boolean;
} 