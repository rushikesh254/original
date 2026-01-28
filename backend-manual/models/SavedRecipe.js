/**
 * SAVED RECIPE MODEL
 * This file acts as a "Junction" or "Link".
 * It connects a specific User to a specific Recipe they liked.
 * Think of it as a "Bookmarks" or "Favorites" collection.
 */

const mongoose = require("mongoose");

// Define the blueprint for our Saved Recipe (Bookmark) data
const SavedRecipeSchema = new mongoose.Schema(
    {
        // WHOS bookmark is this?
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Points to the User who clicked "Save"
            required: true,
        },
        
        // WHAT recipe did they save?
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe", // Points to the specific Recipe they liked
            required: true,
        },
        
        // When exactly did they save it?
        savedAt: { type: Date, default: Date.now },
    },
    {
        // automatically adds 'createdAt' and 'updatedAt'
        timestamps: true,
        
        // Formatting for the frontend (React side)
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

/**
 * INDEXING
 * We can optionally add an index here to make sure a user can't save 
 * the SAME recipe twice, but for now, we leave it simple.
 */

// Export the blueprint so we can use it in saved-recipes.js routes
module.exports = mongoose.model("SavedRecipe", SavedRecipeSchema);
