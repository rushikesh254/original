const { z } = require("zod");

// Standard ingredients/instructions for AI output
const aiIngredientSchema = z
  .object({
    name: z.string().optional(),
    item: z.string().optional(),
    amount: z.union([z.string(), z.number()]).optional(),
    unit: z.string().optional(),
    category: z.string().optional(),
  })
  .catchall(z.any());

const aiInstructionSchema = z
  .object({
    step: z.number().optional(),
    text: z.string(),
  })
  .catchall(z.any());

// Schema for Single Recipe Generation - More lenient with catchall
const aiRecipeSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    cuisine: z.string().optional(),
    category: z.string().optional(),
    ingredients: z.array(aiIngredientSchema).optional().default([]),
    instructions: z.array(aiInstructionSchema).optional().default([]),
    prepTime: z.coerce.number().optional(),
    cookTime: z.coerce.number().optional(),
    servings: z.coerce.number().optional(),
    nutrition: z.record(z.any()).optional(),
    tips: z.array(z.string()).optional(),
    substitutions: z.array(z.any()).optional(),
  })
  .catchall(z.any());

// Schema for Suggestions (List of Recipes)
const aiSuggestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  matchPercentage: z.coerce.number().optional(),
  missingIngredients: z.array(z.string()).optional(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
  prepTime: z.coerce.number().optional(),
  cookTime: z.coerce.number().optional(),
  servings: z.coerce.number().optional(),
});

const aiSuggestionsListSchema = z.array(aiSuggestionSchema);

module.exports = { aiRecipeSchema, aiSuggestionsListSchema };
