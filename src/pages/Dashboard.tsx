import React, { useState, useEffect } from "react";
import { projectService } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Project } from "@/types/project";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos projetos</p>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Health Score Médio</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{avgHealthScore}%</span>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Projetos Excelentes</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{excellentProjects}</span>
            <span className="text-sm text-muted-foreground">
              projetos com score ≥ 85%
            </span>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Projetos em Risco</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{atRiskProjects}</span>
            <span className="text-sm text-muted-foreground">
              projetos com score < 50%
            </span>
          </div>
        </div>
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
