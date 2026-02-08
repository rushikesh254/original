/**
 * LANDING PAGE (page.js)
 * This is the first thing users see when they visit our website.
 * It uses "use client" because it has interactive parts like buttons.
 */
"use client";

import React from "react";
import { ArrowRight, Star, Flame, Clock, Users } from "lucide-react"; // Icons
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Reusable Button
import { Card, CardContent } from "@/components/ui/card"; // Reusable Card
import { Badge } from "@/components/ui/badge"; // Small status pills
import { SITE_STATS, FEATURES, HOW_IT_WORKS_STEPS } from "@/lib/data"; // Text content
import PricingSection from "@/components/PricingSection"; // Pricing table
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth-context"; // Get current user status
import TiltedCard from "@/components/ReactBits/TiltedCard";
import CircularGallery from "@/components/ReactBits/CircularGallery";
import Stepper, { Step } from "@/components/ReactBits/Stepper";
import Magnet from "@/components/ReactBits/Magnet";

export default function LandingPage() {
  // We check if the user is already logged in to show correct pricing/cta
  const { user } = useUser();
  const router = useRouter();
  const subscriptionTier = user?.subscriptionTier || "free";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* 
        HERO SECTION 
        The "BIG MESSAGE" at the top of the page.
      */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* 1. LEFT SIDE: Messaging */}
            <div className="flex-1 text-center md:text-left">
              <Badge
                variant="outline"
                className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-sm font-bold mb-6 uppercase tracking-wide"
              >
                <Flame className="mr-1" />
                #1 AI Cooking Assistant
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tight">
                Turn your{" "}
                <span className="italic underline decoration-4 decoration-orange-600">
                  leftovers
                </span>{" "}
                into <br />
                masterpieces.
              </h1>

              <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-lg mx-auto md:mx-0 font-light">
                Snap a photo of your fridge. We&apos;ll tell you what to cook.
                Save money, reduce waste, and eat better tonight.
              </p>
              <Magnet padding={50} disabled={false} magnetStrength={90}>
                <Link href="/dashboard">
                  <Button
                    size="xl"
                    variant="primary"
                    className="px-8 py-6 text-lg"
                  >
                    Start Cooking Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </Magnet>
              <p className="mt-6 text-sm text-stone-500">
                <span className="font-bold text-stone-900">10k+ cooks</span>{" "}
                joined last month
              </p>
            </div>

            {/* 2. RIGHT SIDE: Visual/Image */}
            <div className="flex justify-center items-center w-full md:w-auto">
              <TiltedCard
                imageSrc="./pasta-dish.png    "
                altText="Delicious pasta dish"
                captionText="Rustic Tomato Basil Pasta"
                containerHeight="500px"
                containerWidth="500px"
                imageHeight="500px"
                imageWidth="500px"
                rotateAmplitude={4}
                scaleOnHover={1.02}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <Card className="mx-8 mb-8 bg-white/95 backdrop-blur-sm border-2 border-stone-900 shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">
                            Rustic Tomato Basil Pasta
                          </h3>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-orange-500 text-orange-500"
                              />
                            ))}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-2 border-green-700 bg-green-50 text-green-700 font-bold"
                        >
                          98% MATCH
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-stone-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 25 mins
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> 2 servings
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 
        STATS BAR 
        A dark strip that shows users we are a real, popular app.
      */}
      <section className="py-12 border-y-2 border-stone-900 bg-stone-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {SITE_STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-1 text-stone-50">
                {stat.val}
              </div>
              <Badge
                variant="secondary"
                className="bg-transparent text-orange-500 text-sm uppercase tracking-wider font-medium border-none"
              >
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* 
        POPULAR RECIPES CIRCULAR GALLERY 
        Showcasing trending dishes with recipe details.
      */}
      <section className="py-12 relative overflow-hidden bg-stone-50 border-y-2 border-stone-200">
        {/* Clean Background with Subtle Texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              'url("https://grainy-gradients.vercel.app/noise.svg")',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-orange-50/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 mb-16 text-center">
          <Badge
            variant="outline"
            className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-xs font-bold mb-6 uppercase tracking-wide px-4 py-1.5"
          >
            <Flame className="w-3 h-3 mr-1.5 inline" />
            Community Favorites
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
            Popular Recipes
          </h2>
          <p className="text-stone-600 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Discover trending dishes loved by our community. Drag to explore
            more.
          </p>
        </div>

        <div className="h-180 w-full relative z-10 px-4">
          <CircularGallery
            items={[
              {
                image:
                  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop",
                text: "Margherita Pizza",
                time: "25 min",
                servings: "4 servings",
                difficulty: "Easy",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop",
                text: "Berry Cheesecake",
                time: "45 min",
                servings: "8 servings",
                difficulty: "Medium",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1000&auto=format&fit=crop",
                text: "Avocado Toast",
                time: "10 min",
                servings: "2 servings",
                difficulty: "Easy",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1000&auto=format&fit=crop",
                text: "Wagyu Burger",
                time: "30 min",
                servings: "4 servings",
                difficulty: "Medium",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop",
                text: "Caesar Salad",
                time: "15 min",
                servings: "4 servings",
                difficulty: "Easy",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1000&auto=format&fit=crop",
                text: "Fluffy Pancakes",
                time: "20 min",
                servings: "6 servings",
                difficulty: "Easy",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1000&auto=format&fit=crop",
                text: "Sashimi Platter",
                time: "40 min",
                servings: "3 servings",
                difficulty: "Hard",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1000&auto=format&fit=crop",
                text: "Spicy Meatballs",
                time: "35 min",
                servings: "5 servings",
                difficulty: "Medium",
              },
            ]}
            bend={1.8}
            textColor="#ffffff"
            borderRadius={0.12}
            font="600 24px system-ui"
            scrollSpeed={1.5}
            scrollEase={0.08}
          />
        </div>
      </section>

      {/* 
        FEATURES SECTION 
        Explaining What the App actually DOES.
      */}
      {/* <section className="pt-15 pb-5 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Your Smart Kitchen
            </h2>
            <p className="text-stone-600 text-xl font-light">
              Everything you need to master your meal prep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                // <SpotlightCard
                //   key={index}
                //   className="border-stone-200 bg-white hover:shadow-lg transition-all group"
                //   spotlightColor="rgba(255, 82, 0, 0.15)"
                // >
                // eslint-disable-next-line react/jsx-key
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="border-2 border-stone-200 bg-orange-50 p-3 group-hover:border-orange-200 group  -hover:bg-orange-100 transition-colors rounded-xl">
                      <IconComponent className="w-6 h-6 text-orange-700" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs font-mono bg-stone-100 text-stone-600 uppercase tracking-wide border border-stone-200"
                    >
                      {feature.limit}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-stone-600 text-lg font-light">
                    {feature.description}
                  </p>
                </div>
                // </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <Badge
              variant="outline"
              className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-xs font-bold mb-6 uppercase tracking-wide px-4 py-1.5"
            >
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-stone-900">
              Your Smart Kitchen Assistant
            </h2>
            <p className="text-stone-600 text-lg font-light max-w-2xl mx-auto">
              Everything you need to master your meal prep, powered by AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 border-stone-200 bg-white hover:border-orange-600 hover:shadow-lg transition-all group py-0"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="border-2 border-stone-200 bg-orange-50 p-3 group-hover:border-orange-600 group-hover:bg-orange-100 transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs font-mono bg-stone-100 text-stone-600 uppercase tracking-wide border border-stone-200"
                      >
                        {feature.limit}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-stone-600 text-lg font-light">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        HOW IT WORKS 
        Interactive step-by-step guide.
      */}
      <section className="py-24 bg-stone-50 border-y-2 border-stone-200">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge
              variant="outline"
              className="border-2 border-orange-600 text-orange-700 bg-orange-50 text-xs font-bold mb-6 uppercase tracking-wide px-4 py-1.5"
            >
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-5 tracking-tight">
              From Photo to Feast in{" "}
              <span className="text-orange-600">3 Easy Steps</span>
            </h2>
            <p className="text-lg text-stone-600 font-light leading-relaxed">
              Our AI analyzes your ingredients and suggests the perfect recipes
              instantly. instantly.
            </p>
          </div>

          <Stepper
            initialStep={1}
            onStepChange={(step) => console.log("Step changed to:", step)}
            onFinalStepCompleted={() =>
              router.push(user ? "/dashboard" : "/sign-in")
            }
            backButtonText="Previous"
            nextButtonText="Next Step"
            finishButtonText="Start Cooking"
          >
            <Step>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  Snap Your Ingredients
                </h3>
                <p className="text-stone-600 max-w-md mb-8">
                  Simply take a photo of the ingredients you have in your fridge
                  or pantry. No need to type anything!
                </p>
                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                    alt="Ingredients"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Step>
            <Step>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                    <polyline points="7.5 19.79 12 17.19 16.5 19.79" />
                    <polyline points="10 9 9 9" />
                    <polyline points="10 12 9 12" />
                    <polyline points="16 9 15 9" />
                    <polyline points="16 12 15 12" />
                    <line x1="12" y1="2" x2="12" y2="22" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  AI Magic Analysis
                </h3>
                <p className="text-stone-600 max-w-md mb-8">
                  Our advanced AI identifies every item in your photo and
                  suggests additional pairings you might like.
                </p>
                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <span className="text-green-400 font-mono text-xl">
                      Scanning...
                    </span>
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1621255551928-84226a273b07?q=80&w=2670&auto=format&fit=crop"
                    alt="Analysis"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Step>
            <Step>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  Cook & Enjoy
                </h3>
                <p className="text-stone-600 max-w-md mb-8">
                  Get a list of delicious recipes you can make right now. Save
                  your favorites and start cooking!
                </p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg transform translate-y-4">
                    <Image
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop"
                      alt="Recipe 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg transform -translate-y-4">
                    <Image
                      src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2574&auto=format&fit=crop"
                      alt="Recipe 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </section>

      {/* 
        PRICING SECTION 
        Where we convince people to upgrade to PRO.
      */}
      <section className="py-24 px-4 bg-white">
        <PricingSection subscriptionTier={subscriptionTier} />
      </section>
    </div>
  );
}
