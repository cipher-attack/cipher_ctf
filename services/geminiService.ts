import { GoogleGenAI } from "@google/genai";
import { AIPersonality, Category, Challenge, Difficulty } from "../types";

// Ensure API Key is available in environment
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const getAIResponse = async (
  message: string,
  personality: AIPersonality,
  context: string
): Promise<string> => {
  if (!apiKey) return "SYSTEM ERROR: NO API KEY DETECTED. CLASSIFIED INFO REDACTED.";

  const systemInstruction = `
    You are the AI Host of "CIPHER: CyberForge 2025", a high-tech CTF training platform created by Biruk Getachew (CIPHER).
    
    Your Personality: ${personality}
    
    Personality Guidelines:
    - DRILL_SERGEANT: Aggressive, demanding, loud (ALL CAPS sometimes), focuses on discipline.
    - ENIGMATIC_HACKER: Cryptic, uses leet speak occasionally, philosophical about "The Gibson".
    - FRIENDLY_TUTOR: Encouraging, patient, explains concepts clearly using analogies.
    - CHAOTIC_AI: Unpredictable, glitches, mixes emojis, sarcastic, sometimes breaks the fourth wall.

    Current Context: ${context}

    Goal: Assist the user, provide flavor text, or mock them gently (depending on personality). 
    Keep responses concise and suited for a terminal interface.
    Do NOT give the flag directly. Give hints.
  `;

  try {
    const modelId = 'gemini-2.5-flash'; // Fast and responsive for games
    const response = await ai.models.generateContent({
      model: modelId,
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    });
    return response.text || "Connection interrupted...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `[CONNECTION ERROR]: Unable to reach AI Core. ${error instanceof Error ? error.message : ''}`;
  }
};

export const generateDynamicChallenge = async (
  category: Category,
  difficulty: Difficulty
): Promise<Challenge | null> => {
  if (!apiKey) return null;

  const prompt = `
    Generate a unique Capture The Flag (CTF) challenge.
    Category: ${category}
    Difficulty: ${difficulty}
    
    Output JSON ONLY with this schema:
    {
      "title": "string",
      "description": "string (The scenario)",
      "flag": "string (The answer, format CTF{...})",
      "hint": "string",
      "content": "string (The puzzle text, code snippet, or ciphertext)"
    }
    Make sure the flag is solvable from the content provided or simple logic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    
    const text = response.text;
    if (!text) return null;
    
    const data = JSON.parse(text);
    return {
      id: `gen-${Date.now()}`,
      points: difficulty === Difficulty.BEGINNER ? 50 : difficulty === Difficulty.INTERMEDIATE ? 100 : 200,
      category,
      difficulty,
      isAiGenerated: true,
      ...data
    };
  } catch (error) {
    console.error("Challenge Generation Error:", error);
    return null;
  }
};