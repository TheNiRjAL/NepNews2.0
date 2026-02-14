import React, { useState, useEffect } from 'react';
import { Search, MapPin, Award, X, User, GraduationCap, BookOpen, Fingerprint, Flag, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { searchCandidates, getAllCandidates } from '../services/supabaseService';
import { Candidate } from '../types';

const ElectionPage = () => {
  const { t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState('');

  // Load all candidates on mount
  useEffect(() => {
    loadAllCandidates();
  }, []);

  const loadAllCandidates = async () => {
    setLoading(true);
    try {
      const data = await getAllCandidates();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch candidates.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadAllCandidates();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await searchCandidates(searchTerm);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="text-center space-y-3 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-nepalRed dark:text-red-400">
          {t('candidatesTitle')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          Find comprehensive information about all election candidates.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative px-4 sm:px-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-nepalRed focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20 transition shadow-sm text-lg outline-none"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-nepalRed transition-colors" size={24} />
          {searchTerm && (
             <button 
               type="button" 
               onClick={() => { setSearchTerm(''); loadAllCandidates(); }}
               className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
             >
               <X size={20} />
             </button>
          )}
        </div>
      </form>

      {/* Results Grid */}
      <div className="mt-8">
        {error && <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg animate-fade-in">{error}</div>}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 h-80">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {results.length === 0 && !error ? (
              <div className="text-center text-gray-500 py-12 animate-fade-in">
                <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="opacity-40" />
                </div>
                <p className="text-xl font-medium">{t('noResults')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
                {results.map((candidate, index) => (
                  <div 
                    key={candidate.id} 
                    onClick={() => setSelectedCandidate(candidate)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 transform hover:-translate-y-2 cursor-pointer opacity-0 animate-slide-up overflow-hidden flex flex-col"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Photo Section with Party Logo */}
                    <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {candidate.imageUrl ? (
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <User size={64} />
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                      {/* Position Badge */}
                      <div className="absolute top-3 left-3">
                         <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider border border-white/20">
                           {candidate.position}
                         </span>
                      </div>

                      {/* Party Logo (Symbol) - Placed prominently in photo section */}
                      <div className="absolute -bottom-6 right-4 z-10">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                           {candidate.symbolUrl ? (
                             <img src={candidate.symbolUrl} alt="Party Symbol" className="w-full h-full object-cover rounded-full" />
                           ) : (
                             <Award size={32} className="text-nepalRed" />
                           )}
                        </div>
                      </div>
                      
                      {/* Name on Image (Mobile friendly style) */}
                      <div className="absolute bottom-4 left-4 right-20 text-white">
                        <h3 className="text-xl font-bold leading-tight shadow-black drop-shadow-md">
                          {candidate.name}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Info Section */}
                    <div className="p-5 pt-8 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center text-nepalRed dark:text-red-400 font-bold text-sm mb-3">
                          <Flag size={14} className="mr-2" />
                          {candidate.party}
                        </div>

                        <div className="flex items-start text-gray-500 dark:text-gray-400 text-xs gap-2 mb-3">
                           <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                           <span className="line-clamp-2">{candidate.municipality}, {t('ward')} {candidate.ward}, {candidate.district}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-2">
                         <div className="text-xs font-medium text-gray-400">
                           View Details
                         </div>
                         <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-nepalBlue group-hover:text-white transition-colors">
                           <ChevronRight size={16} />
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedCandidate(null)}
          ></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in font-nepali">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition backdrop-blur-md"
            >
              <X size={24} />
            </button>

            {/* Modal Header with Photo */}
            <div className="relative h-64 w-full overflow-hidden">
               {selectedCandidate.imageUrl ? (
                 <img src={selectedCandidate.imageUrl} alt={selectedCandidate.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-nepalBlue to-blue-900 flex items-center justify-center">
                    <User size={80} className="text-white/20" />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
               
               <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
                 <div className="text-white">
                   <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-nepalRed text-white text-xs rounded-full font-bold uppercase tracking-wider shadow-lg">
                        {selectedCandidate.position}
                      </span>
                   </div>
                   <h2 className="text-3xl md:text-4xl font-bold leading-none mb-2">{selectedCandidate.name}</h2>
                   <div className="flex items-center text-gray-300 font-medium text-sm md:text-base">
                      <Flag size={16} className="mr-2" />
                      {selectedCandidate.party}
                   </div>
                 </div>

                 {/* Party Logo in Modal */}
                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-1.5 shadow-2xl flex-shrink-0 -mb-10 md:-mb-12 mr-4 relative z-10">
                    <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                        {selectedCandidate.symbolUrl ? (
                            <img src={selectedCandidate.symbolUrl} alt="Symbol" className="w-full h-full object-cover" />
                        ) : (
                            <Award size={40} className="text-nepalRed" />
                        )}
                    </div>
                 </div>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 space-y-8 pt-12 md:pt-14">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                  <div className="text-nepalBlue dark:text-blue-400 mb-1 flex justify-center"><User size={20} /></div>
                  <div className="text-xs text-gray-500 uppercase font-bold">{t('age')}</div>
                  <div className="font-bold text-xl">{selectedCandidate.age || 'N/A'}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                  <div className="text-nepalBlue dark:text-blue-400 mb-1 flex justify-center"><Fingerprint size={20} /></div>
                  <div className="text-xs text-gray-500 uppercase font-bold">{t('ward')}</div>
                  <div className="font-bold text-xl">{selectedCandidate.ward}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl text-center border border-gray-100 dark:border-gray-700 col-span-2">
                  <div className="text-nepalBlue dark:text-blue-400 mb-1 flex justify-center"><MapPin size={20} /></div>
                  <div className="text-xs text-gray-500 uppercase font-bold">{t('district')}</div>
                  <div className="font-bold text-xl truncate px-2">{selectedCandidate.district}</div>
                </div>
              </div>

              {/* Education & Bio */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-nepalBlue dark:text-blue-400">
                      <GraduationCap size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{t('education')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{selectedCandidate.education || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                      <BookOpen size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{t('bio')}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {selectedCandidate.bio || 'No biography available.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-nepalRed dark:text-red-400">
                      <Award size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{t('manifesto')}</h3>
                    <div className="p-5 bg-gray-50 dark:bg-gray-700/20 rounded-2xl border border-gray-100 dark:border-gray-700/50 mt-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {selectedCandidate.manifesto || 'No manifesto details available.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                 <button 
                   onClick={() => setSelectedCandidate(null)}
                   className="w-full py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-xl transition text-lg"
                 >
                   {t('close')}
                 </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionPage;