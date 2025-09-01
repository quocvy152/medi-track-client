import type { ApiError, ApiState } from '@/types/api';
import { ApiStatus } from '@/types/api';
import { useCallback, useRef, useState } from 'react';

export interface UseApiOptions<T> {
	onSuccess?: (data: T) => void;
	onError?: (error: ApiError) => void;
	onSettled?: () => void;
	initialData?: T;
}

export function useApi<T = unknown>(
	apiCall: (...args: unknown[]) => Promise<T>,
	options: UseApiOptions<T> = {}
) {
	const [state, setState] = useState<ApiState<T>>({
		data: options.initialData || null,
		error: null,
		status: ApiStatus.IDLE,
		isLoading: false,
	});

	const abortControllerRef = useRef<AbortController | null>(null);

	const execute = useCallback(
		async (...args: unknown[]) => {
			// Cancel previous request if it exists
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create new abort controller
			abortControllerRef.current = new AbortController();

			setState(prev => ({
				...prev,
				status: ApiStatus.LOADING,
				isLoading: true,
				error: null,
			}));

			try {
				const data = await apiCall(...args);
				
				setState({
					data,
					error: null,
					status: ApiStatus.SUCCESS,
					isLoading: false,
				});

				options.onSuccess?.(data);
				return data;
			} catch (error) {
				// Don't update state if request was aborted
				if (abortControllerRef.current?.signal.aborted) {
					return;
				}

				const apiError: ApiError = {
					message: error instanceof Error ? error.message : 'An error occurred',
					status: 0,
					code: 'UNKNOWN_ERROR'
				};

				setState(prev => ({
					...prev,
					error: apiError,
					status: ApiStatus.ERROR,
					isLoading: false,
				}));

				options.onError?.(apiError);
				throw apiError;
			} finally {
				options.onSettled?.();
			}
		},
		[apiCall, options]
	);

	const reset = useCallback(() => {
		setState({
			data: options.initialData || null,
			error: null,
			status: ApiStatus.IDLE,
			isLoading: false,
		});
	}, [options.initialData]);

	const cancel = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
		}
	}, []);

	return {
		...state,
		execute,
		reset,
		cancel,
	};
}

// Specialized hooks for common HTTP methods
export function useGet<T = unknown>(
	apiCall: (...args: unknown[]) => Promise<T>,
	options: UseApiOptions<T> = {}
) {
	return useApi(apiCall, options);
}

export function usePost<T = unknown>(
	apiCall: (...args: unknown[]) => Promise<T>,
	options: UseApiOptions<T> = {}
) {
	return useApi(apiCall, options);
}

export function usePut<T = unknown>(
	apiCall: (...args: unknown[]) => Promise<T>,
	options: UseApiOptions<T> = {}
) {
	return useApi(apiCall, options);
}

export function useDelete<T = unknown>(
	apiCall: (...args: unknown[]) => Promise<T>,
	options: UseApiOptions<T> = {}
) {
	return useApi(apiCall, options);
}

// Hook for file uploads with progress
export function useFileUpload<T = unknown>(
	uploadCall: (file: File, onProgress?: (progress: number) => void) => Promise<T>,
	options: UseApiOptions<T> & {
		onProgress?: (progress: number) => void;
	} = {}
) {
	const [uploadProgress, setUploadProgress] = useState(0);

	const execute = useCallback(
		async (file: File) => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			abortControllerRef.current = new AbortController();

			setState(prev => ({
				...prev,
				status: ApiStatus.LOADING,
				isLoading: true,
				error: null,
			}));

			setUploadProgress(0);

			try {
				const data = await uploadCall(file, (progress) => {
					setUploadProgress(progress);
					options.onProgress?.(progress);
				});

				setState({
					data,
					error: null,
					status: ApiStatus.SUCCESS,
					isLoading: false,
				});

				options.onSuccess?.(data);
				return data;
			} catch (error) {
				if (abortControllerRef.current?.signal.aborted) {
					return;
				}

				const apiError: ApiError = {
					message: error instanceof Error ? error.message : 'Upload failed',
					status: 0,
					code: 'UPLOAD_ERROR'
				};

				setState(prev => ({
					...prev,
					error: apiError,
					status: ApiStatus.ERROR,
					isLoading: false,
				}));

				options.onError?.(apiError);
				throw apiError;
			} finally {
				options.onSettled?.();
			}
		},
		[uploadCall, options]
	);

	const [state, setState] = useState<ApiState<T>>({
		data: options.initialData || null,
		error: null,
		status: ApiStatus.IDLE,
		isLoading: false,
	});

	const abortControllerRef = useRef<AbortController | null>(null);

	const reset = useCallback(() => {
		setState({
			data: options.initialData || null,
			error: null,
			status: ApiStatus.IDLE,
			isLoading: false,
		});
		setUploadProgress(0);
	}, [options.initialData]);

	const cancel = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
			abortControllerRef.current = null;
		}
	}, []);

	return {
		...state,
		uploadProgress,
		execute,
		reset,
		cancel,
	};
} 