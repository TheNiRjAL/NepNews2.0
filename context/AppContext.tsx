import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationDictionary } from '../types';
import { DICTIONARY } from '../constants';

interface AppContextProps {
  language: Language;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  // CHANGED: Default language is strictly 'np'
  const [language, setLanguage] = useState<Language>('np');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load from local storage, fallback to 'np'
    const savedLang = localStorage.getItem('nepnews_lang') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      setLanguage('np'); // Force Nepali default if not set
    }

    const savedTheme = localStorage.getItem('nepnews_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'np' ? 'en' : 'np';
    setLanguage(newLang);
    localStorage.setItem('nepnews_lang', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('nepnews_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const t = (key: string): string => {
    const entry = DICTIONARY[key];
    if (!entry) return key;
    return entry[language];
  };

  return (
    <AppContext.Provider value={{ language, toggleLanguage, theme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};