"use client";

import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { AnalysisHistoryItem, historyService } from "@/services/historyService";
import {
	ArrowRightIcon,
	ClockIcon,
	DocumentIcon,
	DocumentTextIcon,
	EyeIcon,
	FunnelIcon,
	MagnifyingGlassIcon,
	PhotoIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function HistoryPage() {
	const t = useTranslations('history');
	const locale = useLocale();
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	
	const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const loadHistory = useCallback(async () => {
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
	}, [t]);

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
	}, [isAuthenticated, authLoading, locale, router, loadHistory]);

	const handleDelete = async (id: string, e: React.MouseEvent) => {
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
		} catch {
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
		if (!mimeType) return DocumentTextIcon;
		if (mimeType.startsWith('image/')) return PhotoIcon;
		if (mimeType === 'application/pdf') return DocumentIcon;
		return DocumentTextIcon;
	};

	// Filter and sort history
	const filteredAndSortedHistory = useMemo(() => {
		let filtered = history;

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(item => 
				item.file?.name?.toLowerCase().includes(query) ||
				formatDate(item.createdTime).toLowerCase().includes(query)
			);
		}

		// Apply sorting
		filtered = [...filtered].sort((a, b) => {
			let comparison = 0;
			
			if (sortBy === 'date') {
				comparison = new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
			} else if (sortBy === 'name') {
				const nameA = a.file?.name || '';
				const nameB = b.file?.name || '';
				comparison = nameA.localeCompare(nameB);
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return filtered;
	}, [history, searchQuery, sortBy, sortOrder]);

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
			<div className="text-center pt-20 pb-12 px-4">
				<h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
					{t('title')}
				</h1>
				<p className="text-xl text-gray-300 max-w-2xl mx-auto">
					{t('subtitle')}
				</p>
			</div>

			<div className="mx-auto w-full max-w-7xl px-4 pb-16">
				{history.length === 0 ? (
					<div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-16 shadow-2xl text-center">
						<div className="flex justify-center mb-6">
							<div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
								<DocumentTextIcon className="w-12 h-12 text-blue-400" />
							</div>
						</div>
						<h2 className="text-3xl font-bold text-white mb-4">{t('empty.title')}</h2>
						<p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">{t('empty.description')}</p>
						<Button
							onClick={() => router.push(`/${locale}/upload`)}
							className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
						>
							{t('empty.button')}
						</Button>
					</div>
				) : (
					<>
						{/* Search and Filter Bar */}
						<div className="mb-8 space-y-4">
							{/* Search Bar */}
							<div className="relative">
								<MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="text"
									placeholder="Search by file name or date..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-12 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
									>
										<XMarkIcon className="w-5 h-5" />
									</button>
								)}
							</div>

							{/* Sort Controls */}
							<div className="flex items-center gap-4 flex-wrap">
								<div className="flex items-center gap-2">
									<FunnelIcon className="w-5 h-5 text-gray-400" />
									<span className="text-sm text-gray-400">Sort by:</span>
								</div>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
									className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 cursor-pointer"
								>
									<option value="date">Date</option>
									<option value="name">File Name</option>
								</select>
								<button
									onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
									className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white text-sm hover:bg-slate-700/60 transition-all duration-200 cursor-pointer"
								>
									{sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
								</button>
								{searchQuery && (
									<div className="ml-auto text-sm text-gray-400">
										Found {filteredAndSortedHistory.length} of {history.length} results
									</div>
								)}
							</div>
						</div>

						{/* History Cards Grid */}
						{filteredAndSortedHistory.length === 0 ? (
							<div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-12 shadow-2xl text-center">
								<MagnifyingGlassIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
								<p className="text-gray-400">Try adjusting your search query</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredAndSortedHistory.map((item) => {
									const FileIcon = getFileIcon(item.file?.type);
									const hasAbnormalResults = item.result?.risks?.some(r => r.level !== 'Normal') ?? false;
									
									return (
										<div
											key={item.id}
											className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
											onClick={() => handleViewDetails(item)}
										>
											{/* Card Header */}
											<div className="flex items-start justify-between mb-5">
												<div className="flex items-center gap-3 flex-1 min-w-0">
													<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
														<FileIcon className="w-6 h-6 text-blue-400" />
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="text-base font-semibold text-white truncate mb-1">
															{item.file?.name || t('card.fileName')}
														</h3>
														<div className="flex items-center gap-2 text-xs text-gray-400">
															<ClockIcon className="w-4 h-4" />
															<span className="truncate">{formatDate(item.createdTime)}</span>
														</div>
													</div>
												</div>
												<button
													onClick={(e) => handleDelete(item.id, e)}
													disabled={deletingId === item.id}
													className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
													title={t('card.delete')}
												>
													{deletingId === item.id ? (
														<div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
													) : (
														<TrashIcon className="w-5 h-5" />
													)}
												</button>
											</div>

											{/* Status Badge */}
											{hasAbnormalResults && (
												<div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
													<div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
													<span className="text-xs font-medium text-amber-400">Abnormal results detected</span>
												</div>
											)}

											{/* Summary Stats */}
											<div className="mb-5 grid grid-cols-2 gap-3">
												<div className="bg-slate-900/40 rounded-lg p-3">
													<div className="text-xs text-gray-400 mb-1">Summary</div>
													<div className="text-lg font-semibold text-white">{item.result?.summary?.length ?? 0}</div>
												</div>
												<div className="bg-slate-900/40 rounded-lg p-3">
													<div className="text-xs text-gray-400 mb-1">Risks</div>
													<div className="text-lg font-semibold text-white">{item.result?.risks?.length ?? 0}</div>
												</div>
											</div>

											{/* Action Buttons */}
											<div className="flex items-center gap-2">
												{item.file?.path && (
													<button
														onClick={(e) => handleViewFile(item, e)}
														className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-300 font-medium rounded-lg transition-all duration-200 text-sm cursor-pointer"
													>
														<EyeIcon className="w-4 h-4" />
														<span className="hidden sm:inline">{t('card.viewFile')}</span>
													</button>
												)}
												<button
													onClick={() => handleViewDetails(item)}
													className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm cursor-pointer"
												>
													<span>{t('card.viewDetails')}</span>
													<ArrowRightIcon className="w-4 h-4" />
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

