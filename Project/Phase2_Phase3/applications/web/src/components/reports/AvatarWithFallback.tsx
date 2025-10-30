import React from "react";
import { ReportImage } from "./ReportImage";

interface AvatarWithFallbackProps {
  src?: string | null;
  name: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showName?: boolean;
  onlineStatus?: boolean;
}

export const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  name,
  subtitle,
  size = "md",
  className = "",
  showName = false,
  onlineStatus,
}) => {
  const sizeClasses = {
    sm: {
      container: "text-xs",
      avatar: "w-6 h-6",
      name: "ml-2",
    },
    md: {
      container: "text-sm",
      avatar: "w-8 h-8",
      name: "ml-3",
    },
    lg: {
      container: "text-base",
      avatar: "w-10 h-10",
      name: "ml-4",
    },
  };

  const currentSize = sizeClasses[size];

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (showName) {
    return (
      <div className={`flex items-center ${currentSize.container} ${className}`}>
        <div className="relative">
          <ReportImage
            src={src}
            alt={name}
            size={size}
            fallbackText={getInitials(name)}
            className={`${currentSize.avatar} flex-shrink-0`}
          />
          {onlineStatus !== undefined && (
            <div
              className={`
                absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
                ${onlineStatus ? "bg-green-500" : "bg-gray-400"}
              `}
              title={onlineStatus ? "Online" : "Offline"}
            />
          )}
        </div>
        <div className={`${currentSize.name} min-w-0 flex-1`}>
          <div className="font-medium text-gray-900 truncate">{name}</div>
          {subtitle && (
            <div className="text-gray-500 truncate">{subtitle}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <ReportImage
        src={src}
        alt={name}
        size={size}
        fallbackText={getInitials(name)}
        className={`${currentSize.avatar}`}
      />
      {onlineStatus !== undefined && (
        <div
          className={`
            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
            ${onlineStatus ? "bg-green-500" : "bg-gray-400"}
          `}
          title={onlineStatus ? "Online" : "Offline"}
        />
      )}
    </div>
  );
};