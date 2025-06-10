import React from "react";
import "./Badge.css";

interface BadgeProps {
  children: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "gradient";
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  green: "bg-green-100 text-green-700 border-green-200",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
  red: "bg-red-100 text-red-700 border-red-200",
  gradient: "badge-evently-gradient",
};

const Badge = ({ children, color = "blue" }: BadgeProps) => {
  return (
    <span className={`evently-badge ${colorClasses[color] || colorClasses.blue}`}>
      {children}
    </span>
  );
};

export default Badge;