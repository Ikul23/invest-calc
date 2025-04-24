import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRU from './locales/ru/translation.json';
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
  ru: { translation: translationRU },
  en: { translation: translationEN },
  zh: { translation: translationZH },
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
    },
  });

export default i18n;
