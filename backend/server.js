/**
 * MAIN SERVER ENTRY POINT (server.js)
 * This is the Heart of the Backend. 
 * It sets up the environment, connects to the database, and starts listening 
 * for requests from the frontend.
 */

require("dotenv").config(); // Load variables from .env file (Security)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Allows frontend to talk to backend
const cookieParser = require("cookie-parser"); // Allows reading login cookies

const app = express();
const PORT = process.env.PORT || 1337; // The port where our server "lives"

/**
 * MIDDLEWARE SETUP
 * These functions process the data BEFORE it reaches our routes.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Only allow OUR frontend
    credentials: true, // Allow sending cookies between front and back
  }),
);
app.use(express.json({ limit: "50mb" })); // Includes limit for large Base64 images from pantry scan
app.use(cookieParser()); // Allows server to read 'token' from cookies

/**
 * DATABASE CONNECTION (MongoDB)
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    // Connect using Mongoose helper
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

// Monitor DB connection for issues
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
});

/**
 * ROUTE REGISTRATION
 * We tell the server which files handle which URL paths.
 */
app.use("/api/auth", require("./routes/auth"));           // Signup/Login
app.use("/api/users", require("./routes/users"));         // Profile updates
app.use("/api/recipes", require("./routes/recipes"));     // AI Recipe storage
app.use("/api/pantry-items", require("./routes/pantry")); // Fridge items
app.use("/api/saved-recipes", require("./routes/saved-recipes")); // Bookmarks

/**
 * ERROR HANDLING
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

/**
 * START SERVER
 * First we connect to the database, THEN we open the server port.
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Waiting for requests from the frontend...`);
  });
});
