import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project, Task } from "@/types/project";
import { projectService } from "@/services/projectService";
import { TaskManager } from "./TaskManager";
import { toast } from "sonner";

export function NewProjectForm() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    startDate: "",
    duration: 0,
    metrics: {
      velocity: { current: 0, target: 0, weight: 0.4 },
      quality: { current: 0, target: 0, weight: 0.3 },
      engagement: { current: 0, target: 0, weight: 0.3 },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProject = await projectService.createProject({
        ...formData,
        tasks,
      });
      toast.success("Projeto criado com sucesso!");
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      toast.error("Erro ao criar projeto");
      console.error(error);
    }
  };

  const handleAddTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask = await projectService.addTask("temp", task);
    if (newTask) {
      setTasks([...tasks, newTask]);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
    const updatedTask = await projectService.updateTask("temp", taskId, taskData);
    if (updatedTask) {
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const success = await projectService.deleteTask("temp", taskId);
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duração (meses)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Métricas</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="velocity-target">Velocidade (Target)</Label>
              <Input
                id="velocity-target"
                type="number"
                min="0"
                max="100"
                value={formData.metrics.velocity.target}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      velocity: {
                        ...formData.metrics.velocity,
                        target: parseInt(e.target.value),
                      },
                    },
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality-target">Qualidade (Target)</Label>
              <Input
                id="quality-target"
                type="number"
                min="0"
                max="100"
                value={formData.metrics.quality.target}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      quality: {
                        ...formData.metrics.quality,
                        target: parseInt(e.target.value),
                      },
                    },
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engagement-target">Engajamento (Target)</Label>
              <Input
                id="engagement-target"
                type="number"
                min="0"
                max="100"
                value={formData.metrics.engagement.target}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: {
                      ...formData.metrics,
                      engagement: {
                        ...formData.metrics.engagement,
                        target: parseInt(e.target.value),
                      },
                    },
                  })
                }
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tarefas</h3>
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/")}>
          Cancelar
        </Button>
        <Button type="submit">Criar Projeto</Button>
      </div>
    </form>
  );
} 