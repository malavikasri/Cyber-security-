import { GoogleGenAI, Type } from "@google/genai";
import { PasswordAnalysis, AIAnalysisResult } from '../types';

// IMPORTANT: In a real production app, never hardcode keys or expose them in client code if possible.
// This is for demonstration as requested.
const API_KEY = process.env.API_KEY || '';

export const generateSecurityReport = async (
  analysis: PasswordAnalysis,
  maskedPasswordStructure: string
): Promise<AIAnalysisResult> => {
  
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    You are an elite Cybersecurity Consultant and Ethical Hacker.
    I will provide metadata about a password. DO NOT ASK FOR THE REAL PASSWORD.
    
    Password Metadata:
    - Length: ${analysis.length}
    - Has Lowercase: ${analysis.hasLower}
    - Has Uppercase: ${analysis.hasUpper}
    - Has Numbers: ${analysis.hasNumber}
    - Has Special Chars: ${analysis.hasSpecial}
    - Entropy Bits: ${analysis.entropy.toFixed(2)}
    - Structure hint: "${maskedPasswordStructure}" (e.g., LLLNNN)
    
    Task:
    1. Act as a specific "Hacker Persona" (e.g., Script Kiddie, State Actor, Social Engineer) and explain how you would try to crack this specific pattern.
    2. Provide a short, witty critique of the password strength.
    3. Give 2-3 concrete, actionable tips to improve this specific password type.
    
    Response Format: JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hackerPersona: { type: Type.STRING, description: "The type of attacker simulating the attack" },
            critique: { type: Type.STRING, description: "A witty critique of the password" },
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of actionable security tips"
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("AI Analysis Failed", error);
    throw error;
  }
};
