/**
 * USER ROUTES
 * This file handles profile-related actions, like updating your name 
 * or changing your password.
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User"); // The User blueprint
const auth = require("../middleware/auth"); // Login protection

/**
 * HELPER: IS VALID OBJECT ID
 * Checks if the ID in the URL is a real MongoDB ID format.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET ME (GET /api/users/me)
 * Returns the data of the currently logged-in user.
 */
router.get("/me", auth, async (req, res) => {
  try {
    // The 'auth' middleware already found the user and attached it to 'req.user'
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * UPDATE PROFILE (PUT /api/users/:id)
 * Allows a user to change their name, email, or profile picture.
 */
router.put("/:id", auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // 1. SECURITY CHECK: A user can only update their OWN profile.
    // We compare the ID in the URL with the ID from their login cookie.
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // 2. Define which fields are safe to update via this route
    const updates = {};
    const allowedFields = ["firstName", "lastName", "email", "imageUrl"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 3. Update the user in MongoDB
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); // Never return the password in the response

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * CHANGE PASSWORD (PUT /api/users/change-password/:id)
 * Securely updates a user's password after verifying the old one.
 */
router.put("/change-password/:id", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Basic validation
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
    }

    // 2. SECURITY CHECK: Ownership check
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // 3. Find user and include the password field (which is usually hidden)
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 4. Verify that the "Current Password" they typed is correct
    // (We use the helper method we defined in User.js)
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // 5. Set the new password (The 'pre-save' hook in User.js will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET USER BY ID (GET /api/users/:id)
 * PUBLIC: Allows seeing another user's public profile (like username and image).
 */
router.get("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
