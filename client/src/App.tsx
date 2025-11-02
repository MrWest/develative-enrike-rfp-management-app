import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Blue
      light: "#3b82f6",
      dark: "#1d4ed8",
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
    },
    secondary: {
      main: "#a855f7", // Purple
      light: "#c084fc",
      dark: "#9333ea",
    },
    info: {
      main: "#06b6d4", // Cyan
      light: "#22d3ee",
      dark: "#0891b2",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
