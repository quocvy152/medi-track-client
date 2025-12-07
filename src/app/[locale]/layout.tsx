import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }];
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!['vi', 'en'].includes(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  // Check if this is an admin route by examining the children
  // If children contain AdminRootLayout, skip the client layout
  const childrenString = JSON.stringify(children);
  const isAdminRoute = childrenString.includes('AdminRootLayout') || 
                      childrenString.includes('admin');

  // For admin routes, return only the NextIntlClientProvider without Navigation/Footer
  if (isAdminRoute) {
    return (
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    );
  }

  // For client routes, return the full layout with Navigation and Footer
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        {/* Spacer for fixed floating header */}
        <div className="h-20 md:h-24 lg:h-28" />
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