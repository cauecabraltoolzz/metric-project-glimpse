import React from "react";
import { Project } from "../types/project";
import { HealthScoreBadge } from "./HealthScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Link to={`/project/${project.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
          <HealthScoreBadge score={project.healthScore} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{project.client}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Velocidade</p>
                  {getTrendIcon(project.metrics.velocity.trend)}
                </div>
                <p className="font-medium">{project.metrics.velocity.value}%</p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Qualidade</p>
                  {getTrendIcon(project.metrics.quality.trend)}
                </div>
                <p className="font-medium">{project.metrics.quality.value}%</p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Engajamento</p>
                  {getTrendIcon(project.metrics.engagement.trend)}
                </div>
                <p className="font-medium">{project.metrics.engagement.value}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {project.duration} meses
              </Badge>
              {project.isNew && (
                <Badge variant="secondary">Novo</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
