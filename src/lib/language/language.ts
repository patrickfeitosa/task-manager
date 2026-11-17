// Framework-free (importable from Server Components): supported languages and the cookie that
// remembers the user's choice. The cookie, unlike localStorage, is visible to the server, so the
// first render already uses the right language and hydration matches.
export const LANGUAGES = ['en', 'pt'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';
export const LANGUAGE_COOKIE = 'language';

export const isLanguage = (value: string | null | undefined): value is Language =>
  LANGUAGES.includes(value as Language);

export const resolveLanguage = (value: string | null | undefined): Language =>
  isLanguage(value) ? value : DEFAULT_LANGUAGE;
