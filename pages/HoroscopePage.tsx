import React, { useMemo, useState, useEffect } from 'react';
import { MOCK_RASHIFAL } from '../constants';
import { useApp } from '../context/AppContext';
import { Sun, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchAIHoroscope } from '../services/aiService';
import { HoroscopeSign } from '../types';

const HoroscopePage = () => {
  const { t, language } = useApp();
  const [loading, setLoading] = useState(false);
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeSign[]>([]);
  const [fetchError, setFetchError] = useState(false);

  // Logic: Horoscope refreshes at 4:00 AM
  // If current time < 4:00 AM, we show "yesterday's" horoscope (which is technically the active one for the "night")
  // If current time >= 4:00 AM, we show "today's"
  const getDisplayDate = () => {
    const now = new Date();
    if (now.getHours() < 4) {
      now.setDate(now.getDate() - 1);
    }
    return now;
  };

  // We use useMemo to calculate this once on render to avoid mismatch during renders, 
  // though typically standard Date() calls in component body are fine for client-side apps.
  // Using a state initialized function ensures it stays stable.
  const [displayDate] = useState(getDisplayDate);
  
  const formattedDate = displayDate.toLocaleDateString(language === 'np' ? 'ne-NP' : 'en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Deterministic shuffle logic (offline fallback)
  const getOfflineData = () => {
    // Seed based on Year, Month, Day of the *displayDate* (adjusted for 4 AM)
    const seed = displayDate.getFullYear() * 10000 + (displayDate.getMonth() + 1) * 100 + displayDate.getDate();
    
    const seededRandom = (s: number) => {
      let t = s += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const signs = [...MOCK_RASHIFAL];
    
    return signs.map((sign, index) => {
      const dailySeed = seed + index;
      const rnd = seededRandom(dailySeed);
      const luckyNum = Math.floor(rnd * 9) + 1;
      const colors = ['रातो (Red)', 'सेतो (White)', 'हरियो (Green)', 'पहेँलो (Yellow)', 'निलो (Blue)', 'कालो (Black)', 'गुलाबी (Pink)'];
      const luckyColor = colors[Math.floor(rnd * colors.length)];

      return {
        ...sign,
        luckyNumber: luckyNum,
        luckyColor: language === 'np' ? luckyColor.split(' ')[0] : luckyColor.split(' ')[1].replace(/[()]/g, ''),
        energy: Math.floor(rnd * 40) + 60 
      };
    });
  };

  // Initial load
  useEffect(() => {
    setHoroscopeData(getOfflineData());
  }, [language, displayDate.getDate()]); // Re-run if language or date changes

  const handleRefresh = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      // Pass the adjusted displayDate to AI service
      const aiData = await fetchAIHoroscope(language, displayDate);
      
      if (aiData && aiData.length > 0) {
        // Merge AI data with static data (icons, names) to ensure consistent UI
        const mergedData = MOCK_RASHIFAL.map(staticSign => {
          const aiSign = aiData.find(a => a.id === staticSign.id) || aiData.find(a => a.id?.toLowerCase() === staticSign.englishName.toLowerCase());
          
          if (aiSign) {
            return {
              ...staticSign,
              prediction: aiSign.prediction || staticSign.prediction,
              luckyColor: aiSign.luckyColor || staticSign.luckyColor,
              luckyNumber: aiSign.luckyNumber || staticSign.luckyNumber,
              energy: aiSign.energy || 80
            };
          }
          return { ...staticSign, energy: 75 }; // Fallback if ID mismatch
        });
        setHoroscopeData(mergedData);
      }
    } catch (err) {
      console.error("Failed to fetch latest horoscope", err);
      setFetchError(true);
      setTimeout(() => setFetchError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="text-center mb-8 animate-fade-in relative">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sun className="text-orange-500 animate-spin-slow" size={32} />
          <h1 className="text-4xl font-bold text-nepalBlue dark:text-blue-400">{t('todayHoroscope')}</h1>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-6 py-2 rounded-full border border-blue-200 dark:border-blue-700">
             <p className="text-lg text-blue-800 dark:text-blue-200 font-bold capitalize">{formattedDate}</p>
          </div>

          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-nepalBlue hover:border-nepalBlue transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? (language === 'np' ? 'लोड हुँदैछ...' : 'Updating...') : (language === 'np' ? 'ताजा गर्नुहोस्' : 'Refresh Latest')}
          </button>
          
          <div className="h-4">
            {fetchError ? (
               <span className="text-xs text-red-500 flex items-center gap-1 animate-fade-in">
                 <AlertCircle size={12} /> Live update failed. Showing offline prediction.
               </span>
            ) : (
               <p className="text-[10px] text-gray-400 italic">Refreshes daily at 4:00 AM</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {horoscopeData.map((sign, index) => (
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