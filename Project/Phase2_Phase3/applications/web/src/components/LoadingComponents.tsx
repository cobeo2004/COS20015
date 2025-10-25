import React from "react";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
