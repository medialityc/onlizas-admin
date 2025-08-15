import React from "react";

interface CircleIndicatorProps {
  isActive: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CircleIndicator: React.FC<CircleIndicatorProps> = ({
  isActive,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  return (
    <div 
      className={`rounded-full ${sizeClasses[size]} ${
        isActive ? "bg-green-500" : "bg-red-500"
      } ${className}`}
    />
  );
};

export default CircleIndicator;
