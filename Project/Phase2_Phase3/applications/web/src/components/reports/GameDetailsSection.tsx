import React, { useState } from "react";
import { ImageGallery } from "./ImageGallery";
import { GameTags } from "./JSONBadge";
import type { GameMetadata, DeveloperMetadata } from "@/lib/types/hybrid-data";
import { RiStarLine, RiGamepadLine, RiUserLine } from "@remixicon/react";

interface GameDetailsSectionProps {
  game: {
    id: string;
    title: string;
    genre: string;
    metadata?: GameMetadata | null;
    developers?: {
      name: string;
      logo_url?: string;
      metadata?: DeveloperMetadata | null;
    } | null;
    // Other fields...
  };
  className?: string;
}

export const GameDetailsSection: React.FC<GameDetailsSectionProps> = ({
  game,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const metadata = game.metadata as GameMetadata | null;
  const developerMetadata = game.developers
    ?.metadata as DeveloperMetadata | null;

  const screenshots = metadata?.screenshots || [];
  const tags = metadata?.tags || [];
  const specialties = developerMetadata?.specialties || [];

  if (!metadata && !developerMetadata && screenshots.length === 0) {
    return null;
  }

  return (
    <div className={`border-t pt-4 mt-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
          <RiGamepadLine className="w-4 h-4" />
          Game Details & Media
        </h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <div>
              <ImageGallery
                images={screenshots}
                title="Screenshots"
                maxVisible={3}
              />
            </div>
          )}

          {/* Game Tags */}
          {tags.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">
                Game Tags
              </h5>
              <GameTags items={tags} maxVisible={10} />
            </div>
          )}

          {/* Game Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rating and Reviews */}
            {metadata?.average_rating && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <RiStarLine className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">
                    {metadata.average_rating.toFixed(1)} / 5.0
                  </div>
                  {metadata.total_reviews && (
                    <div className="text-xs text-gray-500">
                      {metadata.total_reviews.toLocaleString()} reviews
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Rating */}
            {metadata?.content_rating && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">
                    {metadata.content_rating}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium">Content Rating</div>
                  <div className="text-xs text-gray-500">
                    ESRB {metadata.content_rating}
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            {metadata?.languages && metadata.languages.length > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium mb-1">Languages</div>
                <div className="text-xs text-gray-600">
                  {metadata.languages.slice(0, 3).join(", ")}
                  {metadata.languages.length > 3 && (
                    <span> +{metadata.languages.length - 3} more</span>
                  )}
                </div>
              </div>
            )}

            {/* DLC Available */}
            {metadata?.dlc_available && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800">
                  DLC Available
                </div>
                {metadata.dlc_count && (
                  <div className="text-xs text-green-600">
                    {metadata.dlc_count} expansion
                    {metadata.dlc_count !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}

            {/* Early Access */}
            {metadata?.early_access && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800">
                  Early Access
                </div>
                <div className="text-xs text-yellow-600">
                  Game in development
                </div>
              </div>
            )}

            {/* Peak Players */}
            {metadata?.peak_concurrent_players && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <RiUserLine className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">
                    {metadata.peak_concurrent_players.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Peak concurrent</div>
                </div>
              </div>
            )}
          </div>

          {/* System Requirements */}
          {metadata?.system_requirements && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">
                System Requirements
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                {metadata.system_requirements.min_ram_gb && (
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="font-medium">RAM:</span>{" "}
                    {metadata.system_requirements.min_ram_gb}GB+
                  </div>
                )}
                {metadata.system_requirements.min_storage_gb && (
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="font-medium">Storage:</span>{" "}
                    {metadata.system_requirements.min_storage_gb}GB+
                  </div>
                )}
                {metadata.system_requirements.platforms && (
                  <div className="p-2 bg-gray-50 rounded">
                    <span className="font-medium">Platforms:</span>{" "}
                    {metadata.system_requirements.platforms.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Developer Specialties */}
          {specialties.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                Developer Specialties
              </h5>
              <GameTags items={specialties} maxVisible={6} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
