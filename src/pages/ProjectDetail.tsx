import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { projectService } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthScoreBadge } from "@/components/HealthScoreBadge";
import { MetricCard } from "@/components/MetricCard";
import { TaskManager } from "@/components/TaskManager";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ArrowLeft, Info, Plus } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProject() {
      if (!id) {
        setError("ID do projeto não fornecido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("Carregando projeto com ID:", id); // Debug
        const projectData = await projectService.getProjectById(id);
        console.log("Dados do projeto:", projectData); // Debug
        
        if (isMounted) {
          if (projectData) {
            setProject(projectData);
          } else {
            setError("Projeto não encontrado");
            toast.error("Projeto não encontrado");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        if (isMounted) {
          setError("Erro ao carregar projeto");
          toast.error("Erro ao carregar projeto");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddTask = async (task: any) => {
    if (id) {
      try {
        const newTask = await projectService.addTask(id, task);
        if (newTask) {
          const updatedProject = await projectService.getProjectById(id);
          if (updatedProject) {
            setProject(updatedProject);
            toast.success("Tarefa adicionada com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        toast.error("Erro ao adicionar tarefa");
      }
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    if (id) {
      try {
        const updatedTask = await projectService.updateTask(id, taskId, updates);
        if (updatedTask) {
          const updatedProject = await projectService.getProjectById(id);
          if (updatedProject) {
            setProject(updatedProject);
            toast.success("Tarefa atualizada com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        toast.error("Erro ao atualizar tarefa");
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (id) {
      try {
        const success = await projectService.deleteTask(id, taskId);
        if (success) {
          const updatedProject = await projectService.getProjectById(id);
          if (updatedProject) {
            setProject(updatedProject);
            toast.success("Tarefa removida com sucesso!");
          }
        }
      } catch (error) {
        console.error("Erro ao remover tarefa:", error);
        toast.error("Erro ao remover tarefa");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-lg">Projeto não encontrado</div>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">Cliente: {project.client}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HealthScoreBadge score={project.healthScore} size="lg" />
          <Button onClick={() => toast.success("Relatório exportado com sucesso!")}>
            Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
        <div className="flex items-center gap-2">
          <MetricCard metric={project.metrics.velocity} />
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Como é calculada a Velocidade?</h4>
                <div className="text-sm space-y-1">
                  <p>A velocidade é calculada com base em:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Pontos entregues por sprint</li>
                    <li>Tempo médio de conclusão das tarefas</li>
                    <li>Previsibilidade das entregas</li>
                    <li>Cumprimento dos prazos estimados</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Meta: Entregar consistentemente os pontos planejados e manter ou melhorar o ritmo de entregas.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="flex items-center gap-2">
          <MetricCard metric={project.metrics.quality} />
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Como é calculada a Qualidade?</h4>
                <div className="text-sm space-y-1">
                  <p>A qualidade é medida através de:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Taxa de bugs em produção</li>
                    <li>Cobertura de testes</li>
                    <li>Débito técnico</li>
                    <li>Code review approval rate</li>
                    <li>Satisfação do usuário final</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Meta: Manter alta qualidade do código e minimizar problemas em produção.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="flex items-center gap-2">
          <MetricCard metric={project.metrics.engagement} />
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Info className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Como é calculado o Engajamento?</h4>
                <div className="text-sm space-y-1">
                  <p>O engajamento é calculado considerando:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Presença em reuniões (30%)</li>
                    <li>Tempo de resposta em comunicações (20%)</li>
                    <li>Contribuições semanais (25%)</li>
                    <li>Feedback do time (25%)</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p><strong>Tempo de Resposta:</strong> 1h ou menos = 100%, 24h ou mais = 0%</p>
                    <p><strong>Contribuições:</strong> 10+ por semana = 100%</p>
                    <p><strong>Feedback:</strong> Avaliação média do time (0-100)</p>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {[1, 2, 3].map((index) => (
          <div key={index} className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center">
            <Button variant="ghost" className="h-full w-full flex flex-col gap-2 text-muted-foreground">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Adicionar Métrica</span>
            </Button>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise do Health Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            O health score do projeto é calculado com base nas métricas ponderadas:
          </p>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Velocidade (40%)</span>
              <span>{project.metrics.velocity.value}% vs {project.metrics.velocity.target}% meta</span>
            </div>
            <div className="flex justify-between">
              <span>Qualidade (30%)</span>
              <span>{project.metrics.quality.value}% vs {project.metrics.quality.target}% meta</span>
            </div>
            <div className="flex justify-between">
              <span>Engajamento (30%)</span>
              <span>{project.metrics.engagement.value}% vs {project.metrics.engagement.target}% meta</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskManager
            tasks={project.tasks || []}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </CardContent>
      </Card>
    </div>
  );
}
