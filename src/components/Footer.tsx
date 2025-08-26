import { useTranslations } from 'next-intl';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {t('copyright', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
} 