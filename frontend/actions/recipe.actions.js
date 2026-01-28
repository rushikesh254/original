/**
 * RECIPE SERVER ACTIONS
 * In Next.js, "use server" means these functions run on the server, not in the browser.
 * This is where we safely use our API keys and database.
 */
"use server";

import { getServerUser, getAuthToken } from "@/lib/serverAuth"; // Auth helpers
import { freeMealRecommendations, proTierLimit } from "@/lib/arcjet"; // Security limits
import { request } from "@arcjet/next";
import { getGeminiModel } from "@/lib/ai/client"; // AI client
import { fetchRecipeImage } from "@/lib/ai/image-service"; // Image search
import { RECIPE_GENERATION_PROMPT, INGREDIENT_RECIPE_SUGGESTIONS_PROMPT } from "@/lib/ai/prompts";

// Where is our manual backend running?
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * HELPER: NORMALIZE TITLE
 * Turns "pizza margherita" into "Pizza Margherita" for consistent DB storage.
 */
function normalizeTitle(title) {
  return title
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * GET OR GENERATE RECIPE
 * The main engine of the app. It checks if we ALREADY know a recipe, 
 * and if not, it asks Gemini to create it.
 */
export async function getOrGenerateRecipe(formData) {
  try {
    // 1. Authenticate the user
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const token = await getAuthToken();
    const recipeName = formData.get("recipeName");
    if (!recipeName) throw new Error("Recipe name is required");

    const normalizedTitle = normalizeTitle(recipeName);
    const isPro = user.subscriptionTier === "pro";

    /**
     * STEP 1: Check Database FIRST
     * We don't want to waste AI credits if we already have the recipe.
     */
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/recipes?filters[title][$eqi]=${encodeURIComponent(normalizedTitle)}&populate=*`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.data && searchData.data.length > 0) {
        // We found it! Now check if THIS user has it saved.
        const savedRecipeResponse = await fetch(
          `${STRAPI_URL}/api/saved-recipes?filters[recipe][id][$eq]=${searchData.data[0].id}`,
          {
            headers: { Cookie: `token=${token}` },
            cache: "no-store",
          },
        );

        let isSaved = false;
        if (savedRecipeResponse.ok) {
          const savedData = await savedRecipeResponse.json();
          isSaved = savedData.data && savedData.data.length > 0;
        }

        return {
          success: true,
          recipe: searchData.data[0],
          recipeId: searchData.data[0].id,
          isSaved,
          fromDatabase: true, // Frontend can show a "Loaded from community" badge
          isPro,
          message: "Recipe loaded from database",
        };
      }
    }

    /**
     * STEP 2: Generate with Gemini AI
     * If the recipe isn't in our DB, the AI will invent it.
     */
    const model = getGeminiModel("gemini-2.0-flash");
    const prompt = RECIPE_GENERATION_PROMPT(normalizedTitle);

    // Call the AI
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // The AI returns a string that LOOKS like JSON. We need to turn it into a JS object.
    let recipeData;
    try {
      // Clean accidental markdown tags if the AI includes them (```json ... ```)
      const cleanText = text.replace(/```json\n?|```\n?/g, "").trim();
      recipeData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to generate recipe. Please try again.");
    }

    // Ensure category and cuisine are valid even if AI made a typo
    recipeData.title = normalizedTitle;
    const category = ["breakfast", "lunch", "dinner", "snack", "dessert"].includes(recipeData.category?.toLowerCase())
      ? recipeData.category.toLowerCase() : "dinner";

    const validCuisines = ["italian", "chinese", "mexican", "indian", "american", "thai", "japanese", "mediterranean", "french", "korean", "vietnamese", "spanish", "greek", "turkish", "moroccan", "brazilian", "caribbean", "middle-eastern", "british", "german", "portuguese", "other"];
    const cuisine = validCuisines.includes(recipeData.cuisine?.toLowerCase()) ? recipeData.cuisine.toLowerCase() : "other";

    /**
     * STEP 3: Fetch Image from Unsplash
     * Recipes look boring without photos.
     */
    const imageUrl = await fetchRecipeImage(normalizedTitle);

    /**
     * STEP 4: Save AI-generated recipe to our Database
     * This way, the NEXT user who asks for this dish gets it instantly.
     */
    const strapiRecipeData = {
      data: {
        title: normalizedTitle,
        description: recipeData.description,
        cuisine,
        category,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        prepTime: Number(recipeData.prepTime),
        cookTime: Number(recipeData.cookTime),
        servings: Number(recipeData.servings),
        nutrition: recipeData.nutrition,
        tips: recipeData.tips,
        substitutions: recipeData.substitutions,
        imageUrl: imageUrl || "",
        isPublic: true,
        author: user.id,
      },
    };

    const createRecipeResponse = await fetch(`${STRAPI_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify(strapiRecipeData),
    });

    if (!createRecipeResponse.ok) throw new Error("Failed to save recipe to database");

    const createdRecipe = await createRecipeResponse.json();

    return {
      success: true,
      recipe: { ...recipeData, title: normalizedTitle, category, cuisine, imageUrl: imageUrl || "" },
      recipeId: createdRecipe.data.id,
      isSaved: false,
      fromDatabase: false,
      recommendationsLimit: isPro ? "unlimited" : 5,
      isPro,
      message: "Recipe generated and saved successfully!",
    };
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
    const token = await getAuthToken();
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const recipeId = formData.get("recipeId");
    if (!recipeId) throw new Error("Recipe ID is required");

    // Check if they already saved it
    const existingResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();
      if (existingData.data && existingData.data.length > 0) {
        return { success: true, alreadySaved: true, message: "Recipe is already in your collection" };
      }
    }

    // Link User to Recipe
    const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
      body: JSON.stringify({
        data: { recipe: recipeId, savedAt: new Date().toISOString() },
      }),
    });

    if (!saveResponse.ok) throw new Error("Failed to save recipe to collection");

    const savedRecipe = await saveResponse.json();
    return { success: true, alreadySaved: false, savedRecipe: savedRecipe.data, message: "Recipe saved to your collection!" };
  } catch (error) {
    console.error("❌ Error saving recipe to collection:", error);
    throw new Error(error.message || "Failed to save recipe");
  }
}

/**
 * REMOVE RECIPE FROM COLLECTION
 * Handles the "Unlike" action.
 */
export async function removeRecipeFromCollection(formData) {
  try {
    const token = await getAuthToken();
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const recipeId = formData.get("recipeId");
    if (!recipeId) throw new Error("Recipe ID is required");

    // Search for the Save record first
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: { Cookie: `token=${token}` },
        cache: "no-store",
      },
    );

    if (!searchResponse.ok) throw new Error("Failed to find saved recipe");

    const searchData = await searchResponse.json();
    if (!searchData.data || searchData.data.length === 0) {
      return { success: true, message: "Recipe was not in your collection" };
    }

    // Delete the Save record
    const savedRecipeId = searchData.data[0].id;
    const deleteResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes/${savedRecipeId}`,
      {
        method: "DELETE",
        headers: { Cookie: `token=${token}` },
      },
    );

    if (!deleteResponse.ok) throw new Error("Failed to remove recipe from collection");

    return { success: true, message: "Recipe removed from your collection" };
  } catch (error) {
    console.error("❌ Error removing recipe from collection:", error);
    throw new Error(error.message || "Failed to remove recipe");
  }
}

/**
 * GET RECIPES BY PANTRY INGREDIENTS
 * The "Cook with what you have" feature. 
 * Fetches ingredients, asks AI for options, and looks up images.
 */
export async function getRecipesByPantryIngredients() {
  try {
    const token = await getAuthToken();
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const isPro = user.subscriptionTier === "pro";

    /**
     * SECURITY: Arcjet Protection
     * Limits how many times a Free user can ask for AI suggestions.
     */
    const arcjetClient = isPro ? proTierLimit : freeMealRecommendations;
    if (arcjetClient) {
      const req = await request();
      const decision = await arcjetClient.protect(req, { userId: user._id, requested: 1 });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          throw new Error(`Monthly AI recipe limit reached. ${isPro ? "Please contact support." : "Upgrade to Pro!"}`);
        }
        throw new Error("Request denied");
      }
    }

    // 1. Fetch the user's current ingredients
    const pantryResponse = await fetch(`${STRAPI_URL}/api/pantry-items`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!pantryResponse.ok) throw new Error("Failed to fetch pantry items");
    const pantryData = await pantryResponse.json();

    if (!pantryData.data || pantryData.data.length === 0) {
      return { success: false, message: "Your pantry is empty. Add ingredients first!" };
    }

    const ingredients = pantryData.data.map((item) => item.name).join(", ");

    // 2. Ask Gemini for suggestions based on these ingredients
    const model = getGeminiModel("gemini-2.0-flash");
    const prompt = INGREDIENT_RECIPE_SUGGESTIONS_PROMPT(ingredients);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let recipeSuggestions;
    try {
      const cleanText = text.replace(/```json\n?|```\n?/g, "").trim();
      recipeSuggestions = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Failed to generate recipe suggestions. Please try again.");
    }

    // 3. Find images for each suggestion
    const recipeSuggestionsWithImages = await Promise.all(
      recipeSuggestions.map(async (recipe) => {
        const imageUrl = await fetchRecipeImage(recipe.title);
        return { ...recipe, imageUrl };
      }),
    );

    return {
      success: true,
      recipes: recipeSuggestionsWithImages,
      ingredientsUsed: ingredients,
      recommendationsLimit: isPro ? "unlimited" : 5,
      message: `Found ${recipeSuggestions.length} recipes you can make!`,
    };
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
    const token = await getAuthToken();
    const user = await getServerUser();
    if (!user) throw new Error("User not authenticated");

    const response = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch saved recipes");
    const data = await response.json();
    
    // Extract just the Recipe data from the Saved-Recipe records
    const recipes = data.data.map((savedRecipe) => savedRecipe.recipe).filter(Boolean);

    return { success: true, recipes, count: recipes.length };
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    throw new Error(error.message || "Failed to load saved recipes");
  }
}
