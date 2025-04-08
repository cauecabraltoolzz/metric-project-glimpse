import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectHoursSummaryProps {
  project: Project;
  teamHoursPerMonth: number;
}

export function ProjectHoursSummary({ project, teamHoursPerMonth }: ProjectHoursSummaryProps) {
  const hoursUtilization = (project.hours.allocated / teamHoursPerMonth) * 100;
  const hoursSoldUtilization = (project.hours.sold / teamHoursPerMonth) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo de Horas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Horas Vendidas/Mês</p>
            <p className="text-2xl font-bold">{project.hours.sold}h</p>
            <p className="text-sm text-muted-foreground">
              {hoursSoldUtilization.toFixed(1)}% da capacidade do time
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Horas Alocadas/Mês</p>
            <p className="text-2xl font-bold">{project.hours.allocated}h</p>
            <p className="text-sm text-muted-foreground">
              {hoursUtilization.toFixed(1)}% da capacidade do time
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
              Atenção: O projeto está com sobrealocação de {(hoursUtilization - 100).toFixed(1)}% 
              da capacidade do time
            </p>
          </div>
        )}

        {hoursSoldUtilization < hoursUtilization && (
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              Alerta: O projeto está consumindo mais horas do que foi vendido 
              ({(hoursUtilization - hoursSoldUtilization).toFixed(1)}% acima)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 