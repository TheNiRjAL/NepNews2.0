import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe, Flag, Newspaper, Users, Star, Calendar, Gamepad2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { t, language, toggleLanguage, theme, toggleTheme } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? 'text-nepalRed dark:text-red-400 font-bold' 
    : 'text-gray-600 dark:text-gray-400 hover:text-nepalBlue dark:hover:text-blue-300';

  const navItemClasses = "px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm font-medium";
  const mobileNavClasses = "flex flex-col items-center justify-center w-full py-1 text-xs";

  const DesktopNavLinks = () => (
    <>
      <Link to="/news" className={`${isActive('/news')} ${navItemClasses}`}>{t('news')}</Link>
      <Link to="/horoscope" className={`${isActive('/horoscope')} ${navItemClasses}`}>{t('horoscope')}</Link>
      <Link to="/calendar" className={`${isActive('/calendar')} ${navItemClasses}`}>{t('calendar')}</Link>
      <Link to="/callbreak" className={`${isActive('/callbreak')} ${navItemClasses}`}>
        <Gamepad2 size={16} className="mr-1" />
        Callbreak
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col font-nepali bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full group-hover:scale-110 transition-transform duration-200">
                <Flag className="h-6 w-6 text-nepalRed" fill="currentColor" />
              </div>
              <Link to="/" className="text-2xl font-bold text-nepalBlue dark:text-blue-400 tracking-tight">
                {t('appTitle')}
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-2 items-center">
              <DesktopNavLinks />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleLanguage} 
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95"
              >
                <Globe size={16} />
                <span className="text-sm font-semibold">{language === 'np' ? 'EN' : 'ने'}</span>
              </button>
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95 text-gray-600 dark:text-gray-300"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Added padding bottom for mobile nav */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 animate-fade-in">
        {children}
      </main>

      {/* Footer (Desktop Only mostly) */}
      <footer className="bg-gray-900 text-white py-12 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-3 rounded-full">
               <Flag className="h-6 w-6 text-nepalRed" fill="currentColor" />
            </div>
          </div>
          <p className="mb-4 text-gray-400">© {new Date().getFullYear()} {t('appTitle')}. All rights reserved.</p>
          <div className="flex justify-center flex-wrap gap-4 md:gap-8 text-sm text-gray-500">
            <Link to="/admin" className="hover:text-white transition">Admin Panel</Link>
            <span className="hidden md:inline">•</span>
            <span>Privacy Policy</span>
            <span className="hidden md:inline">•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - The "Better Way" to Access Pages */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          <Link to="/news" className={`${mobileNavClasses} ${location.pathname === '/news' ? 'text-nepalBlue dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
            <Newspaper size={20} className={location.pathname === '/news' ? 'mb-1 stroke-2' : 'mb-1 stroke-1.5'} />
            <span className="text-[10px]">{t('news')}</span>
          </Link>
           {/* Removed Election Link, moved Callbreak */}
          <Link to="/callbreak" className={`${mobileNavClasses} ${location.pathname === '/callbreak' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
            <Gamepad2 size={24} className={location.pathname === '/callbreak' ? 'mb-1 stroke-2' : 'mb-1 stroke-1.5'} />
            <span className="text-[10px]">Game</span>
          </Link>
          <Link to="/horoscope" className={`${mobileNavClasses} ${location.pathname === '/horoscope' ? 'text-yellow-600 dark:text-yellow-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
            <Star size={20} className={location.pathname === '/horoscope' ? 'mb-1 stroke-2' : 'mb-1 stroke-1.5'} />
            <span className="text-[10px]">{t('horoscope')}</span>
          </Link>
          <Link to="/calendar" className={`${mobileNavClasses} ${location.pathname === '/calendar' ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
            <Calendar size={20} className={location.pathname === '/calendar' ? 'mb-1 stroke-2' : 'mb-1 stroke-1.5'} />
            <span className="text-[10px]">{t('calendar')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;