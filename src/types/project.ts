
export type Metric = {
  id: string;
  name: string;
  value: number; // Percentage value (0-100)
  target: number; // Target percentage
  trend: 'up' | 'down' | 'stable';
  weight: number; // Weight in health score calculation (0-1)
};

export type Project = {
  id: string;
  name: string;
  client: string;
  startDate: string;
  healthScore: number; // 0-100
  metrics: {
    deliveryRate: Metric;
    reworkRate: Metric;
    estimateAccuracy: Metric;
    nps: Metric;
  };
};

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
