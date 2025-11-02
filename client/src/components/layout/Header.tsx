import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, useLocation } from 'wouter';
import { Home as HomeIcon, Info as InfoIcon } from '@mui/icons-material';

export function Header() {
  const [location] = useLocation();

  return (
    <AppBar position="sticky" elevation={0} color="inherit">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component={Link}
            color="primary"
            href="/"
            sx={{
              mr: 4,
              fontWeight: 700,
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            RFP Manager
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/"
              startIcon={<HomeIcon />}
              color="primary"
              sx={{
                textTransform: 'none',
                fontWeight: location === '/' ? 700 : 400,
                borderBottom: location === '/' ? '2px solid white' : 'none',
                borderRadius: 0,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              Events
            </Button>
            
            <Button
              component={Link}
              href="/about"
              startIcon={<InfoIcon />}
              color="primary"
              sx={{
                textTransform: 'none',
                fontWeight: location === '/about' ? 700 : 400,
                borderBottom: location === '/about' ? '2px solid white' : 'none',
                borderRadius: 0,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              About
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};