"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Article, ArticleCategory, ArticleCategoryFilter, ArticleFilters } from '@/types/article';
import { ArticleSearch } from './ArticleSearch';
import { ArticleList } from './ArticleList';
import { Loading } from './ui/Loading';

interface ArticleListPageProps {
  locale: string;
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
  };
}

// Mock data for demonstration
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Understanding Your Blood Test Results: A Complete Guide',
    slug: 'understanding-blood-test-results-guide',
    excerpt: 'Learn how to interpret your blood test results and understand what each marker means for your health.',
    content: 'Full article content here...',
    featuredImage: '/images/articles/blood-test-guide.jpg',
    category: 'general',
    tags: ['blood test', 'health', 'diagnosis'],
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: '/images/authors/sarah-johnson.jpg',
      bio: 'Board-certified internal medicine physician with 15 years of experience.'
    },
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    readingTime: 8,
    featured: true,
    seo: {
      metaTitle: 'Understanding Your Blood Test Results: A Complete Guide',
      metaDescription: 'Learn how to interpret your blood test results and understand what each marker means for your health.',
      keywords: ['blood test', 'health', 'diagnosis', 'medical results']
    }
  },
  {
    id: '2',
    title: 'The Importance of Regular Health Checkups',
    slug: 'importance-regular-health-checkups',
    excerpt: 'Discover why regular health checkups are crucial for maintaining good health and preventing diseases.',
    content: 'Full article content here...',
    featuredImage: '/images/articles/health-checkup.jpg',
    category: 'prevention',
    tags: ['checkup', 'prevention', 'health'],
    author: {
      name: 'Dr. Michael Chen',
      avatar: '/images/authors/michael-chen.jpg',
      bio: 'Preventive medicine specialist with expertise in health screening.'
    },
    publishedAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    readingTime: 6,
    featured: true,
    seo: {
      metaTitle: 'The Importance of Regular Health Checkups',
      metaDescription: 'Discover why regular health checkups are crucial for maintaining good health and preventing diseases.',
      keywords: ['checkup', 'prevention', 'health', 'screening']
    }
  },
  {
    id: '3',
    title: 'Nutrition Tips for Better Health',
    slug: 'nutrition-tips-better-health',
    excerpt: 'Simple nutrition tips that can significantly improve your overall health and well-being.',
    content: 'Full article content here...',
    featuredImage: '/images/articles/nutrition-tips.jpg',
    category: 'nutrition',
    tags: ['nutrition', 'diet', 'health'],
    author: {
      name: 'Dr. Emily Rodriguez',
      avatar: '/images/authors/emily-rodriguez.jpg',
      bio: 'Registered dietitian and nutritionist with 10 years of clinical experience.'
    },
    publishedAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    readingTime: 5,
    featured: false,
    seo: {
      metaTitle: 'Nutrition Tips for Better Health',
      metaDescription: 'Simple nutrition tips that can significantly improve your overall health and well-being.',
      keywords: ['nutrition', 'diet', 'health', 'wellness']
    }
  },
  {
    id: '4',
    title: 'Exercise and Mental Health: The Connection',
    slug: 'exercise-mental-health-connection',
    excerpt: 'Explore how regular exercise can improve your mental health and reduce stress and anxiety.',
    content: 'Full article content here...',
    featuredImage: '/images/articles/exercise-mental-health.jpg',
    category: 'mental',
    tags: ['exercise', 'mental health', 'stress'],
    author: {
      name: 'Dr. James Wilson',
      avatar: '/images/authors/james-wilson.jpg',
      bio: 'Sports psychologist and mental health advocate.'
    },
    publishedAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    readingTime: 7,
    featured: false,
    seo: {
      metaTitle: 'Exercise and Mental Health: The Connection',
      metaDescription: 'Explore how regular exercise can improve your mental health and reduce stress and anxiety.',
      keywords: ['exercise', 'mental health', 'stress', 'anxiety']
    }
  },
  {
    id: '5',
    title: 'Recovery After Surgery: What to Expect',
    slug: 'recovery-after-surgery-what-expect',
    excerpt: 'A comprehensive guide to post-surgical recovery, including tips for faster healing.',
    content: 'Full article content here...',
    featuredImage: '/images/articles/surgery-recovery.jpg',
    category: 'treatment',
    tags: ['surgery', 'recovery', 'healing'],
    author: {
      name: 'Dr. Lisa Thompson',
      avatar: '/images/authors/lisa-thompson.jpg',
      bio: 'General surgeon with expertise in post-operative care.'
    },
    publishedAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-05T11:20:00Z',
    readingTime: 9,
    featured: false,
    seo: {
      metaTitle: 'Recovery After Surgery: What to Expect',
      metaDescription: 'A comprehensive guide to post-surgical recovery, including tips for faster healing.',
      keywords: ['surgery', 'recovery', 'healing', 'post-operative']
    }
  }
];

export function ArticleListPage({ locale, searchParams }: ArticleListPageProps) {
  const t = useTranslations('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ArticleFilters>({
    category: searchParams.category as ArticleCategory,
    search: searchParams.search,
    page: parseInt(searchParams.page || '1'),
    limit: 6
  });

  // Filter articles based on current filters
  const filteredArticles = useMemo(() => {
    let filtered = [...mockArticles];

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(article => article.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [filters]);

  // Separate featured and regular articles
  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  useEffect(() => {
    // Simulate API call
    const loadArticles = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setArticles(filteredArticles);
      setLoading(false);
    };

    loadArticles();
  }, [filteredArticles]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (category: ArticleCategoryFilter) => {
    setFilters(prev => ({ 
      ...prev, 
      category: category === 'all' ? undefined : category as ArticleCategory,
      page: 1 
    }));
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <ArticleSearch
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          selectedCategory={filters.category || 'all'}
          searchQuery={filters.search || ''}
          className="mb-8"
        />

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('featured')}
            </h2>
            <ArticleList
              articles={featuredArticles}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          </div>
        )}

        {/* Regular Articles */}
        {regularArticles.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('latest')}
            </h2>
            <ArticleList
              articles={regularArticles}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            />
          </div>
        )}

        {/* No Articles Found */}
        {filteredArticles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('noArticles')}
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
