'use client';

import { useTranslation } from 'react-i18next';

import { Button } from '@Ui/Button';

import { LANGUAGE_COOKIE, type Language, resolveLanguage } from '@Libs/language';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation('common');
  const current = resolveLanguage(i18n.language);
  const next: Language = current === 'en' ? 'pt' : 'en';

  // The cookie makes the next server render use the chosen language (see app/layout.tsx).
  const handleClick = () => {
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in all browsers
    document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    document.documentElement.lang = next;
    i18n.changeLanguage(next);
  };

  return (
    <Button
      aria-label={t('language.switch', { language: t(`language.${next}`) })}
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      {next.toUpperCase()}
    </Button>
  );
};
