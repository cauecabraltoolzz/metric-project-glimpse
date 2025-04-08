import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTeamConfig } from "@/hooks/use-team-config";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { config, updateConfig, totalHoursPerMonth } = useTeamConfig();
  
  const [metrics, setMetrics] = React.useState({
    deliveryRate: { weight: 0.3, target: 90 },
    reworkRate: { weight: 0.25, target: 10 },
    estimateAccuracy: { weight: 0.25, target: 85 },
    nps: { weight: 0.2, target: 70 },
  });

  const handleWeightChange = (metric: string, value: number[]) => {
    setMetrics((prev) => ({
      ...prev,
      [metric]: { ...prev[metric as keyof typeof prev], weight: value[0] / 100 },
    }));
  };

  const handleTargetChange = (metric: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setMetrics((prev) => ({
        ...prev,
        [metric]: { ...prev[metric as keyof typeof prev], target: numValue },
      }));
    }
  };

  const handleTeamConfigChange = (field: keyof typeof config, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      updateConfig({ [field]: numValue });
    }
  };

  const handleSave = () => {
    // Aqui seria a lógica para salvar as configurações
    // Em uma aplicação real, isso enviaria dados para uma API
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };
  
  const totalWeight = Object.values(metrics).reduce(
    (sum, metric) => sum + metric.weight,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure preferências de aplicação e métricas de projetos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração do Time</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure a capacidade do time para cálculo de horas disponíveis
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Desenvolvedores</label>
              <Input 
                type="number"
                min="0"
                value={config.developers}
                onChange={(e) => handleTeamConfigChange("developers", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Horas por Dia</label>
              <Input 
                type="number"
                min="1"
                max="8"
                value={config.hoursPerDay}
                onChange={(e) => handleTeamConfigChange("hoursPerDay", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dias Úteis por Mês</label>
              <Input 
                type="number"
                min="1"
                max="23"
                value={config.workingDays}
                onChange={(e) => handleTeamConfigChange("workingDays", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              Total de horas disponíveis por mês: <strong>{totalHoursPerMonth} horas</strong>
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Baseado em {config.developers} desenvolvedores trabalhando {config.hoursPerDay} horas por dia em {config.workingDays} dias úteis
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Métricas</CardTitle>
          <p className="text-sm text-muted-foreground">
            Defina os pesos e metas para cada métrica usada no cálculo do Health Score
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalWeight !== 1 && (
            <div className="rounded-md bg-amber-50 p-4 mb-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                Atenção: A soma dos pesos das métricas deve ser igual a 1. Atualmente: {totalWeight.toFixed(2)}
              </p>
            </div>
          )}
          
          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
              <span>Taxa de Entregas</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 pb-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Peso na pontuação: {metrics.deliveryRate.weight}</label>
                    <span className="text-sm text-muted-foreground">{(metrics.deliveryRate.weight * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[metrics.deliveryRate.weight * 100]} 
                    onValueChange={(val) => handleWeightChange("deliveryRate", val)} 
                    max={100} 
                    step={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Meta (%)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={metrics.deliveryRate.target} 
                    onChange={(e) => handleTargetChange("deliveryRate", e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Mede a produtividade ao relacionar o número de entregas com o tempo de atuação do projeto.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
              <span>Taxa de Retrabalho</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 pb-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Peso na pontuação: {metrics.reworkRate.weight}</label>
                    <span className="text-sm text-muted-foreground">{(metrics.reworkRate.weight * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[metrics.reworkRate.weight * 100]} 
                    onValueChange={(val) => handleWeightChange("reworkRate", val)} 
                    max={100} 
                    step={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Meta (%)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={metrics.reworkRate.target} 
                    onChange={(e) => handleTargetChange("reworkRate", e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Avalia a qualidade do processo com base no percentual de tarefas que precisaram ser refeitas ou revisadas.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
              <span>Taxa de Acerto de Estimativa</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 pb-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Peso na pontuação: {metrics.estimateAccuracy.weight}</label>
                    <span className="text-sm text-muted-foreground">{(metrics.estimateAccuracy.weight * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[metrics.estimateAccuracy.weight * 100]} 
                    onValueChange={(val) => handleWeightChange("estimateAccuracy", val)} 
                    max={100} 
                    step={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Meta (%)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={metrics.estimateAccuracy.target} 
                    onChange={(e) => handleTargetChange("estimateAccuracy", e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Mede a precisão das estimativas de esforço ou tempo. Calculada como a média de acurácia das estimativas.
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
              <span>NPS Mensal</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 pb-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Peso na pontuação: {metrics.nps.weight}</label>
                    <span className="text-sm text-muted-foreground">{(metrics.nps.weight * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[metrics.nps.weight * 100]} 
                    onValueChange={(val) => handleWeightChange("nps", val)} 
                    max={100} 
                    step={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Meta (%)</label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={metrics.nps.target} 
                    onChange={(e) => handleTargetChange("nps", e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Mede a satisfação dos clientes com base na metodologia NPS (Promotores – Detratores).
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-8">
            No futuro, você poderá configurar integrações com ferramentas como Zapier, Make (Integromat) ou n8n para 
            extrair dados de sistemas como Pipefy, Google Sheets ou Notion.
          </p>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="border rounded-md p-4 text-center opacity-50">
              <p className="font-medium mb-2">Pipefy</p>
              <p className="text-sm text-muted-foreground">Em breve</p>
            </div>
            <div className="border rounded-md p-4 text-center opacity-50">
              <p className="font-medium mb-2">Google Sheets</p>
              <p className="text-sm text-muted-foreground">Em breve</p>
            </div>
            <div className="border rounded-md p-4 text-center opacity-50">
              <p className="font-medium mb-2">Notion</p>
              <p className="text-sm text-muted-foreground">Em breve</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
