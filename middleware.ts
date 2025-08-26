import { i18n } from '@/i18n';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: i18n.locales as unknown as string[],
  defaultLocale: i18n.defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
}; 