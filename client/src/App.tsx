import { CssBaseline} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Switch } from "wouter";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";
const baseTheme = createTheme();

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
      fontSize: "2rem",
      [baseTheme.breakpoints.down("md")]: {
        fontSize: "1.3rem",
      },
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 0,
        },
      },
    },
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
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 4,
        },
      },
    },
  },
});

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
  },
});

function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </QueryClientProvider>
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
