import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

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

  if (!['vi', 'en'].includes(locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
} 