/**
 * MIDDLEWARE (The Gatekeeper)
 * This file runs BEFORE any page is loaded. 
 * It checks if you are allowed to see a page or if you should be blocked.
 */

import { NextResponse } from "next/server";
import arcjet, { shield, detectBot } from "@arcjet/next";

/**
 * 1. PROTECTED ROUTES
 * These are "Secret" pages. You MUST be logged in to see them.
 * If you aren't logged in, the gatekeeper will kick you back to the Sign-In page.
 */
const protectedRoutes = ["/recipe", "/recipes", "/pantry", "/dashboard"];

function isProtectedRoute(pathname) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Arcjet Setup
const isArcjetConfigured = !!process.env.ARCJET_KEY;
const aj = isArcjetConfigured
  ? arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        shield({ mode: "LIVE" }), // Block common hacker attacks
        detectBot({
          mode: "LIVE",
          allow: [
            "CATEGORY:SEARCH_ENGINE", // Google is allowed
            "CATEGORY:PREVIEW",       // Slack/Discord previews are allowed
          ],
        }),
      ],
    })
  : null;

export async function middleware(req) {
  
  /**
   * STEP A: Security Check (Arcjet)
   * Is the person visiting a bot? Are they trying to hack us?
   */
  if (aj) {
    try {
      const decision = await aj.protect(req);
      if (decision.isDenied()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch (error) {
      console.error("Arcjet protection error:", error);
    }
  }

  /**
   * STEP B: Login Check
   * If the user is trying to see a "Member Only" page:
   */
  if (isProtectedRoute(req.nextUrl.pathname)) {
    const token = req.cookies.get("token"); // Look for the "Login Token"

    if (!token) {
      /**
       * NO TOKEN? -> Send them to Sign-In.
       * We also remember where they were trying to go using 'redirect_url'.
       */
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Everything looks good! Let them through.
  return NextResponse.next();
}

/**
 * CONFIG: Matcher
 * Tells Next.js NOT to run this on images, CSS, or JS files.
 * This makes the website faster.
 */
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
