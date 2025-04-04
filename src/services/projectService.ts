
import { Project, Metric } from "../types/project";

// Calculate a health score from 0-100 based on metrics and their weights
export const calculateHealthScore = (metrics: { [key: string]: Metric }): number => {
  const metricArray = Object.values(metrics);
  const totalWeight = metricArray.reduce((sum, metric) => sum + metric.weight, 0);
  
  const weightedSum = metricArray.reduce((sum, metric) => {
    // For rework rate, lower is better, so we invert the value
    const value = metric.id === 'reworkRate' ? 100 - metric.value : metric.value;
    return sum + (value * metric.weight);
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
      healthScore: 0, // Will be calculated
      metrics: {
        deliveryRate: {
          id: "deliveryRate",
          name: "Delivery Rate",
          value: 85,
          target: 90,
          trend: "up",
          weight: 0.3,
        },
        reworkRate: {
          id: "reworkRate",
          name: "Rework Rate",
          value: 12, // Lower is better
          target: 10,
          trend: "down",
          weight: 0.25,
        },
        estimateAccuracy: {
          id: "estimateAccuracy",
          name: "Estimate Accuracy",
          value: 78,
          target: 85,
          trend: "up",
          weight: 0.25,
        },
        nps: {
          id: "nps",
          name: "NPS Score",
          value: 65,
          target: 70,
          trend: "stable",
          weight: 0.2,
        },
      },
    },
    {
      id: "2",
      name: "E-commerce Platform",
      client: "Magalu",
      startDate: "2023-11-10",
      healthScore: 0, // Will be calculated
      metrics: {
        deliveryRate: {
          id: "deliveryRate",
          name: "Delivery Rate",
          value: 92,
          target: 90,
          trend: "up",
          weight: 0.3,
        },
        reworkRate: {
          id: "reworkRate",
          name: "Rework Rate",
          value: 8, // Lower is better
          target: 10,
          trend: "stable",
          weight: 0.25,
        },
        estimateAccuracy: {
          id: "estimateAccuracy",
          name: "Estimate Accuracy",
          value: 88,
          target: 85,
          trend: "up",
          weight: 0.25,
        },
        nps: {
          id: "nps",
          name: "NPS Score",
          value: 82,
          target: 75,
          trend: "up",
          weight: 0.2,
        },
      },
    },
    {
      id: "3",
      name: "Financial Dashboard",
      client: "Nubank",
      startDate: "2023-09-05",
      healthScore: 0, // Will be calculated
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

  // Calculate health scores for all projects
  return projects.map(project => ({
    ...project,
    healthScore: calculateHealthScore(project.metrics)
  }));
};

// Get a specific project by ID
export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
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
