import type {
    ApiError,
    ApiResponse,
    PaginatedResponse,
    PaginationParams,
    RequestConfig
} from '@/types/api';
import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './apiClient';

export abstract class BaseService {
	protected baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	/**
	 * Build full URL with query parameters
	 */
	protected buildUrl(endpoint: string, params?: Record<string, unknown>): string {
		const url = `${this.baseUrl}${endpoint}`;
		
		if (!params || Object.keys(params).length === 0) {
			return url;
		}

		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});

		return `${url}?${searchParams.toString()}`;
	}

	/**
	 * Convert RequestConfig to AxiosRequestConfig
	 */
	protected convertConfig(config?: RequestConfig): AxiosRequestConfig {
		if (!config) return {};
		
		const axiosConfig: AxiosRequestConfig = {
			headers: config.headers,
			timeout: config.timeout,
		};

		// Handle params separately since they're built into the URL
		if (config.params) {
			// Params are already handled in buildUrl
		}

		return axiosConfig;
	}

	/**
	 * Handle API errors consistently
	 */
	protected handleError(error: unknown): never {
		if (this.isApiError(error)) {
			throw error;
		}
		
		// Convert unknown errors to ApiError
		const apiError: ApiError = {
			message: error instanceof Error ? error.message : 'An unknown error occurred',
			status: 0,
			code: 'UNKNOWN_ERROR'
		};
		
		throw apiError;
	}

	/**
	 * Type guard for ApiError
	 */
	protected isApiError(error: unknown): error is ApiError {
		return (
			typeof error === 'object' &&
			error !== null &&
			'message' in error &&
			'status' in error
		);
	}

	/**
	 * Generic GET request
	 */
	protected async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		try {
			const url = this.buildUrl(endpoint, config?.params);
			const axiosConfig = this.convertConfig(config);
			const response = await apiClient.get<ApiResponse<T>>(url, axiosConfig);
			return response.data.data;
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Generic POST request
	 */
	protected async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
		try {
			const url = this.buildUrl(endpoint, config?.params);
			const axiosConfig = this.convertConfig(config);
			const response = await apiClient.post<ApiResponse<T>>(url, data, axiosConfig);
			return response.data.data;
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Generic PUT request
	 */
	protected async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
		try {
			const url = this.buildUrl(endpoint, config?.params);
			const axiosConfig = this.convertConfig(config);
			const response = await apiClient.put<ApiResponse<T>>(url, data, axiosConfig);
			return response.data.data;
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Generic PATCH request
	 */
	protected async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
		try {
			const url = this.buildUrl(endpoint, config?.params);
			const axiosConfig = this.convertConfig(config);
			const response = await apiClient.patch<ApiResponse<T>>(url, data, axiosConfig);
			return response.data.data;
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Generic DELETE request
	 */
	protected async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		try {
			const url = this.buildUrl(endpoint, config?.params);
			const axiosConfig = this.convertConfig(config);
			const response = await apiClient.delete<ApiResponse<T>>(url, axiosConfig);
			return response.data.data;
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Get paginated data
	 */
	protected async getPaginated<T>(
		endpoint: string, 
		params?: PaginationParams & Record<string, unknown>
	): Promise<PaginatedResponse<T>> {
		return this.get<PaginatedResponse<T>>(endpoint, { params });
	}

	/**
	 * Upload file with progress tracking
	 */
	protected async uploadFile<T>(
		endpoint: string, 
		file: File, 
		onProgress?: (progress: number) => void
	): Promise<T> {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await apiClient.post<ApiResponse<T>>(
				this.buildUrl(endpoint),
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					onUploadProgress: (progressEvent) => {
						if (onProgress && progressEvent.total) {
							const progress = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							onProgress(progress);
						}
					},
				}
			);

			return response.data.data;
		} catch (error) {
			this.handleError(error);
		}
	}
} 