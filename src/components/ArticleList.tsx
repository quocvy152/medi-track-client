"use client";

import { ArticleListProps } from '@/types/article';
import { ArticleCard } from './ArticleCard';

export function ArticleList({ 
  articles, 
  loading = false, 
  onLoadMore, 
  hasMore = false, 
  className = '' 
}: ArticleListProps) {
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4 w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
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
        />
      ))}
      
      {hasMore && onLoadMore && (
        <div className="col-span-full flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
