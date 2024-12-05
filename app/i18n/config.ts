import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { en } from './locales/en';
import { zh } from './locales/zh';
import { es } from './locales/es';
import { hi } from './locales/hi';
import { ar } from './locales/ar';
import { pt } from './locales/pt';
import { bn } from './locales/bn';
import { ru } from './locales/ru';
import { ja } from './locales/ja';
import { fr } from './locales/fr';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
      hi: { translation: hi },
      ar: { translation: ar },
      pt: { translation: pt },
      bn: { translation: bn },
      ru: { translation: ru },
      ja: { translation: ja },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;