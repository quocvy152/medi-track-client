/* eslint-disable @next/next/no-img-element */
"use client";

import { analyzeService } from "@/services/analyzeService";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import LoginModal from "./LoginModal";
import Button from "./ui/Button";

type Step = 1 | 2 | 3; // 1 Upload, 2 Processing, 3 Results

type LevelMetric = 'High' | 'Normal' | 'Low';

type Metric = {
	name: string;
	value: string | number;
	unit: string;
	level: LevelMetric;
};

type MetricSummary = Metric;

type MetricRisks = Metric & { explaination: string; };

type AnalysisResults = {
	summary: MetricSummary[],
	risks: MetricRisks[],
	recommendations: string[],
};

const ACCEPTED_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
];
const ACCEPT_INPUT_LIST = "application/pdf,image/*,.pdf,.jpg,.jpeg,.png";
const MAX_SIZE_MB = 10;

function formatBytes(bytes: number) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

export default function UploadAndAnalysisPage() {
	const t = useTranslations('upload');

	const [step, setStep] = useState<Step>(1);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const [results, setResults] = useState<AnalysisResults | null>(null);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const cameraRef = useRef<HTMLInputElement>(null);

	// New: processing UX state
	const [phase, setPhase] = useState<'idle' | 'upload' | 'analyze'>('idle');
	const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
	const [tipIndex, setTipIndex] = useState<number>(0);
	const tips = useMemo(() => [
		t('processing.tips.0'),
		t('processing.tips.1'),
		t('processing.tips.2'),
		t('processing.tips.3'),
		t('processing.tips.4'),
	], [t]);

	const isImage = useMemo(() => (file ? file.type.startsWith("image/") : false), [file]);

	// Check if user is authenticated
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Function to check authentication status
	const checkAuthStatus = useCallback(() => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem("authToken");
			setIsAuthenticated(!!token);
		}
	}, []);

	useEffect(() => {
		checkAuthStatus();

		// Listen for authentication state changes
		const handleAuthChange = () => {
			checkAuthStatus();
		};

		window.addEventListener('authStateChanged', handleAuthChange);

		return () => {
			window.removeEventListener('authStateChanged', handleAuthChange);
		};
	}, [checkAuthStatus]);

	const resetAll = useCallback(() => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setFile(null);
		setPreviewUrl(null);
		setError(null);
		setProgress(0);
		setResults(null);
		setPhase('idle');
		setElapsedSeconds(0);
		setTipIndex(0);
		setStep(1);
	}, [previewUrl]);

	const validateFile = useCallback((f: File) => {
		if (!ACCEPTED_TYPES.includes(f.type)) {
			return t('errors.unsupported');
		}
		if (f.size > MAX_SIZE_MB * 1024 * 1024) {
			return t('errors.tooLarge', { max: MAX_SIZE_MB });
		}
		return null;
	}, [t]);

	const handleFiles = useCallback((files: FileList | null) => {
		if (!files || files.length === 0) return;
		const f = files[0];
		const err = validateFile(f);
		if (err) {
			toast.error(err);
			return;
		}
		setFile(f);
		setError(null);
		    toast.success(t('toast.fileUploaded'));
		const url = URL.createObjectURL(f);
		setPreviewUrl(url);
	}, [t, validateFile]);

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		if (files.length > 0) {
			handleFiles(files);
		}
	}, [handleFiles]);

	const handleLoginSuccess = useCallback(() => {
		window.dispatchEvent(new Event('authStateChanged'));
	}, []);

	const startProcessing = async () => {
		let elapsedTimer: number | undefined;
		let tipTimer: number | undefined;
		try {
			if (!file) return;
			
			if (!isAuthenticated) {
				setShowLoginModal(true);
				return;
			}

			setStep(2);
			toast.success(t('toast.processingStarted'));
			setProgress(0);
			setPhase('upload');
			setElapsedSeconds(0);

			// Timers: elapsed and rotating tips
			elapsedTimer = window.setInterval(() => {
				setElapsedSeconds((s) => s + 1);
			}, 1000);
			tipTimer = window.setInterval(() => {
				setTipIndex((i) => (i + 1) % tips.length);
			}, 3500);

			// Use real upload progress up to ~90%
			const resultsAnalyze = await analyzeService.analyzeFile({ 
				file, 
				onProgress: (p) => {
					const capped = Math.min(90, Math.round(p * 0.9));
					setProgress(capped);
					if (p >= 100) {
						setPhase('analyze');
					}
				}
			});

			// Smoothly complete to 100%
			for (let i = Math.max(progress, 90); i <= 100; i += 2) {
				// small delay for smoothness
				// eslint-disable-next-line no-await-in-loop
				await new Promise((r) => setTimeout(r, 40));
				setProgress(i);
			}

			const analysis = JSON.parse(JSON.stringify(resultsAnalyze.analysis));

			setResults({
				summary: analysis.summary,
				risks: analysis.risks,
				recommendations: analysis.recommendations,
			});
			setStep(3);
			toast.success(t('toast.analysisComplete'));
		} catch (error) {
			toast.error(t('toast.analysisError'));
			// Reset processing UI state on error
			setPhase('idle');
			setProgress(0);
			setElapsedSeconds(0);
			setTipIndex(0);
			setStep(1);
		} finally {
			if (elapsedTimer) window.clearInterval(elapsedTimer);
			if (tipTimer) window.clearInterval(tipTimer);
			setPhase('idle');
		}
	};

	const downloadPdf = () => {
		// Check if user is authenticated for download
		if (!isAuthenticated) {
			setShowLoginModal(true);
			return;
		}

		    toast.success(t('toast.downloadStarted'));
		const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "medi-track-results.pdf";
		a.click();
		URL.revokeObjectURL(url);
		setTimeout(() => {
			      toast.success(t('toast.downloadComplete'));
		}, 1000);
	};

	const shareResults = async () => {
		// Check if user is authenticated for sharing
		if (!isAuthenticated) {
			setShowLoginModal(true);
			return;
		}

		try {
			if (navigator.share) {
				await navigator.share({
					title: 'My Lab Test Results',
					text: 'Check out my lab test results from MediTrack',
					url: window.location.href,
				});
				        toast.success(t('toast.shareSuccess'));
			} else {
				// Fallback to clipboard
				await navigator.clipboard.writeText(JSON.stringify(results));
				        toast.success(t('toast.linkCopied'));
			}
		} catch (error) {
			console.error(error);
			toast.error(t('toast.shareError'));
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			{/* Header Section */}
			<div className="text-center pt-16 pb-12 px-4">
				<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
					Medi Track
				</h1>
				<p className="text-xl text-gray-300 max-w-2xl mx-auto">
					{t('description')}
				</p>
			</div>

			<div className="mx-auto w-full max-w-7xl px-4 pb-16">
				{/* Progress Steps */}
				<div className="flex items-center justify-center gap-6 mb-12">
					{[
						{ id: 1, label: t('step.upload'), icon: "🗂" },
						{ id: 2, label: t('step.processing'), icon: "⚡" },
						{ id: 3, label: t('step.results'), icon: "📊" },
					].map((s) => (
						<div key={s.id} className="flex items-center">
							<div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
								s.id === step 
									? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-110" 
									: s.id < step 
										? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25" 
										: "bg-gray-700 text-gray-400 border border-gray-600"
							}`}>
								{step > s.id ? "✓" : s.icon}
							</div>
							<div className={`ml-4 text-sm font-medium ${
								s.id === step ? "text-white" : s.id < step ? "text-green-400" : "text-gray-400"
							}`}>
								{s.label}
							</div>
							{s.id < 3 && (
								<div className={`w-12 h-px mx-4 ${
									s.id < step ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gray-600"
								}`} />
							)}
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Upload Section */}
					<div className="lg:col-span-1">
						<div
							onDragOver={(e) => e.preventDefault()}
							onDrop={onDrop}
							className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 text-center shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
						>
							<div className="text-3xl mb-4">📋</div>
							<div className="text-white text-xl font-semibold mb-2">{t('dropHere')}</div>
							<div className="text-gray-400 mb-6">{t('hintTypes', { max: MAX_SIZE_MB })}</div>
							
							<div className="space-y-4 mb-6">
								<Button 
									onClick={() => inputRef.current?.click()}
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
								>
									{t('btn.upload')}
								</Button>
								<Button 
									variant="secondary" 
									onClick={() => cameraRef.current?.click()}
									className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl border border-gray-600 transition-all duration-300"
								>
									{t('btn.capture')}
								</Button>
							</div>

							<input
								ref={inputRef}
								type="file"
								accept={ACCEPT_INPUT_LIST}
								className="hidden"
								onChange={(e) => handleFiles(e.target.files)}
							/>
							<input
								ref={cameraRef}
								type="file"
								accept="image/*"
								{...({ capture: 'environment' } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
								className="hidden"
								onChange={(e) => handleFiles(e.target.files)}
							/>

							{file && (
								<div className="mt-6 p-4 bg-gray-700/50 rounded-xl border border-gray-600/50">
									<div className="flex items-center justify-between mb-3">
										<div className="text-white font-medium truncate max-w-[70%]">{file.name}</div>
										<div className="text-gray-400 text-sm">{formatBytes(file.size)}</div>
									</div>
									{isImage && previewUrl ? (
										<div className="mb-4 overflow-hidden rounded-lg border border-gray-600/50">
											<img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
										</div>
									) : (
										<div className="mb-4 text-sm text-gray-400">{t('errors.previewUnavailable')}</div>
									)}
									<div className="space-y-3">
										<Button 
											onClick={startProcessing} 
											disabled={!file}
											className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isAuthenticated ? t('btn.analyze') : t('btn.analyze')}
										</Button>
										<Button 
											variant="secondary" 
											onClick={resetAll}
											className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl border border-gray-600 transition-all duration-300"
										>
											{t('btn.uploadNew')}
										</Button>
									</div>
									{!isAuthenticated && (
										<div className="mt-3 text-sm text-blue-400 bg-blue-900/20 rounded-lg p-2">
											{t('loginRequired')}
										</div>
									)}
								</div>
							)}

							{error && (
								<div className="mt-4 text-sm text-red-400 bg-red-900/20 rounded-lg p-3">{error}</div>
							)}
						</div>
					</div>

					{/* Main Content Area */}
					<div className="lg:col-span-2">
						{step === 1 && (
							<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 shadow-2xl text-center">
								<div className="text-6xl mb-6">🔬</div>
								<div className="text-white text-2xl font-semibold mb-4">Sẵn sàng phân tích kết quả của bạn?</div>
								<div className="text-gray-400 text-lg">Tải lên tệp xét nghiệm y tế của bạn để bắt đầu</div>
							</div>
						)}

						{step === 2 && (
							<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
								<div className="flex items-start justify-between gap-4 mb-6">
									<div className="flex items-center gap-4">
										<div className="text-4xl">⚡</div>
										<div>
											<div className="text-white text-xl font-semibold">{t('processing.title')}</div>
											<div className="text-gray-400">{t('processing.subtitle')}</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 ring-1 ring-blue-400/30 text-blue-200 font-semibold text-xs md:text-sm tracking-wide">
											<span className="text-lg">⏱</span>
											<span className="font-mono tabular-nums">{t('processing.elapsed', { s: elapsedSeconds })}</span>
										</span>
									</div>
								</div>

								<div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
									{phase === 'upload' ? (
										<div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-200 rounded-full" style={{ width: `${progress}%` }} />
									) : (
										<div className="relative h-full w-full">
											<div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30" />
											<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '92%' }} />
										</div>
									)}
								</div>
								<div className="mt-4 flex items-center justify-between text-sm">
									<div className="text-blue-400 font-medium">
										{phase === 'upload' ? t('processing.phases.uploading') : t('processing.phases.analyzing')}
									</div>
									<div className="text-gray-400">{t('processing.comfort')}</div>
								</div>

								<div className="mt-6 p-5 bg-gradient-to-r from-blue-900/20 to-purple-900/10 rounded-2xl border border-blue-500/20 shadow-inner">
									<div className="text-base md:text-lg text-blue-200/90 font-medium leading-relaxed">
										<span className="mr-2 align-middle text-blue-300/90">💡</span>{tips[tipIndex]}
									</div>
									<div className="text-xs md:text-sm mt-3 uppercase tracking-widest text-blue-300/60">{t('processing.youCan')}</div>
								</div>
							</div>
						)}

						{step === 3 && results && (
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
										{results.summary.map((itSummary, idx) => (
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
										{results.risks
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
																{risk.explaination}
															</p>
														</div>
													</div>
												</div>
											))
										}
										
										{/* Overall Health Status */}
										{/* <div className="mt-8 p-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-2xl border border-orange-500/30">
											<div className="flex items-start gap-4">
												<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-xl">
													🏥
												</div>
												<div>
													<h4 className="text-xl font-bold text-white mb-3">Tình trạng sức khỏe tổng thể</h4>
													<p className="text-gray-300 text-lg leading-relaxed"></p>
												</div>
											</div>
										</div> */}
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
										{results.recommendations && results.recommendations.length > 0 ? (
											results.recommendations.map((recommend, idx) => (
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
									<div className="flex flex-col sm:flex-row gap-4 mt-8">
										{/* <Button 
											onClick={downloadPdf}
											className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
										>
											📄 Tải báo cáo PDF
										</Button> */}
										{/* <Button 
											onClick={shareResults}
											className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
										>
											🔗 Chia sẻ kết quả
										</Button> */}
										<Button 
											onClick={resetAll}
											className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-xl border border-gray-600 transition-all duration-300"
										>
											Phân tích mới
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Login Modal */}
			<LoginModal
				isOpen={showLoginModal}
				onClose={() => setShowLoginModal(false)}
				onLoginSuccess={handleLoginSuccess}
			/>
		</div>
	);
} 