import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";

interface HoursOverviewProps {
  projects: Project[];
  teamHoursPerMonth: number;
}

export function HoursOverview({ projects, teamHoursPerMonth }: HoursOverviewProps) {
  const totalSoldHours = projects.reduce((sum, project) => {
    if (!project?.hours?.sold) {
      console.warn(`Projeto sem horas vendidas: ${project?.name || 'Projeto desconhecido'}`);
      return sum;
    }
    return sum + project.hours.sold;
  }, 0);

  const totalAllocatedHours = projects.reduce((sum, project) => {
    if (!project?.hours?.allocated) {
      console.warn(`Projeto sem horas alocadas: ${project?.name || 'Projeto desconhecido'}`);
      return sum;
    }
    return sum + project.hours.allocated;
  }, 0);
  const hoursUtilization = (totalAllocatedHours / teamHoursPerMonth) * 100;
  const availableHours = Math.max(0, teamHoursPerMonth - totalAllocatedHours);

  const projectsByUtilization = [...projects]
    .sort((a, b) => b.hours.allocated - a.hours.allocated)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral de Horas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Horas Vendidas</p>
            <p className="text-2xl font-bold">{totalSoldHours}h</p>
            <p className="text-sm text-muted-foreground">
              Total por mês
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Horas Alocadas</p>
            <p className="text-2xl font-bold">{totalAllocatedHours}h</p>
            <p className="text-sm text-muted-foreground">
              {hoursUtilization.toFixed(1)}% da capacidade
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Horas Disponíveis</p>
            <p className="text-2xl font-bold">{availableHours}h</p>
            <p className="text-sm text-muted-foreground">
              {Math.max(0, 100 - hoursUtilization).toFixed(1)}% livre
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Capacidade Total</p>
            <p className="text-2xl font-bold">{teamHoursPerMonth}h</p>
            <p className="text-sm text-muted-foreground">
              Por mês
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Utilização Total</span>
            <span className={hoursUtilization > 100 ? "text-red-500" : "text-green-500"}>
              {hoursUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                hoursUtilization > 100 ? "bg-red-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(hoursUtilization, 100)}%` }}
            />
          </div>
        </div>

        {hoursUtilization > 100 && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">
              Atenção: O time está com sobrealocação de {(hoursUtilization - 100).toFixed(1)}% 
              da capacidade total
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-4">Top 5 Projetos por Alocação</h3>
          <div className="space-y-4">
            {projectsByUtilization.map(project => {
              const projectUtilization = (project.hours.allocated / teamHoursPerMonth) * 100;
              return (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{project.name}</span>
                    <span>{projectUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${projectUtilization}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 