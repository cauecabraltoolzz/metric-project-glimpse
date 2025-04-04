
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectById } from "../services/projectService";
import { HealthScoreBadge } from "../components/HealthScoreBadge";
import { MetricCard } from "../components/MetricCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const project = getProjectById(id || "");
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Projeto Não Encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O projeto que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => navigate("/")}>
          Voltar ao Painel
        </Button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const handleExportReport = () => {
    toast({
      title: "Relatório Exportado",
      description: "O relatório do projeto foi exportado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <p className="text-muted-foreground">
            {project.client} • Iniciado em {formatDate(project.startDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HealthScoreBadge score={project.healthScore} size="lg" />
          <Button onClick={handleExportReport}>Exportar Relatório</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard metric={project.metrics.deliveryRate} />
        <MetricCard metric={project.metrics.reworkRate} inverted={true} />
        <MetricCard metric={project.metrics.estimateAccuracy} />
        <MetricCard metric={project.metrics.nps} />
      </div>

      <div className="rounded-lg border bg-card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Análise do Health Score</h2>
        <p className="text-sm text-muted-foreground mb-3">
          O health score do projeto é calculado com base nas métricas ponderadas:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Taxa de Entregas (30%)</span>
            <span>{project.metrics.deliveryRate.value}% vs {project.metrics.deliveryRate.target}% meta</span>
          </li>
          <li className="flex justify-between">
            <span>Taxa de Retrabalho (25%)</span>
            <span>{project.metrics.reworkRate.value}% vs {project.metrics.reworkRate.target}% meta</span>
          </li>
          <li className="flex justify-between">
            <span>Precisão das Estimativas (25%)</span>
            <span>{project.metrics.estimateAccuracy.value}% vs {project.metrics.estimateAccuracy.target}% meta</span>
          </li>
          <li className="flex justify-between">
            <span>Pontuação NPS (20%)</span>
            <span>{project.metrics.nps.value}% vs {project.metrics.nps.target}% meta</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetail;
