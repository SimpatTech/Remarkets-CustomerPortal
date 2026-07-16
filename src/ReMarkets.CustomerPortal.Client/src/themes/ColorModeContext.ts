import { createContext, useContext } from 'react';
import type { ColorMode } from './theme';

/**
 * App-level color mode (light/dark). Provided by App.tsx; consumed by the
 * Settings menu's Dark Mode toggle. Preference persists per device in
 * localStorage — no server-side profile in Phase 1.
 */
export const ColorModeContext = createContext<{ mode: ColorMode; toggleMode: () => void }>({
  mode: 'light',
  toggleMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);
