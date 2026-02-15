import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Candidate, NewsItem, HotTopic } from '../types';
import { MOCK_CANDIDATES, MOCK_NEWS, MOCK_HOT_TOPICS } from '../constants';

// Safe environment variable accessor
const getEnv = (key: string) => {
  // Vite env access
  if ((import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  // Fallback for process.env if defined
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch(e) {}
  
  return '';
};

// Check for both standard and Vite-prefixed keys
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

const useMock = !supabase;

export const getAllCandidates = async (): Promise<Candidate[]> => {
  if (useMock) {
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
    await new Promise(resolve => setTimeout(resolve, 400));
    const lowerQuery = query.toLowerCase();
    return MOCK_CANDIDATES.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.party.toLowerCase().includes(lowerQuery) ||
      c.district.toLowerCase().includes(lowerQuery) ||
      c.municipality.toLowerCase().includes(lowerQuery)
    );
  }
  
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
    return [...MOCK_NEWS].sort(() => Math.random() - 0.5);
  }

  const { data, error } = await supabase!
    .from('news_cache')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as unknown as NewsItem[];
};

export const fetchHotTopic = async (): Promise<HotTopic | null> => {
  if (useMock) {
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