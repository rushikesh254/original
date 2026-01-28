/**
 * AUTH CONTEXT (The App's Memory)
 * This file handles the "Brain" of the frontend authentication.
 * It remembers who is logged in and shares that info with every component.
 */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// 1. Create the "Storage Container" for our Auth data
const AuthContext = createContext(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/**
 * AUTH PROVIDER
 * This component wraps the entire app. It holds the "State" (the data).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // The logged-in user's info
  const [isLoaded, setIsLoaded] = useState(false); // Are we still checking if they are logged in?

  /**
   * FETCH USER
   * When the page first loads, we ask the backend: "Is there a valid cookie?"
   */
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include", // CRITICAL: This tells the browser to send our "Secure Token" cookie
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Yes! Logged in.
      } else {
        setUser(null); // No cookie or expired token.
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoaded(true); // We are done checking.
    }
  }, []);

  // Run the check as soon as the app starts
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * SIGN OUT
   * Tells the backend to delete the cookie and clears the React memory.
   */
  const signOut = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);

      // Redirect to landing page after logout
      typeof window !== "undefined" && window.location.assign("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  /**
   * SIGN IN
   * Sends email/password to backend and waits for a "Success" response.
   */
  const signIn = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to sign in");
    }

    const data = await response.json();
    setUser(data.user); // Save user to memory
    return data;
  }, []);

  /**
   * SIGN UP
   * Creates a new account in our database.
   */
  const signUp = useCallback(async (email, password, firstName, lastName) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to sign up");
    }

    const data = await response.json();
    setUser(data.user);
    return data;
  }, []);

  /**
   * UPDATE USER
   * Saves new profile info (like name or avatar).
   */
  const updateUser = useCallback(async (userData) => {
    const userId = user?.id || user?._id;
    if (!userId) throw new Error("User ID not found");

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    const data = await response.json();
    // Update local memory with the new info from the server
    setUser((prev) => ({ ...prev, ...data.user }));
    return data;
  }, [user]);

  /**
   * CHANGE PASSWORD
   * Securely updates the user's password.
   */
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const userId = user?.id || user?._id;
    if (!userId) throw new Error("User ID not found");

    const response = await fetch(`${API_BASE_URL}/api/users/change-password/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to change password");
    }

    return await response.json();
  }, [user]);

  // The "Value" is what the rest of the app can access
  const value = {
    user,
    isSignedIn: !!user,
    isLoaded,
    signOut,
    signIn,
    signUp,
    updateUser,
    updateProfile: updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * CUSTOM HOOKS
 * These are "Shortcuts" for components to get auth data.
 */

// Use this to get user info: e.g. const { user } = useUser();
export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within AuthProvider");
  }
  return {
    user: context.user,
    isSignedIn: context.isSignedIn,
    isLoaded: context.isLoaded,
    updateProfile: context.updateUser,
    changePassword: context.changePassword,
  };
}

// Use this to check if logged in and log out
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return {
    userId: context.user?.id || context.user?._id || null,
    isSignedIn: context.isSignedIn,
    isLoaded: context.isLoaded,
    signOut: context.signOut,
  };
}

// Simple shortcuts for Login/Signup
export function useSignIn() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSignIn must be used within AuthProvider");
  }
  return { signIn: context.signIn };
}

export function useSignUp() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSignUp must be used within AuthProvider");
  }
  return { signUp: context.signUp };
}
