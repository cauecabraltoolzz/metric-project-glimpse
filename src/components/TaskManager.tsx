import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types/project";
import { Plus, Trash2, ExternalLink, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

const taskSizes = {
  PP: { label: 'PP (1 semana)', duration: 1 },
  P: { label: 'P (2 semanas)', duration: 2 },
  M: { label: 'M (3 semanas)', duration: 3 },
  G: { label: 'G (4 semanas)', duration: 4 },
  GG: { label: 'GG (5 semanas)', duration: 5 },
} as const;

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateTask: (taskId: string, taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskManager({ tasks, onAddTask, onUpdateTask, onDeleteTask }: TaskManagerProps) {
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>({
    title: "",
    pipefyLink: "",
    status: "pending",
    size: "M",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (!newTask.title) return;
    onAddTask(newTask);
    setNewTask({
      title: "",
      pipefyLink: "",
      status: "pending",
      size: "M",
    });
  };

  const handleUpdateTask = () => {
    if (!editingTask?.id) return;
    onUpdateTask(editingTask.id, editingTask);
    setEditingTask(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              placeholder="Digite o título da tarefa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pipefyLink">Link do Pipefy</Label>
            <Input
              id="pipefyLink"
              value={newTask.pipefyLink}
              onChange={(e) =>
                setNewTask({ ...newTask, pipefyLink: e.target.value })
              }
              placeholder="Cole o link do Pipefy"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="size">Tamanho</Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4">
                    <Info className="h-3 w-3" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tamanhos de Tarefa</h4>
                    <ul className="text-sm space-y-1">
                      <li>PP - 1 semana de duração</li>
                      <li>P - 2 semanas de duração</li>
                      <li>M - 3 semanas de duração</li>
                      <li>G - 4 semanas de duração</li>
                      <li>GG - 5 semanas de duração</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Select
              value={newTask.size}
              onValueChange={(value) =>
                setNewTask({ ...newTask, size: value as Task["size"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(taskSizes).map(([size, { label }]) => (
                  <SelectItem key={size} value={size}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newTask.status}
              onValueChange={(value) =>
                setNewTask({ ...newTask, status: value as Task["status"] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleAddTask} className="self-end">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Tarefa
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Link do Pipefy</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead>Atualizada em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <a
                    href={task.pipefyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver no Pipefy
                  </a>
                </TableCell>
                <TableCell>{taskSizes[task.size].label}</TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      onUpdateTask(task.id, { status: value as Task["status"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
                <TableCell>{formatDate(task.updatedAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Tarefa</DialogTitle>
                      </DialogHeader>
                      {editingTask && (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-title">Título</Label>
                            <Input
                              id="edit-title"
                              value={editingTask.title}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-pipefyLink">Link do Pipefy</Label>
                            <Input
                              id="edit-pipefyLink"
                              value={editingTask.pipefyLink}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  pipefyLink: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="edit-size">Tamanho</Label>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-4 w-4">
                                    <Info className="h-3 w-3" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Tamanhos de Tarefa</h4>
                                    <ul className="text-sm space-y-1">
                                      <li>PP - 1 semana de duração</li>
                                      <li>P - 2 semanas de duração</li>
                                      <li>M - 3 semanas de duração</li>
                                      <li>G - 4 semanas de duração</li>
                                      <li>GG - 5 semanas de duração</li>
                                    </ul>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                            <Select
                              value={editingTask.size}
                              onValueChange={(value) =>
                                setEditingTask({
                                  ...editingTask,
                                  size: value as Task["size"],
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(taskSizes).map(([size, { label }]) => (
                                  <SelectItem key={size} value={size}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                              value={editingTask.status}
                              onValueChange={(value) =>
                                setEditingTask({
                                  ...editingTask,
                                  status: value as Task["status"],
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pendente</SelectItem>
                                <SelectItem value="in_progress">
                                  Em Andamento
                                </SelectItem>
                                <SelectItem value="completed">Concluída</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setEditingTask(null)}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={handleUpdateTask}>Salvar</Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 