"use client";

import { useRef, useState } from "react";

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.1,
  showMobileWarning = false,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent = null,
}) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5; // -0.5 to 0.5
    const yPct = mouseY / height - 0.5; // -0.5 to 0.5

    const newRotateY = xPct * rotateAmplitude * 2; // multiply by 2 to get full range
    const newRotateX = -yPct * rotateAmplitude * 2;

    setRotateX(newRotateX);
    setRotateY(newRotateY);
    setScale(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <div
      ref={ref}
      className="relative z-10 transition-transform duration-200 ease-out"
      style={{
        width: containerWidth,
        height: containerHeight,
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover rounded-[15px] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />

        {displayOverlayContent && overlayContent && (
          <div
            className="absolute bottom-0 left-0 right-0 z-50 transform translate-z-[50px]"
            style={{
              transform: "translateZ(50px)",
            }}
          >
            {overlayContent}
          </div>
        )}
      </div>

      {showTooltip && (
        <div
          className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg px-2 py-1 text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            transform: "translateZ(30px)",
          }}
        >
          {captionText}
        </div>
      )}
    </div>
  );
}
