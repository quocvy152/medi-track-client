import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  if (!['vi', 'en'].includes(locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </NextIntlClientProvider>
  );
} 