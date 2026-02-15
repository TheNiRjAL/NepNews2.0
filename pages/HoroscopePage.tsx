import React, { useMemo } from 'react';
import { MOCK_RASHIFAL } from '../constants';
import { useApp } from '../context/AppContext';
import { Sun, Sparkles } from 'lucide-react';

const HoroscopePage = () => {
  const { t, language } = useApp();

  // Get current date relative to 4 AM cutoff
  // If it's 3 AM, we are still technically "yesterday" for the horoscope cycle
  const getHoroscopeDate = () => {
    const now = new Date();
    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }
    return now;
  };

  const displayDate = getHoroscopeDate();
  
  const formattedDate = displayDate.toLocaleDateString(language === 'np' ? 'ne-NP' : 'en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Deterministic shuffle based on date string
  // This ensures everyone sees the same "random" result for the day, and it changes daily
  const dailyHoroscope = useMemo(() => {
    const seed = displayDate.getFullYear() * 10000 + (displayDate.getMonth() + 1) * 100 + displayDate.getDate();
    
    // Simple seeded random generator
    const seededRandom = (s: number) => {
      let t = s += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const signs = [...MOCK_RASHIFAL];
    
    // We don't shuffle the signs themselves (Aries is always Aries),
    // We shuffle the *predictions* and *lucky numbers* to make it dynamic daily.
    return signs.map((sign, index) => {
      const dailySeed = seed + index;
      const rnd = seededRandom(dailySeed);
      
      // Pick a random lucky number between 1-9 based on day
      const luckyNum = Math.floor(rnd * 9) + 1;
      
      // Rotate colors (Mock logic)
      const colors = ['रातो (Red)', 'सेतो (White)', 'हरियो (Green)', 'पहेँलो (Yellow)', 'निलो (Blue)', 'कालो (Black)', 'गुलाबी (Pink)'];
      const luckyColor = colors[Math.floor(rnd * colors.length)];

      // In a real app, you'd fetch specific text. Here we keep the static text but add a prefix to show it's "fresh"
      return {
        ...sign,
        luckyNumber: luckyNum,
        luckyColor: language === 'np' ? luckyColor.split(' ')[0] : luckyColor.split(' ')[1].replace(/[()]/g, ''),
        // Append a dynamic "energy" score just for UI flair
        energy: Math.floor(rnd * 40) + 60 // 60% to 100%
      };
    });
  }, [displayDate.getDate(), language]);

  return (
    <div className="pb-10">
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sun className="text-orange-500 animate-spin-slow" size={32} />
          <h1 className="text-4xl font-bold text-nepalBlue dark:text-blue-400">{t('todayHoroscope')}</h1>
        </div>
        <div className="inline-block bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-6 py-2 rounded-full border border-blue-200 dark:border-blue-700">
           <p className="text-lg text-blue-800 dark:text-blue-200 font-bold capitalize">{formattedDate}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">Refreshes daily at 4:00 AM</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyHoroscope.map((sign, index) => (
          <div 
            key={sign.id} 
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 opacity-0 animate-slide-up flex flex-col"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/40 dark:to-amber-900/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-orange-100 dark:border-orange-900/50">
                  {sign.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {language === 'np' ? sign.nepaliName : sign.englishName}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                    <Sparkles size={10} />
                    <span>Energy: {sign.energy}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[48px] leading-relaxed font-nepali">
              {sign.prediction}
            </p>

            <div className="mt-auto grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/30 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Color</span>
                <span className="font-bold text-nepalRed dark:text-red-400">{sign.luckyColor}</span>
              </div>
              <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-700/30 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Number</span>
                <span className="font-bold text-nepalBlue dark:text-blue-400">{sign.luckyNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HoroscopePage;