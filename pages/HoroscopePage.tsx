import React from 'react';
import { MOCK_RASHIFAL } from '../constants';
import { useApp } from '../context/AppContext';

const HoroscopePage = () => {
  const { t, language } = useApp();
  const today = new Date().toLocaleDateString(language === 'np' ? 'ne-NP' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="pb-10">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-nepalBlue dark:text-blue-400 mb-2">{t('todayHoroscope')}</h1>
        <div className="inline-block bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
           <p className="text-lg text-blue-800 dark:text-blue-200 font-medium">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_RASHIFAL.map((sign, index) => (
          <div 
            key={sign.id} 
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-0 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                {sign.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {language === 'np' ? sign.nepaliName : sign.englishName}
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[48px] leading-relaxed">
              {sign.prediction}
            </p>

            <div className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl">
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Color</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{sign.luckyColor}</span>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>
              <div className="flex flex-col text-right">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Number</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{sign.luckyNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoroscopePage;