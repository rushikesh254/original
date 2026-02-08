"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";

/**
 * ChromaGrid Component
 * Based on React Bits "Chroma Grid"
 * Implements a grid of items with chromatic aberration / spotlight effects on hover.
 */
export default function ChromaGrid({
  items = [],
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Ensure GSAP is loaded
    if (!containerRef.current || items.length === 0) return;

    const container = containerRef.current;

    // Mouse movement handler
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left - rect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top - rect.top + cardRect.height / 2;

        const dist = Math.sqrt(
          Math.pow(mouseX - cardCenterX, 2) + Math.pow(mouseY - cardCenterY, 2),
        );

        // Calculate intensity based on distance and radius
        let intensity = 1 - Math.min(dist / radius, 1);
        intensity = Math.max(0, intensity); // Clamp to 0

        // Apply animations via GSAP
        // We will animate the border/gradient opacity and maybe a chromatic shift
        const gradientLayer = card.querySelector(".chroma-gradient");
        const contentLayer = card.querySelector(".chroma-content");

        if (gradientLayer) {
          gsap.to(gradientLayer, {
            opacity: intensity,
            duration: damping,
            ease: ease,
          });
        }

        // Optional: Chromatic shift or scale effect
        if (contentLayer) {
          // Slight tilt or move towards mouse
          const moveX = (mouseX - cardCenterX) * 0.02 * intensity;
          const moveY = (mouseY - cardCenterY) * 0.02 * intensity;

          gsap.to(contentLayer, {
            x: moveX,
            y: moveY,
            duration: damping,
            ease: ease,
          });
        }
      });
    };

    const handleMouseLeave = () => {
      // Reset all cards
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const gradientLayer = card.querySelector(".chroma-gradient");
        const contentLayer = card.querySelector(".chroma-content");

        if (gradientLayer) {
          gsap.to(gradientLayer, {
            opacity: 0,
            duration: fadeOut,
            ease: ease,
          });
        }
        if (contentLayer) {
          gsap.to(contentLayer, {
            x: 0,
            y: 0,
            duration: fadeOut,
            ease: ease,
          });
        }
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [items, radius, damping, fadeOut, ease]);

  return (
    <div
      ref={containerRef}
      className="relative grid gap-6 w-full"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      }}
    >
      {items.map((item, index) => (
        <Link href={item.url || "#"} key={index} className="block h-full group">
          <div
            ref={(el) => (cardsRef.current[index] = el)}
            className="relative rounded-2xl overflow-hidden bg-white border border-stone-200 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              borderColor: item.borderColor || "transparent",
            }}
          >
            {/* Gradient Overlay (Hidden by default, revealed by mouse) */}
            <div
              className="chroma-gradient absolute inset-0 z-0 opacity-0 pointer-events-none"
              style={{
                background: item.gradient || "none",
                mixBlendMode: "overlay",
              }}
            />

            {/* Content Container */}
            <div className="chroma-content relative z-10 flex flex-col h-full bg-white">
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay for Text Contrast */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent/50 to-black/70 opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Top Right: Category Badge */}
                {item.subtitle && (
                  <div className="absolute top-3 right-3 z-20">
                    <span className="bg-white/90 backdrop-blur-xs text-stone-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-stone-200 shadow-xs">
                      {item.subtitle}
                    </span>
                  </div>
                )}

                {/* Top Left: Save Button (Visible on Hover) */}
                <button
                  className="absolute top-3 left-3 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-red-500 hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    // Add save logic here
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5 4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>

                {/* Bottom Left: Metadata Badges (On Image) */}
                {item.metadata && (
                  <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
                    {item.metadata.time && (
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-2 py-1 rounded-md border border-white/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {item.metadata.time}
                      </span>
                    )}
                    {item.metadata.rating && (
                      <span className="flex items-center gap-1 bg-orange-500/90 backdrop-blur-xs text-white text-xs font-bold px-2 py-1 rounded-md border border-orange-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {item.metadata.rating}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-5 flex flex-col flex-grow relative">
                <div className="mb-3">
                  <h3
                    className="font-bold text-lg text-stone-900 leading-tight group-hover:text-orange-600 transition-colors"
                    title={item.title} // Tooltip for full title
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Additional Metadata / Tags */}
                {item.metadata && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.metadata.spice && (
                      <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded-md uppercase tracking-wide">
                        {item.metadata.spice}
                      </span>
                    )}
                    {item.metadata.diet && (
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wide border border-green-100">
                        {item.metadata.diet}
                      </span>
                    )}
                  </div>
                )}

                {/* Cook Now CTA (Appears on Hover, replaces meta) */}
                <div className="absolute bottom-5 left-5 right-5 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="flex items-center justify-center w-full bg-orange-600 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-orange-700">
                    Start Cooking
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
