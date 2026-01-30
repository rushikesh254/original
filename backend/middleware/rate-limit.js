/**
 * RATE LIMIT MIDDLEWARE
 * Uses Arcjet to strictly limit how many times a user can perform expensive AI actions.
 */
const { aj, freePantryScans, freeMealRecommendations, proTierLimit } = require("../lib/arcjet");

/**
 * @param {string} type - 'scan' | 'suggestion'
 */
const rateLimit = (type) => {
  return async (req, res, next) => {
    try {
      // If Arcjet isn't configured, just let them pass (dev mode safe)
      if (!aj) return next();

      const user = req.user; // User is attached by 'auth' middleware earlier
      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const isPro = user.subscriptionTier === "pro";
      
      // Select the correct rule based on User Tier and Action Type
      let rule;
      if (isPro) {
        rule = proTierLimit;
      } else {
        if (type === "scan") rule = freePantryScans;
        else if (type === "suggestion") rule = freeMealRecommendations;
        else return next(); // Unknown type, no limit?
      }

      // Ask Arcjet if this request is allowed
      const decision = await aj.protect(req, {
        userId: user._id.toString(),
        requested: 1, // deduct 1 token
        rules: [rule] // Apply specific rule manually
      });

      if (decision.isDenied()) {
         if (decision.reason.isRateLimit()) {
            return res.status(429).json({ 
              error: `Limit reached. ${isPro ? "Please contact support." : "Upgrade to Pro for more!"}` 
            });
         }
         return res.status(403).json({ error: "Request denied by security system" });
      }

      next();
    } catch (error) {
      console.error("Rate limit error:", error);
      // Fail open or closed? Let's fail open so valid users aren't blocked by system errors
      next(); 
    }
  };
};

module.exports = rateLimit;
