"use client";

import { ArticleListProps } from '@/types/article';
import { ArticleCard } from './ArticleCard';

export function ArticleList({ 
  articles, 
  loading = false, 
  onLoadMore, 
  hasMore = false, 
  className = '',
  locale = 'en'
}: ArticleListProps) {
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden animate-pulse">
              <div className="h-52 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"></div>
              <div className="p-6">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-4/5"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>
                <div className="flex items-center mb-5 pb-5 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-24"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          locale={locale}
        />
      ))}
      
      {hasMore && onLoadMore && (
        <div className="col-span-full flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 font-semibold cursor-pointer"
          >
            Load More Articles
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
