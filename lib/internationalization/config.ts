export type Locale = (typeof locales)[number];

export const locales = ['en', 'es', 'fr', 'hi', 'ja', 'ur', 'zh'] as const;
export const defaultLocale: Locale = 'en';
