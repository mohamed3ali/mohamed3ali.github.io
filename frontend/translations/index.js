import { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { ar } from './ar';

const TranslationContext = createContext();

export const translations = {
  en,
  ar
};

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') || 'en';
      setLanguage(savedLang);
      
      // Apply language direction
      document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    
    // Update document direction and language
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
