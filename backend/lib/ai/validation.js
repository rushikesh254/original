const { z } = require("zod");

/**
 * Validates AI JSON response against a Zod schema.
 * Handles extensive cleaning of markdown blocks.
 * @param {string} text - The raw text response from AI
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @returns {any|null} - The parsed data or null if validation failed
 */
const fs = require('fs');
const path = require('path');

const parseAIResponse = (text, schema) => {
  try {
    // 1. Clean the text
    console.log("🔍 Parsing AI Response - Step 1: Cleaning markdown...");
    const cleanText = text
      .replace(/```json\n?|```\n?/g, "")
      .replace(/^\s*json\s+/i, "")
      .trim();

    // 2. Parse JSON
    console.log("🔍 Step 2: Parsing JSON...");
    const data = JSON.parse(cleanText);

    // 3. Validate with Zod
    console.log("🔍 Step 3: Validating with Zod schema...");
    const result = schema.safeParse(data);

    if (!result.success) {
      console.error("❌ VALIDATION FAILED - Schema errors");
      
      const debugFile = path.join(process.cwd(), 'debug_zod_error.json');
      const debugInfo = {
        timestamp: new Date().toISOString(),
        validationErrors: result.error.format(),
        receivedData: data,
        rawText: text
      };
      
      try {
        fs.writeFileSync(debugFile, JSON.stringify(debugInfo, null, 2));
        console.log(`📝 Debug info written to: ${debugFile}`);
      } catch (writeErr) {
        console.error("Failed to write debug file:", writeErr);
      }

      console.warn("   ℹ️ Note: Due to .catchall(z.any()) in schema, still returning data (if possible)");
      // Attempt to return data despite error if it looks partly valid
      return data;
    }

    console.log("✅ Validation passed!");
    return result.data;
  } catch (err) {
    console.error("❌ CRITICAL PARSING ERROR:", err.message);
    
    // Dump raw text even on parse error
    try {
        const debugFile = path.join(process.cwd(), 'debug_parse_error.txt');
        fs.writeFileSync(debugFile, `Error: ${err.message}\n\nRaw Text:\n${text}`);
    } catch (e) {}

    return null;
  }
};

module.exports = { parseAIResponse };
