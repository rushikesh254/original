/**
 * PANTRY ROUTES
 * This file handles how we Add, Get, Update, and Delete ingredients 
 * in a user's digital kitchen. 
 * Every action here is "Protected", meaning only logged-in users 
 * can access their own data.
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const PantryItem = require("../models/PantryItem"); // The blueprint for pantry data
const auth = require("../middleware/auth"); // Helper to check the "Digital Pass" (JWT)
const rateLimit = require("../middleware/rate-limit");
const { getGeminiModel } = require("../lib/ai/client");
const { PANTRY_SCAN_PROMPT } = require("../lib/ai/prompts");

/**
 * HELPER: IS VALID OBJECT ID
 * Checks if a string is a valid MongoDB format before we try to search for it.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET PANTRY ITEMS (GET /api/pantry)
 * Returns a list of all ingredients owned by the logged-in user.
 */
router.get("/", auth, async (req, res) => {
  try {
    // req.userId comes from the 'auth' middleware
    // We only find items where 'owner' matches this ID
    const items = await PantryItem.find({ owner: req.userId });
    res.json({ data: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ADD PANTRY ITEM (POST /api/pantry)
 * Creates a new ingredient record.
 */
router.post("/", auth, async (req, res) => {
  try {
    // 1. Check if the frontend sent the 'data' object
    if (!req.body.data) {
      return res.status(400).json({ error: "Missing 'data' object in request body" });
    }

    const { data } = req.body;

    // 2. SANITIZE: Remove fields that users shouldn't manually set
    // (We don't want them trying to change the owner or created date via the form)
    const sanitizedData = { ...data };
    delete sanitizedData._id;
    delete sanitizedData.owner;
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;
    delete sanitizedData.__v;

    // 3. SECURE: Attach the ID of the logged-in user as the owner
    const itemData = {
      ...sanitizedData,
      owner: req.userId,
    };

    // 4. Save to Database
    const item = new PantryItem(itemData);
    await item.save();
    res.status(201).json({ data: item });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE ITEM (PUT /api/pantry/:id)
 * Updates the name or quantity of an existing item.
 */
router.put("/:id", auth, async (req, res) => {
  try {
    // 1. Validate the ID format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    if (!req.body.data) {
      return res.status(400).json({ error: "Missing 'data' object in request body" });
    }

    const { data } = req.body;

    // 2. Sanitize just like in Create
    const sanitizedData = { ...data };
    delete sanitizedData._id;
    delete sanitizedData.owner;
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;
    delete sanitizedData.__v;

    // 3. Find the item in the database first
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 4. SECURITY CHECK: Make sure the user trying to update
    // is actually the OWNER of the item.
    if (item.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this item" });
    }

    // 5. Apply the update
    const updatedItem = await PantryItem.findByIdAndUpdate(
      req.params.id,
      { $set: sanitizedData },
      { new: true, runValidators: true }, // 'new: true' returns the item AFTER update
    );

    res.json({ data: updatedItem });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE ITEM (DELETE /api/pantry/:id)
 * Removes an ingredient from the user's kitchen.
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid item ID format" });
    }

    // 1. Find the item
    const item = await PantryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 2. OWNERSHIP CHECK
    if (item.owner.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this item" });
    }

    // 3. Delete it
    await PantryItem.findByIdAndDelete(req.params.id);
    res.json({ data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * SCAN IMAGE (POST /api/pantry-items/scan)
 * Uses Gemini Vision to identify ingredients from an image provided as Base64.
 * PROTECTED & RATE LIMITED
 */
router.post("/scan", auth, rateLimit("scan"), async (req, res) => {
  try {
    const { image } = req.body; // Expecting Base64 string
    if (!image) return res.status(400).json({ error: "Image data is required" });

    // 1. Call Gemini Vision
    const model = getGeminiModel("gemini-2.0-flash");

    // The image from frontend might have "data:image/jpeg;base64," prefix.
    // Gemini wants just the data, or we pass standard inlineData.
    // Let's assume frontend sends the raw base64 or we strip it.
    // But usually `frontend-mid` setup extracts raw base64. 
    // We will clean it just in case.
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    // We can guess mimeType or default to image/jpeg for Gemini (it's usually flexible)
    
    const result = await model.generateContent([
      PANTRY_SCAN_PROMPT,
      {
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG/PNG
          data: base64Data,
        },
      },
    ]);

    const text = result.response.text();

    // 2. Parse results
    let ingredients;
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, "").trim();
      ingredients = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini Vision response:", text);
      return res.status(500).json({ error: "Failed to analyze image" });
    }
    
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "No ingredients detected. Please try a clearer photo." });
    }

    res.json({
      success: true,
      ingredients: ingredients.slice(0, 20),
      message: `Found ${ingredients.length} ingredients!`,
    });

  } catch (error) {
    console.error("Error in scan:", error);
    
    // Handle Google API Quota limits gracefully
    if (error.message?.toLowerCase().includes("quota") || error.message?.includes("429")) {
      return res.status(429).json({ 
        error: "AI Usage Limit Reached. Please wait a minute before scanning again." 
      });
    }

    res.status(500).json({ error: "Failed to analyze image. Please try again." });
  }
});

module.exports = router;
