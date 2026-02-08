/**
 * PRICING SECTION
 * This component displays the two plans: Free (Sous Chef) and Pro (Head Chef).
 * It changes its buttons based on whether the user is logged in or already subscribed.
 */
"use client";

import React from "react";
import { Check } from "lucide-react"; // The "Tick" icon
import { useUser } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PricingSection({ subscriptionTier = "free" }) {
  const { isSignedIn } = useUser();

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. SECTION HEADER */}
      <div className="mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-xl text-stone-600 font-light">
          Start for free. Upgrade to become a master chef.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* 
          FREE PLAN (Sous Chef) 
          Standard card with grey/stone borders.
        */}
        <Card className="border-2 border-stone-200 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Sous Chef</CardTitle>
            <div className="text-5xl font-bold text-stone-900">
              $0
              <span className="text-lg font-normal text-stone-400">/mo</span>
            </div>
            <CardDescription className="text-stone-600 font-light text-base">
              Perfect for casual weekly cooks.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-4">
              {[
                "10 pantry scans per month",
                "5 AI meal recommendations",
                "Standard support",
                "Standard Recipes",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-stone-700">
                  <Check className="h-5 w-5 shrink-0 mt-0.5 text-stone-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className={"mt-auto"}>
            <Link href="/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full border-2 border-stone-900 hover:bg-stone-900 hover:text-white"
              >
                Get Started
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* 
          PRO PLAN (Head Chef) 
          Highlighted card with orange borders and a "Most Popular" tag.
        */}
        <Card className="relative border-2 border-orange-600 bg-orange-50">
          {/* Most Popular Ribbon */}
          <Badge className="absolute top-0 right-0 rounded-none rounded-bl-lg bg-orange-600 text-white font-bold uppercase tracking-wide border-none">
            MOST POPULAR
          </Badge>

          <CardHeader>
            <CardTitle className="text-3xl font-bold text-orange-900">
              Head Chef
            </CardTitle>
            <div className="text-5xl font-bold text-orange-600">
              $7.99
              <span className="text-lg font-normal text-orange-400">/mo</span>
            </div>
            <CardDescription className="text-orange-800/70 font-light text-base">
              For the serious home cook.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-4">
              {[
                "Unlimited pantry scans",
                "Unlimited AI recipes",
                "Priority Support",
                "Recipes with Nutritional analysis",
                "Chef's Tips & Tricks",
                "Ingredient Substitutions",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-orange-950">
                  <Badge className="bg-orange-200 p-1 rounded-full h-6 w-6 flex items-center justify-center border-none">
                    <Check className="h-4 w-4 text-orange-700" />
                  </Badge>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          {/* DYNAMIC BUTTON LOGIC */}
          <CardFooter>
            {isSignedIn ? (
              // If user is logged in, show "Subscribed" or "Coming Soon"
              <Button
                disabled={subscriptionTier === "pro"}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed text-white"
              >
                {subscriptionTier === "pro" ? "Subscribed" : "Coming Soon"}
              </Button>
            ) : (
              // If not logged in, tell them to Login first
              <Link href="/sign-in" className="w-full">
                <Button variant="primary" className="w-full">
                  Login to Subscribe
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

