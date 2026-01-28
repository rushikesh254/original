/**
 * ROOT LAYOUT
 * This is the "Skeleton" of the entire website.
 * Every page (Login, Dashboard, etc.) is wrapped inside this file.
 */

import { Inter } from "next/font/google";
import "./globals.css"; // The global styles (colors, fonts, Tailwind)
import { AuthProvider } from "@/lib/auth-context"; // Let all pages know if user is logged in
import { Toaster } from "sonner"; // The little notification popups
import ClientLayout from "@/components/wrappers/ClientLayout"; // Handles sticky headers/sidebars
import Header from "@/components/Header";
import Image from "next/image";

// Load the Modern "Inter" Font from Google
const inter = Inter({ subsets: ["latin"] });

/**
 * WEBSITE METADATA
 * This is what shows up on the browser tab and Google search results.
 */
export const metadata = {
  title: "Servd - AI Recipes Platform",
  description: "Cook anything with the power of AI",
};

export default function RootLayout({ children }) {
  /**
   * FOOTER DATA
   * We define the footer here so it appears on every page.
   */
  const footerData = (
    <footer className="py-8 px-4 border-t">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Servd Logo"
            width={48}
            height={48}
            className="w-14"
          />
        </div>
        <p className="text-stone-500 text-sm">
          Made with 💗 by RoadsideCoder
        </p>
      </div>
    </footer>
  );

  return (
    // 1. AuthProvider: Wraps the app so we can track the 'user' state
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        {/* 2. suppressHydrationWarning: Prevents annoying "Text mismatch" errors in development */}
        <body className={`${inter.className}`} suppressHydrationWarning={true}>
          {/* 3. ClientLayout: A wrapper that helps with UI placement */}
          <ClientLayout header={<Header />} footer={footerData}>
            {/* 4. children: This is where the actual page content (like Landing or Dashboard) goes */}
            {children}
          </ClientLayout>
          
          {/* 5. Toaster: Shows success/error messages */}
          <Toaster richColors />
        </body>
      </html>
    </AuthProvider>
  );
}

