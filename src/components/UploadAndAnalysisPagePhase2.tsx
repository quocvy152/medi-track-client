/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import LoginModal from "./LoginModal";
import Button from "./ui/Button";

type Step = 1 | 2 | 3; // 1 Upload, 2 Processing, 3 Results

type Metric = {
	key: string;
	value: string | number;
	unit: string;
	status: "low" | "normal" | "high";
	explanation: string;
};

type AnalysisResults = {
	summary: { status: "all-normal" | "partial-abnormal"; text: string };
	metrics: Metric[];
	details: string;
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
		if (!file) return;
		
		// Check if user is authenticated
		if (!isAuthenticated) {
			setShowLoginModal(true);
			return;
		}

		setStep(2);
		    toast.success(t('toast.processingStarted'));
		setProgress(0);

		for (let i = 0; i <= 100; i += 5) {
			await new Promise((r) => setTimeout(r, 80));
			setProgress(i);
		}

		const mockResults: AnalysisResults = {
			summary: {
			  status: "partial-abnormal",
			  text: "Nhiều chỉ số bất thường, nghi ngờ suy giảm chức năng thận và cần theo dõi chức năng gan.",
			},
			metrics: [
			  { 
				key: "Creatinine", 
				value: 2.4, 
				unit: "mg/dL", 
				status: "high", 
				explanation: "Creatinine tăng cao, dấu hiệu suy thận mạn." 
			  },
			  { 
				key: "Ure", 
				value: 72, 
				unit: "mg/dL", 
				status: "high", 
				explanation: "Ure máu tăng cao, phản ánh giảm chức năng lọc cầu thận." 
			  },
			  { 
				key: "eGFR", 
				value: 35, 
				unit: "mL/ph/1.73m2", 
				status: "low", 
				explanation: "eGFR thấp, gợi ý suy thận mạn độ 3b." 
			  },
			  { 
				key: "Protein niệu", 
				value: "+3", 
				unit: "", 
				status: "high", 
				explanation: "Protein niệu dương tính mạnh, chỉ điểm tổn thương cầu thận." 
			  },
			  { 
				key: "Acid uric", 
				value: 9.2, 
				unit: "mg/dL", 
				status: "high", 
				explanation: "Acid uric tăng, thường gặp ở bệnh nhân suy thận mạn." 
			  },
			  { 
				key: "Kali", 
				value: 5.9, 
				unit: "mmol/L", 
				status: "high", 
				explanation: "Tăng Kali máu, biến chứng nguy hiểm ở bệnh nhân suy thận." 
			  },
		  
			  // Gan
			  { 
				key: "AST (GOT)", 
				value: 45, 
				unit: "U/L", 
				status: "high", 
				explanation: "AST hơi tăng, cần theo dõi chức năng gan." 
			  },
			  { 
				key: "ALT (GPT)", 
				value: 38, 
				unit: "U/L", 
				status: "normal", 
				explanation: "ALT trong giới hạn bình thường." 
			  },
			  { 
				key: "GGT", 
				value: 82, 
				unit: "U/L", 
				status: "high", 
				explanation: "GGT tăng, gợi ý ảnh hưởng chức năng gan hoặc mật." 
			  },
			  { 
				key: "Albumin", 
				value: 3.1, 
				unit: "g/dL", 
				status: "low", 
				explanation: "Albumin máu thấp, có thể liên quan đến suy thận hoặc bệnh gan." 
			  },
			  { 
				key: "Bilirubin toàn phần", 
				value: 0.9, 
				unit: "mg/dL", 
				status: "normal", 
				explanation: "Bilirubin trong giới hạn bình thường." 
			  },
			],
			details: "Kết quả cho thấy bệnh nhân có nhiều chỉ số bất thường, đặc biệt liên quan đến chức năng thận (Creatinine, Ure, eGFR, Protein niệu, Kali). Ngoài ra, một số chỉ số gan (AST, GGT, Albumin) cũng cần theo dõi. Khuyến nghị khám chuyên khoa Thận và Gan để được chẩn đoán và điều trị phù hợp."
		};

		setResults(mockResults);
		setStep(3);
		    toast.success(t('toast.analysisComplete'));
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
								<div className="text-white text-2xl font-semibold mb-4">Ready to analyze your results?</div>
								<div className="text-gray-400 text-lg">Upload your medical test file to get started</div>
							</div>
						)}

						{step === 2 && (
							<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
								<div className="flex items-center gap-4 mb-6">
									<div className="text-4xl">⚡</div>
									<div>
										<div className="text-white text-xl font-semibold">{t('processing.title')}</div>
										<div className="text-gray-400">{t('processing.subtitle')}</div>
									</div>
								</div>
								<div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
									<div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
								</div>
								<div className="text-center mt-4 text-blue-400 font-medium">{progress}%</div>
							</div>
						)}

						{step === 3 && results && (
							<div className="space-y-6">
								{/* Summary Card */}
								<div className={`rounded-2xl p-6 border backdrop-blur-sm ${
									results.summary.status === 'all-normal' 
										? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-600/50' 
										: 'bg-gradient-to-r from-amber-900/50 to-orange-900/50 border-amber-600/50'
								}`}>
									<div className="text-white text-xl font-semibold mb-2">
										{results.summary.status === 'all-normal' ? t('summary.allNormal') : t('summary.someAbnormal')}
									</div>
									<div className="text-gray-300">{t('summary.disclaimer')}</div>
								</div>

								{/* Metrics Grid */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{results.metrics.map((m: Metric) => (
										<div key={m.key} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
											<div className="flex items-center justify-between mb-4">
												<div className="text-white font-semibold text-lg">{m.key}</div>
												<div className={`text-sm px-3 py-1 rounded-full border font-medium ${
													m.status === 'normal' 
														? 'bg-green-900/50 text-green-400 border-green-600/50' 
														: m.status === 'high' 
															? 'bg-red-900/50 text-red-400 border-red-600/50' 
															: 'bg-amber-900/50 text-amber-400 border-amber-600/50'
												}`}>
													{t(`metrics.status.${m.status}`)}
												</div>
											</div>
											<div className="mb-3">
												<span className="text-3xl font-bold text-white">{m.value}</span>
												<span className="ml-2 text-lg text-gray-400">{m.unit}</span>
											</div>
											<div className="text-gray-300 text-sm mb-4">{m.explanation}</div>

											<details className="group">
												<summary className="text-sm text-blue-400 cursor-pointer select-none hover:text-blue-300 transition-colors">
													{t('metrics.details.toggle')}
												</summary>
												<div className="mt-3 text-sm text-gray-400 leading-relaxed">
													{t('metrics.details.more', { key: m.key })}
												</div>
											</details>
										</div>
									))}
								</div>

								{/* Actions Card */}
								<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-xl">
									<div className="text-white text-xl font-semibold mb-4">{t('metrics.details.title')}</div>
									<p className="text-gray-300 text-sm leading-relaxed mb-6">{results.details}</p>
									<div className="flex flex-wrap gap-4">
										<Button 
											onClick={downloadPdf}
											className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
										>
											{t('btn.download')}
										</Button>
										<Button 
											variant="secondary" 
											onClick={shareResults}
											className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl border border-gray-600 transition-all duration-300"
										>
											{t('btn.share')}
										</Button>
										<Button 
											variant="ghost" 
											onClick={resetAll}
											className="text-gray-400 hover:text-white hover:bg-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
										>
											{t('btn.retry')}
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