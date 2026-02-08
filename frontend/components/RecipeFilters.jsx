"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { X, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Filter state options
const DIET_OPTIONS = [
  { value: "all", label: "All Recipes" },
  { value: "veg", label: "Vegetarian" },
  { value: "nonveg", label: "Non-Vegetarian" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Saved" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "time-asc", label: "Cooking Time (Low to High)" },
  { value: "time-desc", label: "Cooking Time (High to Low)" },
];

export default function RecipeFilters({ recipes, onFilteredRecipes }) {
  // Filter states
  const [dietFilter, setDietFilter] = useState("all");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Extract unique cuisines and categories from recipes
  const { cuisines, categories } = useMemo(() => {
    const cuisineSet = new Set();
    const categorySet = new Set();

    recipes.forEach((recipe) => {
      if (recipe.cuisine) cuisineSet.add(recipe.cuisine.toLowerCase());
      if (recipe.category) categorySet.add(recipe.category.toLowerCase());
    });

    return {
      cuisines: Array.from(cuisineSet).sort(),
      categories: Array.from(categorySet).sort(),
    };
  }, [recipes]);

  // Apply filters and sorting
  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    // Diet filter
    if (dietFilter === "veg") {
      result = result.filter((recipe) => recipe.isVeg === true);
    } else if (dietFilter === "nonveg") {
      result = result.filter((recipe) => recipe.isVeg === false);
    }

    // Cuisine filter
    if (cuisineFilter !== "all") {
      result = result.filter(
        (recipe) => recipe.cuisine?.toLowerCase() === cuisineFilter,
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (recipe) => recipe.category?.toLowerCase() === categoryFilter,
      );
    }

    // Sorting
    switch (sortBy) {
      case "title-asc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title-desc":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "time-asc":
        result.sort((a, b) => {
          const timeA = (a.prepTime || 0) + (a.cookTime || 0);
          const timeB = (b.prepTime || 0) + (b.cookTime || 0);
          return timeA - timeB;
        });
        break;
      case "time-desc":
        result.sort((a, b) => {
          const timeA = (a.prepTime || 0) + (a.cookTime || 0);
          const timeB = (b.prepTime || 0) + (b.cookTime || 0);
          return timeB - timeA;
        });
        break;
      default:
        // "recent" - keep original order (most recent first from API)
        break;
    }

    return result;
  }, [recipes, dietFilter, cuisineFilter, categoryFilter, sortBy]);

  // Update parent with filtered recipes
  useEffect(() => {
    onFilteredRecipes(filteredRecipes);
  }, [filteredRecipes, onFilteredRecipes]);

  // Count active filters
  const activeFiltersCount = [dietFilter, cuisineFilter, categoryFilter].filter(
    (f) => f !== "all",
  ).length;

  // Clear all filters
  const clearFilters = () => {
    setDietFilter("all");
    setCuisineFilter("all");
    setCategoryFilter("all");
    setSortBy("recent");
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Diet Filter with Icons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-700">Diet:</span>
          <div className="flex gap-1">
            {DIET_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={dietFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDietFilter(option.value)}
                className={`gap-2 ${
                  dietFilter === option.value
                    ? "bg-stone-900 text-white hover:bg-stone-800"
                    : "border-stone-300 hover:border-stone-400"
                }`}
              >
                {option.value === "veg" && (
                  <Image
                    src="/icons/veg-icon.png"
                    alt="Veg"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                )}
                {option.value === "nonveg" && (
                  <Image
                    src="/icons/nonveg-icon.png"
                    alt="Non-Veg"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                )}
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Cuisine Filter */}
        {cuisines.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-700 whitespace-nowrap">
              Cuisine:
            </span>
            <div className="relative">
              <select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                className="appearance-none w-[140px] h-9 pl-3 pr-8 rounded-md border border-stone-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer capitalize"
              >
                <option value="all">All Cuisines</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-700 whitespace-nowrap">
              Category:
            </span>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none w-[140px] h-9 pl-3 pr-8 rounded-md border border-stone-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer capitalize"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-4 h-4 text-stone-500" />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-[180px] h-9 pl-3 pr-8 rounded-md border border-stone-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-stone-500 hover:text-stone-700 gap-1"
          >
            <X className="w-4 h-4" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-3 pt-3 border-t border-stone-100">
        <p className="text-sm text-stone-500">
          Showing{" "}
          <span className="font-semibold text-stone-700">
            {filteredRecipes.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-stone-700">{recipes.length}</span>{" "}
          recipes
        </p>
      </div>
    </div>
  );
}
