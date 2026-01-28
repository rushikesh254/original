/**
 * IMAGE FETCHING SERVICE (Unsplash)
 * This file handles how we find beautiful photos for our recipes.
 * It connects to the Unsplash API to search for images based on the recipe title.
 */

// The Access Key is stored in .env for security
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/**
 * FETCH RECIPE IMAGE
 * Takes a recipe name (like "Butter Chicken") and finds a matching photo.
 * @param {string} recipeName - The title of the recipe to search for.
 * @returns {Promise<string>} - The URL of the image, or an empty string if not found.
 */
export async function fetchRecipeImage(recipeName) {
  try {
    // 1. Safety Check: If no API key is found, don't even try to fetch.
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn("⚠️ UNSPLASH_ACCESS_KEY not set, skipping image fetch");
      return "";
    }

    // 2. Build the search query
    const searchQuery = `${recipeName}`;
    
    // 3. Call the Unsplash API search endpoint
    // We ask for 1 image, and it must be "landscape" orientation (looks better on cards).
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        searchQuery,
      )}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    // 4. Handle API errors (like 401 Unauthorized or 429 Rate Limit)
    if (!response.ok) {
      console.error("❌ Unsplash API error:", response.statusText);
      return "";
    }

    const data = await response.json();

    // 5. If we found a result, return the "regular" sized image URL.
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      console.log("✅ Found Unsplash image:", photo.urls.regular);
      return photo.urls.regular;
    }

    // 6. If no image found for that specific name, return empty.
    console.log("ℹ️ No Unsplash image found for:", recipeName);
    return "";
  } catch (error) {
    console.error("❌ Error fetching Unsplash image:", error);
    return "";
  }
}
