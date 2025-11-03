import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: { xs: 0, sm: 2 },
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: "center" }, fontSize: { xs: 12 } }}
          >
            © {currentYear} RFP Management App. Built with Material-UI & React.
          </Typography>

          {/* Links */}
          <Stack direction="row" spacing={2} alignItems="center">
            <MuiLink
              href="https://github.com/MrWest/develative-enrike-rfp-management-app"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">GitHub</Typography>
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
