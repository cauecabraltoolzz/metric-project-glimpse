import React from "react";
import { Project } from "../types/project";
import { HealthScoreBadge } from "./HealthScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, Circle, Clock } from "lucide-react";
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
          <div className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{project.client}</p>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {project.hours?.allocated || 0}h/{project.hours?.sold || 0}h por mês
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium mb-1">Velocidade</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{project.metrics.velocity.value}%</span>
                  {getTrendIcon(project.metrics.velocity.trend)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Qualidade</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{project.metrics.quality.value}%</span>
                  {getTrendIcon(project.metrics.quality.trend)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Engajamento</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{project.metrics.engagement.value}%</span>
                  {getTrendIcon(project.metrics.engagement.trend)}
                </div>
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
