import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (_client) return _client;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[Gemini] GEMINI_API_KEY is not set. Add it to your .env file.",
    );
  }

  _client = new GoogleGenerativeAI(apiKey);
  return _client;
}

export function getAtsModel() {
  return getGeminiClient().getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 8196,
    },
  });
}

/** Low-temperature model for per-answer and overall interview evaluation. */
export function getEvaluationModel() {
  return getGeminiClient().getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
      maxOutputTokens: 8196,
    },
  });
}
