/**
 * AUTH MIDDLEWARE
 * This is a "Gatekeeper" function. 
 * Before the server lets anyone Get or Save data, this function checks 
 * if they have a valid "Digital Passport" (Token).
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // 1. Get the token from the browser cookie
    const token = req.cookies.token;

    if (!token) {
      // If no token, they aren't logged in
      return res.status(401).json({ error: "Authentication required" });
    }

    // 2. Security Check: Make sure the secret key exists in our settings
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // 3. VERIFY the token: Is it real? Was it signed by US? Has it expired?
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Handle expired or fake tokens specifically
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired" });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      throw jwtError;
    }

    // 4. Find the User in the database using the ID inside the token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 5. ATTACH the user to the request
    // This makes 'req.user' available in all our route files (like pantry.js)
    req.userId = decoded.userId;
    req.user = user;

    // 6. Go to the next step (the actual route logic)
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = auth;
