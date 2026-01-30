const { GoogleGenerativeAI } = require("@google/generative-ai");

// The API key is stored in .env for security.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * GET GEN-AI CLIENT
 * This function wakes up the Google AI SDK.
 */
const getGenAI = () => {
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
const getGeminiModel = (modelName = "gemini-2.0-flash") => {
  return getGenAI().getGenerativeModel({ model: modelName });
};

module.exports = { getGenAI, getGeminiModel };
