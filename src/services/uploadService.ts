import { apiClient } from './apiClient';
import { BaseService } from './baseService';

export interface UploadProgress {
	loaded: number;
	total: number;
	percentage: number;
}

export interface FileUploadResponse {
	id: string;
	filename: string;
	originalName: string;
	size: number;
	mimeType: string;
	url: string;
	uploadedAt: string;
}

export interface FileAnalysisResult {
	id: string;
	fileId: string;
	status: 'pending' | 'processing' | 'completed' | 'failed';
	result?: {
		summary: string;
		details: Record<string, unknown>;
		confidence: number;
	};
	error?: string;
	createdAt: string;
	updatedAt: string;
}

export interface UploadOptions {
	onProgress?: (progress: UploadProgress) => void;
	onSuccess?: (response: FileUploadResponse) => void;
	onError?: (error: Error) => void;
}

export class UploadService extends BaseService {
	constructor() {
		super('/upload');
	}

	/**
	 * Upload a single file
	 */
	async uploadSingleFile(
		file: File, 
		options?: UploadOptions
	): Promise<FileUploadResponse> {
		try {
			const response = await this.uploadFile<FileUploadResponse>(
				'', 
				file, 
				(progress: number) => {
					options?.onProgress?.({
						loaded: progress,
						total: 100,
						percentage: progress
					});
				}
			);
			
			options?.onSuccess?.(response);
			return response;
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error('Upload failed');
			options?.onError?.(errorObj);
			throw errorObj;
		}
	}

	/**
	 * Upload multiple files
	 */
	async uploadMultipleFiles(
		files: File[], 
		options?: UploadOptions
	): Promise<FileUploadResponse[]> {
		const uploadPromises = files.map(file => 
			this.uploadSingleFile(file, options)
		);
		
		return Promise.all(uploadPromises);
	}

	/**
	 * Get upload history
	 */
	async getUploadHistory(params?: {
		page?: number;
		limit?: number;
		status?: string;
	}): Promise<{
		uploads: FileUploadResponse[];
		total: number;
		page: number;
		limit: number;
	}> {
		return this.get('', { params });
	}

	/**
	 * Get file details by ID
	 */
	async getFileDetails(fileId: string): Promise<FileUploadResponse> {
		return this.get(`/${fileId}`);
	}

	/**
	 * Delete uploaded file
	 */
	async deleteFile(fileId: string): Promise<void> {
		return this.delete(`/${fileId}`);
	}

	/**
	 * Get file analysis results
	 */
	async getAnalysisResults(fileId: string): Promise<FileAnalysisResult[]> {
		return this.get(`/${fileId}/analysis`);
	}

	/**
	 * Request file analysis
	 */
	async requestAnalysis(fileId: string): Promise<FileAnalysisResult> {
		return this.post(`/${fileId}/analyze`);
	}

	/**
	 * Get analysis result by ID
	 */
	async getAnalysisResult(analysisId: string): Promise<FileAnalysisResult> {
		return this.get(`/analysis/${analysisId}`);
	}

	/**
	 * Download file
	 */
	async downloadFile(fileId: string): Promise<Blob> {
		try {
			const response = await apiClient.get(`/upload/${fileId}/download`, {
				responseType: 'blob'
			});
			return response.data;
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Get file preview URL
	 */
	getFilePreviewUrl(fileId: string): string {
		return `${this.baseUrl}/${fileId}/preview`;
	}

	/**
	 * Validate file before upload
	 */
	validateFile(file: File): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];
		const maxSize = 100 * 1024 * 1024; // 100MB
		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'application/pdf',
			'text/plain',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		];

		if (file.size > maxSize) {
			errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
		}

		if (!allowedTypes.includes(file.type)) {
			errors.push('File type not supported');
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}
}

// Export singleton instance
export const uploadService = new UploadService(); 