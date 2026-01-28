/**
 * HEADER COMPONENT
 * This is the bar at the top of the screen that stays there 
 * even when you scroll. It handles navigation and user login state.
 */
"use client";

import React from "react";
import { Button } from "./ui/button";
import { Cookie, Refrigerator, Sparkles } from "lucide-react"; // Icons for "Recipes" and "Pantry"
import Link from "next/link";
import { useUser } from "@/lib/auth-context"; // The "Hook" that tells us if user is logged in
import HowToCookModal from "./HowToCookModal";
import PricingModal from "./PricingModal";
import Image from "next/image";
import { Badge } from "./ui/badge";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const { user, isSignedIn, isLoaded } = useUser();

  /**
   * LOADING STATE
   * If we don't know yet if the user is logged in (checking cookies), 
   * we show a simple "Pulsing" placeholder.
   */
  if (!isLoaded) {
    return (
      <header className="fixed top-0 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-stone-50/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-16 h-8 bg-stone-200 animate-pulse rounded" />
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full border-b border-stone-200 bg-stone-50/80 backdrop-blur-md z-50 supports-backdrop-filter:bg-stone-50/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 1. LOGO: Clicking this takes you Home (or Dashboard if logged in) */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 group"
        >
          <Image
            src="/orange-logo.png"
            alt="Servd Logo"
            width={60}
            height={60}
            className="w-16"
          />
        </Link>




        {/* 2. MAIN NAV: Only visible on Tablets and Desktops (hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-600">
          <Link
            href="/recipes"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center"
          >
            <Cookie className="w-4 h-4" />
            My Recipes
          </Link>
          <Link
            href="/pantry"
            className="hover:text-orange-600 transition-colors flex gap-1.5 items-center"
          >
            <Refrigerator className="w-4 h-4" />
            My Pantry
          </Link>
        </div>





        {/* 3. RIGHT SIDE: Action Buttons (Login/Signup or User Profile) */}
        <div className="flex items-center space-x-4">
          <HowToCookModal />

          {isSignedIn && user ? (
            // IF LOGGED IN: Show Subscription Badge + User Avatar
            <>
              {/* Pricing Modal with Built-in Trigger */}
              <PricingModal subscriptionTier={user.subscriptionTier}>
                <Badge
                  variant="outline"
                  className={`flex h-8 px-3 gap-1.5 rounded-full text-xs font-semibold transition-all ${
                    user.subscriptionTier === "pro"
                      ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
                      : "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"
                  }`}
                >
                  <Sparkles
                    className={`h-3 w-3 ${
                      user.subscriptionTier === "pro"
                        ? "text-white fill-white/20"
                        : "text-stone-500"
                    }`}
                  />
                  <span>
                    {user.subscriptionTier === "pro" ? "Pro Chef" : "Free Plan"}
                  </span>
                </Badge>
              </PricingModal>

              <UserDropdown />
            </>
          ) : (
            // IF NOT LOGGED IN: Show Sign In / Get Started buttons
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-stone-600 hover:text-orange-600 hover:bg-orange-50 font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" className="rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

