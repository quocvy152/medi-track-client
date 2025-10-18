import AdminRootLayout from '@/components/admin/AdminRootLayout';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Admin Layout for /admin route group
 * 
 * This layout provides:
 * - Completely separate from client layout
 * - No Navigation or Footer from client
 * - Admin-specific layout with sidebar and header
 * - Independent internationalization support
 */
export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  // Use Vietnamese as default locale for admin
  const locale = 'vi';
  const messages = await getMessages({ locale });
  
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AdminRootLayout locale={locale} messages={messages}>
        {children}
      </AdminRootLayout>
    </NextIntlClientProvider>
  );
}
