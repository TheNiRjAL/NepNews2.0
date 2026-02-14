import React, { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw, ExternalLink, Zap, Vote, Star, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchNews } from '../services/supabaseService';
import { NewsItem } from '../types';

const NewsPage = () => {
  const { t } = useApp();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await fetchNews();
      setNews(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load news', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
    const intervalId = setInterval(() => {
      loadNews(true);
    }, 3 * 60 * 1000); 
    return () => clearInterval(intervalId);
  }, [loadNews]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('ne-NP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const QuickLink = ({ to, icon: Icon, title, colorClass }: any) => (
    <Link to={to} className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition active:scale-95 group`}>
      <div className={`p-3 rounded-full mb-2 ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{title}</span>
    </Link>
  );

  return (
    <div className="space-y-8">
      
      {/* Quick Access Section */}
      <div className="animate-slide-down">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          {t('quickLinks')}
          <ArrowRight size={16} className="ml-2 opacity-50" />
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickLink 
            to="/horoscope" 
            icon={Star} 
            title={t('horoscope')} 
            colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" 
          />
          <QuickLink 
            to="/calendar" 
            icon={Calendar} 
            title={t('calendar')} 
            colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

      {/* News Header */}
      <div className="flex justify-between items-center pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Zap className="text-nepalBlue dark:text-blue-400" fill="currentColor" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-nepalBlue dark:text-blue-400">{t('news')}</h1>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="hidden sm:inline">{t('updated')} {lastUpdated.toLocaleTimeString()}</span>
          <button 
            onClick={() => loadNews(true)}
            className={`p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95 ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800 h-48 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
          {news.map((item, index) => (
            <a 
              key={item.id} 
              href={item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-nepalBlue/30 dark:hover:border-blue-500/30 p-5 transform hover:-translate-y-1 active:scale-[0.98] cursor-pointer opacity-0 animate-slide-up block"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-center mb-3">
                 <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                   item.category === 'election' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' :
                   item.category === 'politics' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' :
                   'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                 }`}>
                    {item.category === 'election' ? 'चुनाव' : item.category === 'politics' ? 'राजनीति' : 'राष्ट्रिय'}
                 </span>
                 <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(item.publishedAt)}
                 </span>
              </div>
              
              <h2 className="text-lg font-bold mb-2 leading-tight text-gray-900 dark:text-gray-100 group-hover:text-nepalBlue dark:group-hover:text-blue-400 transition">
                {item.title}
              </h2>
              
              <div className="text-xs font-semibold text-nepalRed dark:text-red-400 mb-2">
                 {item.source}
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed font-nepali">
                {item.description}
              </p>
              
              <div className="pt-3 border-t border-gray-50 dark:border-gray-700/50 mt-auto">
                <span className="flex items-center space-x-1 text-gray-500 hover:text-nepalBlue dark:hover:text-blue-400 font-medium text-xs transition">
                  <span>{t('readMore')}</span>
                  <ExternalLink size={12} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;