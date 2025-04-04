
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize e gere relatórios de saúde dos projetos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Funcionalidade de relatórios em breve</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Essa funcionalidade permitirá gerar relatórios detalhados sobre métricas de saúde dos projetos,
            com opções avançadas de filtragem e exportação.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
