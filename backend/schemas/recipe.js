const z = require('zod');

const ingredientSchema = z.object({
    name: z.string(),
    amount: z.union([z.string(), z.number()]).optional(),
    unit: z.string().optional(),
}).catchall(z.any());

const instructionSchema = z.object({
    step: z.number().optional(),
    text: z.string(),
}).catchall(z.any());

const recipeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    ingredients: z.array(ingredientSchema),
    instructions: z.array(instructionSchema),
    cuisine: z.string().optional(),
    category: z.string().optional(),
    imageUrl: z.string().optional(),
    isPublic: z.boolean().default(true),
    prepTime: z.number().optional(),
    cookTime: z.number().optional(),
    servings: z.number().optional(),
    nutrition: z.record(z.any()).optional(),
    tips: z.array(z.string()).optional(),
    substitutions: z.array(z.any()).optional(),
    isVeg: z.boolean().nullable().optional(), // true=veg, false=non-veg, null=unknown
});

module.exports = { recipeSchema };
