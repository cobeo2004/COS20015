import React, { useState } from "react";
import { RiImageLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";

interface ReportImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showFallback?: boolean;
  fallbackText?: string;
}

export const ReportImage: React.FC<ReportImageProps> = ({
  src,
  alt,
  className = "",
  size = "md",
  showFallback = true,
  fallbackText,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(true);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const toggleImage = () => {
    setShowImage(!showImage);
  };

  // Generate fallback text (first letter or initials)
  const getFallbackText = () => {
    if (fallbackText) return fallbackText;
    return alt
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src || imageError || !showImage) {
    if (!showFallback) return null;

    return (
      <div
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          bg-gray-100 border border-gray-200 rounded-md
          text-gray-500 font-medium text-xs
          ${className}
        `}
        title={alt}
      >
        {src && imageError ? (
          <button
            onClick={toggleImage}
            className="p-1 hover:bg-gray-200 rounded"
            title="Show image anyway"
          >
            <RiEyeLine className="w-4 h-4" />
          </button>
        ) : (
          getFallbackText()
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`
          ${sizeClasses[size]}
          object-cover rounded-md border border-gray-200
          transition-opacity duration-200
          ${imageLoaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Loading state */}
      {!imageLoaded && (
        <div
          className={`
            absolute inset-0
            flex items-center justify-center
            bg-gray-100 border border-gray-200 rounded-md
          `}
        >
          <RiImageLine className="w-4 h-4 text-gray-400 animate-pulse" />
        </div>
      )}

      {/* Toggle button */}
      {imageLoaded && (
        <button
          onClick={toggleImage}
          className="absolute -top-1 -right-1 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
          title="Hide image"
        >
          <RiEyeOffLine className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  );
};