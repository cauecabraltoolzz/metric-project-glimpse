import { Project, Metric, Task } from "../types/project";
import { v4 as uuidv4 } from "uuid";

interface EngagementFactors {
  meetingAttendance: number; // Porcentagem de presença em reuniões (0-100)
  responseTime: number; // Tempo médio de resposta em horas (quanto menor, melhor)
  contributions: number; // Número de contribuições/interações por semana
  teamFeedback: number; // Avaliação média do time (0-100)
}

// Calcula o engajamento baseado nos fatores
function calculateEngagement(factors: EngagementFactors): number {
  // Pesos para cada fator
  const weights = {
    meetingAttendance: 0.3, // 30%
    responseTime: 0.2, // 20%
    contributions: 0.25, // 25%
    teamFeedback: 0.25 // 25%
  };

  // Normaliza o tempo de resposta (converte para uma escala de 0-100)
  // Considera que 24h é ruim (0) e 1h ou menos é ótimo (100)
  const normalizedResponseTime = Math.max(0, Math.min(100, (24 - factors.responseTime) * (100/23)));

  // Normaliza as contribuições (considera que 10 ou mais por semana é ótimo)
  const normalizedContributions = Math.min(100, (factors.contributions / 10) * 100);

  // Calcula o score final
  const engagementScore = 
    (factors.meetingAttendance * weights.meetingAttendance) +
    (normalizedResponseTime * weights.responseTime) +
    (normalizedContributions * weights.contributions) +
    (factors.teamFeedback * weights.teamFeedback);

  return Math.round(engagementScore);
}

// Calculate a health score from 0-100 based on metrics and their weights
export const calculateHealthScore = (metrics: { [key: string]: Metric }): number => {
  const metricArray = Object.values(metrics);
  const totalWeight = metricArray.reduce((sum, metric) => sum + metric.weight, 0);
  
  const weightedSum = metricArray.reduce((sum, metric) => {
    return sum + (metric.value * metric.weight);
  }, 0);
  
  return Math.round(weightedSum / totalWeight);
};

const PROJECTS_KEY = "@metric-project:projects";

// Dados iniciais para testes
const initialProjects: Project[] = [
  {
    id: uuidv4(),
    name: "Mobile App Redesign",
    client: "Banco Inter",
    startDate: "2024-01-15",
    duration: 6,
    healthScore: 0,
    isNew: false,
    tasks: [],
    metrics: {
      velocity: {
        id: uuidv4(),
        name: "Velocidade",
        value: 85,
        target: 85,
        trend: "up",
        weight: 0.4,
      },
      quality: {
        id: uuidv4(),
        name: "Qualidade",
        value: 90,
        target: 85,
        trend: "up",
        weight: 0.3,
      },
      engagement: {
        id: uuidv4(),
        name: "Engajamento",
        value: 88,
        target: 85,
        trend: "stable",
        weight: 0.3,
      },
    },
    hours: {
      sold: 120,
      allocated: 100,
    },
  },
  {
    id: uuidv4(),
    name: "E-commerce Platform",
    client: "Magazine Luiza",
    startDate: "2023-11-01",
    duration: 8,
    healthScore: 0,
    isNew: false,
    tasks: [],
    metrics: {
      velocity: {
        id: uuidv4(),
        name: "Velocidade",
        value: 75,
        target: 85,
        trend: "down",
        weight: 0.4,
      },
      quality: {
        id: uuidv4(),
        name: "Qualidade",
        value: 82,
        target: 85,
        trend: "stable",
        weight: 0.3,
      },
      engagement: {
        id: uuidv4(),
        name: "Engajamento",
        value: 78,
        target: 85,
        trend: "down",
        weight: 0.3,
      },
    },
    hours: {
      sold: 160,
      allocated: 140,
    },
  },
];

function getProjects(): Project[] {
  const savedProjects = localStorage.getItem(PROJECTS_KEY);
  if (!savedProjects) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
    return initialProjects;
  }
  const projects = JSON.parse(savedProjects);
  // Garantir que todos os projetos têm a propriedade hours
  return projects.map(project => ({
    ...project,
    hours: project.hours || {
      sold: 0,
      allocated: 0,
    },
  }));
}

async function getProjectById(id: string): Promise<Project> {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) {
    throw new Error(`Projeto não encontrado: ${id}`);
  }
  return project;
}

async function createProject(projectData: Omit<Project, "id" | "healthScore" | "isNew">): Promise<Project> {
  const projects = getProjects();
  const newProject: Project = {
    id: uuidv4(),
    ...projectData,
    healthScore: 0,
    isNew: true,
    tasks: projectData.tasks || [],
    metrics: {
      velocity: {
        id: uuidv4(),
        name: "Velocidade",
        value: projectData.metrics.velocity.target,
        target: projectData.metrics.velocity.target,
        trend: "stable",
        weight: projectData.metrics.velocity.weight,
      },
      quality: {
        id: uuidv4(),
        name: "Qualidade",
        value: projectData.metrics.quality.target,
        target: projectData.metrics.quality.target,
        trend: "stable",
        weight: projectData.metrics.quality.weight,
      },
      engagement: {
        id: uuidv4(),
        name: "Engajamento",
        value: projectData.metrics.engagement.target,
        target: projectData.metrics.engagement.target,
        trend: "stable",
        weight: projectData.metrics.engagement.weight,
      },
    },
    hours: {
      sold: projectData.hours?.sold || 0,
      allocated: projectData.hours?.allocated || 0,
    },
  };

  newProject.healthScore = calculateHealthScore(newProject.metrics);
  projects.push(newProject);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return newProject;
}

async function addTask(projectId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error(`Projeto não encontrado: ${projectId}`);
  }

  const newTask: Task = {
    id: uuidv4(),
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects[projectIndex].tasks = projects[projectIndex].tasks || [];
  projects[projectIndex].tasks.push(newTask);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return newTask;
}

async function updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<Task> {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error(`Projeto não encontrado: ${projectId}`);
  }

  const taskIndex = projects[projectIndex].tasks?.findIndex(t => t.id === taskId);
  
  if (!taskIndex || taskIndex === -1) {
    throw new Error(`Tarefa não encontrada: ${taskId}`);
  }

  const updatedTask = {
    ...projects[projectIndex].tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  projects[projectIndex].tasks[taskIndex] = updatedTask;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return updatedTask;
}

async function deleteTask(projectId: string, taskId: string): Promise<boolean> {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error(`Projeto não encontrado: ${projectId}`);
  }

  if (!projects[projectIndex].tasks) {
    return false;
  }

  const taskIndex = projects[projectIndex].tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return false;
  }

  projects[projectIndex].tasks.splice(taskIndex, 1);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  return true;
}

export const projectService = {
  getProjects,
  getProjectById,
  createProject,
  addTask,
  updateTask,
  deleteTask,
};
