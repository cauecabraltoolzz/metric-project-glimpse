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
      name: "Food Delivery App",
      client: "iFood",
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
          target: 90,
          trend: "up",
          weight: 0.4,
        },
        quality: {
          id: "quality",
          name: "Qualidade",
          value: 88,
          target: 90,
          trend: "up",
          weight: 0.3,
        },
        engagement: {
          id: "engagement",
          name: "Engajamento",
          value: calculateEngagement({
            meetingAttendance: 95, // 95% de presença em reuniões
            responseTime: 2, // 2 horas em média para responder
            contributions: 8, // 8 contribuições por semana
            teamFeedback: 90 // Feedback positivo do time
          }),
          target: 90,
          trend: "up",
          weight: 0.3,
        },
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
    },
    {
      id: "3",
      name: "Financial Dashboard",
      client: "Nubank",
      startDate: "2023-09-05",
      healthScore: 0, // Will be calculated
      isNew: false,
      metrics: {
        deliveryRate: {
          id: "deliveryRate",
          name: "Delivery Rate",
          value: 70,
          target: 85,
          trend: "down",
          weight: 0.3,
        },
        reworkRate: {
          id: "reworkRate",
          name: "Rework Rate",
          value: 22, // Lower is better
          target: 15,
          trend: "up",
          weight: 0.25,
        },
        estimateAccuracy: {
          id: "estimateAccuracy",
          name: "Estimate Accuracy",
          value: 65,
          target: 80,
          trend: "down",
          weight: 0.25,
        },
        nps: {
          id: "nps",
          name: "NPS Score",
          value: 55,
          target: 70,
          trend: "down",
          weight: 0.2,
        },
      },
    },
    {
      id: "4",
      name: "Logistics Tracker",
      client: "Mercado Livre",
      startDate: "2024-02-20",
      healthScore: 0, // Will be calculated
      isNew: false,
      metrics: {
        deliveryRate: {
          id: "deliveryRate",
          name: "Delivery Rate",
          value: 80,
          target: 85,
          trend: "stable",
          weight: 0.3,
        },
        reworkRate: {
          id: "reworkRate",
          name: "Rework Rate",
          value: 15, // Lower is better
          target: 15,
          trend: "stable",
          weight: 0.25,
        },
        estimateAccuracy: {
          id: "estimateAccuracy",
          name: "Estimate Accuracy",
          value: 75,
          target: 80,
          trend: "up",
          weight: 0.25,
        },
        nps: {
          id: "nps",
          name: "NPS Score",
          value: 68,
          target: 75,
          trend: "up",
          weight: 0.2,
        },
      },
    },
    {
      id: "5",
      name: "Social Network App",
      client: "LinkedIn BR",
      startDate: "2023-08-10",
      healthScore: 0, // Will be calculated
      isNew: false,
      metrics: {
        deliveryRate: {
          id: "deliveryRate",
          name: "Delivery Rate",
          value: 88,
          target: 90,
          trend: "stable",
          weight: 0.3,
        },
        reworkRate: {
          id: "reworkRate",
          name: "Rework Rate",
          value: 11, // Lower is better
          target: 10,
          trend: "down",
          weight: 0.25,
        },
        estimateAccuracy: {
          id: "estimateAccuracy",
          name: "Estimate Accuracy",
          value: 82,
          target: 85,
          trend: "up",
          weight: 0.25,
        },
        nps: {
          id: "nps",
          name: "NPS Score",
          value: 72,
          target: 75,
          trend: "up",
          weight: 0.2,
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
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
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
    return getProjects();
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    return getProjectById(id);
  },

  createProject: async (projectData: Omit<Project, "id" | "healthScore" | "isNew">): Promise<Project> => {
    return createProject(projectData as any);
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project | undefined> => {
    const projects = getProjects();
    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex === -1) return undefined;

    const updatedProject = {
      ...projects[projectIndex],
      ...projectData,
      healthScore: projectData.metrics 
        ? calculateHealthScore(projectData.metrics)
        : projects[projectIndex].healthScore,
    };

    const updatedProjects = [
      ...projects.slice(0, projectIndex),
      updatedProject,
      ...projects.slice(projectIndex + 1),
    ];

    return updatedProjects[projectIndex];
  },

  deleteProject: async (id: string): Promise<boolean> => {
    const projects = getProjects();
    const projectIndex = projects.findIndex(project => project.id === id);
    if (projectIndex === -1) return false;

    const updatedProjects = projects.filter((_, index) => index !== projectIndex);
    return true;
  },

  addTask: async (projectId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task | undefined> => {
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;

    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask],
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    return newTask;
  },

  updateTask: async (projectId: string, taskId: string, taskData: Partial<Task>): Promise<Task | undefined> => {
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return undefined;

    const taskIndex = project.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return undefined;

    const updatedTask = {
      ...project.tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = project.tasks.map((t, index) => index === taskIndex ? updatedTask : t);
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    return updatedTask;
  },

  deleteTask: async (projectId: string, taskId: string): Promise<boolean> => {
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;

    const taskIndex = project.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return false;

    const updatedTasks = project.tasks.filter((_, index) => index !== taskIndex);
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };

    const updatedProjects = projects.map(p => p.id === projectId ? updatedProject : p);
    return true;
  },
};
