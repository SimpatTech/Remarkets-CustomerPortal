import { useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { buildTheme, type ColorMode } from './themes/theme';
import { ColorModeContext } from './themes/ColorModeContext';
import { router } from './router/Router';
import { AppConfigProvider } from './config/App.Config';

const COLOR_MODE_STORAGE_KEY = 'remarkets-portal-color-mode';

export default function App() {
  const [mode, setMode] = useState<ColorMode>(() =>
    localStorage.getItem(COLOR_MODE_STORAGE_KEY) === 'dark' ? 'dark' : 'light',
  );
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const colorMode = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((m) => {
          const next: ColorMode = m === 'light' ? 'dark' : 'light';
          localStorage.setItem(COLOR_MODE_STORAGE_KEY, next);
          return next;
        }),
    }),
    [mode],
  );

  return (
    <AppConfigProvider value={{ appName: 'ReMarkets Customer Portal', env: 'prototype' }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppConfigProvider>
  );
}
