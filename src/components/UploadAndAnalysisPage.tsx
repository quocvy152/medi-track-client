/* eslint-disable @next/next/no-img-element */
"use client";

import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Button from "./ui/Button";
import Loading from "./ui/Loading";

type Step = 1 | 2 | 3; // 1 Upload, 2 Processing, 3 Results

type Metric = {
	key: string;
	value: number;
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
	const inputRef = useRef<HTMLInputElement>(null);
	const cameraRef = useRef<HTMLInputElement>(null);

	const isImage = useMemo(() => (file ? file.type.startsWith("image/") : false), [file]);

	const resetAll = useCallback(() => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setFile(null);
		setPreviewUrl(null);
		setError(null);
		setProgress(0);
		setResults(null);
		setStep(1);
	}, [previewUrl]);

	const validateFile = (f: File) => {
		if (!ACCEPTED_TYPES.includes(f.type)) {
			return t('errors.unsupported');
		}
		if (f.size > MAX_SIZE_MB * 1024 * 1024) {
			return t('errors.tooLarge', { max: MAX_SIZE_MB });
		}
		return null;
	};

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const f = files[0];
		const err = validateFile(f);
		if (err) {
			setError(err);
			return;
		}
		setError(null);
		setFile(f);
		const url = URL.createObjectURL(f);
		setPreviewUrl(url);
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const startProcessing = async () => {
		if (!file) return;
		setStep(2);
		setProgress(0);

		for (let i = 0; i <= 100; i += 5) {
			await new Promise((r) => setTimeout(r, 80));
			setProgress(i);
		}

		const mockResults: AnalysisResults = {
			summary: {
				status: "partial-abnormal",
				text: t('summary.someAbnormal'),
			},
			metrics: [
				{ key: "Hemoglobin", value: 10.8, unit: "g/dL", status: "low", explanation: "Below normal range; consider iron intake." },
				{ key: "WBC", value: 6.2, unit: "10^9/L", status: "normal", explanation: "Within normal range." },
				{ key: "Cholesterol", value: 225, unit: "mg/dL", status: "high", explanation: "Slightly elevated; consider diet changes." },
			],
			details: "Detailed interpretation lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		};

		setResults(mockResults);
		setStep(3);
	};

	const downloadPdf = () => {
		const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/pdf" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "medi-track-results.pdf";
		a.click();
		URL.revokeObjectURL(url);
	};

	type ShareData = { title?: string; text?: string; url?: string };
	type MaybeShareNavigator = Navigator & { share?: (data: ShareData) => Promise<void> };

	const shareResults = async () => {
		const nav = navigator as MaybeShareNavigator;
		if (nav.share) {
			try {
				await nav.share({ title: "Medi Track Results", text: "My recent lab test insights", url: window.location.href });
			} catch {}
		} else {
			try {
				await navigator.clipboard.writeText(JSON.stringify(results));
				alert("Results copied to clipboard");
			} catch {}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto w-full max-w-5xl px-4 py-6">
				<ol className="flex items-center justify-center gap-4 mb-6">
					{[
						{ id: 1, label: t('step.upload') },
						{ id: 2, label: t('step.processing') },
						{ id: 3, label: t('step.results') },
					].map((s) => (
						<li key={s.id} className="flex items-center">
							<div className={`h-9 px-3 rounded-full flex items-center text-sm font-medium border ${
								s.id === step ? "bg-blue-600 text-white border-blue-600" : s.id < step ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-600 border-gray-200"
							}`}>
								{s.label}
							</div>
							{s.id < 3 && <div className={`w-8 h-px ${s.id < step ? "bg-blue-300" : "bg-gray-200"}`} />}
						</li>
					))}
				</ol>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1 space-y-4">
						<div
							onDragOver={(e) => e.preventDefault()}
							onDrop={onDrop}
							className="bg-white rounded-xl border border-dashed border-gray-300 p-6 text-center shadow-sm"
						>
							<div className="text-gray-700 font-medium">{t('dropHere')}</div>
							<div className="text-sm text-gray-500 mt-1">{t('hintTypes', { max: MAX_SIZE_MB })}</div>
							<div className="mt-4 flex items-center justify-center gap-3">
								<Button onClick={() => inputRef.current?.click()}>{t('btn.upload')}</Button>
								<Button variant="secondary" onClick={() => cameraRef.current?.click()}>{t('btn.capture')}</Button>
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
								<div className="mt-4 text-left">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-700 truncate max-w-[70%]">{file.name}</div>
										<div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
									</div>
									{isImage && previewUrl ? (
										<div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
											<img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
										</div>
									) : (
										<div className="mt-3 text-xs text-gray-500">{t('errors.previewUnavailable')}</div>
									)}
									<div className="mt-4 flex items-center gap-3">
										<Button onClick={startProcessing} disabled={!file}>{t('btn.analyze')}</Button>
										<Button variant="secondary" onClick={resetAll}>{t('btn.uploadNew')}</Button>
									</div>
								</div>
							)}

							{error && (
								<div className="mt-4 text-sm text-red-600">{error}</div>
							)}
						</div>
					</div>

					<div className="lg:col-span-2">
						{step === 1 && (
							<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center text-gray-600">
								{t('dropHere')}
							</div>
						)}

						{step === 2 && (
							<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
								<div className="flex items-center gap-3">
									<Loading />
									<div>
										<div className="font-medium text-gray-900">{t('processing.title')}</div>
										<div className="text-sm text-gray-600">{t('processing.subtitle')}</div>
									</div>
								</div>
								<div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
									<div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
								</div>
							</div>
						)}

						{step === 3 && results && (
							<div className="space-y-4">
								<div className={`rounded-xl p-4 border ${
									results.summary.status === 'all-normal' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
								}`}>
									<div className="font-semibold text-gray-900">
										{results.summary.status === 'all-normal' ? t('summary.allNormal') : t('summary.someAbnormal')}
									</div>
									<div className="text-sm text-gray-700">{t('summary.disclaimer')}</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{results.metrics.map((m: Metric) => (
										<div key={m.key} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
											<div className="flex items-center justify-between">
												<div className="font-medium text-gray-900">{m.key}</div>
												<div className={`text-sm px-2 py-1 rounded-full border ${
													m.status === 'normal' ? 'bg-green-50 text-green-700 border-green-200' : m.status === 'high' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
												}`}>{t(`metrics.status.${m.status}`)}</div>
											</div>
											<div className="mt-1 text-gray-700">
												<span className="text-2xl font-bold">{m.value}</span>
												<span className="ml-1 text-sm text-gray-500">{m.unit}</span>
											</div>
											<div className="mt-2 text-sm text-gray-600">{m.explanation}</div>

											<details className="mt-3 group">
												<summary className="text-sm text-gray-700 cursor-pointer select-none">{t('metrics.details.toggle')}</summary>
												<div className="mt-2 text-sm text-gray-600 leading-relaxed">
													{t('metrics.details.more', { key: m.key })}
												</div>
											</details>
										</div>
									))}
								</div>

								<div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
									<div className="font-semibold text-gray-900">{t('metrics.details.title')}</div>
									<p className="mt-2 text-gray-700 text-sm leading-relaxed">{results.details}</p>
									<div className="mt-4 flex flex-wrap gap-3">
										<Button onClick={downloadPdf}>{t('btn.download')}</Button>
										<Button variant="secondary" onClick={shareResults}>{t('btn.share')}</Button>
										<Button variant="ghost" onClick={resetAll}>{t('btn.retry')}</Button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
} 