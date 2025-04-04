
import { Delivery } from "../types/project";
import { getProjects } from "./projectService";

// Mock data para entregas de projetos
const deliveries: Delivery[] = [
  {
    id: "1",
    projectId: "1",
    name: "Fase 1: MVP",
    description: "Desenvolvimento do MVP com funcionalidades básicas",
    startDate: "2024-01-20",
    endDate: "2024-02-28",
    stage: "deployment",
    progress: 100,
  },
  {
    id: "2",
    projectId: "1",
    name: "Fase 2: Melhorias UX",
    description: "Refinamentos na interface e experiência do usuário",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    stage: "development",
    progress: 75,
  },
  {
    id: "3",
    projectId: "1",
    name: "Fase 3: Integração de APIs",
    description: "Integração com sistemas externos",
    startDate: "2024-04-16",
    endDate: "2024-05-30",
    stage: "planning",
    progress: 0,
  },
  {
    id: "4",
    projectId: "2",
    name: "Módulo de Pagamentos",
    description: "Implementação do sistema de pagamentos",
    startDate: "2023-12-01",
    endDate: "2024-01-30",
    stage: "deployment",
    progress: 100,
  },
  {
    id: "5",
    projectId: "2",
    name: "Sistema de Recomendação",
    description: "Algoritmo de recomendação de produtos",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    stage: "testing",
    progress: 85,
  },
  {
    id: "6",
    projectId: "2",
    name: "Otimização para Mobile",
    description: "Melhorias na responsividade para dispositivos móveis",
    startDate: "2024-05-01",
    endDate: "2024-06-15",
    stage: "planning",
    progress: 0,
  },
  {
    id: "7",
    projectId: "3",
    name: "Dashboard v1",
    description: "Primeira versão do dashboard financeiro",
    startDate: "2023-09-10",
    endDate: "2023-11-30",
    stage: "deployment",
    progress: 100,
  },
  {
    id: "8",
    projectId: "3",
    name: "Relatórios Avançados",
    description: "Implementação de relatórios personalizados",
    startDate: "2023-12-01",
    endDate: "2024-02-28",
    stage: "testing",
    progress: 90,
  },
  {
    id: "9",
    projectId: "3",
    name: "Integração Bancária",
    description: "Conexão com APIs de bancos",
    startDate: "2024-03-01",
    endDate: "2024-05-30",
    stage: "development",
    progress: 45,
  },
  {
    id: "10",
    projectId: "4",
    name: "Sistema de Rastreamento",
    description: "Implementação do sistema de rastreamento em tempo real",
    startDate: "2024-02-25",
    endDate: "2024-04-20",
    stage: "development",
    progress: 60,
  },
  {
    id: "11",
    projectId: "5",
    name: "Feed de Atividades",
    description: "Desenvolvimento do feed de atividades em tempo real",
    startDate: "2023-08-15",
    endDate: "2023-10-30",
    stage: "deployment",
    progress: 100,
  },
  {
    id: "12",
    projectId: "5",
    name: "Sistema de Mensagens",
    description: "Chat e comunicação interna",
    startDate: "2023-11-01",
    endDate: "2024-01-15",
    stage: "testing",
    progress: 95,
  },
];

// Obter todas as entregas
export const getDeliveries = (): Delivery[] => {
  return deliveries;
};

// Obter entregas por projeto
export const getDeliveriesByProjectIds = (projectIds: string[]): Delivery[] => {
  return deliveries.filter((delivery) => projectIds.includes(delivery.projectId));
};

// Obter estágio formatado em português
export const getStageLabel = (stage: DeliveryStage): string => {
  const stageLabels: Record<DeliveryStage, string> = {
    planning: "Planejamento",
    development: "Desenvolvimento",
    testing: "Testes",
    review: "Revisão",
    deployment: "Implantação"
  };
  
  return stageLabels[stage];
};

// Obter código de cor por estágio
export const getStageColor = (stage: DeliveryStage): string => {
  const stageColors: Record<DeliveryStage, string> = {
    planning: "bg-blue-200 border-blue-400",
    development: "bg-amber-200 border-amber-400",
    testing: "bg-purple-200 border-purple-400",
    review: "bg-orange-200 border-orange-400",
    deployment: "bg-green-200 border-green-400"
  };
  
  return stageColors[stage];
};

// Obter nome do projeto a partir do ID
export const getProjectNameById = (projectId: string): string => {
  const project = getProjects().find(p => p.id === projectId);
  return project ? project.name : "Projeto Desconhecido";
};
