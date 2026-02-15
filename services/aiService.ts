import { GoogleGenAI, Type } from "@google/genai";
import { HoroscopeSign } from "../types";

// Safe accessor for API key to handle browser environments
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
       // @ts-ignore
       return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    console.warn("API Key access failed");
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const fetchAIHoroscope = async (language: 'np' | 'en', targetDate: Date): Promise<Partial<HoroscopeSign>[]> => {
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  try {
    const dateString = targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const prompt = `Generate a daily horoscope for ${dateString} for all 12 zodiac signs in ${language === 'np' ? 'Nepali' : 'English'}. 
    
    The response must be a JSON array where each object corresponds to a zodiac sign in this order: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.
    
    Use the following IDs for the signs: 'mesh', 'brish', 'mithun', 'karkat', 'simha', 'kanya', 'tula', 'brishchik', 'dhanu', 'makar', 'kumbha', 'min'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              prediction: { type: Type.STRING },
              luckyColor: { type: Type.STRING },
              luckyNumber: { type: Type.INTEGER },
              energy: { type: Type.INTEGER, description: "Energy percentage from 0 to 100" },
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("AI Horoscope Fetch Error:", error);
    throw error;
  }
};