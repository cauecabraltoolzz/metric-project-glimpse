import { useState, useEffect } from 'react';

interface TeamConfig {
  developers: number;
  hoursPerDay: number;
  workingDays: number;
}

const TEAM_CONFIG_KEY = '@metric-project:team-config';

const defaultConfig: TeamConfig = {
  developers: 0,
  hoursPerDay: 6,
  workingDays: 20,
};

export function useTeamConfig() {
  const [config, setConfig] = useState<TeamConfig>(() => {
    const savedConfig = localStorage.getItem(TEAM_CONFIG_KEY);
    return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem(TEAM_CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<TeamConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const totalHoursPerMonth = config.developers * config.hoursPerDay * config.workingDays;

  return {
    config,
    updateConfig,
    totalHoursPerMonth,
  };
} 