import React from "react";

interface SkeletonProps {
  className?: string;
  shape?: "circle" | "square" | "rectangle";
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  shape = "rectangle",
  width = "w-full",
  height = "h-4",
}) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-50 to-gray-200";
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-md",
    rectangle: "rounded",
  };

  return (
    <div
      className={`${baseClasses} ${shapeClasses[shape]} ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
