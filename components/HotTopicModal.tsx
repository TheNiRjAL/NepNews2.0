import React, { useEffect, useState } from 'react';
import { X, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchHotTopic } from '../services/supabaseService';
import { HotTopic } from '../types';

const HotTopicModal = () => {
  const { t } = useApp();
  const [topic, setTopic] = useState<HotTopic | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check for hot topic every 3 mins
    const checkTopic = async () => {
      const hot = await fetchHotTopic();
      const lastSeenId = localStorage.getItem('last_seen_hot_topic');
      
      if (hot && hot.id !== lastSeenId) {
        setTopic(hot);
        setIsOpen(true);
        // Store in local storage to avoid duplicate
        localStorage.setItem('last_seen_hot_topic', hot.id);
      }
    };

    checkTopic(); // Initial check
    const interval = setInterval(checkTopic, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen || !topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 animate-fade-in" 
        onClick={() => setIsOpen(false)} 
      />
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 pointer-events-auto border-l-8 border-nepalRed animate-bounce-in mx-4 mb-4 sm:mb-0">
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full animate-pulse">
            <Flame className="text-nepalRed dark:text-red-400 h-8 w-8" fill="currentColor" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-nepalRed uppercase tracking-wider mb-1 flex items-center">
              {t('hotTopic')}
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </h3>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {topic.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {topic.description}
            </p>
            <div className="mt-5 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotTopicModal;