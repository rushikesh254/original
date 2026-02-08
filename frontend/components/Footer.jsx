import React from "react";
import Image from "next/image";
import Link from "next/link";

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-900">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="cursor-pointer text-sm text-stone-600 hover:text-orange-600 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col items-start text-left">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Servd"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-lg font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                Servd.
              </span>
            </Link>
            <p className="mt-4 text-sm text-stone-600 max-w-xs leading-relaxed">
              Smart cooking powered by AI. <br />
              Reduce waste. Eat better.
            </p>
          </div>

          {/* Product */}
          <FooterColumn
            title="Product"
            links={[
              { name: "Scan Pantry", href: "/dashboard" },
              { name: "AI Recipes", href: "/dashboard" },
              { name: "My Pantry", href: "/pantry" },
              { name: "Pricing", href: "/#pricing" },
            ]}
          />

          {/* Resources */}
          <FooterColumn
            title="Resources"
            links={[
              { name: "How it works", href: "/how-it-works" },
              { name: "Help Center", href: "/contact" },
              { name: "FAQs", href: "/faqs" },
              { name: "Contact", href: "/contact" },
            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              { name: "About", href: "/about" },
              { name: "Privacy Policy", href: "/legal/privacy" },
              { name: "Terms of Service", href: "/legal/terms" },
            ]}
          />
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-8 text-sm text-stone-500 md:flex-row">
          <span>© {new Date().getFullYear()} Servd. All rights reserved.</span>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Made with <span>💗</span> by RoadsideCoder
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
