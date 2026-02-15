import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Candidate, NewsItem, HotTopic } from '../types';
import { MOCK_CANDIDATES, MOCK_NEWS, MOCK_HOT_TOPICS } from '../constants';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

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
    // Sort news by date descending (newest first)
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
    // 1. Get latest news sorted by date
    const sortedNews = [...MOCK_NEWS].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    const latestNews = sortedNews[0];
    
    // 2. Check if the latest news is within 2 hours
    if (latestNews) {
      const newsTime = new Date(latestNews.publishedAt).getTime();
      const currentTime = Date.now();
      const hoursDiff = (currentTime - newsTime) / (1000 * 60 * 60);
      
      // Strict check: Only show as Hot Topic if <= 2 hours old
      if (hoursDiff <= 2) {
        return {
          id: `breaking-${latestNews.id}`,
          title: `ताजा अपडेट: ${latestNews.title}`, // Prefix: Fresh Update
          description: latestNews.description,
          isActive: true
        };
      }
    }

    // Fallback: If no news is recent enough (< 2 hours), return a random static topic
    // This handles the case where "new" news isn't available
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