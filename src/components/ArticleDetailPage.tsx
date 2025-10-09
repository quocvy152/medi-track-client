"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';

interface ArticleDetailPageProps {
  article: Article;
  locale: string;
}

export function ArticleDetailPage({ article, locale }: ArticleDetailPageProps) {
  const t = useTranslations('articles');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      nutrition: 'bg-green-100 text-green-800',
      exercise: 'bg-orange-100 text-orange-800',
      mental: 'bg-purple-100 text-purple-800',
      prevention: 'bg-red-100 text-red-800',
      treatment: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Category */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                {t(`categories.${article.category}`)}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              {article.excerpt}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="font-medium">{article.author.name}</p>
                  <p className="text-sm">{t('publishedOn')} {formatDate(article.publishedAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{article.readingTime} {t('readingTime')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative h-64 md:h-96">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="px-8 md:px-12 pb-8">
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="px-8 md:px-12 pb-8">
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-start space-x-4">
                {article.author.avatar && (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {article.author.name}
                  </h3>
                  {article.author.bio && (
                    <p className="text-gray-600">{article.author.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Articles */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/articles`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.featuredImage,
            "author": {
              "@type": "Person",
              "name": article.author.name,
              "image": article.author.avatar
            },
            "publisher": {
              "@type": "Organization",
              "name": "MediTrack",
              "logo": {
                "@type": "ImageObject",
                "url": "/images/medi_track_logo.png"
              }
            },
            "datePublished": article.publishedAt,
            "dateModified": article.updatedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://meditrack.com/${locale}/articles/${article.slug}`
            },
            "articleSection": article.category,
            "keywords": article.tags.join(", "),
            "wordCount": article.content.split(' ').length,
            "timeRequired": `PT${article.readingTime}M`
          })
        }}
      />
    </div>
  );
}
