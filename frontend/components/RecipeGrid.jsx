"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import RecipeCard from "@/components/RecipeCard";
import ChromaGrid from "@/components/ReactBits/ChromaGrid";
import RecipeFilters from "@/components/RecipeFilters";

export default function RecipeGrid({
  type, // "category" or "cuisine"
  value, // actual category/cuisine name
  fetchAction, // server action to fetch meals
  backLink = "/dashboard",
}) {
  const { loading, data, fn: fetchMeals } = useFetch(fetchAction);

  useEffect(() => {
    if (value) {
      // Capitalize first letter for API call
      const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
      fetchMeals(formattedValue);
    }
  }, [value]);

  const meals = useMemo(() => data?.meals || [], [data]);
  const displayName = value?.replace(/-/g, " "); // Convert "saudi-arabian" to "saudi arabian"

  // 1. Enrich meals with mock metadata for filtering (since API doesn't provide it)
  const enrichedMeals = useMemo(() => {
    return meals.map((meal) => {
      // Deterministic hash based on ID or name
      const id = meal.idMeal || meal.id;
      const hash = id ? parseInt(id) : meal.strMeal ? meal.strMeal.length : 0;

      // Mock Data Generators
      const times = [20, 35, 45, 70]; // in minutes
      const mockTime = times[hash % times.length];

      // Mock Diet (approx 30% veg)
      const isVeg = hash % 3 === 0;

      // Mock Cuisines (if not provided by parent)
      const mockCuisines = [
        "Italian",
        "Indian",
        "American",
        "Mexican",
        "Asian",
      ];
      const cuisine =
        type === "cuisine"
          ? displayName // Use actual cuisine if we are on cuisine page
          : mockCuisines[hash % mockCuisines.length];

      // Mock Categories (if not provided by parent)
      const mockCategories = [
        "Breakfast",
        "Dessert",
        "Seafood",
        "Pasta",
        "Vegetarian",
      ];
      const category =
        type === "category"
          ? displayName // Use actual category if we are on category page
          : mockCategories[hash % mockCategories.length];

      return {
        ...meal,
        // Ensure these fields exist for filters
        title: meal.strMeal,
        image: meal.strMealThumb,
        id: meal.idMeal,
        cuisine: cuisine,
        category: category,
        isVeg: isVeg,
        cookTime: mockTime,
        prepTime: 10, // constant mock
      };
    });
  }, [meals, type, displayName]);

  // 2. Filter State
  const [filteredMeals, setFilteredMeals] = useState([]);

  // Initialize filtered meals when data changes
  useEffect(() => {
    setFilteredMeals(enrichedMeals);
  }, [enrichedMeals]);

  // 3. Callback for RecipeFilters
  const handleFilteredRecipes = useCallback((filtered) => {
    setFilteredMeals(filtered);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-14 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 capitalize tracking-tight leading-tight">
            {displayName}{" "}
            <span className="text-orange-600">
              {type === "cuisine" ? "Cuisine" : "Recipes"}
            </span>
          </h1>

          {!loading && meals.length > 0 && (
            <p className="text-stone-600 mt-2">
              {meals.length} delicious {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"} to try
            </p>
          )}
        </div>

        {/* Filters */}
        {!loading && enrichedMeals.length > 0 && (
          <RecipeFilters
            recipes={enrichedMeals}
            onFilteredRecipes={handleFilteredRecipes}
          />
        )}

        {/* Loading State - Skeleton Grid */}
        {loading && (
          <div
            className="grid gap-6 w-full"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 h-full animate-pulse"
              >
                <div className="aspect-[4/3] bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 w-16 bg-stone-200 rounded" />
                    <div className="h-6 w-16 bg-stone-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Meals Grid - Using ChromaGrid */}
        {!loading && filteredMeals.length > 0 && (
          <ChromaGrid
            items={filteredMeals.map((meal) => {
              // Mock Random Metadata (Visual Demo) - Re-using meal data where possible
              const ratings = ["4.5", "4.8", "4.2", "5.0"];
              const spices = ["Mild", "Medium", "Spicy", null];
              const diets = ["High-Protein", "Low-Carb", "Keto", null];

              // Deterministic hash (re-calc or use enriched)
              const id = meal.id || meal.idMeal;
              const hash = id ? parseInt(id) : 0;

              return {
                image: meal.image || meal.strMealThumb,
                title: meal.title || meal.strMeal,
                subtitle: meal.category || "Recipe",
                handle: (meal.cuisine || "International") + " Cuisine",
                borderColor: "#ff5200",
                gradient: "linear-gradient(145deg, #ff5200, #000)",
                url: `/recipe/${meal.id}`, // Fixed URL to point to recipe details
                metadata: {
                  time: `${meal.cookTime + meal.prepTime} min`,
                  rating: ratings[hash % ratings.length],
                  spice: spices[hash % spices.length],
                  diet: diets[hash % diets.length],
                },
              };
            })}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        )}

        {/* Empty State */}
        {!loading && meals.length > 0 && filteredMeals.length === 0 && (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border border-stone-200 border-dashed">
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              No matching recipes
            </h3>
            <p className="text-stone-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}

        {/* No Data State */}
        {!loading && meals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              No recipes found
            </h3>
            <p className="text-stone-500 mb-6">
              We couldn&apos;t find any {displayName}{" "}
              {type === "cuisine" ? "dishes" : "recipes"}.
            </p>
            <Link href={backLink}>
              <span className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Go back to explore more
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
