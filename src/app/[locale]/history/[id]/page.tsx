"use client";

import AnalysisResultsDisplay from "@/components/AnalysisResultsDisplay";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisHistoryItem, historyService } from "@/services/historyService";
import {
	ArrowLeftIcon,
	CalendarIcon,
	DocumentIcon,
	DocumentTextIcon,
	EyeIcon,
	HomeIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function formatDate(dateString: string, locale: string) {
	const date = new Date(dateString);
	const localeMap: Record<string, string> = {
		en: 'en-US',
		vi: 'vi-VN',
	};
	const dateLocale = localeMap[locale] || 'en-US';
	return new Intl.DateTimeFormat(dateLocale, {
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
	const [loading, setLoading] = useState(true);

	const fileIcon = useMemo(() => {
		if (!analysis?.file?.type) return DocumentTextIcon;
		if (analysis.file.type.startsWith('image/')) return PhotoIcon;
		if (analysis.file.type === 'application/pdf') return DocumentIcon;
		return DocumentTextIcon;
	}, [analysis?.file?.type]);

	const hasAbnormalResults = useMemo(() => {
		return analysis?.result?.risks?.some(r => r.level !== 'Normal') ?? false;
	}, [analysis?.result?.risks]);

	const loadAnalysisRef = useCallback(async (id: string) => {
		try {
			setLoading(true);
			const res = await historyService.getAnalysisById(id);

			const { data, success } = res;

			if (!success) {
				toast.error(res.message || 'Failed to load analysis');
				router.push(`/${locale}/history`);
				return;
			}

			setAnalysis(data);
		} catch (error) {
			toast.error(t('toast.loadError'));
			console.error('Failed to load analysis:', error);
			router.push(`/${locale}/history`);
		} finally {
			setLoading(false);
		}
	}, [locale, router, t]);

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
			loadAnalysisRef(params.id as string);
		}
	}, [isAuthenticated, authLoading, locale, router, params?.id, loadAnalysisRef]);


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
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center">
				<Loading />
			</div>
		);
	}

	if (!analysis) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
				<div className="mx-auto w-full max-w-7xl px-4 pt-20 pb-16">
					{/* Breadcrumbs */}
					<nav className="mb-8 flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
						<Link 
							href={`/${locale}`}
							className="hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
						>
							<HomeIcon className="w-4 h-4" />
							<span>{t('details.breadcrumbs.home')}</span>
						</Link>
						<ChevronRightIcon className="w-4 h-4" />
						<Link 
							href={`/${locale}/history`}
							className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
						>
							{t('details.breadcrumbs.history')}
						</Link>
						<ChevronRightIcon className="w-4 h-4" />
						<span className="text-gray-500">{t('details.title')}</span>
					</nav>

					{/* Error State */}
					<div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-16 shadow-2xl text-center">
						<div className="flex justify-center mb-6">
							<div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
								<DocumentTextIcon className="w-12 h-12 text-red-400" />
							</div>
						</div>
						<h2 className="text-3xl font-bold text-white mb-4">{t('details.notFound.title')}</h2>
						<p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">{t('details.notFound.description')}</p>
						<Button
							onClick={handleBack}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
						>
							{t('details.back')}
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const FileIcon = fileIcon;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
			{/* Subtle background pattern */}
			<div className="fixed inset-0 pointer-events-none z-0 opacity-5">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(8,145,178,0.1),transparent_50%)]" />
			</div>

			<div className="relative z-10">
				<div className="mx-auto w-full max-w-7xl px-4 pt-20 pb-16">
					{/* Breadcrumbs */}
					<nav className="mb-8 flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
						<Link 
							href={`/${locale}`}
							className="hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
						>
							<HomeIcon className="w-4 h-4" />
							<span>{t('details.breadcrumbs.home')}</span>
						</Link>
						<ChevronRightIcon className="w-4 h-4" />
						<Link 
							href={`/${locale}/history`}
							className="hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
						>
							{t('details.breadcrumbs.history')}
						</Link>
						<ChevronRightIcon className="w-4 h-4" />
						<span className="text-gray-500">{t('details.title')}</span>
					</nav>

					{/* Header Section */}
					<div className="mb-8">
						<div className="flex items-start justify-between gap-4 flex-wrap mb-6">
							{/* Title */}
							<div className="flex-1 min-w-0">
								<h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
									{t('details.title')}
								</h1>
								<p className="text-gray-400 text-lg">
									{analysis.file?.name || t('details.fileName')}
								</p>
							</div>

							{/* Back Button */}
							<Button
								onClick={handleBack}
								variant="secondary"
								className="bg-slate-800/60 hover:bg-slate-700/60 text-white font-semibold py-2.5 px-6 rounded-xl border border-slate-700/50 transition-all duration-300 flex items-center gap-2 cursor-pointer"
							>
								<ArrowLeftIcon className="w-5 h-5" />
								{t('details.back')}
							</Button>
						</div>

						{/* Status Badge */}
						{hasAbnormalResults && (
							<div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
								<div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium text-amber-400">Abnormal results detected</span>
							</div>
						)}
					</div>

					{/* Metadata Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						{/* File Info Card */}
						<div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
									<FileIcon className="w-5 h-5 text-blue-400" />
								</div>
								<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
									{t('details.metadata.fileInfo')}
								</h3>
							</div>
							<div className="space-y-2">
								<div className="text-white font-semibold text-lg truncate" title={analysis.file?.name || ''}>
									{analysis.file?.name || t('details.fileName')}
								</div>
								<div className="text-gray-400 text-sm">
									{analysis.file?.type || 'Unknown type'}
								</div>
							</div>
						</div>

						{/* Analysis Date Card */}
						<div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center">
									<CalendarIcon className="w-5 h-5 text-cyan-400" />
								</div>
								<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
									{t('details.metadata.analysisDate')}
								</h3>
							</div>
							<div className="space-y-2">
								<div className="text-white font-semibold text-lg">
									{formatDate(analysis.createdTime, locale)}
								</div>
								<div className="text-gray-400 text-sm">
									{t('details.analyzedAt')}
								</div>
							</div>
						</div>

						{/* Actions Card */}
						<div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
									<EyeIcon className="w-5 h-5 text-purple-400" />
								</div>
								<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
									Actions
								</h3>
							</div>
							<div className="space-y-2">
								{analysis.file?.path ? (
									<Button
										onClick={handleViewFile}
										className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
									>
										<EyeIcon className="w-5 h-5" />
										{t('card.viewFile')}
									</Button>
								) : (
									<div className="text-gray-500 text-sm italic">
										{t('toast.fileNotFound')}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Analysis Results */}
					<div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
						<AnalysisResultsDisplay 
							results={analysis.result}
							onBack={handleBack}
							showBackButton={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

