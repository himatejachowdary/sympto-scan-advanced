
import { GoogleGenAI } from "@google/genai";
import type { Coordinates, Place } from "../types";

const getGenAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const SYMPTOM_ANALYSIS_SYSTEM_INSTRUCTION = `
You are a helpful AI assistant for preliminary symptom analysis. You are not a medical professional.
Your goal is to provide general information based on the described symptoms.

**IMPORTANT**: You MUST start your response with a clear and prominent disclaimer on its own line: 'DISCLAIMER: This is not a medical diagnosis. Please consult a healthcare professional for any health concerns.'

Do not provide a diagnosis. Instead, list potential areas of concern in a neutral, informational tone.
Suggest general wellness tips that are safe and widely applicable (e.g., rest, hydration).
Recommend when it might be appropriate to see a doctor (e.g., if symptoms persist or worsen).
Keep the language simple, empathetic, and easy to understand. Structure your response with clear headings using Markdown.
`;

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  const ai = getGenAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please analyze the following symptoms: "${symptoms}"`,
      config: {
        systemInstruction: SYMPTOM_ANALYSIS_SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw new Error("Failed to get symptom analysis from AI.");
  }
};

export const findNearbyMedicalFacilities = async (symptoms: string, location: Coordinates): Promise<Place[]> => {
  const ai = getGenAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on these symptoms: "${symptoms}", find nearby medical facilities like hospitals, urgent care clinics, and pharmacies.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) {
      return [];
    }

    const places: Place[] = chunks
      .filter((chunk: any) => chunk.maps && chunk.maps.title && chunk.maps.uri)
      .map((chunk: any) => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri,
      }));
      
    // Deduplicate places based on URI
    const uniquePlaces = Array.from(new Map(places.map(p => [p.uri, p])).values());

    return uniquePlaces;
  } catch (error) {
    console.error("Error finding nearby facilities:", error);
    throw new Error("Failed to find nearby medical facilities.");
  }
};
