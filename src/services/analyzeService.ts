import { BaseService } from './baseService';

export interface AnalysisMetric {
	key: string;
	value: string | number;
	unit: string;
	status: "low" | "normal" | "high";
	explanation: string;
}

export interface AnalysisResults {
	summary: {
		status: "all-normal" | "partial-abnormal";
		text: string
	};
	metrics: AnalysisMetric[];
	details: string;
	analysisTexts?: string[];
}

export interface AnalysisRequest {
	file: File;
	onProgress?: (progress: number) => void;
}

type LevelMetric = 'High' | 'Normal' | 'Low';

type Metric = {
	name: string;
	value: string | number;
	unit: string;
	level: LevelMetric;
};


type AnalysisResponse = {
	// analysis: {
	// 	summary: MetricSummary[],
	// 	risks: MetricRisks[],
	// 	recommendations: string[],
	// };
	analysis: string;
};


export class AnalyzeService extends BaseService {
	constructor() {
		super('/ai/analyze');
	}

	async analyzeFile(request: AnalysisRequest): Promise<AnalysisResponse> {
		const { file } = request;
		return this.uploadFile<AnalysisResponse>('', file, request.onProgress);
	}
}

export const analyzeService = new AnalyzeService();
