import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projectService } from "@/services/projectService";
import { HealthScoreBadge } from "../components/HealthScoreBadge";
import { MetricCard } from "../components/MetricCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project, Task } from "@/types/project";
import { TaskManager } from "@/components/TaskManager";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (id) {
        try {
          const data = await projectService.getProjectById(id);
          if (data) {
            setProject(data);
            setEditData(data);
          } else {
            toast.error("Projeto não encontrado");
            navigate("/");
          }
        } catch (error) {
          toast.error("Erro ao carregar projeto");
          console.error(error);
        }
      }
    };
    loadProject();
  }, [id, navigate]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
      </div>
    );
  }

  const handleUpdateProject = async () => {
    if (!id || !editData) return;

    try {
      const updatedProject = await projectService.updateProject(id, editData);
      if (updatedProject) {
        setProject(updatedProject);
        setIsEditing(false);
        toast.success("Projeto atualizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar projeto");
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!id) return;

    try {
      const success = await projectService.deleteProject(id);
      if (success) {
        toast.success("Projeto excluído com sucesso!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Erro ao excluir projeto");
      console.error(error);
    }
  };

  const handleAddTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!id) return;

    try {
      const newTask = await projectService.addTask(id, task);
      if (newTask && project) {
        setProject({
          ...project,
          tasks: [...project.tasks, newTask],
        });
      }
    } catch (error) {
      toast.error("Erro ao adicionar tarefa");
      console.error(error);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    if (!id) return;

    try {
      const updatedTask = await projectService.updateTask(id, taskId, taskData);
      if (updatedTask && project) {
        setProject({
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          ),
        });
      }
    } catch (error) {
      toast.error("Erro ao atualizar tarefa");
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!id) return;

    try {
      const success = await projectService.deleteTask(id, taskId);
      if (success && project) {
        setProject({
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId),
        });
      }
    } catch (error) {
      toast.error("Erro ao excluir tarefa");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-6">
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
          <ThemeToggle />
          <HealthScoreBadge score={project.healthScore} size="lg" />
          <Button onClick={() => toast.success("Relatório exportado com sucesso!")}>
            Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise do Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            O health score do projeto é calculado com base nas métricas ponderadas:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Velocidade (40%)</span>
              <span>{project.metrics.velocity.value}% vs {project.metrics.velocity.target}% meta</span>
            </li>
            <li className="flex justify-between">
              <span>Qualidade (30%)</span>
              <span>{project.metrics.quality.value}% vs {project.metrics.quality.target}% meta</span>
            </li>
            <li className="flex justify-between">
              <span>Engajamento (30%)</span>
              <span>{project.metrics.engagement.value}% vs {project.metrics.engagement.target}% meta</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-muted-foreground">{project.client}</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl">Editar Projeto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Projeto</Label>
                    <Input
                      id="name"
                      value={editData?.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Input
                      id="client"
                      value={editData?.client || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, client: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de Início</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={editData?.startDate || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (meses)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={editData?.duration || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, duration: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Métricas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="velocityValue">Velocidade (%)</Label>
                      <Input
                        id="velocityValue"
                        type="number"
                        min="0"
                        max="100"
                        value={editData?.metrics?.velocity?.value || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            metrics: {
                              ...editData?.metrics,
                              velocity: {
                                ...editData?.metrics?.velocity,
                                value: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="velocityTarget">Meta de Velocidade (%)</Label>
                      <Input
                        id="velocityTarget"
                        type="number"
                        min="0"
                        max="100"
                        value={editData?.metrics?.velocity?.target || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            metrics: {
                              ...editData?.metrics,
                              velocity: {
                                ...editData?.metrics?.velocity,
                                target: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qualityValue">Qualidade (%)</Label>
                      <Input
                        id="qualityValue"
                        type="number"
                        min="0"
                        max="100"
                        value={editData?.metrics?.quality?.value || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            metrics: {
                              ...editData?.metrics,
                              quality: {
                                ...editData?.metrics?.quality,
                                value: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualityTarget">Meta de Qualidade (%)</Label>
                      <Input
                        id="qualityTarget"
                        type="number"
                        min="0"
                        max="100"
                        value={editData?.metrics?.quality?.target || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            metrics: {
                              ...editData?.metrics,
                              quality: {
                                ...editData?.metrics?.quality,
                                target: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="engagementValue">Engajamento (%)</Label>
                      <Input
                        id="engagementValue"
                        type="number"
                        min="0"
                        max="100"
                        value={editData?.metrics?.engagement?.value || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            metrics: {
                              ...editData?.metrics,
                              engagement: {
                                ...editData?.metrics?.engagement,
                                value: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engagementTarget">Meta de Engajamento (%)</Label>
                      <Input
                        id="engagementTarget"
                        type="number"
                        min="0"
                        max="100"
                        value={editData?.metrics?.engagement?.target || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            metrics: {
                              ...editData?.metrics,
                              engagement: {
                                ...editData?.metrics?.engagement,
                                target: parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateProject}>Salvar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            onClick={handleDeleteProject}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Data de Início:</span>{" "}
                {formatDate(project.startDate)}
              </p>
              <p>
                <span className="font-medium">Duração:</span> {project.duration}{" "}
                meses
              </p>
              <p>
                <span className="font-medium">Health Score:</span>{" "}
                {project.healthScore}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(project.metrics).map(([key, metric]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span>{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Meta: {metric.target}%</span>
                    <span>Peso: {(metric.weight * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Tarefas:</span>{" "}
                {project.tasks.length}
              </p>
              <p>
                <span className="font-medium">Concluídas:</span>{" "}
                {project.tasks.filter((task) => task.status === "completed").length}
              </p>
              <p>
                <span className="font-medium">Em Andamento:</span>{" "}
                {project.tasks.filter((task) => task.status === "in_progress").length}
              </p>
              <p>
                <span className="font-medium">Pendentes:</span>{" "}
                {project.tasks.filter((task) => task.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskManager
            tasks={project.tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetail;
