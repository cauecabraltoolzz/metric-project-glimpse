
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
  const { label, color } = getHealthScoreClassification(score);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-${color}/15 text-${color} ${sizeClasses[size]}`}>
      <span>{score}</span>
      {showLabel && <span className="hidden sm:inline-block">• {label}</span>}
    </div>
  );
};
