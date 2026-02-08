import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            We&apos;re on a mission to <br />
            <span className="text-orange-600">eliminate food waste.</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            We believe that great cooking shouldn&apos;t be complicated, and it
            definitely shouldn&apos;t result in wasted food.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-2">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2670&auto=format&fit=crop"
              alt="Cooking together"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">
              Why Servd?
            </h2>
            <p className="text-stone-600 mb-6 text-lg leading-relaxed">
              Every year, billions of tons of food go to waste simply because we
              don&apos;t know what to do with the ingredients we have.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed">
              Servd uses advanced AI to bridge the gap between your pantry and
              your plate. We help you save money, discover new flavors, and make
              the most of what you already own.
            </p>
          </div>
        </div>

        <div className="bg-stone-900 text-stone-50 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Join thousands of cooks</h2>
          <p className="text-stone-400 mb-8 max-w-xl mx-auto">
            Start your journey towards a more sustainable and delicious kitchen
            today.
          </p>
          {/* <Button variant="secondary">Get Started</Button> */}
        </div>
      </div>
    </div>
  );
}
