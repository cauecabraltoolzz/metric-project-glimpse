
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and generate project health reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report functionality coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will allow you to generate detailed reports about project health metrics,
            with advanced filtering and export options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
