"use client";

import { ArticleCategoryFilter, ArticleSearchProps } from '@/types/article';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Input } from './ui/Input';

export function ArticleSearch({ 
  onSearch, 
  onCategoryChange, 
  selectedCategory, 
  searchQuery, 
  className = '' 
}: ArticleSearchProps) {
  const t = useTranslations('articles');
  const [searchValue, setSearchValue] = useState(searchQuery);

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const categories: ArticleCategoryFilter[] = [
    'all',
    'general',
    'nutrition',
    'exercise',
    'mental',
    'prevention',
    'treatment'
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="lg:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as ArticleCategoryFilter)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white text-gray-900"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {t(`categories.${category}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Search: &quot;{searchQuery}&quot;
              <button
                onClick={() => onSearch('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              {t(`categories.${selectedCategory}`)}
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
