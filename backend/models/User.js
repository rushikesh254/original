/**
 * USER MODEL
 * This file defines how "User" data is stored in our MongoDB database.
 * Every time a person signs up, their information (email, password, etc.) 
 * follows this blueprint.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // bcrypt is used to hash passwords so they aren't stored in plain text

// Define the blueprint for our User data
const UserSchema = new mongoose.Schema(
  {
    // The email must be a string, it's required, and no two users can have the same email
    email: { type: String, required: true, unique: true, index: true },
    
    // The password must be at least 8 characters long
    password: { type: String, required: true, minlength: 8 },
    
    // Optional basic information about the user
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String }, // Stores the link to the user's profile picture
    
    // Subscription tier helps us decide if the user gets "Pro" features
    subscriptionTier: {
      type: String,
      enum: ["free", "pro"], // Only these two values are allowed
      default: "free",
    },
    
  },
  {
    // timestamps: true automatically adds 'createdAt' and 'updatedAt' fields to the user
    timestamps: true,
    
    // toJSON defines how the data looks when we send it to the frontend
    toJSON: {
      virtuals: true, // Allows us to use 'id' instead of '_id'
      transform: function (doc, ret) {
        ret.id = ret._id; // Copy _id to id
        delete ret._id;   // Remove the original _id
        delete ret.__v;   // Remove version key (Mongoose internal)
        delete ret.password; // IMPORTANT: Never send the hashed password to the frontend for security
      },
    },
  },
);

/**
 * PASSWORD HASHING MIDDLEWARE
 * This runs automatically EVERY TIME we save a user.
 * It takes the naked password and turns it into a long "hash" string
 * that nobody can read.
 */
UserSchema.pre("save", async function () {
  // If the password hasn't changed, don't re-hash it
  if (!this.isModified("password")) return;

  // Generate a "salt" (a random piece of data to make the hash unique)
  const salt = await bcrypt.genSalt(10);
  
  // Replace the plain password with the hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * COMPARE PASSWORD METHOD
 * This helper function is used during Login.
 * It checks if the password the user typed matches the hash in the database.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model so we can use it in our routes (like signup.js or login.js)
module.exports = mongoose.model("User", UserSchema);
