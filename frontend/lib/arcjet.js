/**
 * ARCJET SECURITY CONFIGURATION
 * Arcjet is our "Digital Bodyguard". It protects the app from hackers, 
 * bots, and people trying to spam our AI models.
 */

import arcjet, { shield, tokenBucket, detectBot } from "@arcjet/next";

// 1. Check if we have the secret key to turn on the bodyguard
const isArcjetConfigured = !!process.env.ARCJET_KEY;

if (!isArcjetConfigured) {
  console.warn("⚠️ ARCJET_KEY is not set. Rate limiting will be disabled.");
}

/**
 * MAIN ARCJET INSTANCE
 * We define global rules that apply to EVERY request.
 */
export const aj = isArcjetConfigured
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        // SHIELD: Protects against SQL Injection and other common hacks.
        shield({
          mode: "LIVE", 
        }),

        // BOT PROTECTION: Only allows humans and Search Engines (like Google).
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
      ],
    })
  : null;

/**
 * FREE TIER: PANTRY SCAN LIMITS
 * Limits free users to 10 AI scans per month.
 * We use 'tokenBucket' which works like a jar of 10 coins. 
 * Every time you scan, you use a coin.
 */
export const freePantryScans = aj?.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"], // Track coins per individual user
    refillRate: 10, // Get 10 new coins...
    interval: "30d", // ...every 30 days
    capacity: 10,   // Can't hold more than 10 coins at once
  }),
);

/**
 * FREE TIER: MEAL RECOMMENDATIONS
 * Limits free users to 5 AI recipe suggestions per month.
 */
export const freeMealRecommendations = aj?.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 5,
    interval: "30d",
    capacity: 5,
  }),
);

/**
 * PRO TIER: UNLIMITED ACCESS
 * Pro users get 1,000 requests per day (which is basically unlimited for a human).
 */
export const proTierLimit = aj?.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 1000,
    interval: "1d",
    capacity: 1000,
  }),
);
