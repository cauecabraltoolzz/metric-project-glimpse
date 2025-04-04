
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectById } from "../services/projectService";
import { HealthScoreBadge } from "../components/HealthScoreBadge";
import { MetricCard } from "../components/MetricCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const project = getProjectById(id || "");
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const handleExportReport = () => {
    toast({
      title: "Report Export",
      description: "Project report has been exported successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
          <p className="text-muted-foreground">
            {project.client} • Started {formatDate(project.startDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HealthScoreBadge score={project.healthScore} size="lg" />
          <Button onClick={handleExportReport}>Export Report</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard metric={project.metrics.deliveryRate} />
        <MetricCard metric={project.metrics.reworkRate} inverted={true} />
        <MetricCard metric={project.metrics.estimateAccuracy} />
        <MetricCard metric={project.metrics.nps} />
      </div>

      <div className="rounded-lg border bg-card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Health Score Analysis</h2>
        <p className="text-sm text-muted-foreground mb-3">
          The project health score is calculated based on weighted metrics:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>Delivery Rate (30%)</span>
            <span>{project.metrics.deliveryRate.value}% vs {project.metrics.deliveryRate.target}% target</span>
          </li>
          <li className="flex justify-between">
            <span>Rework Rate (25%)</span>
            <span>{project.metrics.reworkRate.value}% vs {project.metrics.reworkRate.target}% target</span>
          </li>
          <li className="flex justify-between">
            <span>Estimate Accuracy (25%)</span>
            <span>{project.metrics.estimateAccuracy.value}% vs {project.metrics.estimateAccuracy.target}% target</span>
          </li>
          <li className="flex justify-between">
            <span>NPS Score (20%)</span>
            <span>{project.metrics.nps.value}% vs {project.metrics.nps.target}% target</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetail;
