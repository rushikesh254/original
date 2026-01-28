/**
 * PANTRY ITEM MODEL
 * This file defines how ingredients in the user's kitchen are stored.
 * When a user scans a photo or adds an item manually, it follows 
 * this blueprint.
 */

const mongoose = require("mongoose");

// Define the blueprint for our Pantry Item data
const PantryItemSchema = new mongoose.Schema(
    {
        // What is the item called? (e.g., "Tomato", "Milk")
        name: { type: String, required: true },
        
        // How much of it do they have? (e.g., "3 items", "1 liter")
        quantity: { type: String },
        
        // Optional photo of the specific item
        imageUrl: { type: String },
        
        // Ownership: This is critical. It tells us WHOS pantry this item belongs to.
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Links to the 'User' model
            required: true,
        },
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

// Export the blueprint so we can use it in pantry.js routes
module.exports = mongoose.model("PantryItem", PantryItemSchema);
