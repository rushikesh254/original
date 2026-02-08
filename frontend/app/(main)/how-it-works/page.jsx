import React from "react";
import { Camera, Brain, ChefHat, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Camera,
      title: "1. Snap Your Pantry",
      description:
        "Take a photo of your open fridge, pantry shelves, or a pile of ingredients on your counter.",
    },  
    {
      icon: Brain,
      title: "2. AI Analysis",
      description:
        "Our advanced computer vision identifies ingredients instantly, understanding what you have on hand.",
    },
    {
      icon: ChefHat,
      title: "3. Get Recipes",
      description:
        "We match your ingredients with thousands of recipes to find the perfect meal you can cook right now.",
    },
    {
      icon: Heart,
      title: "4. Cook & Enjoy",
      description:
        "Follow easy step-by-step instructions. Save your favorites and reduce food waste.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
          How <span className="text-orange-600">Servd</span> Works
        </h1>
        <p className="text-xl text-stone-600 mb-16 max-w-2xl mx-auto">
          Turn chaos into delicious meals in seconds. No more staring at the
          fridge wondering what to cook.
        </p>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6">
              <div className="shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-stone-200 text-orange-600">
                <step.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-xl"
            >
              Try it now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
