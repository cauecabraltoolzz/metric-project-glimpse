import { Project, Metric, Task } from "../types/project";

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

// Mock data for projects
export const getProjects = (): Project[] => {
  const projects: Project[] = [
    {
      id: "1",
      name: "Mobile App Redesign",
      client: "Banco Inter",
      startDate: "2024-01-15",
      duration: 6,
      healthScore: 0, // Will be calculated
      isNew: false,
      tasks: [],
      metrics: {
        velocity: {
          id: "velocity",
          name: "Velocidade",
          value: 85,
          target: 85,
          trend: "up",
          weight: 0.4,
        },
        quality: {
          id: "quality",
          name: "Qualidade",
          value: 90,
          target: 85,
          trend: "up",
          weight: 0.3,
        },
        engagement: {
          id: "engagement",
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
      id: "2",
      name: "E-commerce Platform",
      client: "Magazine Luiza",
      startDate: "2023-11-01",
      duration: 8,
      healthScore: 0, // Will be calculated
      isNew: false,
      tasks: [],
      metrics: {
        velocity: {
          id: "velocity",
          name: "Velocidade",
          value: 75,
          target: 85,
          trend: "down",
          weight: 0.4,
        },
        quality: {
          id: "quality",
          name: "Qualidade",
          value: 82,
          target: 85,
          trend: "stable",
          weight: 0.3,
        },
        engagement: {
          id: "engagement",
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
    {
      id: "3",
      name: "Financial Dashboard",
      client: "Nubank",
      startDate: "2023-09-05",
      duration: 12,
      healthScore: 0, // Will be calculated
      isNew: false,
      tasks: [],
      metrics: {
        velocity: {
          id: "velocity",
          name: "Velocidade",
          value: 70,
          target: 85,
          trend: "down",
          weight: 0.4,
        },
        quality: {
          id: "quality",
          name: "Qualidade",
          value: 65,
          target: 80,
          trend: "down",
          weight: 0.3,
        },
        engagement: {
          id: "engagement",
          name: "Engajamento",
          value: 55,
          target: 70,
          trend: "down",
          weight: 0.3,
        },
      },
      hours: {
        sold: 200,
        allocated: 180,
      },
    },
    {
      id: "4",
      name: "Logistics Tracker",
      client: "Mercado Livre",
      startDate: "2024-02-20",
      duration: 9,
      healthScore: 0, // Will be calculated
      isNew: false,
      tasks: [],
      metrics: {
        velocity: {
          id: "velocity",
          name: "Velocidade",
          value: 80,
          target: 85,
          trend: "stable",
          weight: 0.4,
        },
        quality: {
          id: "quality",
          name: "Qualidade",
          value: 75,
          target: 80,
          trend: "up",
          weight: 0.3,
        },
        engagement: {
          id: "engagement",
          name: "Engajamento",
          value: 68,
          target: 75,
          trend: "up",
          weight: 0.3,
        },
      },
    },
    {
      id: "5",
      name: "Social Network App",
      client: "LinkedIn BR",
      startDate: "2023-08-10",
      duration: 15,
      healthScore: 0, // Will be calculated
      isNew: false,
      tasks: [],
      metrics: {
        velocity: {
          id: "velocity",
          name: "Velocidade",
          value: 88,
          target: 90,
          trend: "stable",
          weight: 0.4,
        },
        quality: {
          id: "quality",
          name: "Qualidade",
          value: 82,
          target: 85,
          trend: "up",
          weight: 0.3,
        },
        engagement: {
          id: "engagement",
          name: "Engajamento",
          value: 72,
          target: 75,
          trend: "up",
          weight: 0.3,
        },
      },
    },
  ];

  // Calculate health scores
  return projects.map(project => ({
    ...project,
    healthScore: calculateHealthScore(project.metrics),
  }));
};

// Get a specific project by ID
export const getProjectById = async (id: string): Promise<Project> => {
  const projects = await getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) {
    throw new Error(`Project with id ${id} not found`);
  }
  return project;
};

// Create a new project
export const createProject = (projectData: Omit<Project, 'id' | 'healthScore' | 'isNew'>): Project => {
  const newProject: Project = {
    ...projectData,
    id: Math.random().toString(36).substr(2, 9), // Generate a random ID
    healthScore: calculateHealthScore(projectData.metrics),
    isNew: true,
  };

  return newProject;
};

// Get health score classification
export const getHealthScoreClassification = (score: number): {
  label: string;
  color: string;
} => {
  if (score >= 85) {
    return { label: "Excellent", color: "health-excellent" };
  } else if (score >= 70) {
    return { label: "Good", color: "health-good" };
  } else if (score >= 50) {
    return { label: "Average", color: "health-average" };
  } else {
    return { label: "Poor", color: "health-poor" };
  }
};

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const projects = getProjects();
      console.log("Projetos carregados:", projects); // Debug
      return Promise.resolve(projects);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      return Promise.reject(error);
    }
  },

  getProjectById: async (id: string): Promise<Project> => {
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return project;
  },

  createProject: async (projectData: Omit<Project, "id" | "healthScore" | "isNew">): Promise<Project> => {
    try {
      const newProject = createProject(projectData);
      return Promise.resolve(newProject);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      return Promise.reject(error);
    }
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project | undefined> => {
    try {
      const projects = getProjects();
      const projectIndex = projects.findIndex(project => project.id === id);
      if (projectIndex === -1) {
        console.log("Projeto não encontrado para atualização:", id); // Debug
        return Promise.resolve(undefined);
      }

      const updatedProject = {
        ...projects[projectIndex],
        ...projectData,
        healthScore: projectData.metrics 
          ? calculateHealthScore(projectData.metrics)
          : projects[projectIndex].healthScore,
      };

      console.log("Projeto atualizado:", updatedProject); // Debug
      return Promise.resolve(updatedProject);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      return Promise.reject(error);
    }
  },

  deleteProject: async (id: string): Promise<boolean> => {
    try {
      const projects = getProjects();
      const projectIndex = projects.findIndex(project => project.id === id);
      if (projectIndex === -1) {
        console.log("Projeto não encontrado para exclusão:", id); // Debug
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      return Promise.reject(error);
    }
  },

  addTask: async (projectId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task | undefined> => {
    try {
      const projects = getProjects();
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        console.log("Projeto não encontrado para adicionar tarefa:", projectId); // Debug
        return Promise.resolve(undefined);
      }

      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Nova tarefa criada:", newTask); // Debug
      return Promise.resolve(newTask);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      return Promise.reject(error);
    }
  },

  updateTask: async (projectId: string, taskId: string, taskData: Partial<Task>): Promise<Task | undefined> => {
    try {
      const projects = getProjects();
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        console.log("Projeto não encontrado para atualizar tarefa:", projectId); // Debug
        return Promise.resolve(undefined);
      }

      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        console.log("Tarefa não encontrada para atualização:", taskId); // Debug
        return Promise.resolve(undefined);
      }

      const updatedTask = {
        ...project.tasks[taskIndex],
        ...taskData,
        updatedAt: new Date().toISOString(),
      };

      console.log("Tarefa atualizada:", updatedTask); // Debug
      return Promise.resolve(updatedTask);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      return Promise.reject(error);
    }
  },

  deleteTask: async (projectId: string, taskId: string): Promise<boolean> => {
    try {
      const projects = getProjects();
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        console.log("Projeto não encontrado para excluir tarefa:", projectId); // Debug
        return Promise.resolve(false);
      }

      const taskIndex = project.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        console.log("Tarefa não encontrada para exclusão:", taskId); // Debug
        return Promise.resolve(false);
      }

      return Promise.resolve(true);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      return Promise.reject(error);
    }
  },
};
