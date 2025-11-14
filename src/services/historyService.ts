import { ApiResponse, PaginatedResponse } from '@/types/api';
import { BaseService } from './baseService';

export interface FileInfo {
	path?: string;
	name?: string;
	type?: string;
}

export interface AnalysisHistoryItem {
	id: string;
	createdTime: string;
	userId: string;
	file: FileInfo;
	result: {
		summary: Array<{
			name: string;
			value: string | number;
			unit: string;
			level: 'High' | 'Normal' | 'Low';
		}>;
		risks: Array<{
			name: string;
			value: string | number;
			unit: string;
			level: 'High' | 'Normal' | 'Low';
			explaination: string;
		}>;
		recommendations: string[];
	};
}

export interface AnalysisHistoryResponse {
	data: AnalysisHistoryItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class HistoryService extends BaseService {
	constructor() {
		super('/analysis-results');
	}

	/**
	 * Get all analysis history for the current user
	 */
	async getHistory(params?: {
		page?: number;
		limit?: number;
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
	}): Promise<PaginatedResponse<AnalysisHistoryItem>> {
		return this.getPaginated<AnalysisHistoryItem>('/history', { params });
	}

	/**
	 * Get a single analysis by ID
	 */
	async getAnalysisById(id: string): Promise<ApiResponse<AnalysisHistoryItem>> {
		return this.get<AnalysisHistoryItem>(`/${id}`);
	}

	/**
	 * Delete an analysis
	 */
	async deleteAnalysis(id: string): Promise<void> {
		return this.delete<void>(`/${id}`);
	}
}

export const historyService = new HistoryService();

