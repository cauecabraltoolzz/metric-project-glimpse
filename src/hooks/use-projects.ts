import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import * as projectService from '@/services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load projects'));
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshProjects() {
    await loadProjects();
  }

  return {
    projects,
    isLoading,
    error,
    refreshProjects
  };
} 