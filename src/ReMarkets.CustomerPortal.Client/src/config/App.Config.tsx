import type { ReactNode } from 'react';
import { AppConfigContext, type AppConfig } from './AppConfigContext';

export type { AppConfig, AppEnv } from './AppConfigContext';

export function AppConfigProvider({
  value,
  children,
}: {
  value: AppConfig;
  children: ReactNode;
}) {
  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}
