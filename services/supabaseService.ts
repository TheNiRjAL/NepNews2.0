import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Candidate, NewsItem, HotTopic } from '../types';
import { MOCK_CANDIDATES, MOCK_NEWS, MOCK_HOT_TOPICS } from '../constants';

// Safe environment variable accessor to prevent "process is not defined" crashes in browser
const getEnv = (key: string) => {
  try {
    // Check for Vite's import.meta.env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    // Check for process.env (Next.js / CRA)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {}
  
  return '';
};

// Try different naming conventions (Next.js vs Vite)
const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || '';

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Supabase init failed:", e);
  }
}

// Wrapper to determine if we use real DB or Mock Data
const useMock = !supabase;

export const getAllCandidates = async (): Promise<Candidate[]> => {
  if (useMock) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_CANDIDATES;
  }
  
  const { data, error } = await supabase!
    .from('candidates')
    .select('*');

  if (error) throw error;
  return data as Candidate[];
};

export const searchCandidates = async (query: string): Promise<Candidate[]> => {
  if (useMock) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const lowerQuery = query.toLowerCase();
    return MOCK_CANDIDATES.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.party.toLowerCase().includes(lowerQuery) ||
      c.district.toLowerCase().includes(lowerQuery) ||
      c.municipality.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Real implementation
  const { data, error } = await supabase!
    .from('candidates')
    .select('*')
    .or(`name.ilike.%${query}%,party.ilike.%${query}%,district.ilike.%${query}%`);

  if (error) throw error;
  return data as Candidate[];
};

export const fetchNews = async (): Promise<NewsItem[]> => {
  if (useMock) {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Return news sorted by date for freshness
    return [...MOCK_NEWS].sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  const { data, error } = await supabase!
    .from('news_cache')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as unknown as NewsItem[]; // Casting for simplicity
};

export const fetchHotTopic = async (): Promise<HotTopic | null> => {
  if (useMock) {
    // Prioritize Breaking News:
    // Sort news by date descending to get the absolute latest
    const sortedNews = [...MOCK_NEWS].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    if (sortedNews.length > 0) {
      const latest = sortedNews[0];
      const now = Date.now();
      const newsTime = new Date(latest.publishedAt).getTime();
      const hoursDiff = (now - newsTime) / (1000 * 60 * 60);

      // User requested "at least 5 hour old news or more latest news"
      // We interpret this as: Show the latest news, provided it is within the last 5-6 hours.
      // Our MOCK_NEWS[0] is always "Just Now", MOCK_NEWS[5] is 5 hours ago.
      // If we have news within ~6 hours, use it as Hot Topic.
      if (hoursDiff <= 6) {
         return {
           id: `breaking_${latest.id}`,
           title: `ताजा अपडेट: ${latest.title}`, // Prefixing with "Fresh Update"
           description: latest.description,
           isActive: true
         };
      }
    }

    // Fallback if no recent news (unlikely with dynamic mock data)
    const randomIndex = Math.floor(Math.random() * MOCK_HOT_TOPICS.length);
    return MOCK_HOT_TOPICS[randomIndex];
  }

  const { data, error } = await supabase!
    .from('hot_topics')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data as HotTopic;
};