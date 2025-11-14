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

export default function HistoryDetailPage() {
	const t = useTranslations('history');
	const locale = useLocale();
	const router = useRouter();
	const params = useParams();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	
	const [analysis, setAnalysis] = useState<AnalysisHistoryItem | null>(null);
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
			setAnalysis(res.data);

			if (!res.success) {
				toast.error(res.message || 'Failed to load analysis');
				router.push(`/${locale}/history`);
			}
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
			<div className="text-center pt-16 pb-12 px-4">
				<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
					{t('details.title')}
				</h1>
				<div className="flex items-center justify-center gap-4 mt-4">
					<Button
						onClick={handleBack}
						variant="secondary"
						className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-xl border border-gray-600 transition-all duration-300"
					>
						← {t('details.back')}
					</Button>
					<div className="text-gray-400 text-sm">
						<span className="font-medium">{t('details.fileName')}:</span> Analysis Result
					</div>
					<div className="text-gray-400 text-sm">
						<span className="font-medium">{t('details.analyzedAt')}:</span> {formatDate(analysis.createdTime)}
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

