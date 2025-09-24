'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'vi';

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="text-lg font-semibold text-gray-900">MediTrack</div>
            <p className="mt-1 text-sm text-gray-500">Theo dõi và hiểu kết quả xét nghiệm y tế của bạn.</p>
          </div>

          <div className="flex justify-center space-x-6">
            <Link href={`/${locale}/terms`} className="text-sm text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline">
              {t('terms')}
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-600 text-sm">
              {t('copyright', { year: currentYear })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 