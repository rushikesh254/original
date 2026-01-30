/**
 * RECIPE SERVER ACTIONS
 * In Next.js, "use server" means these functions run on the server, not in the browser.
 * This is where we safely use our API keys and database.
 */
"use server";

import { fetchWithAuth, getServerUser } from "@/lib/api"; // Unified import

/**
 * HELPER: NORMALIZE TITLE
 * Turns "pizza margherita" into "Pizza Margherita" for consistent DB storage.
 */
/**
 * GET OR GENERATE RECIPE
 * The main engine of the app. It delegates the logic to the backend.
 */
export async function getOrGenerateRecipe(formData) {
  try {
    const recipeName = formData.get("recipeName");

    if (!recipeName) throw new Error("Recipe name is required");

    return await fetchWithAuth("/api/recipes/generate", {
      method: "POST",
      body: JSON.stringify({ recipeName }),
    });
  } catch (error) {
    console.error("❌ Error in getOrGenerateRecipe:", error);
    throw new Error(error.message || "Failed to load recipe");
  }
}

/**
 * SAVE RECIPE TO COLLECTION
 * When a user clicks "Bookmark/Heart", this function links 
 * their account to that recipe.
 */
export async function saveRecipeToCollection(formData) {
  try {
    const recipeId = formData.get("recipeId");
    if (!recipeId) throw new Error("Recipe ID is required");

    // Check existing
    const existingData = await fetchWithAuth(`/api/saved-recipes?filters[recipe][id][$eq]=${recipeId}`);
    if (existingData.data?.length > 0) {
      return { success: true, alreadySaved: true, message: "Recipe is already in your collection" };
    }

    // Save
    const savedRecipe = await fetchWithAuth("/api/saved-recipes", {
      method: "POST",
      body: JSON.stringify({
        data: { recipe: recipeId, savedAt: new Date().toISOString() },
      }),
    });

    return { success: true, alreadySaved: false, savedRecipe: savedRecipe.data, message: "Recipe saved to your collection!" };
  } catch (error) {
    console.error("❌ Error saving recipe:", error);
    throw new Error(error.message || "Failed to save recipe");
  }
}

/**
 * REMOVE RECIPE FROM COLLECTION
 * Handles the "Unlike" action.
 */
export async function removeRecipeFromCollection(formData) {
  try {
    const recipeId = formData.get("recipeId");
    if (!recipeId) throw new Error("Recipe ID is required");

    const searchData = await fetchWithAuth(`/api/saved-recipes?filters[recipe][id][$eq]=${recipeId}`);
    if (!searchData.data || searchData.data.length === 0) {
      return { success: true, message: "Recipe was not in your collection" };
    }

    const savedRecipeId = searchData.data[0].id;
    await fetchWithAuth(`/api/saved-recipes/${savedRecipeId}`, { method: "DELETE" });

    return { success: true, message: "Recipe removed from your collection" };
  } catch (error) {
    console.error("❌ Error removing recipe:", error);
    throw new Error(error.message || "Failed to remove recipe");
  }
}

/**
 * GET RECIPES BY PANTRY INGREDIENTS
 * The "Cook with what you have" feature. 
 * Fetches ingredients, asks AI for options, and looks up images.
 */
/**
 * GET RECIPES BY PANTRY INGREDIENTS
 * The "Cook with what you have" feature. 
 * Delegates to backend.
 */
export async function getRecipesByPantryIngredients() {
  try {
    return await fetchWithAuth("/api/recipes/suggest", { method: "POST" });
  } catch (error) {
    console.error("❌ Error in getRecipesByPantryIngredients:", error);
    throw new Error(error.message || "Failed to get recipe suggestions");
  }
}

/**
 * GET SAVED RECIPES
 * Simple function to fetch all the recipes the user has "Hearted".
 */
export async function getSavedRecipes() {
  try {
    const data = await fetchWithAuth("/api/saved-recipes");
    const recipes = data.data.map((savedRecipe) => savedRecipe.recipe).filter(Boolean);
    return { success: true, recipes, count: recipes.length };
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    throw new Error(error.message || "Failed to load saved recipes");
  }
}
