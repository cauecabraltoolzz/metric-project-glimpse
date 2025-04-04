
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/services/projectService";
import { getDeliveriesByProjectIds } from "@/services/deliveryService";
import { ProjectFilter } from "@/components/ProjectFilter";
import GanttChart from "@/components/GanttChart";
import { Calendar } from "lucide-react";

const Reports = () => {
  const projects = getProjects();
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(
    projects.length > 0 ? [projects[0].id] : []
  );

  const deliveries = getDeliveriesByProjectIds(selectedProjectIds);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize e gere relatórios de saúde dos projetos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar com filtros */}
        <div className="space-y-6">
          <ProjectFilter 
            projects={projects}
            selectedProjectIds={selectedProjectIds}
            onSelectionChange={setSelectedProjectIds}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Cronograma de Entregas</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GanttChart deliveries={deliveries} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
