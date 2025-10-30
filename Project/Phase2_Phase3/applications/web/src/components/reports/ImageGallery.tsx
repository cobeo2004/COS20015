import React, { useState } from "react";
import { RiExpandDiagonalLine, RiCloseLine } from "@remixicon/react";
import { ReportImage } from "./ReportImage";

interface ImageGalleryProps {
  images: string[];
  title?: string;
  className?: string;
  maxVisible?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title = "Screenshots",
  className = "",
  maxVisible = 3,
}) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const visibleImages = images.slice(0, maxVisible);
  const hasMore = images.length > maxVisible;

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className={`image-gallery ${className}`}>
      {/* Thumbnail gallery */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500 font-medium">{title}:</span>
        <div className="flex gap-1">
          {visibleImages.map((image, index) => (
            <button
              key={index}
              onClick={() => openLightbox(image)}
              className="relative group"
              title={`View screenshot ${index + 1}`}
            >
              <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 group-hover:border-blue-300 transition-colors">
                <ReportImage
                  src={image}
                  alt={`Screenshot ${index + 1}`}
                  size="lg"
                  className="w-12 h-12"
                  showFallback={false}
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                <RiExpandDiagonalLine className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}

          {hasMore && (
            <button
              onClick={() => openLightbox(images[maxVisible])}
              className="w-12 h-12 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
              title={`View all ${images.length} screenshots`}
            >
              <span className="text-xs text-gray-600 font-medium">
                +{images.length - maxVisible}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors p-2"
              title="Close (ESC)"
            >
              <RiCloseLine className="w-6 h-6" />
            </button>

            {/* Main image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={lightboxImage}
                alt="Screenshot"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(image);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    image === lightboxImage
                      ? "bg-white w-8"
                      : "bg-white bg-opacity-50 hover:bg-opacity-75"
                  }`}
                  title={`Go to screenshot ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
