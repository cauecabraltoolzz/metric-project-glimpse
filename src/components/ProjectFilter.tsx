
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Project } from "@/types/project";

interface ProjectFilterProps {
  projects: Project[];
  selectedProjectIds: string[];
  onSelectionChange: (projectIds: string[]) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  projects,
  selectedProjectIds,
  onSelectionChange,
}) => {
  const handleToggleProject = (projectId: string) => {
    const updatedSelection = selectedProjectIds.includes(projectId)
      ? selectedProjectIds.filter((id) => id !== projectId)
      : [...selectedProjectIds, projectId];
    
    onSelectionChange(updatedSelection);
  };

  const handleSelectAll = () => {
    if (selectedProjectIds.length === projects.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(projects.map((project) => project.id));
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Filtrar por Projetos</h3>
        <button
          onClick={handleSelectAll}
          className="text-xs text-blue-600 hover:underline"
        >
          {selectedProjectIds.length === projects.length
            ? "Desmarcar Todos"
            : "Selecionar Todos"}
        </button>
      </div>
      
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center space-x-2">
            <Checkbox
              id={`project-${project.id}`}
              checked={selectedProjectIds.includes(project.id)}
              onCheckedChange={() => handleToggleProject(project.id)}
            />
            <Label
              htmlFor={`project-${project.id}`}
              className="text-sm cursor-pointer"
            >
              {project.name} <span className="text-xs text-muted-foreground">({project.client})</span>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
