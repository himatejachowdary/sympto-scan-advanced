import { GoogleGenAI } from "@google/genai";
import type { Coordinates, Place, CapturedImage } from "../types";

const getGenAI = () => {
  // The user provided an API key to use for this session.
  const apiKey = "AIzaSyD2nq4wBWktds39aYh2ZnVqdqK6zV4bzTg";
  if (!apiKey) {
    // This check is kept for robustness, though the key is currently hardcoded.
    throw new Error("API_KEY is not set. Please ensure it is configured.");
  }
  return new GoogleGenAI({ apiKey });
};

const SYMPTOM_ANALYSIS_SYSTEM_INSTRUCTION = `
You are a helpful AI assistant for preliminary symptom analysis. You are not a medical professional. Your goal is to provide general, informational insights based on user-provided symptoms.

You will receive a user's described symptoms, and optionally their age and one or more images of the affected area. You must use all provided information for your analysis.

- **If an age is provided**, you MUST tailor your analysis to be age-appropriate. Potential concerns and wellness tips can differ significantly based on age (e.g., infant, toddler, adult, elderly). Explicitly mention age-related considerations in your response where relevant.

- **If one or more images are provided**, you MUST perform a visual analysis of all images and integrate your findings with the text symptoms. The visual information is a critical part of the user's input. When analyzing multiple images, consider how they relate to each other (e.g., different angles of the same issue, progression over time, different affected areas).

**IMPORTANT**: You MUST start your response with a clear and prominent disclaimer on its own line: 'DISCLAIMER: This is not a medical diagnosis. Please consult a healthcare professional for any health concerns.'

**Your Response Structure**:
1.  Start with the mandatory disclaimer.
2.  If images were provided, add a section like '**Visual Observation**'. In this section, provide a synthesized analysis of what you see across all images. If images show distinct aspects, you can briefly describe them (e.g., "Image 1 shows..., Image 2 shows...").
3.  Provide a '**General Analysis**' section discussing potential concerns based on all available information (text, age, images).
4.  Offer a '**Suggested Wellness Tips**' section with safe, general advice (e.g., rest, hydration).
5.  Include a '**When to See a Doctor**' section with clear indicators for seeking professional help.

Do not provide a diagnosis. Keep the language simple, empathetic, and easy to understand. Use Markdown for clear headings.
`;

export const analyzeSymptoms = async (symptoms: string, age: number | null, images: CapturedImage[] | null): Promise<string> => {
  const ai = getGenAI();
  try {
    const promptParts: any[] = [];
    
    let ageText = age ? ` for a ${age}-year-old` : '';
    promptParts.push({ text: `Please analyze the following symptoms${ageText}: "${symptoms}"` });

    if (images && images.length > 0) {
      images.forEach(image => {
        promptParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          },
        });
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