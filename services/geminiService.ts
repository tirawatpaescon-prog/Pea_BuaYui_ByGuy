
import { GoogleGenAI, Type } from "@google/genai";
import { ElectricityUser, UserLocation } from "../types";

export const optimizeRoute = async (
  startLocation: UserLocation,
  destinations: ElectricityUser[]
): Promise<string[]> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const destData = destinations.map(d => ({
    id: d.id,
    lat: d.latitude,
    lng: d.longitude,
    name: `${d.firstName} ${d.lastName}`
  }));

  const prompt = `
    You are an expert logistics optimizer for the Provincial Electricity Authority (PEA).
    Current Position (Start): Lat ${startLocation.lat}, Lng ${startLocation.lng}
    
    Tasks to visit:
    ${JSON.stringify(destData, null, 2)}
    
    Objective: Return a JSON array containing ONLY the IDs of these tasks in the most efficient visiting order to minimize travel distance.
    The output must be a valid JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || '[]');
  } catch (error) {
    console.error("AI Optimization failed:", error);
    // Fallback: return as-is
    return destinations.map(d => d.id);
  }
};
