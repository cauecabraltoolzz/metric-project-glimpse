import React from "react";
import { getHealthScoreClassification } from "../services/projectService";

interface HealthScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const HealthScoreBadge: React.FC<HealthScoreBadgeProps> = ({ 
  score, 
  showLabel = true,
  size = "md"
}) => {
  const getColorClass = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses[size]} ${getColorClass(score)}`}>
      <span>{score}</span>
      {showLabel && <span className="hidden sm:inline-block">• {getHealthScoreClassification(score).label}</span>}
    </div>
  );
};
