
import React from "react";
import { Delivery, DeliveryStage } from "../types/project";
import { getProjectNameById, getStageColor, getStageLabel } from "../services/deliveryService";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

// Helper para calcular a posição e largura das barras
const calculatePositionAndWidth = (
  delivery: Delivery,
  earliestStart: Date,
  latestEnd: Date
): { left: string; width: string } => {
  const totalDuration = latestEnd.getTime() - earliestStart.getTime();
  if (totalDuration === 0) return { left: "0%", width: "100%" };

  const startDate = new Date(delivery.startDate);
  const endDate = new Date(delivery.endDate);
  
  const startOffset = startDate.getTime() - earliestStart.getTime();
  const duration = endDate.getTime() - startDate.getTime();
  
  const left = (startOffset / totalDuration) * 100;
  const width = (duration / totalDuration) * 100;
  
  return {
    left: `${left}%`,
    width: `${Math.max(width, 2)}%` // Garantir um mínimo de largura visível
  };
};

interface GanttChartProps {
  deliveries: Delivery[];
}

const GanttChart: React.FC<GanttChartProps> = ({ deliveries }) => {
  if (!deliveries.length) {
    return (
      <div className="text-center py-16">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Nenhuma entrega para exibir</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecione pelo menos um projeto para visualizar suas entregas.
        </p>
      </div>
    );
  }

  // Encontrar datas limite para dimensionar o gráfico
  const dates = deliveries.flatMap(d => [new Date(d.startDate), new Date(d.endDate)]);
  const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Adicionar um mês ao começo e fim para melhor visualização
  earliestDate.setMonth(earliestDate.getMonth() - 1);
  latestDate.setMonth(latestDate.getMonth() + 1);

  // Gerar marcadores de mês para o eixo do tempo
  const months: { label: string; position: string }[] = [];
  const currentDate = new Date(earliestDate);
  
  while (currentDate <= latestDate) {
    const position = calculatePositionAndWidth(
      {
        id: "",
        projectId: "",
        name: "",
        description: "",
        startDate: currentDate.toISOString(),
        endDate: currentDate.toISOString(),
        stage: "planning",
        progress: 0
      },
      earliestDate,
      latestDate
    ).left;
    
    months.push({
      label: currentDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      position
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Organizar entregas por projeto
  const deliveriesByProject: Record<string, Delivery[]> = {};
  
  deliveries.forEach(delivery => {
    if (!deliveriesByProject[delivery.projectId]) {
      deliveriesByProject[delivery.projectId] = [];
    }
    deliveriesByProject[delivery.projectId].push(delivery);
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Timeline headers */}
        <div className="relative h-8 mb-4 border-b">
          {months.map((month, index) => (
            <div
              key={index}
              className="absolute top-0 text-xs text-muted-foreground"
              style={{ left: month.position }}
            >
              {month.label}
            </div>
          ))}
        </div>
        
        {/* Gantt bars por projeto */}
        <div className="space-y-8">
          {Object.entries(deliveriesByProject).map(([projectId, projectDeliveries]) => (
            <div key={projectId} className="space-y-2">
              <h3 className="font-medium text-sm">
                {getProjectNameById(projectId)}
              </h3>
              
              <div className="space-y-2">
                {projectDeliveries.map(delivery => {
                  const { left, width } = calculatePositionAndWidth(
                    delivery,
                    earliestDate,
                    latestDate
                  );
                  
                  return (
                    <div key={delivery.id} className="relative h-16">
                      <div
                        className={`absolute h-8 rounded-md border-2 ${getStageColor(delivery.stage)}`}
                        style={{ left, width }}
                      >
                        <div className="px-2 py-1 truncate text-xs font-medium">
                          {delivery.name}
                        </div>
                        
                        {/* Barra de progresso */}
                        <div 
                          className="absolute bottom-0 left-0 h-1 bg-black/20 rounded-b"
                          style={{ width: `${delivery.progress}%` }}
                        />
                      </div>
                      
                      <div className="absolute -bottom-4 left-0 text-xs text-muted-foreground truncate" style={{ left, maxWidth: width }}>
                        {getStageLabel(delivery.stage)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legenda */}
        <div className="mt-8 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Legenda de Estágios:</h4>
          <div className="flex flex-wrap gap-3">
            {(['planning', 'development', 'testing', 'review', 'deployment'] as DeliveryStage[]).map(stage => (
              <div key={stage} className="flex items-center">
                <div className={`w-3 h-3 rounded mr-1 ${getStageColor(stage)}`}></div>
                <span className="text-xs">{getStageLabel(stage)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
