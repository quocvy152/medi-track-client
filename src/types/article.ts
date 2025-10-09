export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: ArticleCategory;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt: string;
  readingTime: number; // in minutes
  featured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export type ArticleCategory = 
  | 'general'
  | 'nutrition'
  | 'exercise'
  | 'mental'
  | 'prevention'
  | 'treatment';

export type ArticleCategoryFilter = ArticleCategory | 'all';

export interface ArticleFilters {
  category?: ArticleCategory;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
}

export interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export interface ArticleSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: ArticleCategoryFilter) => void;
  selectedCategory: ArticleCategoryFilter;
  searchQuery: string;
  className?: string;
}
