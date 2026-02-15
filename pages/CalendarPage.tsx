import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, MapPin, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalendarDay } from '../types';

const NEPALI_MONTHS = [
  { np: 'बैशाख', en: 'Baishakh' },
  { np: 'जेठ', en: 'Jestha' },
  { np: 'असार', en: 'Asar' },
  { np: 'साउन', en: 'Shrawan' },
  { np: 'भदौ', en: 'Bhadra' },
  { np: 'असोज', en: 'Asoj' },
  { np: 'कात्तिक', en: 'Kartik' },
  { np: 'मंसिर', en: 'Mangsir' },
  { np: 'पुस', en: 'Poush' },
  { np: 'माघ', en: 'Magh' },
  { np: 'फागुन', en: 'Falgun' },
  { np: 'चैत', en: 'Chaitra' }
];

// Mock Data Generator for any given Nepali Month/Year
const generateMonthData = (year: number, monthIndex: number): { days: CalendarDay[], startDayIndex: number } => {
  const days: CalendarDay[] = [];
  const tithis = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'औंसी'];
  
  // Basic Algorithm to determine start day: shifts by roughly 2 days each month + year shift
  // This is a pseudo-random consistent mock to look like a calendar
  const startDayIndex = (year + monthIndex * 3) % 7; 
  
  const daysInMonth = monthIndex % 2 === 0 ? 31 : 30; // Mock: Alternate 31 and 30

  // Mock Festivals per month
  const getEvents = (mIndex: number) => {
    const ev: Record<number, { title: string; desc: string; holiday: boolean }> = {};
    if (mIndex === 0) { // Baishakh
        ev[1] = { title: 'नयाँ वर्ष', desc: 'नेपाली नयाँ वर्षको शुभकामना।', holiday: true };
        ev[11] = { title: 'लोकतन्त्र दिवस', desc: 'लोकतन्त्र स्थापना दिवस।', holiday: true };
        ev[25] = { title: 'बुद्ध जयन्ती', desc: 'भगवान गौतम बुद्धको जन्मजयन्ती।', holiday: true };
    } else if (mIndex === 2) { // Asar
        ev[15] = { title: 'दही चिउरा', desc: 'असारे पन्ध्र, धान दिवस।', holiday: false };
    } else if (mIndex === 5) { // Asoj (Dashain usually)
        ev[10] = { title: 'घटस्थापना', desc: 'बडा दशैंको पहिलो दिन।', holiday: true };
        ev[17] = { title: 'फूलपाती', desc: 'दशैंको सातौं दिन।', holiday: true };
        ev[19] = { title: 'विजया दशमी', desc: 'बडा दशैंको मुख्य दिन (टीका)।', holiday: true };
    } else if (mIndex === 6) { // Kartik (Tihar usually)
        ev[10] = { title: 'लक्ष्मी पूजा', desc: 'तिहारको तेस्रो दिन, धनधान्यकी देवी लक्ष्मीको पूजा।', holiday: true };
        ev[12] = { title: 'भाई टीका', desc: 'दिदीबहिनी र दाजुभाइबीचको प्रेमको पर्व।', holiday: true };
        ev[18] = { title: 'छठ पर्व', desc: 'सूर्य देवताको उपासना गर्ने पर्व।', holiday: true };
    } else if (mIndex === 9) { // Magh
        ev[1] = { title: 'माघे संक्रान्ति', desc: 'माघी पर्व, घ्यू चाकु खाने दिन।', holiday: true };
    } else if (mIndex === 10) { // Falgun
        ev[15] = { title: 'होली', desc: 'रंगहरूको पर्व फागु पूर्णिमा।', holiday: true };
    }
    return ev;
  };

  const events = getEvents(monthIndex);

  for (let i = 1; i <= daysInMonth; i++) {
    // Determine English Date (Approximate)
    // Nepali Year starts approx mid-April
    const baseDate = new Date(year - 57, 3, 13); // Apr 13 roughly
    baseDate.setMonth(baseDate.getMonth() + monthIndex);
    baseDate.setDate(baseDate.getDate() + i - 1);
    
    const dayOfWeek = (startDayIndex + i - 1) % 7;
    const isSaturday = dayOfWeek === 6;
    const eventData = events[i];
    const isHoliday = eventData?.holiday || isSaturday;
    
    days.push({
      dateBS: i,
      dateAD: `${baseDate.getDate()} ${baseDate.toLocaleString('default', { month: 'short' })}`,
      fullDateAD: baseDate.toLocaleDateString(),
      dayName: '', // Logic handled in grid
      isHoliday: isHoliday,
      event: eventData?.title || '',
      description: eventData?.desc || (isSaturday ? 'साप्ताहिक बिदा (शनिबार)' : 'शुभ दिन'),
      tithi: tithis[(i + year) % 30] || 'औंसी', // Pseudo random tithi
    });
  }
  return { days, startDayIndex };
};

const CalendarPage = () => {
  const { t, language } = useApp();
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  
  // Initialize state but waiting for useEffect to set current date
  const [year, setYear] = useState(2081);
  const [monthIndex, setMonthIndex] = useState(0); 

  // Effect to load "Present Day" based on System Time
  useEffect(() => {
    const now = new Date();
    // Rough Algorithm: Nepali Year is AD + 57 (approximately)
    // Nepali New Year is usually mid-April.
    // So if current month is Jan, Feb, Mar, or early Apr, the Nepali year is AD + 56.
    // However, specifically for 2024-2025 cycle:
    // Apr 2024 starts 2081.
    
    // Determine AD Year offset
    const currentADYear = now.getFullYear();
    const currentADMonth = now.getMonth(); // 0-11
    
    let currentBSYear = currentADYear + 57;
    // Before mid-April, it's technically previous BS year end
    if (currentADMonth < 3 || (currentADMonth === 3 && now.getDate() < 13)) {
      currentBSYear = currentADYear + 56;
    }

    // Determine Month Index (0 = Baishakh = ~April)
    // April (3) -> Baishakh (0)
    // May (4) -> Jestha (1)
    // ...
    // Jan (0) -> Poush/Magh (8/9)
    let currentBSMonth = (currentADMonth - 3 + 12) % 12;
    // Adjust for mid-month split (Simple toggle for mock)
    if (now.getDate() < 13) {
      currentBSMonth = (currentBSMonth - 1 + 12) % 12;
    }

    setYear(currentBSYear);
    setMonthIndex(currentBSMonth);
  }, []);
  
  const { days, startDayIndex } = useMemo(() => generateMonthData(year, monthIndex), [year, monthIndex]);
  
  const weekDaysNp = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentWeekDays = language === 'np' ? weekDaysNp : weekDaysEn;
  
  // Padding for start of month
  const startPad = Array.from({ length: startDayIndex });

  // Today marker calculation (approx)
  const today = new Date();
  const isCurrentMonthDisplayed = () => {
     // Very rough check for UI purposes
     const currentADYear = today.getFullYear();
     const bsYear = currentADYear + 57; 
     // Logic is loose here because it's a mock calendar generator
     // We just check if the year matches what we calculated initially
     return Math.abs(year - bsYear) <= 1; 
  };
  // We will highlight a specific day if it matches approximately
  const currentDayHighlight = (dateBS: number) => {
    // For mock, we just say if it's the current month and day is roughly calculated
    // In a real app with exact conversion, this matches exactly.
    // Here we just map AD day to BS day loosely: AD Day + 17 approx = BS Day
    const approxBSDay = (today.getDate() + 17) % 30 || 1; 
    return isCurrentMonthDisplayed() && dateBS === approxBSDay;
  };


  const handlePrevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(prev => prev - 1);
    } else {
      setMonthIndex(prev => prev - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(prev => prev + 1);
    } else {
      setMonthIndex(prev => prev + 1);
    }
    setSelectedDay(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, day: CalendarDay) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setSelectedDay(day);
    }
  };

  const currentMonthName = language === 'np' ? NEPALI_MONTHS[monthIndex].np : NEPALI_MONTHS[monthIndex].en;

  return (
    <div className="max-w-4xl mx-auto pb-10 font-nepali">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-nepalRed dark:text-red-400 flex items-center gap-2">
            <CalendarIcon className="mb-1" />
            {t('calendar')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
             नेपाली पात्रो, तिथि र चाडपर्वहरू
          </p>
        </div>

        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 p-1">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-6 font-bold text-lg text-gray-800 dark:text-gray-200 min-w-[180px] text-center">
            {currentMonthName} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            aria-label="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-nepalRed text-white">
          {currentWeekDays.map((day, idx) => (
            <div key={day} className={`py-3 text-center font-bold text-sm md:text-base ${idx === 6 ? 'bg-red-700' : ''}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {/* Empty Slots */}
          {startPad.map((_, i) => (
            <div key={`empty-${i}`} className="h-20 md:h-32 border-b border-r border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50"></div>
          ))}

          {/* Date Slots */}
          {days.map((day, idx) => {
            const isToday = currentDayHighlight(day.dateBS);
            return (
            <div 
              key={idx}
              onClick={() => setSelectedDay(day)}
              onKeyDown={(e) => handleKeyDown(e, day)}
              tabIndex={0}
              role="button"
              aria-label={`${day.dateBS} ${currentMonthName}, ${day.event ? day.event : ''}`}
              className={`
                group relative h-20 md:h-32 border-b border-r border-gray-100 dark:border-gray-700/50 p-1 md:p-2 
                transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-inset focus:ring-nepalBlue
                hover:bg-blue-50 dark:hover:bg-blue-900/10
                ${day.isHoliday ? 'bg-red-50/30 dark:bg-red-900/5' : ''}
                ${isToday ? 'bg-blue-100/50 dark:bg-blue-900/20' : ''}
              `}
            >
              {isToday && <div className="absolute top-1 right-1 w-2 h-2 bg-nepalBlue rounded-full animate-pulse md:w-3 md:h-3"></div>}

              {/* Nepali Date */}
              <div className="flex justify-between items-start">
                <span className={`text-xl md:text-3xl font-bold leading-none ${day.isHoliday ? 'text-nepalRed dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
                  {day.dateBS}
                </span>
                {/* English Date - Hidden on very small screens if needed, but useful */}
                <span className="text-[9px] md:text-xs font-medium text-gray-400 dark:text-gray-500 font-sans">
                  {day.dateAD.split(' ')[0]}
                </span>
              </div>

              {/* Tithi */}
              <div className="mt-0.5 md:mt-1 text-[9px] md:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                {day.tithi}
              </div>

              {/* Event Badge */}
              {day.event && (
                <div className="absolute bottom-1 left-1 right-1">
                   <div className={`text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded truncate font-medium shadow-sm ${
                     day.isHoliday 
                       ? 'bg-nepalRed text-white' 
                       : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                   }`}>
                     {day.event}
                   </div>
                </div>
              )}
            </div>
          )})}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedDay(null)}
          ></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
            {/* Modal Header */}
            <div className={`p-6 ${selectedDay.isHoliday ? 'bg-nepalRed' : 'bg-nepalBlue'} text-white relative`}>
              <button 
                onClick={() => setSelectedDay(null)}
                className="absolute top-4 right-4 p-1 bg-white/20 hover:bg-white/30 rounded-full transition"
              >
                <X size={20} />
              </button>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-sm font-medium opacity-90 mb-1">{currentMonthName} {year}</div>
                  <div className="text-6xl font-bold leading-none">{selectedDay.dateBS}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold opacity-90">
                    {language === 'np' ? weekDaysNp[(startDayIndex + selectedDay.dateBS - 1) % 7] : weekDaysEn[(startDayIndex + selectedDay.dateBS - 1) % 7]}
                  </div>
                  <div className="text-sm opacity-75 font-sans">{selectedDay.fullDateAD}</div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              
              {/* Event Section */}
              {selectedDay.event ? (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                  <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300 mb-1">{selectedDay.event}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDay.description}</p>
                </div>
              ) : (
                <div className="text-gray-500 italic text-center py-2">{t('noResults')} (कुनै विशेष छैन)</div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">तिथि (Tithi)</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedDay.tithi}</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase font-bold block mb-1">स्थान (Loc)</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">नेपाल (Nepal)</span>
                </div>
              </div>

              {selectedDay.isHoliday && (
                <div className="flex items-center space-x-2 text-nepalRed dark:text-red-400 font-medium text-sm justify-center pt-2">
                  <Info size={16} />
                  <span>आज सार्वजनिक बिदा हो</span>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 flex justify-center border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;