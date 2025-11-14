"use client";

import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisHistoryItem, historyService } from "@/services/historyService";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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

function formatBytes(bytes: number) {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

// Lấy biến môi trường ở top level để Next.js có thể replace nó ở build time
const CLOUDFLARE_R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '';

export default function HistoryPage() {
	const t = useTranslations('history');
	const locale = useLocale();
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	
	const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		// Chờ auth check hoàn tất trước khi quyết định redirect
		if (authLoading) {
			return;
		}

		if (!isAuthenticated) {
			router.push(`/${locale}/login`);
			return;
		}
		
		loadHistory();
	}, [isAuthenticated, authLoading, locale, router]);

	const loadHistory = async () => {
		try {
			setLoading(true);
			const response = await historyService.getHistory();
			setHistory(response?.data || []);
		} catch (error) {
			toast.error(t('toast.loadError'));
			console.error('Failed to load history:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		console.log("🚀 ~ handleDelete ~ id:", id)
		e.stopPropagation();
		if (!confirm('Bạn có chắc chắn muốn xóa kết quả phân tích này?')) {
			return;
		}

		try {
			setDeletingId(id);
			await historyService.deleteAnalysis(id);
			toast.success(t('toast.deleteSuccess'));
			setHistory(history.filter(item => item.id !== id));
			if (selectedItem?.id === id) {
				setSelectedItem(null);
			}
		} catch (error) {
			toast.error(t('toast.deleteError'));
		} finally {
			setDeletingId(null);
		}
	};

	const handleViewDetails = (item: AnalysisHistoryItem) => {
		router.push(`/${locale}/history/${item.id}`);
	};

	const handleViewFile = (item: AnalysisHistoryItem, e: React.MouseEvent) => {
		e.stopPropagation();
		
		if (!item.file?.path) {
			toast.error(t('toast.fileNotFound'));
			return;
		}

		const publicLink = `${CLOUDFLARE_R2_PUBLIC_URL}/${item.file?.path}`;
		
		window.open(publicLink, '_blank', 'noopener,noreferrer');
	};

	const getFileIcon = (mimeType?: string) => {
		if (!mimeType) return '📄';
		if (mimeType.startsWith('image/')) return '🖼️';
		if (mimeType === 'application/pdf') return '📕';
		if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
		return '📄';
	};

	if (authLoading || loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
				<Loading />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			{/* Header Section */}
			<div className="text-center pt-16 pb-12 px-4">
				<h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
					{t('title')}
				</h1>
				<p className="text-xl text-gray-300 max-w-2xl mx-auto">
					{t('subtitle')}
				</p>
			</div>

			<div className="mx-auto w-full max-w-7xl px-4 pb-16">
				{history.length === 0 ? (
					<div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-12 shadow-2xl text-center">
						<div className="text-6xl mb-6">📋</div>
						<h2 className="text-2xl font-semibold text-white mb-4">{t('empty.title')}</h2>
						<p className="text-gray-400 text-lg mb-8">{t('empty.description')}</p>
						<Button
							onClick={() => router.push(`/${locale}`)}
							className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
						>
							{t('empty.button')}
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{history.map((item) => (
							<div
								key={item.id}
								className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
							>
								{/* Header with delete button */}
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										<div className="text-sm text-gray-400">
											<span className="font-medium">{t('card.analyzedAt')}:</span> {formatDate(item.createdTime)}
										</div>
									</div>
									<button
										onClick={(e) => handleDelete(item.id, e)}
										disabled={deletingId === item.id}
										className="ml-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
										title={t('card.delete')}
									>
										{deletingId === item.id ? (
											<div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
										) : (
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										)}
									</button>
								</div>

								{/* File Information Section */}
								<div className="mb-4 pb-4 border-b border-gray-700/50">
									<div className="flex items-center gap-3 mb-3">
										<div className="text-3xl">{getFileIcon(item.file?.type)}</div>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium text-gray-300 mb-1 truncate">
												{item.file?.name || t('card.fileName')}
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-col gap-3">
									{item.file?.path && (
										<Button
											onClick={(e) => handleViewFile(item, e)}
											className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
											{t('card.viewFile')}
										</Button>
									)}
									<Button
										onClick={() => handleViewDetails(item)}
										className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
									>
										{t('card.viewDetails')}
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

