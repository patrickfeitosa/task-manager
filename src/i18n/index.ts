import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import type { Language } from '@Libs/language';

import enCommon from './locales/en/common.json';
import enTasks from './locales/en/tasks.json';
import ptCommon from './locales/pt/common.json';
import ptTasks from './locales/pt/tasks.json';

export const defaultNS = 'common';

export const resources = {
  en: { common: enCommon, tasks: enTasks },
  pt: { common: ptCommon, tasks: ptTasks },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    defaultNS,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    lng: 'en',
    resources,
  });
}

// One instance per provider (not the global singleton): on the server the singleton would be
// shared by concurrent requests that may use different languages.
export const createI18n = (lng: Language) => {
  const instance = i18n.createInstance();

  instance.use(initReactI18next).init({
    defaultNS,
    fallbackLng: 'en',
    initAsync: false,
    interpolation: { escapeValue: false },
    lng,
    resources,
  });

  return instance;
};

// Re-apply the bundles on every module evaluation: the `isInitialized` guard keeps the first
// global instance (used by tests and Storybook) across hot reloads, which would otherwise serve stale translations (and render raw
// keys on the server) after a locale JSON changes.
for (const [lng, namespaces] of Object.entries(resources)) {
  for (const [ns, bundle] of Object.entries(namespaces)) {
    i18n.addResourceBundle(lng, ns, bundle, true, true);
  }
}

export default i18n;
