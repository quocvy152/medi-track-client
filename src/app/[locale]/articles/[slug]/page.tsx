import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticleDetailPage } from '@/components/ArticleDetailPage';

interface ArticlePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Mock function to get article by slug
async function getArticleBySlug(slug: string) {
  // In a real app, this would fetch from your API/database
  const mockArticles = [
    {
      id: '1',
      title: 'Understanding Your Blood Test Results: A Complete Guide',
      slug: 'understanding-blood-test-results-guide',
      excerpt: 'Learn how to interpret your blood test results and understand what each marker means for your health.',
      content: `
        <h2>Introduction</h2>
        <p>Blood tests are one of the most common diagnostic tools used in modern medicine. They provide valuable insights into your overall health and can help detect various conditions early. However, understanding what all those numbers and abbreviations mean can be overwhelming.</p>
        
        <h2>Common Blood Test Markers</h2>
        <h3>Complete Blood Count (CBC)</h3>
        <p>The CBC measures different components of your blood, including:</p>
        <ul>
          <li><strong>Red Blood Cells (RBC):</strong> Carry oxygen throughout your body</li>
          <li><strong>White Blood Cells (WBC):</strong> Fight infections and diseases</li>
          <li><strong>Platelets:</strong> Help with blood clotting</li>
          <li><strong>Hemoglobin:</strong> Protein in red blood cells that carries oxygen</li>
        </ul>
        
        <h3>Basic Metabolic Panel (BMP)</h3>
        <p>This panel checks your body's chemical balance and metabolism:</p>
        <ul>
          <li><strong>Glucose:</strong> Blood sugar levels</li>
          <li><strong>Electrolytes:</strong> Sodium, potassium, chloride, and bicarbonate</li>
          <li><strong>Kidney function:</strong> BUN and creatinine levels</li>
        </ul>
        
        <h2>Understanding Normal Ranges</h2>
        <p>It's important to note that normal ranges can vary between laboratories and populations. Your healthcare provider will interpret your results in the context of your overall health, age, and other factors.</p>
        
        <h2>When to Be Concerned</h2>
        <p>While slight variations from normal ranges are common, significant deviations may indicate underlying health issues. Always discuss your results with your healthcare provider.</p>
        
        <h2>Conclusion</h2>
        <p>Understanding your blood test results empowers you to take an active role in your health. Remember, these tests are just one piece of the puzzle, and your healthcare provider is the best person to interpret them in the context of your overall health.</p>
      `,
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
    }
  ];
  
  return mockArticles.find(article => article.slug === slug) || null;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const locale = params.locale;

  return {
    title: article.seo.metaTitle,
    description: article.seo.metaDescription,
    keywords: article.seo.keywords,
    openGraph: {
      title: article.seo.metaTitle,
      description: article.seo.metaDescription,
      type: 'article',
      locale: locale,
      siteName: 'MediTrack',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: article.featuredImage ? [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo.metaTitle,
      description: article.seo.metaDescription,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    alternates: {
      canonical: `/${locale}/articles/${article.slug}`,
      languages: {
        'en': `/en/articles/${article.slug}`,
        'vi': `/vi/articles/${article.slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <ArticleDetailPage 
      article={article}
      locale={params.locale}
    />
  );
}
