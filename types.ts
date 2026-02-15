export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyIcon?: string;
  position: string;
  district: string;
  municipality: string;
  ward: number;
  votes?: number;
  imageUrl: string;
  symbolUrl?: string;
  age?: number;
  education?: string;
  bio?: string;
  manifesto?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  imageUrl: string;
  publishedAt: string;
  category: 'election' | 'politics' | 'national';
  url: string;
}

export interface HoroscopeSign {
  id: string;
  nepaliName: string;
  englishName: string;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
  icon: string;
  energy?: number;
}

export interface CalendarDay {
  dateAD: string;
  dateBS: number;
  dayName: string;
  isHoliday: boolean;
  event?: string;
  tithi: string;
  description?: string;
  fullDateAD: string;
}

export type Language = 'np' | 'en';

export interface TranslationDictionary {
  [key: string]: {
    np: string;
    en: string;
  };
}

export interface HotTopic {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}