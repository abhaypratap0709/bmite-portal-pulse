import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en.json';
import translationHI from './locales/hi.json';
import translationPA from './locales/pa.json';
import translationHR from './locales/hr.json';
import translationTA from './locales/ta.json';
import translationTE from './locales/te.json';

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  pa: { translation: translationPA },
  hr: { translation: translationHR },
  ta: { translation: translationTA },
  te: { translation: translationTE },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

