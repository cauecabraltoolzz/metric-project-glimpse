import React from "react";
import { useTeamConfig } from "@/hooks/use-team-config";
import { useProjects } from "@/hooks/use-projects";
import { HoursOverview } from "@/components/HoursOverview";
import { PageHeader } from "@/components/PageHeader";

export default function Reports() {
  const { totalHoursPerMonth } = useTeamConfig();
  const { projects } = useProjects();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Relatórios" 
        description="Visualize métricas e relatórios detalhados dos projetos"
      />
      
      <HoursOverview 
        projects={projects} 
        teamHoursPerMonth={totalHoursPerMonth} 
      />
    </div>
  );
}
