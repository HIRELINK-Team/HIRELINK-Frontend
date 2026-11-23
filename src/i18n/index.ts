import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ko from './locales/ko.json';

const LANGUAGE_STORAGE_KEY = 'hirelink.student.language';

function getSavedLanguage(): 'ko' | 'en' {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'ko';
  } catch {
    return 'ko';
  }
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ko: { translation: ko } },
  lng: getSavedLanguage(),
  fallbackLng: 'ko',
  supportedLngs: ['ko', 'en'],
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The selected language still works for this session if storage is blocked.
  }
});

export default i18n;
