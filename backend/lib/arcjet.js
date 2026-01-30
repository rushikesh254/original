/**
 * ARCJET SECURITY CONFIGURATION (Backend)
 * Protects the API from abuse using strict rate limits.
 */

const arcjet = require("@arcjet/node");
const { shield, tokenBucket, detectBot } = require("@arcjet/node");

// 1. Check if we have the secret key
const isArcjetConfigured = !!process.env.ARCJET_KEY;

if (!isArcjetConfigured) {
  console.warn("⚠️ ARCJET_KEY is not set. Backend rate limiting will be disabled.");
}

/**
 * MAIN ARCJET INSTANCE
 */
const aj = isArcjetConfigured
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        // SHIELD: Protects against common attacks (SQLi, XSS, etc.)
        shield({
          mode: "LIVE", 
        }),
        
        // BOT PROTECTION: Allow search engines, block malicious bots
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
      ],
    })
  : null;

/**
 * RATE LIMIT RULES
 * We return the rule object so the middleware can use it.
 */

// Free users: 10 scans per 30 days
const freePantryScans = tokenBucket({
  mode: "LIVE",
  characteristics: ["userId"],
  refillRate: 10,
  interval: "30d",
  capacity: 10,
});

// Free users: 5 recipe suggestions per 30 days
const freeMealRecommendations = tokenBucket({
  mode: "LIVE",
  characteristics: ["userId"],
  refillRate: 5,
  interval: "30d",
  capacity: 5,
});

// Pro users: 1000 requests per day
const proTierLimit = tokenBucket({
  mode: "LIVE",
  characteristics: ["userId"],
  refillRate: 1000,
  interval: "1d",
  capacity: 1000,
});

module.exports = {
  aj,
  freePantryScans,
  freeMealRecommendations,
  proTierLimit,
};
