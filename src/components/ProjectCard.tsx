
import React from "react";
import { Project } from "../types/project";
import { HealthScoreBadge } from "./HealthScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, Circle } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-health-good" />;
      case "down":
        return <ArrowDown className="h-3 w-3 text-health-poor" />;
      default:
        return <Circle className="h-3 w-3 text-health-average" />;
    }
  };

  return (
    <Link to={`/project/${project.id}`}>
      <Card className="h-full transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{project.client}</p>
            </div>
            <HealthScoreBadge score={project.healthScore} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {Object.values(project.metrics).map((metric) => (
              <div key={metric.id} className="flex items-center gap-1.5">
                <div className="text-xs font-medium flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span>{metric.value}%</span>
                </div>
                <span className="text-xs text-muted-foreground">{metric.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
