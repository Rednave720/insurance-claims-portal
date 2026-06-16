import { createTheme } from '@mui/material/styles'

export const claimsTheme = createTheme({
  palette: {
    primary: {
      light: '#e3f2fd',
      main: '#2196f3',
      dark: '#1565c0',
    },
    secondary: {
      light: '#ede7f6',
      main: '#673ab7',
      dark: '#4527a0',
    },
    background: {
      default: '#eef2f6',
      paper: '#ffffff',
    },
    text: {
      primary: '#121926',
      secondary: '#697586',
    },
    divider: '#e3e8ef',
    success: {
      light: '#d9f8e5',
      main: '#00a854',
      dark: '#007a3d',
    },
    warning: {
      light: '#fff4cf',
      main: '#f6ad1b',
      dark: '#a66900',
    },
    info: {
      light: '#d8efff',
      main: '#2196f3',
      dark: '#1565c0',
    },
    error: {
      light: '#ffe2e2',
      main: '#d32f2f',
      dark: '#9a1b1b',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1.05rem', fontWeight: 600 },
    h5: { fontSize: '0.95rem', fontWeight: 600 },
    h6: { fontSize: '0.85rem', fontWeight: 600 },
    body1: { fontSize: '0.9rem', lineHeight: 1.55 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.55 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#eef2f6',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e3e8ef',
          boxShadow: '0 2px 14px rgba(32, 40, 45, 0.06)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#e3e8ef',
        },
        head: {
          backgroundColor: '#f8fafc',
          color: '#121926',
          fontSize: '0.8125rem',
          fontWeight: 800,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
      },
    },
  },
})
