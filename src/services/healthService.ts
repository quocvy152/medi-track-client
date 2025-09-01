import { BaseService } from './baseService';

export interface HealthStatus {
	status: string;
	timestamp?: string;
	version?: string;
}

export class HealthService extends BaseService {
	constructor() {
		super('/health');
	}

	/**
	 * Check API health status
	 */
	async checkHealth(): Promise<HealthStatus> {
		return this.get<HealthStatus>('');
	}

	/**
	 * Get detailed health information
	 */
	async getDetailedHealth(): Promise<HealthStatus> {
		return this.get<HealthStatus>('/detailed');
	}

	/**
	 * Ping the API
	 */
	async ping(): Promise<{ pong: string }> {
		return this.get<{ pong: string }>('/ping');
	}
}

// Export singleton instance
export const healthService = new HealthService();

// Legacy function for backward compatibility
export async function fetchHealth(): Promise<HealthStatus> {
	return healthService.checkHealth();
} 