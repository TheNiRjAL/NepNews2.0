import { GoogleGenAI, Type } from "@google/genai";
import { HoroscopeSign } from "../types";

export const fetchAIHoroscope = async (language: 'np' | 'en', targetDate: Date): Promise<Partial<HoroscopeSign>[]> => {
  // Access key via process.env.API_KEY as per guidelines.
  // This is polyfilled in vite.config.ts to read from VITE_API_KEY.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key is missing. Horoscope will use offline fallback.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const dateString = targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const prompt = `Generate a daily horoscope for ${dateString} for all 12 zodiac signs in ${language === 'np' ? 'Nepali' : 'English'}. 
    
    The response must be a JSON array where each object corresponds to a zodiac sign in this order: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.
    
    Use the following IDs for the signs: 'mesh', 'brish', 'mithun', 'karkat', 'simha', 'kanya', 'tula', 'brishchik', 'dhanu', 'makar', 'kumbha', 'min'.
    `;

  try {
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
    return [];
  }
};