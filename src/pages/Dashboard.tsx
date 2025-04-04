
import React, { useState } from "react";
import { getProjects } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Dashboard = () => {
  const projects = getProjects();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overall statistics
  const avgHealthScore = Math.round(
    projects.reduce((sum, project) => sum + project.healthScore, 0) / projects.length
  );
  
  const excellentProjects = projects.filter(project => project.healthScore >= 85).length;
  const atRiskProjects = projects.filter(project => project.healthScore < 50).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Painel de Projetos</h1>
        <p className="text-muted-foreground">
          Visão geral de todas as métricas de saúde dos projetos
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total de Projetos
          </div>
          <div className="text-2xl font-bold">{projects.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Média de Health Score
          </div>
          <div className="text-2xl font-bold">{avgHealthScore}%</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Projetos em Risco
          </div>
          <div className="text-2xl font-bold">{atRiskProjects}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar projetos por nome ou cliente..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Nenhum projeto encontrado para sua busca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
