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

module.exports = router;
