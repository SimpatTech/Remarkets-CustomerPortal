import { useContext } from 'react';
import { AppConfigContext, type AppConfig } from './AppConfigContext';

export function useAppConfig(): AppConfig {
  const ctx = useContext(AppConfigContext);
  if (!ctx) {
    throw new Error('useAppConfig must be used within <AppConfigProvider>');
  }
  return ctx;
}
