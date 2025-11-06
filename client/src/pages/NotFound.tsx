import { Container, Box, Typography, Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <Container
      maxWidth="sm"
      sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
    >
      <Box sx={{ textAlign: "center", width: "100%" }}>
        <Typography
          variant="h1"
          sx={{ fontSize: "6rem", fontWeight: 800, color: "primary.main" }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => setLocation("/")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.5,
          }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
