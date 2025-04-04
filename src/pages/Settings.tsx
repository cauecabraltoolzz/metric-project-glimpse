
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure application and metric preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings functionality coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Here you will be able to configure metric weights, targets, and other system settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
