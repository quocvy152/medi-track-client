export const i18n = {
  locales: ['vi', 'en'] as const,
  defaultLocale: 'vi'
};

export type Locale = (typeof i18n)['locales'][number]; 