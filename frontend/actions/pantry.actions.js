/**
 * PANTRY SERVER ACTIONS
 * These functions handle managing your fridge/pantry items.
 * This includes the "AI Scan" feature where you take a photo of your food.
 */
"use server";

import { fetchWithAuth, getServerUser } from "@/lib/api";

/**
 * SCAN PANTRY IMAGE (Gemini Vision)
 * Delegates to backend.
 */
export async function scanPantryImage(formData) {
  try {
    const imageFile = formData.get("image");
    if (!imageFile) throw new Error("No image provided");

    // Convert to base64
    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    return await fetchWithAuth("/api/pantry-items/scan", {
      method: "POST",
      body: JSON.stringify({ image: base64Image }),
    });
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
    const ingredients = JSON.parse(formData.get("ingredients"));
    if (!ingredients || ingredients.length === 0) throw new Error("No ingredients to save");

    // Parallel save is faster
    const savePromises = ingredients.map((ingredient) => 
      fetchWithAuth("/api/pantry-items", {
        method: "POST",
        body: JSON.stringify({
          data: { name: ingredient.name, quantity: ingredient.quantity, imageUrl: "" },
        }),
      }).then(res => res.data) // Store result data
    );

    const savedItems = await Promise.all(savePromises);

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
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    if (!name || !quantity) throw new Error("Name and quantity are required");

    const data = await fetchWithAuth("/api/pantry-items", {
      method: "POST",
      body: JSON.stringify({
        data: { name: name.trim(), quantity: quantity.trim(), imageUrl: "" },
      }),
    });

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
    const data = await fetchWithAuth("/api/pantry-items");
    return { success: true, items: data.data || [] };
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
    const itemId = formData.get("itemId");
    await fetchWithAuth(`/api/pantry-items/${itemId}`, { method: "DELETE" });

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
    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    const data = await fetchWithAuth(`/api/pantry-items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({
        data: { name, quantity },
      }),
    });

    return { success: true, item: data.data, message: "Item updated successfully" };
  } catch (error) {
    console.error("Error updating item:", error);
    throw new Error(error.message || "Failed to update item");
  }
}
