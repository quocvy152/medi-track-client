"use client";

import AnalysisResultsDisplay from "@/components/AnalysisResultsDisplay";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisHistoryItem, historyService } from "@/services/historyService";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function formatDate(dateString: string) {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

// Lấy biến môi trường ở top level để Next.js có thể replace nó ở build time
const CLOUDFLARE_R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '';

export default function HistoryDetailPage() {
	const t = useTranslations('history');
	const locale = useLocale();
	const router = useRouter();
	const params = useParams();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	
	const [analysis, setAnalysis] = useState<AnalysisHistoryItem | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Chờ auth check hoàn tất trước khi quyết định redirect
		if (authLoading) {
			return;
		}

		if (!isAuthenticated) {
			router.push(`/${locale}/login`);
			return;
		}
		
		if (params?.id) {
			loadAnalysis(params.id as string);
		}
	}, [isAuthenticated, authLoading, locale, router, params?.id]);

	const loadAnalysis = async (id: string) => {
		try {
			setLoading(true);
			const res = await historyService.getAnalysisById(id);

			const { data, success, message } = res;

			if (!success) {
				toast.error(res.message || 'Failed to load analysis');
				router.push(`/${locale}/history`);
			}

			setAnalysis(data);
			setFileName(data.file.name || null);
		} catch (error) {
			toast.error(t('toast.loadError'));
			console.error('Failed to load analysis:', error);
			router.push(`/${locale}/history`);
		} finally {
			setLoading(false);
		}
	};

	const handleBack = () => {
		router.push(`/${locale}/history`);
	};

	const handleViewFile = () => {
		if (!analysis?.file?.path) {
			toast.error(t('toast.fileNotFound'));
			return;
		}

		const publicLink = `${CLOUDFLARE_R2_PUBLIC_URL}/${analysis.file.path}`;
		window.open(publicLink, '_blank', 'noopener,noreferrer');
	};

	// Hiển thị loading khi đang check auth hoặc đang load data
	if (authLoading || loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
				<Loading />
			</div>
		);
	}

	if (!analysis) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
				<div className="text-center">
					<div className="text-6xl mb-6">❌</div>
					<h2 className="text-2xl font-semibold text-white mb-4">Không tìm thấy kết quả phân tích</h2>
					<Button
						onClick={handleBack}
						className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
					>
						{t('details.back')}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			{/* Header Section */}
			<div className="pt-16 pb-12">
				{/* Title */}
				<div className="mx-auto w-full max-w-7xl px-4 mb-20">
					<h1 className="text-5xl md:text-6xl font-bold text-white text-center">
						{t('details.title')}
					</h1>
				</div>

				{/* Action Bar */}
				<div className="mx-auto w-full max-w-7xl px-4">
					<div className="flex items-start justify-between gap-4 flex-wrap">
						{/* Left: Back Button */}
						<Button
							onClick={handleBack}
							variant="secondary"
							className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-xl border border-gray-600 transition-all duration-300"
						>
							← {t('details.back')}
						</Button>

						{/* Right: File Info & Actions */}
						<div className="flex flex-col items-end gap-3">
							{/* Row 1: Analyzed At */}
							<div className="text-gray-400 text-sm">
								<span className="font-medium">{t('details.analyzedAt')}:</span> {formatDate(analysis.createdTime)}
							</div>

							{/* Row 2: File Name & View File Button */}
							<div className="flex items-center gap-3 flex-wrap">
								<div className="text-gray-400 text-sm">
									<span className="font-medium">{t('details.fileName')}:</span> {fileName || ''}
								</div>
								{analysis.file?.path && (
									<Button
										onClick={handleViewFile}
										className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
										{t('card.viewFile')}
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mx-auto w-full max-w-7xl px-4 pb-16">
				<AnalysisResultsDisplay 
					results={analysis.result}
					onBack={handleBack}
					showBackButton={true}
				/>
			</div>
		</div>
	);
}

