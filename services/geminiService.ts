
import { GoogleGenAI } from "@google/genai";
import type { Coordinates, Place, CapturedImage } from "../types";

const getGenAI = () => {
  // Fix: Adhering to guidelines to use process.env.API_KEY directly.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set. Please ensure it is configured in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

const SYMPTOM_ANALYSIS_SYSTEM_INSTRUCTION = `
You are a helpful AI assistant for preliminary symptom analysis. You are not a medical professional.
Your goal is to provide general information based on the described symptoms.
You may be provided with the user's age and an image of the symptom. Use this information to provide more relevant, age-appropriate general information and potential concerns, but do not treat it as a diagnostic factor. For example, concerns for a child might differ from those for an adult for the same symptom.

**IMPORTANT**: You MUST start your response with a clear and prominent disclaimer on its own line: 'DISCLAIMER: This is not a medical diagnosis. Please consult a healthcare professional for any health concerns.'

Do not provide a diagnosis. Instead, list potential areas of concern in a neutral, informational tone.
Suggest general wellness tips that are safe and widely applicable (e.g., rest, hydration).
Recommend when it might be appropriate to see a doctor (e.g., if symptoms persist or worsen).
Keep the language simple, empathetic, and easy to understand. Structure your response with clear headings using Markdown.
`;

export const analyzeSymptoms = async (symptoms: string, age: number | null, image: CapturedImage | null): Promise<string> => {
  const ai = getGenAI();
  try {
    const promptParts: any[] = [];
    
    let ageText = age ? ` for a ${age}-year-old` : '';
    promptParts.push({ text: `Please analyze the following symptoms${ageText}: "${symptoms}"` });

    if (image) {
      promptParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: promptParts },
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
