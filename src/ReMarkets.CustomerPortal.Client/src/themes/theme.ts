import { createTheme, type ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    brandAccent: Palette['primary'];
  }
  interface PaletteOptions {
    brandAccent?: PaletteOptions['primary'];
  }
}

export type ColorMode = 'light' | 'dark';

const lightGreyRamp = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

// Dark mode INVERTS the grey ramp: prototype pages lean on `grey.800` text and
// `grey.50` hover/backgrounds everywhere, so flipping the ramp underneath keeps
// them readable without touching every page. Production feature code should
// use semantic tokens (text.primary, background.paper, divider) per CLAUDE.md;
// the inverted ramp is the compatibility bridge for grey.N references.
const darkGreyRamp = {
  50: '#1c2a44',
  100: '#22304b',
  200: '#2b3a55',
  300: '#3e4f6d',
  400: '#64748b',
  500: '#94a3b8',
  600: '#b6c2d4',
  700: '#cbd5e1',
  800: '#e2e8f0',
  900: '#f8fafc',
};

function buildThemeOptions(mode: ColorMode): ThemeOptions {
  const dark = mode === 'dark';
  const border = dark ? '#26334d' : '#e2e8f0';
  const bgDefault = dark ? '#0b1220' : '#f8fafc';
  const bgPaper = dark ? '#111c30' : '#ffffff';
  const textPrimary = dark ? '#e2e8f0' : '#1e293b';
  const textSecondary = dark ? '#94a3b8' : '#64748b';

  return {
    palette: {
      mode,
      // Primary is the near-black "ink" in light mode; dark mode flips it to a
      // light ink. (The sidebar deliberately does NOT use palette primary — it
      // is a fixed dark surface in both modes; see Sidebar.tsx.)
      primary: dark
        ? { main: '#cbd5e1', light: '#e2e8f0', dark: '#94a3b8', contrastText: '#0f172a' }
        : { main: '#0f172a', light: '#1e293b', dark: '#000000', contrastText: '#ffffff' },
      secondary: {
        main: dark ? '#5BA24A' : '#488B37',
        light: '#5BA24A',
        dark: '#3A7430',
        contrastText: '#ffffff',
      },
      success: {
        main: dark ? '#10b981' : '#059669',
        light: '#10b981',
        dark: '#047857',
        contrastText: '#ffffff',
      },
      warning: {
        main: dark ? '#f59e0b' : '#d97706',
        light: '#f59e0b',
        dark: '#b45309',
        contrastText: '#ffffff',
      },
      error: {
        main: dark ? '#ef4444' : '#dc2626',
        light: '#ef4444',
        dark: '#b91c1c',
        contrastText: '#ffffff',
      },
      info: {
        main: dark ? '#06b6d4' : '#0891b2',
        light: '#06b6d4',
        dark: '#0e7490',
        contrastText: '#ffffff',
      },
      grey: dark ? darkGreyRamp : lightGreyRamp,
      background: {
        default: bgDefault,
        paper: bgPaper,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      divider: border,
      brandAccent: {
        main: '#488B37',
        light: '#5BA24A',
        dark: '#3A7430',
        contrastText: '#ffffff',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: 14,
      h1: { fontWeight: 700, letterSpacing: '-0.5px' },
      h2: { fontWeight: 700, letterSpacing: '-0.4px' },
      h3: { fontWeight: 700, letterSpacing: '-0.3px' },
      h4: { fontWeight: 700, letterSpacing: '-0.3px', fontSize: '1.5rem' },
      h5: { fontWeight: 600, letterSpacing: '-0.2px', fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      button: { fontWeight: 600, textTransform: 'none' },
      body2: { fontSize: '0.8125rem' },
      caption: { fontSize: '0.75rem', color: textSecondary },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: bgDefault,
            color: textPrimary,
          },
          a: { color: 'inherit', textDecoration: 'none' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, paddingInline: 14, paddingBlock: 8 },
          sizeSmall: { paddingInline: 10, paddingBlock: 5 },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${border}`,
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: { paddingBottom: 8 },
          title: { fontSize: '0.9375rem', fontWeight: 600 },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${border}`,
            padding: '10px 14px',
          },
          head: {
            fontWeight: 600,
            color: textSecondary,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            backgroundColor: bgDefault,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, height: 22, fontSize: '0.7rem' },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiSelect: {
        defaultProps: { size: 'small' },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: {
            backgroundColor: bgPaper,
            borderBottom: `1px solid ${border}`,
            color: textPrimary,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: border },
        },
      },
    },
  };
}

export function buildTheme(mode: ColorMode) {
  return createTheme(buildThemeOptions(mode));
}

// Default (light) theme retained for existing imports.
export const theme = buildTheme('light');
export default theme;
