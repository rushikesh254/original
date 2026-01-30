/**
 * API HELPERS
 * Shared functions to talk to our Backend nicely.
 * Handles: Authentication headers, Error parsing, etc.
 */

import { getServerUser, getAuthToken } from "@/lib/serverAuth";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * FETCH WITH AUTH
 * A wrapper around 'fetch' that automatically adds the User Token.
 */
export async function fetchWithAuth(endpoint, options = {}) {
  // 1. Ensure User is Logged In
  const user = await getServerUser();
  if (!user) throw new Error("User not authenticated");

  const token = await getAuthToken();

  // 2. Prepare Headers
  const headers = {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
    ...options.headers,
  };

  // 3. Make the Request
  const response = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 4. Handle Errors uniformly
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || response.statusText;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // 5. Return success data
  // Some endpoints return { data: ... }, others just { ... }
  // We'll return the raw JSON so the caller can pick what they need.
  return await response.json();
}

export { getServerUser, getAuthToken }; // Re-export for convenience
