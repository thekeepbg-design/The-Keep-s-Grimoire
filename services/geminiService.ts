
import { GoogleGenAI } from "@google/genai";

export const enhanceDescription = async (name: string, ingredients: string[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Write a short, immersive fantasy/medieval style description for a drink named "${name}" which contains ${ingredients.join(', ')}. Keep it under 150 characters. Mention something about "alchemists", "adventurers", or "quests".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "A mystical brew whose secrets are known only to the wise.";
  } catch (error) {
    console.error("AI enhancement failed:", error);
    return "A classic recipe from the old world scrolls.";
  }
};
