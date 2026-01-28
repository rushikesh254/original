/**
 * RECIPE MODEL
 * This file defines how "AI Generated Recipes" are stored in MongoDB.
 * When Gemini generates a recipe, it creates an object that looks like this.
 */

const mongoose = require("mongoose");

// Define the blueprint for our Recipe data
const RecipeSchema = new mongoose.Schema(
    {
        // Basic naming and info
        title: { type: String, required: true },
        description: { type: String },
        
        // Complex data types: These store arrays of objects (like name, amount, unit)
        ingredients: { type: [Object], required: true }, // List of what goes in the dish
        instructions: { type: [Object], required: true }, // List of cooking steps
        
        // Categorization helps users search for recipes
        cuisine: { type: String },  // e.g., "Italian", "Indian"
        category: { type: String }, // e.g., "Breakfast", "Dinner"
        
        // Presentation
        imageUrl: { type: String }, // Link to a photo of the dish (fetched from Unsplash)
        
        // Visibility
        isPublic: { type: Boolean, default: true }, // Allows other users to see this recipe
        
        // Time and Portions
        prepTime: { type: Number }, // Time in minutes to prepare
        cookTime: { type: Number }, // Time in minutes to cook
        servings: { type: Number }, // How many people can eat this
        
        // AI specifically adds these for helpful context
        nutrition: { type: Object }, // Stores Calories, Protein, etc.
        tips: { type: [String] },     // Extra chef tips
        substitutions: { type: [Object] }, // e.g., "Use tofu instead of chicken"
        
        // Ownership: This connects the recipe to the user who generated it
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Points to the 'User' model
        },
    },
    {
        // automatically adds 'createdAt' and 'updatedAt'
        timestamps: true,
        
        // Formatting for the frontend
        toJSON: {
            virtuals: true, // Uses 'id' instead of '_id'
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

// Export the blueprint so we can use it in recipes.js routes
module.exports = mongoose.model("Recipe", RecipeSchema);
