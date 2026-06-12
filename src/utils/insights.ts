import { ActivityCategory } from '../types';

/**
 * Returns a fallback, deterministic suggestion based on the highest emission category.
 */
export function getDeterministicFallback(category: ActivityCategory, pct: number, kg: number): string {
  const roundedPct = Math.round(pct);
  const roundedKg = Math.round(kg);

  switch (category) {
    case 'transport':
      return `Transport is your highest category at ${roundedPct}% (${roundedKg} kg/mo). Commute by train or bus just 2 days a week to cut emissions by ~40 kg CO₂ and save over $30 in fuel!`;
    case 'food':
      return `Food is your highest category at ${roundedPct}% (${roundedKg} kg/mo). Going plant-based for just 3 days a week cuts your food footprint by 25% and saves $25 in groceries.`;
    case 'electricity':
      return `Electricity is your highest category at ${roundedPct}% (${roundedKg} kg/mo). Unplug standby electronics and lower your thermostat by 2°F to save 30 kg CO₂ and $15 on your bill.`;
    case 'shopping':
      return `Shopping is your highest category at ${roundedPct}% (${roundedKg} kg/mo). Deferring one new clothing or electronics purchase this month saves 15–80 kg CO₂ and upwards of $45.`;
    default:
      return 'Great job tracking your footprint! Reduce emissions further by adjusting your daily transit and adopting a vegetarian diet.';
  }
}

/**
 * Fetches dynamic AI insights using the Gemini API.
 * Falls back gracefully to deterministic insights if offline or API key is missing.
 */
export async function getCarbonInsights(
  category: ActivityCategory,
  pct: number,
  kg: number
): Promise<string> {
  const fallback = getDeterministicFallback(category, pct, kg);

  // 1. Check if offline
  if (typeof window !== 'undefined' && !window.navigator.onLine) {
    return fallback;
  }

  // 2. Check for API key in env variable (VITE_GEMINI_API_KEY)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  // 3. Make fetch request to Gemini API
  try {
    const prompt = `The user's highest emission category is ${category} at ${Math.round(pct)}% of their total footprint (${Math.round(kg)} kg/month). Give one specific, actionable recommendation with exact numbers for reducing this. Keep it under 40 words. Be encouraging.`;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 80,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const insightText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (insightText && typeof insightText === 'string') {
      return insightText.trim();
    }

    return fallback;
  } catch (error) {
    console.warn('[Insights] Failed to fetch Gemini AI insights, falling back to deterministic response.', error);
    return fallback;
  }
}
