/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { analyzeService } from "@/services/analyzeService";
import { ApiResponse } from "@/services/apiClient";
import {
	BeakerIcon,
	BoltIcon,
	CameraIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ClipboardDocumentIcon,
	ClockIcon,
	DocumentArrowUpIcon,
	DocumentTextIcon,
	ExclamationTriangleIcon,
	LightBulbIcon,
} from "@heroicons/react/24/outline";
import {
	BoltIcon as BoltIconSolid,
	ChartBarIcon as ChartBarIconSolid,
	DocumentArrowUpIcon as DocumentArrowUpIconSolid
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useRef, useState } from "react";
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

type MetricRisks = Metric & { explanation: string; };

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

function UploadAndAnalysisPageContent() {
	const t = useTranslations('upload');
	const { isAuthenticated } = useAuth();

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
		let virtualProgressTimer: number | undefined;
		let timeoutId: number | undefined;
		let lastProgressUpdate = 0;
		const PROGRESS_UPDATE_INTERVAL = 500; // Update progress every 500ms
		const TARGET_TIME_TO_90 = 10000; // 10 seconds to reach 90%
		const PROGRESS_INCREMENT = 90 / (TARGET_TIME_TO_90 / PROGRESS_UPDATE_INTERVAL); // ~0.45% per 500ms
		const MAX_TIMEOUT = 60000; // 60 seconds timeout
		
		try {
			if (!file) return;
			
			if (!isAuthenticated) {
				setShowLoginModal(true);
				return;
			}

			setStep(2);
			toast.success(t('toast.processingStarted'));
			// Reset progress to 0 and ensure it starts from 0%
			setProgress(0);
			setPhase('upload');
			setElapsedSeconds(0);
			
			// Small delay to ensure UI is ready before starting progress animation
			await new Promise((r) => setTimeout(r, 1000));

			// Start API call and timeout race
			const apiPromise = analyzeService.analyzeFile({ 
				file, 
				onProgress: (p) => {
					if (p >= 100) {
						setPhase('analyze');
					}
				}
			}).then((results) => {
				// API completed successfully
				isApiComplete = true;
				// Clear timeout if API completes first
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				// Immediately jump progress to 100%
				setProgress(100);
				return results;
			}).catch((error) => {
				// API failed
				isApiComplete = true;
				// Clear timeout if API fails
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				throw error;
			});

			// Timers: elapsed and rotating tips
			elapsedTimer = window.setInterval(() => {
				setElapsedSeconds((s) => s + 1);
			}, 1000);
			tipTimer = window.setInterval(() => {
				setTipIndex((i) => (i + 1) % tips.length);
			}, 3500);

			// Virtual progress that increases slowly and smoothly from 0% to 90%
			// Then stops at 90% until server responds
			let virtualProgress = 0;
			let isApiComplete = false;
			let hasReached90 = false;
			
			// Start virtual progress animation
			// Progress will increase from 0% to 90% over 10 seconds
			// Then stop at 90% until server processing is complete
			virtualProgressTimer = window.setInterval(() => {
				const now = Date.now();
				
				// Only update if enough time has passed
				if (now - lastProgressUpdate < PROGRESS_UPDATE_INTERVAL) return;
				
				// If API is complete, immediately jump to 100%
				if (isApiComplete) {
					virtualProgress = 100;
					setProgress(100);
					lastProgressUpdate = now;
					return;
				}
				
				// Gradually increase from 0% to 90% over 10 seconds
				if (!hasReached90) {
					virtualProgress = Math.min(90, virtualProgress + PROGRESS_INCREMENT);
					
					// Check if we've reached 90%
					if (virtualProgress >= 90) {
						hasReached90 = true;
						virtualProgress = 90; // Ensure we stop exactly at 90%
					}
				}
				// If hasReached90 is true but isApiComplete is false, stay at 90%
				setProgress(Math.round(virtualProgress));
				lastProgressUpdate = now;
			}, PROGRESS_UPDATE_INTERVAL);

			const timeoutPromise = new Promise<never>((_, reject) => {
				timeoutId = window.setTimeout(() => {
					if (!isApiComplete) {
						reject(new Error('API processing timeout after 60 seconds'));
					}
				}, MAX_TIMEOUT);
			});

			// Race between API call and timeout
			let resultsAnalyze: ApiResponse<{ analysis: AnalysisResults }>;
			try {
				resultsAnalyze = await Promise.race([apiPromise, timeoutPromise]) as unknown as ApiResponse<{ analysis: AnalysisResults }>;
			} catch (raceError) {
				// If the race fails (timeout or API error), rethrow it
				throw raceError;
			}
			
			// Stop virtual progress timer
			if (virtualProgressTimer) {
				window.clearInterval(virtualProgressTimer);
				virtualProgressTimer = undefined;
			}

			// Ensure progress is at 100%
			setProgress(100);
			
			// Small delay to show 100% before displaying results
			await new Promise((r) => setTimeout(r, 300));

			// Validate that we have results
			if (!resultsAnalyze) {
				throw new Error('No results received from server');
			}

			const result = resultsAnalyze;

			if (!result.success) {
				throw new Error(result.message || 'Failed to analyze file');
			}
			
			const analysis = result.data.analysis;

			setResults({
				summary: analysis.summary,
				risks: analysis.risks,
				recommendations: analysis.recommendations,
			});
			setStep(3);
			toast.success(t('toast.analysisComplete'));
		} catch (error: unknown) {
			// Handle timeout or other errors
			const errorMessage = (error instanceof Error && error.message?.includes('timeout'))
				? 'Xử lý quá thời gian chờ. Vui lòng thử lại.' 
				: (error as Error)?.message || t('toast.analysisError');
			toast.error(errorMessage);
			// Reset processing UI state on error
			setPhase('idle');
			setProgress(0);
			setElapsedSeconds(0);
			setTipIndex(0);
			setStep(1);
		} finally {
			if (elapsedTimer) window.clearInterval(elapsedTimer);
			if (tipTimer) window.clearInterval(tipTimer);
			if (virtualProgressTimer) window.clearInterval(virtualProgressTimer);
			if (timeoutId) window.clearTimeout(timeoutId);
			setPhase('idle');
		}
	};

	// Medical icons for background decoration - removed for cleaner professional look
	// Background will use subtle gradient patterns instead

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 relative overflow-hidden">
			{/* Subtle background pattern */}
			<div className="fixed inset-0 pointer-events-none z-0 opacity-5">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.1),transparent_50%)]" />
			</div>

			{/* Main Content */}
			<div className="relative z-10">
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
				<div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-8 md:mb-12 px-2">
					{[
						{ id: 1, label: t('step.upload'), icon: DocumentArrowUpIcon, iconSolid: DocumentArrowUpIconSolid },
						{ id: 2, label: t('step.processing'), icon: BoltIcon, iconSolid: BoltIconSolid },
						{ id: 3, label: t('step.results'), icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
					].map((s) => {
						const IconComponent = step > s.id ? CheckCircleIcon : s.id === step ? s.iconSolid : s.icon;
						return (
							<div key={s.id} className="flex items-center flex-shrink-0">
								<div className="flex flex-col items-center">
									<div className={`h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
										s.id === step 
											? "bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/25 md:scale-110" 
											: s.id < step 
												? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" 
												: "bg-slate-700/50 text-slate-400 border border-slate-600"
									}`}>
										<IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" aria-hidden="true" />
									</div>
									<div className={`mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm font-medium text-center whitespace-nowrap ${
										s.id === step ? "text-white" : s.id < step ? "text-emerald-400" : "text-slate-400"
									}`}>
										<span className="hidden sm:inline">{s.label}</span>
										<span className="sm:hidden">{s.label.split(' ')[0]}</span>
									</div>
								</div>
								{s.id < 3 && (
									<div className={`w-4 sm:w-6 md:w-12 h-px mx-1 sm:mx-2 md:mx-4 transition-colors duration-300 ${
										s.id < step ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-slate-600"
									}`} />
								)}
							</div>
						);
					})}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Upload Section */}
					<div className="lg:col-span-1">
						<div
							onDragOver={(e) => e.preventDefault()}
							onDrop={onDrop}
							className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 text-center shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									inputRef.current?.click();
								}
							}}
							aria-label={t('dropHere')}
						>
							<div className="flex justify-center mb-4">
								<ClipboardDocumentIcon className="w-12 h-12 text-cyan-400" aria-hidden="true" />
							</div>
							<div className="text-white text-xl font-semibold mb-2">{t('dropHere')}</div>
							<div className="text-slate-400 mb-6">{t('hintTypes', { max: MAX_SIZE_MB })}</div>
							
							<div className="space-y-4 mb-6">
								<Button 
									onClick={() => inputRef.current?.click()}
									className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
									aria-label={t('btn.upload')}
								>
									<DocumentArrowUpIcon className="w-5 h-5" aria-hidden="true" />
									{t('btn.upload')}
								</Button>
								<Button 
									variant="secondary" 
									onClick={() => cameraRef.current?.click()}
									className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl border border-slate-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
									aria-label={t('btn.capture')}
								>
									<CameraIcon className="w-5 h-5" aria-hidden="true" />
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
								<div className="mt-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
									<div className="flex items-center justify-between mb-3">
										<div className="text-white font-medium truncate max-w-[70%]">{file.name}</div>
										<div className="text-slate-400 text-sm">{formatBytes(file.size)}</div>
									</div>
									{isImage && previewUrl ? (
										<div className="mb-4 overflow-hidden rounded-lg border border-slate-600/50">
											<img src={previewUrl} alt={`Preview of ${file.name}`} className="w-full h-48 object-cover" />
										</div>
									) : (
										<div className="mb-4 text-sm text-slate-400">{t('errors.previewUnavailable')}</div>
									)}
									<div className="space-y-3">
										<Button 
											onClick={startProcessing} 
											disabled={!file}
											className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
											aria-label={t('btn.analyze')}
										>
											<BeakerIcon className="w-5 h-5" aria-hidden="true" />
											{isAuthenticated ? t('btn.analyze') : t('btn.analyze')}
										</Button>
										<Button 
											variant="secondary" 
											onClick={resetAll}
											className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl border border-slate-600 transition-all duration-300 cursor-pointer"
											aria-label={t('btn.uploadNew')}
										>
											{t('btn.uploadNew')}
										</Button>
									</div>
									{!isAuthenticated && (
										<div className="mt-3 text-sm text-cyan-400 bg-cyan-900/20 rounded-lg p-2" role="alert">
											{t('loginRequired')}
										</div>
									)}
								</div>
							)}

							{error && (
								<div className="mt-4 text-sm text-red-400 bg-red-900/20 rounded-lg p-3" role="alert" aria-live="polite">
									{error}
								</div>
							)}
						</div>
					</div>

					{/* Main Content Area */}
					<div className="lg:col-span-2">
						{step === 1 && (
							<div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 shadow-2xl text-center">
								<div className="flex justify-center mb-6">
									<BeakerIcon className="w-16 h-16 text-cyan-400" aria-hidden="true" />
								</div>
								<div className="text-white text-2xl font-semibold mb-4">Sẵn sàng phân tích kết quả của bạn?</div>
								<div className="text-slate-400 text-lg">Tải lên tệp xét nghiệm y tế của bạn để bắt đầu</div>
							</div>
						)}

						{step === 2 && (
							<div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
								<div className="flex items-start justify-between gap-4 mb-6">
									<div className="flex items-center gap-4">
										<BoltIcon className="w-10 h-10 text-cyan-400 flex-shrink-0" aria-hidden="true" />
										<div>
											<div className="text-white text-xl font-semibold">{t('processing.title')}</div>
											<div className="text-slate-400">{t('processing.subtitle')}</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-teal-500/15 ring-1 ring-cyan-400/30 text-cyan-200 font-semibold text-xs md:text-sm tracking-wide">
											<ClockIcon className="w-4 h-4" aria-hidden="true" />
											<span className="font-mono tabular-nums">{t('processing.elapsed', { s: elapsedSeconds })}</span>
										</span>
									</div>
								</div>

								<div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
									<div className="relative h-full w-full">
										{/* Background layer */}
										<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-teal-600/30 rounded-full" />
										{/* Actual progress bar - continues from current progress value */}
										<div 
											className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full transition-all duration-300 ease-out"
											style={{ width: `${progress}%` }}
											role="progressbar"
											aria-valuenow={progress}
											aria-valuemin={0}
											aria-valuemax={100}
											aria-label="Processing progress"
										/>
										{/* Subtle pulse effect overlay on the progress bar */}
										{progress < 100 && (
											<div 
												className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-500/20 to-teal-600/20 rounded-full"
												style={{ width: `${progress}%` }}
											/>
										)}
									</div>
								</div>
								<div className="mt-4 flex items-center justify-between text-sm">
									<div className="text-cyan-400 font-medium">
										{phase === 'upload' ? t('processing.phases.uploading') : t('processing.phases.analyzing')}
									</div>
									<div className="text-slate-400">{t('processing.comfort')}</div>
								</div>

								<div className="mt-6 p-5 bg-gradient-to-r from-cyan-900/20 to-teal-900/10 rounded-2xl border border-cyan-500/20 shadow-inner">
									<div className="text-base md:text-lg text-cyan-200/90 font-medium leading-relaxed flex items-start gap-2">
										<LightBulbIcon className="w-5 h-5 text-cyan-300/90 flex-shrink-0 mt-0.5" aria-hidden="true" />
										<span>{tips[tipIndex]}</span>
									</div>
									<div className="text-xs md:text-sm mt-3 uppercase tracking-widest text-cyan-300/60">{t('processing.youCan')}</div>
								</div>
							</div>
						)}

						{step === 3 && results && (
							<div className="space-y-8">
								{/* Part 1: Test Results Summary */}
								<div className="bg-gradient-to-br from-cyan-900/30 to-teal-900/30 backdrop-blur-sm rounded-3xl border border-cyan-500/20 p-8 shadow-2xl shadow-cyan-500/10">
									<div className="flex items-center gap-4 mb-8">
										<div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl flex items-center justify-center">
											<ClipboardDocumentIcon className="w-6 h-6 text-white" aria-hidden="true" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-white">Tóm tắt kết quả xét nghiệm</h3>
											<p className="text-slate-400">Tổng quan các chỉ số trong kết quả của bạn</p>
										</div>
									</div>
									
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{results.summary.map((itSummary, idx) => (
											<div key={idx} className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
												itSummary.level === 'Normal' 
													? 'bg-emerald-900/20 border-emerald-500/30 hover:bg-emerald-900/30' 
													: 'bg-amber-900/20 border-amber-500/30 hover:bg-amber-900/30'
											} shadow-lg hover:shadow-xl`}>
												<div className="flex items-center justify-between mb-3">
													<h4 className="text-lg font-semibold text-white">{itSummary.name}</h4>
													<div className={`w-3 h-3 rounded-full ${
														itSummary.level === 'Normal' ? 'bg-emerald-500' : 'bg-amber-500'
													}`} aria-label={itSummary.level === 'Normal' ? 'Normal level' : 'Attention required'}></div>
												</div>
												<div className="text-2xl font-bold text-white mb-2">
													{itSummary.value} <span className="text-sm text-slate-400">{itSummary.unit}</span>
												</div>
												<p className={`text-sm font-medium ${
													itSummary.level === 'Normal' ? 'text-emerald-300' : 'text-amber-300'
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
										<div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
											<ExclamationTriangleIcon className="w-6 h-6 text-white" aria-hidden="true" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-white">Điều cần lưu ý về sức khỏe</h3>
											<p className="text-slate-400">Những chỉ số cần quan tâm và tình trạng hiện tại</p>
										</div>
									</div>
									
									<div className="space-y-6">
										{results.risks
											.filter(risk => risk.level !== 'Normal')
											.map((risk, idx) => (
												<div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
													<div className="flex items-start gap-4">
														<div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
															risk.level === 'High' 
																? 'bg-gradient-to-br from-red-500 to-pink-600' 
																: 'bg-gradient-to-br from-cyan-500 to-teal-600'
														}`} aria-label={risk.level === 'High' ? 'High level' : 'Low level'}>
															{risk.level === 'High' ? '↑' : '↓'}
														</div>
														<div className="flex-1">
															<div className="flex items-center justify-between mb-2">
																<h4 className="text-xl font-bold text-white">{risk.name}</h4>
																<div className="text-2xl font-bold text-white">
																	{risk.value} <span className="text-sm text-slate-400">{risk.unit}</span>
																</div>
															</div>
															<p className="text-slate-300 text-lg leading-relaxed">
																{risk.explanation}
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
										<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
											<LightBulbIcon className="w-6 h-6 text-white" aria-hidden="true" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-white">Lời khuyên & Hướng dẫn</h3>
											<p className="text-slate-400">Những điều bạn nên làm tiếp theo</p>
										</div>
									</div>
									
									<div className="space-y-6">
										{results.recommendations && results.recommendations.length > 0 ? (
											results.recommendations.map((recommend, idx) => (
												<div key={idx} className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
													<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm" aria-label={`Recommendation ${idx + 1}`}>
														{idx + 1}
													</div>
													<p className="text-slate-200 text-lg leading-relaxed">
														{recommend}
													</p>
												</div>
											))
										) : (
											<div className="p-6 bg-white/5 rounded-2xl border border-white/10">
												<p className="text-slate-200 text-lg leading-relaxed"></p>
											</div>
										)}
									</div>

									{/* Action Buttons */}
									<div className="flex flex-col sm:flex-row gap-4 mt-8">
										<Button 
											onClick={resetAll}
											className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 px-8 rounded-xl border border-slate-600 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
											aria-label="Start new analysis"
										>
											<DocumentTextIcon className="w-5 h-5" aria-hidden="true" />
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
		</div>
	);
}

export default function UploadAndAnalysisPage() {
	return <UploadAndAnalysisPageContent />;
} 