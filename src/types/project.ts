export interface Metric {
  id: string;
  name: string;
  value: number;
  target: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Task {
  id: string;
  title: string;
  pipefyLink: string;
  status: 'pending' | 'in_progress' | 'completed';
  size: 'PP' | 'P' | 'M' | 'G' | 'GG';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  duration: number;
  healthScore: number;
  isNew: boolean;
  tasks: Task[];
  metrics: {
    velocity: Metric;
    quality: Metric;
    engagement: Metric;
  };
}

export type DeliveryStage = 'planning' | 'development' | 'testing' | 'review' | 'deployment';

export type Delivery = {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  stage: DeliveryStage;
  progress: number; // 0-100
};
