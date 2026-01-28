/**
 * AI CLIENT INITIALIZATION
 * This file sets up the connection to Google's Gemini AI.
 * We use a "Lazy Initialization" approach, which means we only create 
 * the AI client when it's actually needed.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// The API key is stored in .env for security.
// In Next.js, process.env works on the server-side.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * GET GEN-AI CLIENT
 * This function wakes up the Google AI SDK.
 */
export const getGenAI = () => {
  // 1. Safety Check: If the key is missing, show a clear error message.
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables. Please check your .env file.");
  }
  
  // 2. Create the main AI instance
  return new GoogleGenerativeAI(GEMINI_API_KEY);
};

/**
 * GET SPECIFIC MODEL
 * Different models have different speeds/costs.
 * We use 'gemini-2.0-flash' because it's super fast and great for JSON.
 */
export const getGeminiModel = (modelName = "gemini-2.0-flash") => {
  return getGenAI().getGenerativeModel({ model: modelName });
};
