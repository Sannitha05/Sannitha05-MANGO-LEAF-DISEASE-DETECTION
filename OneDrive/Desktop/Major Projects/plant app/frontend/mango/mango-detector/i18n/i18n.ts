import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      te: { translation: te },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;