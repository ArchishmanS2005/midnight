import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#08080c',
    },
    primary: {
      main: '#e5c158', // Old Gold accent
      contrastText: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.04em',
    },
    h2: {
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.03em',
    },
    h3: {
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.01em',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 700,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #e5c158 0%, #c59b27 100%)',
          color: '#000000',
          boxShadow: '0 4px 20px rgba(229, 193, 88, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #f3e5ab 0%, #e5c158 100%)',
            boxShadow: '0 6px 28px rgba(229, 193, 88, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.16)',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#e5c158',
            backgroundColor: 'rgba(229, 193, 88, 0.05)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(8, 8, 12, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#08080c',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
        },
      },
    },
  },
});
