/**
 * SERVER AUTH HELPERS
 * These functions help us check who is logged in while we are 
 * working on the "Server" side of Next.js.
 */

import { cookies } from "next/headers";

/**
 * GET AUTH TOKEN
 * Looks into the user's browser "Cookie Jar" to find the login token.
 */
export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token"); // Pulling the 'token' cookie
    return token?.value || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

/**
 * GET SERVER USER
 * The most important function for security. 
 * It takes the token, calls the backend, and gets the full user profile.
 */
export async function getServerUser() {
  try {
    const token = await getAuthToken();

    // 1. If no token, they aren't logged in.
    if (!token) {
      return null;
    }

    // 2. Point to our Manual Backend
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

    // 3. Ask the backend "/me" route "Who does this token belong to?"
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Cookie: `token=${token}`, // We "forward" the cookie to the backend
      },
      cache: "no-store", // Don't remember old results, always ask fresh
    });

    if (!response.ok) {
      return null;
    }

    const { user } = await response.json();

    /**
     * 4. DATA MAPPING (User Translation)
     * MongoDB uses '_id' but standard JavaScript often expects 'id'.
     * We create a simplified object that has both, so it works everywhere.
     */
    const mappedUser = {
      ...user,
      id: user._id?.toString() || user.id, // Ensure we have a string ID
      _id: user._id?.toString() || user.id, // Keep _id for security checks
    };

    return mappedUser;
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}
