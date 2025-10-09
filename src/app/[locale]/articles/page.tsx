import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArticleListPage } from '@/components/ArticleListPage';

interface ArticlesPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
  };
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const t = await getTranslations('articles');
  const locale = params.locale;

  return {
    title: t('title'),
    description: t('subtitle'),
    keywords: [
      'health articles',
      'medical insights',
      'health information',
      'wellness tips',
      'medical advice',
      'health education',
      'disease prevention',
      'nutrition advice',
      'exercise tips',
      'mental health'
    ],
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      type: 'website',
      locale: locale,
      siteName: 'MediTrack',
      images: [
        {
          url: '/images/medi_track_logo.png',
          width: 1200,
          height: 630,
          alt: 'MediTrack Health Articles',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('subtitle'),
      images: ['/images/medi_track_logo.png'],
    },
    alternates: {
      canonical: `/${locale}/articles`,
      languages: {
        'en': '/en/articles',
        'vi': '/vi/articles',
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

export default function ArticlesPage({ params, searchParams }: ArticlesPageProps) {
  return (
    <ArticleListPage 
      locale={params.locale}
      searchParams={searchParams}
    />
  );
}
