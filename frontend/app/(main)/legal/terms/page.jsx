import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4">
      <div className="max-w-3xl mx-auto prose prose-stone">
        <h1 className="text-4xl font-bold text-stone-900 mb-8">
          Terms of Service
        </h1>
        <p className="text-stone-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing and using this website, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h3>2. Use License</h3>
        <p>
          Permission is granted to temporarily download one copy of the
          materials (information or software) on Servd&apos;s website for
          personal, non-commercial transitory viewing only.
        </p>

        {/* Placeholder content */}
        <p className="italic text-stone-400 mt-10">
          (This is a placeholder terms of service for demonstration purposes.)
        </p>
      </div>
    </div>
  );
}
