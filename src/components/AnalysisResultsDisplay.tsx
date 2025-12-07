"use client";

import Button from "./ui/Button";

type LevelMetric = 'High' | 'Normal' | 'Low';

type Metric = {
	name: string;
	value: string | number;
	unit: string;
	range?: string; // Optional because API may not always return this field
	level: LevelMetric;
};

type MetricSummary = Metric;

type MetricRisks = Metric & { explanation: string; };

type AnalysisResults = {
	summary: MetricSummary[],
	risks: MetricRisks[],
	recommendations: string[],
};

interface AnalysisResultsDisplayProps {
	results: AnalysisResults;
	onBack?: () => void;
	showBackButton?: boolean;
}

export default function AnalysisResultsDisplay({ 
	results, 
	onBack,
	showBackButton = false 
}: AnalysisResultsDisplayProps) {
	// Parse only if results is a string, otherwise use directly
	const resultsConverted: AnalysisResults = JSON.parse(results as unknown as string);

	return (
		<div className="space-y-8">
			{/* Part 1: Test Results Summary */}
			<div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm rounded-3xl border border-blue-500/20 p-8 shadow-2xl shadow-blue-500/10">
				<div className="flex items-center gap-4 mb-8">
					<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl">
						📋
					</div>
					<div>
						<h3 className="text-2xl font-bold text-white">Tóm tắt kết quả xét nghiệm</h3>
						<p className="text-gray-400">Tổng quan các chỉ số trong kết quả của bạn</p>
					</div>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{resultsConverted.summary.map((itSummary, idx) => (
						<div key={idx} className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
							itSummary.level === 'Normal' 
								? 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30' 
								: 'bg-orange-900/20 border-orange-500/30 hover:bg-orange-900/30'
						} shadow-lg hover:shadow-xl`}>
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-lg font-semibold text-white">{itSummary.name}</h4>
								<div className={`w-3 h-3 rounded-full ${
									itSummary.level === 'Normal' ? 'bg-green-500' : 'bg-orange-500'
								}`}></div>
							</div>
							<div className="text-2xl font-bold text-white mb-2">
								{itSummary.value} <span className="text-sm text-gray-400">{itSummary.unit}</span>
							</div>
							<p className={`text-sm font-medium ${
								itSummary.level === 'Normal' ? 'text-green-300' : 'text-orange-300'
							}`}>
								{itSummary.level === 'Normal' ? 'Bình thường' : 'Cần chú ý'}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Part 2: Health Concerns & Important Notes */}
			<div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm rounded-3xl border border-amber-500/20 p-8 shadow-2xl shadow-amber-500/10">
				<div className="flex items-center gap-4 mb-8">
					<div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-xl">
						⚠️
					</div>
					<div>
						<h3 className="text-2xl font-bold text-white">Điều cần lưu ý về sức khỏe</h3>
						<p className="text-gray-400">Những chỉ số cần quan tâm và tình trạng hiện tại</p>
					</div>
				</div>
				
				<div className="space-y-6">
					{resultsConverted.risks
						.filter(risk => risk.level !== 'Normal')
						.map((risk, idx) => (
							<div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
								<div className="flex items-start gap-4">
									<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
										risk.level === 'High' 
											? 'bg-gradient-to-br from-red-500 to-pink-600' 
											: 'bg-gradient-to-br from-blue-500 to-cyan-600'
									}`}>
										{risk.level === 'High' ? '↑' : '↓'}
									</div>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-2">
											<h4 className="text-xl font-bold text-white">{risk.name}</h4>
											<div className="text-2xl font-bold text-white">
												{risk.value} <span className="text-sm text-gray-400">{risk.unit}</span>
											</div>
										</div>
										<p className="text-gray-300 text-lg leading-relaxed">
											{risk.explanation}
										</p>
									</div>
								</div>
							</div>
						))
					}
				</div>
			</div>

			{/* Part 3: Recommendations & Next Steps */}
			<div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-sm rounded-3xl border border-emerald-500/20 p-8 shadow-2xl shadow-emerald-500/10">
				<div className="flex items-center gap-4 mb-8">
					<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-xl">
						💡
					</div>
					<div>
						<h3 className="text-2xl font-bold text-white">Lời khuyên & Hướng dẫn</h3>
						<p className="text-gray-400">Những điều bạn nên làm tiếp theo</p>
					</div>
				</div>
				
				<div className="space-y-6">
					{resultsConverted.recommendations.length > 0 ? (
						resultsConverted.recommendations.map((recommend, idx) => (
							<div key={idx} className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
								<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
									{idx + 1}
								</div>
								<p className="text-gray-200 text-lg leading-relaxed">
									{recommend}
								</p>
							</div>
						))
					) : (
						<div className="p-6 bg-white/5 rounded-2xl border border-white/10">
							<p className="text-gray-200 text-lg leading-relaxed"></p>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				{showBackButton && onBack && (
					<div className="flex flex-col sm:flex-row gap-4 mt-8">
						<Button 
							onClick={onBack}
							className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl border border-gray-600 transition-all duration-300"
						>
							Quay lại
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

