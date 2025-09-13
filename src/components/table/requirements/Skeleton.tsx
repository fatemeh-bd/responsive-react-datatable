import React from "react";

interface SkeletonProps {
  className?: string;
  shape?: "circle" | "square" | "rectangle";
  width?: string;
  height?: string;
  bgColor?: string; // prop جدید برای رنگ پس‌زمینه
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  shape = "rectangle",
  width = "w-full",
  height = "h-4",
  bgColor = "bg-gradient-to-r from-gray-50 to-gray-200", // مقدار پیش‌فرض گرادیان
}) => {
  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-md",
    rectangle: "rounded",
  };

  return (
    <div
      className={`animate-pulse ${bgColor} ${shapeClasses[shape]} ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
