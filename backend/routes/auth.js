/**
 * AUTHENTICATION ROUTES
 * This file handles how users join the platform and stay logged in.
 * It uses JWT (JSON Web Tokens) to remember who the user is.
 */

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // The library that creates the "Digital Passports"
const User = require("../models/User"); // The blueprint for our user data
const auth = require("../middleware/auth"); // Helper to check if a user is valid

// Secret Key for signing the tokens (Keep this secret!)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // Passwords expire for the browser after 7 days

// Check if we actually have a secret key. Without it, nobody can login.
if (!JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not set. Authentication will fail.");
}

/**
 * GENERATE TOKEN HELPER
 * This function takes a User ID and turns it into a signed string.
 * This string is the "Ticket" the browser shows us to prove who it is.
 */
const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * SIGNUP ROUTE (POST /api/auth/signup)
 * Used when a new person wants to create an account.
 */
router.post("/signup", async (req, res) => {
  try {
    // Take the data that the user typed in the frontend form
    const { email, password, firstName, lastName, username } = req.body;

    // 1. Check if they actually provided email and password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Ensure password isn't too short
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // 3. Make sure the email isn't already in our database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 4. Create the new user object (Mongoose will hash the password automatically)
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      username: username || email.split("@")[0], // If no username, use the first part of their email
    });

    // 5. Save the user to MongoDB
    await user.save();

    // 6. Create their "Digital Ticket" (Token)
    const token = generateToken(user._id);

    // 7. Send the token to the browser as a "Secure Cookie"
    // This is safer than LocalStorage because JavaScript cannot steal it.
    res.cookie("token", token, {
      httpOnly: true, // Only the server can read this
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevent cross-site attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    });

    // 8. Success! Send the user info back (without password)
    res.status(201).json({ user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * LOGIN ROUTE (POST /api/auth/login)
 * Used when an existing user wants to enter the site.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic check
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Try to find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Check if the password they typed matches the hashed password in DB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Create and set the Cookie (Same as Signup)
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * LOGOUT ROUTE (POST /api/auth/logout)
 * Just tells the browser to throw away the digital ticket.
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

/**
 * GET CURRENT USER (GET /api/auth/me)
 * This is used when a user refreshes the page. 
 * The app asks the backend: "Who is logged in based on that cookie?"
 */
router.get("/me", auth, async (req, res) => {
  try {
    // The 'auth' middleware already found the user and put it in 'req.user'
    res.json({ user: req.user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
