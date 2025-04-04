
import React from "react";
import { Metric } from "../types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, Circle } from "lucide-react";

interface MetricCardProps {
  metric: Metric;
  inverted?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, inverted = false }) => {
  const getTrendIcon = () => {
    const isPositive = inverted 
      ? metric.trend === "down" 
      : metric.trend === "up";
    
    const isNegative = inverted 
      ? metric.trend === "up" 
      : metric.trend === "down";
      
    if (isPositive) {
      return <ArrowUp className="h-4 w-4 text-health-good" />;
    } else if (isNegative) {
      return <ArrowDown className="h-4 w-4 text-health-poor" />;
    } else {
      return <Circle className="h-4 w-4 text-health-average" />;
    }
  };

  const getProgressColor = () => {
    const value = metric.value;
    const target = metric.target;
    
    // For inverted metrics (like rework rate), lower is better
    const comparison = inverted
      ? value <= target
      : value >= target;
      
    if (comparison) {
      return "bg-health-good";
    } else {
      const diff = Math.abs(value - target);
      if (diff <= 5) return "bg-health-average";
      return "bg-health-poor";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-sm">{metric.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-semibold">{metric.value}%</span>
              {getTrendIcon()}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Target: {metric.target}%
          </div>
        </div>
        
        <div className="mt-3">
          <Progress 
            value={inverted ? 100 - metric.value : metric.value} 
            max={100} 
            className={getProgressColor()}
          />
        </div>
      </CardContent>
    </Card>
  );
};
