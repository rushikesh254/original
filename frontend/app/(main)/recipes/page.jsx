"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark, Loader2, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { getSavedRecipes } from "@/actions/recipe.actions";
import RecipeCard from "@/components/RecipeCard";
import RecipeFilters from "@/components/RecipeFilters";

export default function SavedRecipesPage() {
  const {
    loading,
    data: recipesData,
    fn: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const recipes = recipesData?.recipes || [];

  // Callback to receive filtered recipes from RecipeFilters
  const handleFilteredRecipes = useCallback((filtered) => {
    setFilteredRecipes(filtered);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-1 mb-8">
          <Bookmark className="w-25 h-25 text-orange-600 " />
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
              My Saved Recipes
            </h1>
            <p className="text-stone-600">
              Your personal collection of favorite recipes
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-6" />
            <p className="text-stone-600">Loading your saved recipes...</p>
          </div>
        )}

        {/* Filters - Only show when we have recipes */}
        {!loading && recipes.length > 0 && (
          <RecipeFilters
            recipes={recipes}
            onFilteredRecipes={handleFilteredRecipes}
          />
        )}

        {/* Recipes Grid */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id || recipe._id}
                recipe={recipe}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* No Results After Filtering */}
        {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              No Matching Recipes
            </h3>
            <p className="text-stone-600 mb-4">
              Try adjusting your filters to see more recipes.
            </p>
          </div>
        )}

        {/* Empty State - No saved recipes at all */}
        {!loading && recipes.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              No Saved Recipes Yet
            </h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">
              Start exploring recipes and save your favorites to build your
              personal cookbook!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                  <ChefHat className="w-4 h-4" />
                  Explore Recipes
                </Button>
              </Link>
              <Link href="/pantry">
                <Button variant="outline" className="border-stone-300 gap-2">
                  Check Your Pantry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
