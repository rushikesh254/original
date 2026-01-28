/**
 * PANTRY SERVER ACTIONS
 * These functions handle managing your fridge/pantry items.
 * This includes the "AI Scan" feature where you take a photo of your food.
 */
"use server";

import { getServerUser, getAuthToken } from "@/lib/serverAuth";
import { freePantryScans, proTierLimit } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { getGeminiModel } from "@/lib/ai/client";
import { PANTRY_SCAN_PROMPT } from "@/lib/ai/prompts";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * SCAN PANTRY IMAGE (Gemini Vision)
 * This is the "Magic" feature. It takes a photo, sends it to Gemini, 
 * and gets back a list of food items.
 */
export async function scanPantryImage(formData) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const isPro = user.subscriptionTier === "pro";
    
    /**
     * SECURITY: Arcjet Protection
     * Limits how many scans a free user can do per month.
     */
    const arcjetClient = isPro ? proTierLimit : freePantryScans;
    if (arcjetClient) {
      const req = await request();
      const decision = await arcjetClient.protect(req, {
        userId: user._id,
        requested: 1,
      });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          throw new Error(`Monthly scan limit reached. ${isPro ? "Please contact support." : "Upgrade to Pro for unlimited scans!"}`);
        }
        throw new Error("Request denied by security system");
      }
    }

    // 1. Get the image file from the form
    const imageFile = formData.get("image");
    if (!imageFile) throw new Error("No image provided");

    /**
     * STEP 2: Prepare image for AI
     * AI models can't "read" a file directly from a form.
     * We convert it into 'base64' (a long string of text representing the image pixels).
     */
    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    /**
     * STEP 3: Call Gemini Vision
     * We send the pixels + our instructions (the prompt).
     */
    const model = getGeminiModel("gemini-2.0-flash");

    const result = await model.generateContent([
      PANTRY_SCAN_PROMPT,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const text = result.response.text();

    /**
     * STEP 4: Parse the AI's list
     * The AI gives us a string. We turn it into a JavaScript Array.
     */
    let ingredients;
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, "").trim();
      ingredients = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to parse ingredients. Please try again.");
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error("No ingredients detected. Please try a clearer photo.");
    }

    // 5. Return the list to the frontend so the user can "Confirm" them.
    return {
      success: true,
      ingredients: ingredients.slice(0, 20), // Max 20 items to keep things simple
      scansLimit: isPro ? "unlimited" : 10,
      message: `Found ${ingredients.length} ingredients!`,
    };
  } catch (error) {
    console.error("Error scanning pantry:", error);
    throw new Error(error.message || "Failed to scan image");
  }
}

/**
 * SAVE TO PANTRY
 * After scanning, the user sees a list. When they click "Save All", 
 * this function runs.
 */
export async function saveToPantry(formData) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const token = await getAuthToken();
    const ingredients = JSON.parse(formData.get("ingredients"));

    if (!ingredients || ingredients.length === 0) throw new Error("No ingredients to save");

    /**
     * BULK SAVE
     * We loop through every item and send a 'POST' request to the backend.
     */
    const savedItems = [];
    for (const ingredient of ingredients) {
      const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
        body: JSON.stringify({
          data: { name: ingredient.name, quantity: ingredient.quantity, imageUrl: "" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        savedItems.push(data.data);
      }
    }

    return { success: true, savedItems, message: `Saved ${savedItems.length} items to your pantry!` };
  } catch (error) {
    console.error("Error saving to pantry:", error);
    throw new Error(error.message || "Failed to save items");
  }
}

/**
 * ADD PANTRY ITEM MANUALLY
 * For when the user just wants to type "3 Eggs".
 */
export async function addPantryItemManually(formData) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const token = await getAuthToken();
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    if (!name || !quantity) throw new Error("Name and quantity are required");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({
        data: { name: name.trim(), quantity: quantity.trim(), imageUrl: "" },
      }),
    });

    if (!response.ok) throw new Error("Failed to add item to pantry");
    const data = await response.json();

    return { success: true, item: data.data, message: "Item added successfully!" };
  } catch (error) {
    console.error("Error adding item manually:", error);
    throw new Error(error.message || "Failed to add item");
  }
}

/**
 * GET PANTRY ITEMS
 * Fetches the user's full fridge list.
 */
export async function getPantryItems() {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const token = await getAuthToken();
    const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch pantry items");
    const data = await response.json();
    const isPro = user.subscriptionTier === "pro";

    return { success: true, items: data.data || [], scansLimit: isPro ? "unlimited" : 10 };
  } catch (error) {
    console.error("Error fetching pantry:", error);
    throw new Error(error.message || "Failed to load pantry");
  }
}

/**
 * DELETE PANTRY ITEM
 * Removes an item (e.g., when the user eats the food).
 */
export async function deletePantryItem(formData) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const token = await getAuthToken();
    const itemId = formData.get("itemId");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "DELETE",
      headers: { Cookie: `token=${token}` },
    });

    if (!response.ok) throw new Error("Failed to delete item");
    return { success: true, message: "Item removed from pantry" };
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error(error.message || "Failed to delete item");
  }
}

/**
 * UPDATE PANTRY ITEM
 * For changing quantities (e.g., "3 Eggs" -> "1 Egg").
 */
export async function updatePantryItem(formData) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const token = await getAuthToken();
    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({
        data: { name, quantity },
      }),
    });

    if (!response.ok) throw new Error("Failed to update item");
    const data = await response.json();

    return { success: true, item: data.data, message: "Item updated successfully" };
  } catch (error) {
    console.error("Error updating item:", error);
    throw new Error(error.message || "Failed to update item");
  }
}
