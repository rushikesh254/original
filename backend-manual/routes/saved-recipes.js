/**
 * SAVED RECIPES (BOOKMARKS) ROUTES
 * This file handles how users "Save" recipes to their profile.
 * It connects a User to a Recipe using the SavedRecipe model.
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const SavedRecipe = require("../models/SavedRecipe"); // The link model
const auth = require("../middleware/auth"); // Login protection

/**
 * HELPER: IS VALID OBJECT ID
 * Checks if the ID provided in the URL is a real MongoDB ID.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET SAVED RECIPES (GET /api/saved-recipes)
 * Fetches all recipes that the current user has bookmarked.
 */
router.get("/", auth, async (req, res) => {
  try {
    // Optionally filter by a specific recipe ID (to check if it's already saved)
    const recipeId = req.query["filters[recipe][id][$eq]"];

    // 1. Always start by filtering by the logged-in user (Secure)
    const query = { user: req.userId }; 
    if (recipeId) query.recipe = recipeId;

    // 2. Find and 'populate' (fetch the full recipe data, not just the ID)
    const saved = await SavedRecipe.find(query)
      .populate("recipe") // This turns the recipe ID into a full recipe object
      .sort({ savedAt: -1 }); // Show newest saves first

    res.json({ data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * SAVE A RECIPE (POST /api/saved-recipes)
 * Creates a link between the user and a recipe.
 */
router.post("/", auth, async (req, res) => {
  try {
    // Next.js convention: data is wrapped in a 'data' object
    if (!req.body.data) {
      return res.status(400).json({ error: "Missing 'data' object in request body" });
    }

    const { data } = req.body;

    // 1. SANITIZE: Delete fields that should be set by the server
    const sanitizedData = { ...data };
    delete sanitizedData._id;
    delete sanitizedData.user; 
    delete sanitizedData.createdAt;
    delete sanitizedData.updatedAt;
    delete sanitizedData.__v;

    // 2. SECURE: Force the 'user' field to be the currently logged-in user
    const savedData = {
      ...sanitizedData,
      user: req.userId,
    };

    // 3. Save the link to MongoDB
    const saved = new SavedRecipe(savedData);
    await saved.save();
    res.status(201).json({ data: saved });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * REMOVE SAVED RECIPE (DELETE /api/saved-recipes/:id)
 * "Unsaves" a recipe from the user's collection.
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid saved recipe ID format" });
    }

    // 1. Find the save record
    const saved = await SavedRecipe.findById(req.params.id);

    if (!saved) {
      return res.status(404).json({ error: "Saved recipe not found" });
    }

    // 2. SECURITY CHECK: Make sure the user is deleting their OWN save
    if (saved.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // 3. Remove from Database
    await SavedRecipe.findByIdAndDelete(req.params.id);
    res.json({ data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
