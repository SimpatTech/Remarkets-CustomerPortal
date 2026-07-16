import { createContext } from 'react';

export type AppEnv = 'prototype' | 'dev' | 'prod';

export interface AppConfig {
  appName: string;
  env: AppEnv;
}

export const AppConfigContext = createContext<AppConfig | null>(null);
