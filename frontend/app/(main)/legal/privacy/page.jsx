import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4">
      <div className="max-w-3xl mx-auto prose prose-stone">
        <h1 className="text-4xl font-bold text-stone-900 mb-8">
          Privacy Policy
        </h1>
        <p className="text-stone-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h3>1. Introduction</h3>
        <p>
          Welcome to Servd. We respect your privacy and are committed to
          protecting your personal data.
        </p>

        <h3>2. Data We Collect</h3>
        <p>
          We may collect personal identification information (Name, email
          address, phone number, etc.) and images you upload for analysis.
        </p>

        <h3>3. How We Use Your Data</h3>
        <p>
          We use your data to provide and improve our services, including
          processing your pantry images and generating recipes.
        </p>

        {/* Placeholder content */}
        <p className="italic text-stone-400 mt-10">
          (This is a placeholder privacy policy for demonstration purposes.)
        </p>
      </div>
    </div>
  );
}
