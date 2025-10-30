import React from "react";
import { RiHashtag, RiGamepadLine, RiBuilding2Line, RiStarLine } from "@remixicon/react";

interface JSONBadgeProps {
  items: string[] | null | undefined;
  type?: "tag" | "genre" | "specialty" | "default";
  maxVisible?: number;
  className?: string;
  color?: "blue" | "green" | "purple" | "orange" | "gray";
}

export const JSONBadge: React.FC<JSONBadgeProps> = ({
  items,
  type = "default",
  maxVisible = 5,
  className = "",
  color,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const visibleItems = items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  // Default colors based on type
  const getColorClasses = () => {
    if (color) {
      switch (color) {
        case "blue":
          return "bg-blue-50 text-blue-700 border-blue-200";
        case "green":
          return "bg-green-50 text-green-700 border-green-200";
        case "purple":
          return "bg-purple-50 text-purple-700 border-purple-200";
        case "orange":
          return "bg-orange-50 text-orange-700 border-orange-200";
        case "gray":
          return "bg-gray-50 text-gray-700 border-gray-200";
      }
    }

    // Type-based colors
    switch (type) {
      case "tag":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "genre":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "specialty":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "tag":
        return <RiHashtag className="w-3 h-3" />;
      case "genre":
        return <RiGamepadLine className="w-3 h-3" />;
      case "specialty":
        return <RiBuilding2Line className="w-3 h-3" />;
      default:
        return <RiStarLine className="w-3 h-3" />;
    }
  };

  const badgeClasses = `
    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
    border ${getColorClasses()}
    transition-all hover:shadow-sm
    ${className}
  `;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleItems.map((item, index) => (
        <span key={index} className={badgeClasses} title={item}>
          {getIcon()}
          <span className="truncate max-w-20">{item}</span>
        </span>
      ))}

      {hasMore && (
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            bg-gray-100 text-gray-600 border border-gray-200
            ${className}
          `}
          title={`+${items.length - maxVisible} more items`}
        >
          +{items.length - maxVisible}
        </span>
      )}
    </div>
  );
};

// Specialized badge components
export const GameTags: React.FC<Omit<JSONBadgeProps, "type">> = (props) => (
  <JSONBadge {...props} type="tag" />
);

export const GameGenres: React.FC<Omit<JSONBadgeProps, "type">> = (props) => (
  <JSONBadge {...props} type="genre" />
);

export const DeveloperSpecialties: React.FC<Omit<JSONBadgeProps, "type">> = (props) => (
  <JSONBadge {...props} type="specialty" />
);