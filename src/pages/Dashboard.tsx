import React, { useState, useEffect } from "react";
import { projectService } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Project } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamConfig } from "@/hooks/use-team-config";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { totalHoursPerMonth } = useTeamConfig();

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overall statistics
  const avgHealthScore = projects.length > 0
    ? Math.round(
        projects.reduce((sum, project) => sum + project.healthScore, 0) / projects.length
      )
    : 0;
  
  const excellentProjects = projects.filter(project => project.healthScore >= 85).length;
  const atRiskProjects = projects.filter(project => project.healthScore < 50).length;

  // Calculate hours statistics
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

  const hoursUtilization = (totalAllocatedHours / totalHoursPerMonth) * 100;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos seus projetos e métricas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Health Score Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHealthScore}%</div>
            <p className="text-xs text-muted-foreground">
              {excellentProjects} projetos excelentes • {atRiskProjects} em risco
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Vendidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSoldHours}h</div>
            <p className="text-xs text-muted-foreground">
              Total por mês em {projects.length} projetos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas Alocadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocatedHours}h</div>
            <p className="text-xs text-muted-foreground">
              {hoursUtilization.toFixed(1)}% da capacidade total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacidade Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(0, totalHoursPerMonth - totalAllocatedHours)}h
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.max(0, 100 - hoursUtilization).toFixed(1)}% livre
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
